import { useState } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";
import { Avatar, AvatarFallback } from "/components/ui/avatar";
import { Play, Plus, User, Shield, Clock } from 'lucide-react';

// Mock data for holdings
const initialHoldings = [
  { id: 1, name: 'Apple Inc.', symbol: 'AAPL', shares: 10, price: 175.25, value: 1752.50 },
  { id: 2, name: 'Microsoft Corp.', symbol: 'MSFT', shares: 5, price: 330.20, value: 1651.00 },
  { id: 3, name: 'Tesla Inc.', symbol: 'TSLA', shares: 8, price: 245.75, value: 1966.00 },
];

// Mock investment suggestions
const investmentSuggestions = [
  { id: 1, name: 'Amazon.com Inc.', symbol: 'AMZN', price: 145.30, suggestion: 'Buy 3 shares' },
  { id: 2, name: 'NVIDIA Corp.', symbol: 'NVDA', price: 420.50, suggestion: 'Buy 2 shares' },
  { id: 3, name: 'Alphabet Inc.', symbol: 'GOOGL', price: 135.75, suggestion: 'Buy 4 shares' },
];

export default function InvestmentDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  
  // User data
  const [user, setUser] = useState({ name: 'Alex Johnson', email: 'alex@example.com' });
  const [balance, setBalance] = useState(10000);
  
  // Dashboard state
  const [holdings, setHoldings] = useState(initialHoldings);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investmentMode, setInvestmentMode] = useState('manual');
  const [addAmount, setAddAmount] = useState('');
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation
    if (loginForm.email && loginForm.password) {
      setIsAuthenticated(true);
    }
  };

  // Handle registration
  const handleRegister = (e) => {
    e.preventDefault();
    // Simple validation
    if (registerForm.name && registerForm.email && 
        registerForm.password && registerForm.password === registerForm.confirmPassword) {
      setUser({ name: registerForm.name, email: registerForm.email });
      setIsAuthenticated(true);
    }
  };

  // Handle adding balance
  const handleAddBalance = () => {
    if (addAmount && !isNaN(Number(addAmount))) {
      setBalance(prev => prev + Number(addAmount));
      setAddAmount('');
      setShowAddBalance(false);
    }
  };

  // Handle manual investment
  const handleManualInvestment = (symbol) => {
    // In a real app, this would execute a trade
    alert(`Manual investment executed for ${symbol}`);
    setShowInvestmentModal(false);
  };

  // Handle automated investment
  const handleAutomatedInvestment = () => {
    // Simulate automated trading logic
    alert('Automated investment strategy executed');
    setShowInvestmentModal(false);
  };

  // Render authentication forms
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 p-3 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {authView === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {authView === 'login' 
                ? 'Sign in to manage your investments' 
                : 'Get started with your investment journey'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authView === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <button 
                    type="button" 
                    className="text-blue-600 hover:underline"
                    onClick={() => setAuthView('register')}
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Alex Johnson"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <button 
                    type="button" 
                    className="text-blue-600 hover:underline"
                    onClick={() => setAuthView('login')}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg"></div>
            <h1 className="text-xl font-bold">InvestPro</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAddBalance(true)}
              className="flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Balance</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Balance Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Account Balance</span>
              <span className="text-2xl font-bold text-green-600">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </CardTitle>
            <CardDescription>Your available investment funds</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Current investments in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => (
                    <div key={holding.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{holding.name}</h3>
                        <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{holding.shares} shares</p>
                        <p className="text-sm">${holding.value.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Options */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Investment Options</CardTitle>
                <CardDescription>Choose how you want to invest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full flex items-center justify-center space-x-2"
                  onClick={() => {
                    setInvestmentMode('manual');
                    setShowInvestmentModal(true);
                  }}
                >
                  <Play className="h-4 w-4" />
                  <span>Manual Investment</span>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full flex items-center justify-center space-x-2"
                  onClick={() => {
                    setInvestmentMode('auto');
                    setShowInvestmentModal(true);
                  }}
                >
                  <Clock className="h-4 w-4" />
                  <span>Automated Trading</span>
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Holdings</span>
                    <span className="font-medium">${holdings.reduce((sum, h) => sum + h.value, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Balance</span>
                    <span className="font-medium">${balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Portfolio Value</span>
                    <span className="font-bold text-lg">
                      ${(holdings.reduce((sum, h) => sum + h.value, 0) + balance).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Balance Modal */}
      {showAddBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
              <CardDescription>Deposit money into your investment account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={handleAddBalance}
                  >
                    Add Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddBalance(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {investmentMode === 'manual' ? 'Manual Investment' : 'Automated Trading'}
              </CardTitle>
              <CardDescription>
                {investmentMode === 'manual' 
                  ? 'Select from suggested investments' 
                  : 'Execute automated trading strategy'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {investmentMode === 'manual' ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Based on your portfolio, we recommend these investments:
                  </p>
                  <div className="space-y-3">
                    {investmentSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{suggestion.name}</h3>
                          <p className="text-sm text-muted-foreground">{suggestion.symbol} - ${suggestion.price}</p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleManualInvestment(suggestion.symbol)}
                        >
                          {suggestion.suggestion}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium mb-2">Automated Strategy</h3>
                    <p className="text-sm text-muted-foreground">
                      Our algorithm will automatically invest based on market conditions and your risk profile.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={handleAutomatedInvestment}
                    >
                      Execute Strategy
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowInvestmentModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {investmentMode === 'manual' && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowInvestmentModal(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}