import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ArrowRightLeft, Target, BarChart2, Settings, LogOut, ChevronDown, Plus, MoreVertical, TrendingUp, TrendingDown, DollarSign, Bell, Trash2, Mail, Smartphone, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import BudgetsPage from './components/BudgetsPage';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';
import Login from './Login.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import CategoriesPage from './components/CategoriesPage.jsx';
import TimePage from './components/TimePage.jsx';
import TimeFuturePage from './components/TimeFuturePage.jsx';
import ForecastsPage from './components/ForecastsPage.jsx';
import CalendarPage from './components/CalendarPage.jsx';
import DebtsPage from './components/DebtsPage.jsx';
import PreferencesPage from './components/PreferencesPage.jsx';
import ScheduledTransactionsPage from './components/ScheduledTransactionsPage.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
function app(){
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ... other state

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleAuth} />} />
          <Route path="/signup" element={<SignUpPage onSignUp={handleAuth} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Add this */}
    <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* And this */}
          {/* Redirect any other path to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar  />
        <main className="main-content ...">
          <Header  />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// --- Initial Data & Helpers ---

const initialTransactions = [
    { id: 1, type: 'income', description: 'Web design project', date: '2025-07-15', amount: 50000.00, category: 'Freelance' },
    { id: 2, type: 'expense', description: 'Gas for car', date: '2025-07-05', amount: -3000.00, category: 'Transport' },
    { id: 3, type: 'expense', description: 'Weekly shopping', date: '2025-08-03', amount: -7500.40, category: 'Groceries' },
    { id: 4, type: 'expense', description: 'Apartment rent', date: '2025-08-01', amount: -15000.00, category: 'Rent' },
    { id: 5, type: 'income', description: 'Monthly paycheck', date: '2025-08-01', amount: 450000.00, category: 'Salary' },
];

const initialBudgets = [
    { id: 1, category: 'Groceries', spent: 7500.40, total: 25000.00 },
    { id: 2, category: 'Dining', spent: 2500.50, total: 10000.00 },
    { id: 3, category: 'Transport', spent: 3000.00, total: 8000.00 },
];

const currencies = {
    'INR': { symbol: '₹', code: 'INR' },
    'USD': { symbol: '$', code: 'USD' },
    'EUR': { symbol: '€', code: 'EUR' },
};

const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [theme, setTheme] = useState(() => {
        try {
            const stored = localStorage.getItem('theme');
            if (stored === 'light' || stored === 'dark') return stored;
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        } catch {
            return 'light';
        }
    });
    const [activePage, setActivePage] = useState('Overview');
    const [currency, setCurrency] = useState(currencies['INR']);
    const [userName, setUserName] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        try {
            const stored = localStorage.getItem('sidebarOpen');
            return stored !== null ? JSON.parse(stored) === true : true;
        } catch {
            return true;
        }
    });
    const [transactionFilter, setTransactionFilter] = useState('all');

    const [transactions, setTransactions] = useState(initialTransactions);
    const [budgets, setBudgets] = useState(initialBudgets);
    
    const handleSaveTransaction = (data) => {
        if (data.id) {
            // Logic to update an existing transaction
            setTransactions(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
        } else {
            // Logic to add a new transaction
            setTransactions(prev => [{ ...data, id: Date.now(), icon: Coffee }, ...prev]);
        }
    };

    const handleDeleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    // Debug logging
    console.log('App rendered, isAuthenticated:', isAuthenticated);

    const handleAuth = (user) => {
        setUserName(user.name);
        setIsAuthenticated(true);
        // Store auth state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', name);
    }

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserName('');
        setActivePage('Overview');
        // Clear auth state from localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userName');
    }

    // Check for existing auth on component mount
    /* We are removing this to ensure the login page is always shown on startup.
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedName = localStorage.getItem('userName');
        if (storedAuth === 'true' && storedName) {
            setIsAuthenticated(true);
            setUserName(storedName);
        }
    }, []);
    */

    // Apply theme to body
    useEffect(() => {
        try {
            document.body.classList.remove('light-mode', 'dark-mode');
            document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
            localStorage.setItem('theme', theme);
        } catch {}
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const handleAddTransaction = (newTransaction) => {
        setTransactions(prev => [{...newTransaction, id: Date.now()}, ...prev]);
        if (newTransaction.type === 'expense') {
            setBudgets(prevBudgets => prevBudgets.map(b => 
                b.category === newTransaction.category 
                    ? { ...b, spent: b.spent + Math.abs(newTransaction.amount) } 
                    : b
            ));
        }
    };

    const handleAddBudget = (newBudget) => {
        setBudgets(prev => [{...newBudget, id: Date.now()}, ...prev]);
    };

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    useEffect(() => {
        try {
            localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
        } catch {}
    }, [isSidebarOpen]);

    const navigateToTransactions = (filter = 'all') => {
        setTransactionFilter(filter);
        setActivePage('Transactions');
    };

    if (!isAuthenticated) {
        if (showSignUp) {
            return <SignUpPage onSignUp={handleAuth} onGoToLogin={() => setShowSignUp(false)} />;
        }
        return <Login onLogin={handleAuth} onGoToSignUp={() => setShowSignUp(true)} />;
    }

    console.log('Rendering main app');

    const renderPage = () => {
        switch (activePage) {
            case 'Overview':
            case 'Dashboard':
                return <Dashboard currency={currency} navigateToTransactions={navigateToTransactions} transactions={transactions} budgets={budgets} formatAmount={formatAmount} />;
            case 'Transactions':
                return <TransactionsPage currency={currency} transactionFilter={transactionFilter} setTransactionFilter={setTransactionFilter} transactions={transactions} handleAddTransaction={handleAddTransaction} formatAmount={formatAmount} />;
            case 'Budgets':
                return <BudgetsPage currency={currency} budgets={budgets} handleAddBudget={handleAddBudget} formatAmount={formatAmount} />;
            case 'Scheduled transactions':
                return <ScheduledTransactionsPage currency={currency} formatAmount={formatAmount} />;
            case 'Analytics':
            case 'Charts':
                return <AnalyticsPage currency={currency} transactions={transactions} formatAmount={formatAmount} />;
            case 'Categories':
                return <CategoriesPage currency={currency} formatAmount={formatAmount} />;
            case 'Time':
                return <TimePage currency={currency} formatAmount={formatAmount} />;
            case 'Time (Future)':
                return <TimeFuturePage currency={currency} formatAmount={formatAmount} />;
            case 'Forecasts':
                return <ForecastsPage currency={currency} formatAmount={formatAmount} />;
            case 'Calendar':
                return <CalendarPage currency={currency} transactions={transactions} formatAmount={formatAmount} />;
            case 'Debts':
                return <DebtsPage currency={currency} formatAmount={formatAmount} />;
            case 'Settings':
                return <SettingsPage currency={currency} setCurrency={setCurrency} userName={userName} setUserName={setUserName} />;
            case 'Preferences':
                return <PreferencesPage />;
            default:
                return <Dashboard currency={currency} navigateToTransactions={navigateToTransactions} transactions={transactions} budgets={budgets} formatAmount={formatAmount} />;
        }
    };
    
    return (
        <div className="app-container">
            <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isDarkMode={theme === 'dark'} toggleDarkMode={toggleTheme} />
            <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Header userName={userName} />
                <div className="flex-1 overflow-y-auto main-content-bg">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
};

export default App;