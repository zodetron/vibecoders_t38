// bot1_backend.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// === CONFIG ===
const API_KEY = process.env.ALPACA_API_KEY;
const SECRET_KEY = process.env.ALPACA_SECRET_KEY;

const headers = {
  "APCA-API-KEY-ID": API_KEY,
  "APCA-API-SECRET-KEY": SECRET_KEY,
};

// === STATE ===
let previousEMARelation = null; // 'above' | 'below' | null
let isRunning = false;
let botInterval = null;

// === EMA CALCULATION ===
function calculateEMA(prices, period) {
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
  const emaArr = [];
  emaArr[period - 1] = ema;

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
    emaArr[i] = ema;
  }

  return emaArr;
}

// === GET LIVE PRICE ===
async function fetchLivePrice() {
  const url = "https://data.alpaca.markets/v1beta3/crypto/us/latest/trades?symbols=BTC/USD";
  const res = await fetch(url, { headers });
  const data = await res.json();
  return data.trades?.["BTC/USD"]?.p;
}

// === GET HISTORICAL CANDLES ===
async function fetchCandles() {
  const now = new Date();
  const end = now.toISOString();
  const start = new Date(now.getTime() - 30 * 5 * 60 * 1000).toISOString(); // last 30 * 5min

  const url = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=BTC/USD&timeframe=5Min&start=${start}&end=${end}&limit=30`;
  const res = await fetch(url, { headers });
  const data = await res.json();

  const bars = data.bars?.["BTC/USD"] || [];
  if (bars.length < 20) throw new Error("Not enough candle data for EMA calculation.");
  return bars.map(bar => bar.c);
}

// === CHECK OPEN POSITION ===
async function checkPosition() {
  const res = await fetch("https://paper-api.alpaca.markets/v2/positions/BTC/USD", { headers });
  if (res.status === 404) return null;
  return res.json();
}

// === CLOSE POSITION ===
async function closePosition() {
  try {
    const res = await fetch("https://paper-api.alpaca.markets/v2/positions/BTC/USD", {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    console.log(`🔴 Position closed:`, data.id || data.message || data);
    return true;
  } catch (e) {
    console.error("Error closing position:", e.message);
    return false;
  }
}

// === PLACE ORDER ===
async function placeOrder(side, qty = 0.01) {
  const order = {
    symbol: "BTC/USD",
    qty: qty.toFixed(4),
    side,
    type: "market",
    time_in_force: "gtc",
  };

  const res = await fetch("https://paper-api.alpaca.markets/v2/orders", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  const data = await res.json();
  console.log(`📤 ${side.toUpperCase()} order placed:`, data.id || data.message || data);
}

// === MAIN LOGIC ===
async function checkEMAAndTrade() {
  if (isRunning) return;
  isRunning = true;

  try {
    const livePrice = await fetchLivePrice();
    const closes = await fetchCandles();

    const ema12Arr = calculateEMA(closes, 12);
    const ema20Arr = calculateEMA(closes, 20);

    const ema12 = ema12Arr.at(-1);
    const ema20 = ema20Arr.at(-1);

    console.log(`💰 Price: $${livePrice} | 📈 EMA12: $${ema12.toFixed(2)} | 📉 EMA20: $${ema20.toFixed(2)}`);

    const relation =
      ema12 > ema20 ? "above" :
      ema12 < ema20 ? "below" :
      "equal";

    if (relation !== previousEMARelation) {
      const position = await checkPosition();

      if (position) {
        await closePosition();
      }

      if (relation === "above") {
        console.log("✅ Bullish crossover → BUY");
        await placeOrder("buy");
      } else if (relation === "below") {
        console.log("❌ Bearish crossover → SELL");
        await placeOrder("sell");
      }

      previousEMARelation = relation;
    } else {
      console.log("🔄 EMA relation unchanged, skipping action");
    }
  } catch (e) {
    console.error("❌ Error:", e.message);
  } finally {
    isRunning = false;
  }
}

// === CONTROL FUNCTIONS ===
export function startBot() {
  if (botInterval) return "Bot already running!";
  checkEMAAndTrade(); // run once immediately
  botInterval = setInterval(checkEMAAndTrade, 5 * 60 * 1000);
  console.log("🚀 EMA Bot started. Checking every 5 minutes...");
  return "Bot started ✅";
}

export function stopBot() {
  if (!botInterval) return "Bot is not running.";
  clearInterval(botInterval);
  botInterval = null;
  console.log("🛑 EMA Bot stopped.");
  return "Bot stopped 🛑";
}
