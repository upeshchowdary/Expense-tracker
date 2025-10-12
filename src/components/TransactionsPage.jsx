import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, HelpCircle, MoreVertical, Plus, Minus, Coffee, PartyPopper, Utensils, ShoppingCart, Fuel, Shirt, Briefcase, Laptop, Gift, Newspaper } from 'lucide-react';

const TransactionsPage = ({ currency, transactionFilter, setTransactionFilter, transactions, handleAddTransaction, formatAmount }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showFilter, setShowFilter] = useState(false);
    const [filterData, setFilterData] = useState({
        category: '',
        fromDate: '',
        toDate: '',
        notes: '',
        checked: true,
        notChecked: true,
        expenses: true,
        income: true,
        transfer: false
    });

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const getTransactionIcon = (description) => {
        const iconMap = {
            'Bar': Coffee,
            'Entertainment': PartyPopper,
            'Eating out': Utensils,
            'Shopping': ShoppingCart,
            'Fuel': Fuel,
            'Clothing': Shirt,
            'Odd jobs': Briefcase,
            'Technology': Laptop,
            'Gifts': Gift,
            'Books': Newspaper
        };
        return iconMap[description] || Coffee;
    };

    const getTransactionIconClass = (description) => {
        const classMap = {
            'Bar': 'bar',
            'Entertainment': 'entertainment',
            'Eating out': 'eating',
            'Shopping': 'shopping',
            'Fuel': 'fuel',
            'Clothing': 'clothing',
            'Odd jobs': 'work',
            'Technology': 'technology',
            'Gifts': 'gifts',
            'Books': 'books'
        };
        return classMap[description] || 'bar';
    };

    const filteredTransactions = transactions.filter(t => {
        if (filterData.expenses && t.type === 'expense') return true;
        if (filterData.income && t.type === 'income') return true;
        return false;
    });

    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="transactions-page">
            <div className="transactions-header">
                <div className="month-navigation">
                    <button className="month-nav-btn" onClick={() => navigateMonth(-1)}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="current-month">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>
                    <button className="month-nav-btn" onClick={() => navigateMonth(1)}>
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="transactions-summary">
                    <span className="transaction-count">Transactions: {filteredTransactions.length}</span>
                    <span className="transaction-total">Total: {currency.symbol}{formatAmount(Math.abs(totalAmount))}</span>
                </div>
            </div>

            <div className="transactions-content">
                <div className="filter-panel">
                    <h3>FILTER</h3>
                    <div className="filter-group">
                        <label>Category</label>
                        <input 
                            type="text" 
                            className="filter-input" 
                            value={filterData.category}
                            onChange={(e) => setFilterData({...filterData, category: e.target.value})}
                        />
                    </div>
                    <div className="filter-group">
                        <label>From / To</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="date" 
                                className="filter-input" 
                                value={filterData.fromDate}
                                onChange={(e) => setFilterData({...filterData, fromDate: e.target.value})}
                            />
                            <input 
                                type="date" 
                                className="filter-input" 
                                value={filterData.toDate}
                                onChange={(e) => setFilterData({...filterData, toDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="filter-group">
                        <label>Notes</label>
                        <input 
                            type="text" 
                            className="filter-input" 
                            value={filterData.notes}
                            onChange={(e) => setFilterData({...filterData, notes: e.target.value})}
                        />
                    </div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input 
                                type="checkbox" 
                                id="checked"
                                checked={filterData.checked}
                                onChange={(e) => setFilterData({...filterData, checked: e.target.checked})}
                            />
                            <label htmlFor="checked">Checked</label>
                        </div>
                        <div className="checkbox-item">
                            <input 
                                type="checkbox" 
                                id="notChecked"
                                checked={filterData.notChecked}
                                onChange={(e) => setFilterData({...filterData, notChecked: e.target.checked})}
                            />
                            <label htmlFor="notChecked">Not checked</label>
                        </div>
                    </div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input 
                                type="checkbox" 
                                id="expenses"
                                checked={filterData.expenses}
                                onChange={(e) => setFilterData({...filterData, expenses: e.target.checked})}
                            />
                            <label htmlFor="expenses">Expenses</label>
                        </div>
                        <div className="checkbox-item">
                            <input 
                                type="checkbox" 
                                id="income"
                                checked={filterData.income}
                                onChange={(e) => setFilterData({...filterData, income: e.target.checked})}
                            />
                            <label htmlFor="income">Income</label>
                        </div>
                        <div className="checkbox-item">
                            <input 
                                type="checkbox" 
                                id="transfer"
                                checked={filterData.transfer}
                                onChange={(e) => setFilterData({...filterData, transfer: e.target.checked})}
                            />
                            <label htmlFor="transfer">Transfer between accounts</label>
                        </div>
                    </div>
                    <button className="cancel-btn">CANCEL</button>
                </div>

                <div className="transactions-list">
                    {filteredTransactions.map((transaction) => {
                        const IconComponent = getTransactionIcon(transaction.description);
                        const iconClass = getTransactionIconClass(transaction.description);
                        return (
                            <div key={transaction.id} className="transaction-item">
                                <input type="checkbox" className="transaction-checkbox" />
                                <div className={`transaction-icon ${iconClass}`}>
                                    <IconComponent size={20} />
                                </div>
                                <div className="transaction-details">
                                    <div className="transaction-description">{transaction.description}</div>
                                    <div className="transaction-account">{transaction.category}</div>
                                </div>
                                <div className="transaction-amount">
                                    {currency.symbol}{formatAmount(Math.abs(transaction.amount))}
                                </div>
                                <div className="transaction-date">
                                    {new Date(transaction.date).toLocaleDateString('en-GB')}
                                </div>
                                <div className="transaction-actions">
                                    <MoreVertical size={16} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="floating-actions">
                <button className="floating-btn add-btn">
                    <Plus size={20} />
                </button>
                <button className="floating-btn minus-btn">
                    <Minus size={20} />
                </button>
            </div>
        </div>
    );
};

export default TransactionsPage;