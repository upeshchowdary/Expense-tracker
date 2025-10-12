import React, { useState, useMemo } from 'react';
import { PartyPopper, Bus, Home, Lightbulb, Plus, Minus, MoreVertical, Search, Filter, X, Trash2, Edit } from 'lucide-react';

// A new, separate component for the Add/Edit Modal
const TransactionModal = ({ isOpen, onClose, onSave, transaction, currency }) => {
    const [formData, setFormData] = useState({});

    React.useEffect(() => {
        // When the modal opens for editing, pre-fill the form. Otherwise, reset it.
        if (transaction) {
            const date = new Date(transaction.date);
            const formattedDate = date.toISOString().split('T')[0];
            setFormData({ ...transaction, date: formattedDate });
        } else {
            setFormData({ description: '', category: '', account: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'expense' });
        }
    }, [transaction, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            amount: formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount),
            icon: Home // Placeholder icon, you can make this dynamic
        };
        onSave(finalData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{transaction ? 'Edit' : 'Add'} Scheduled Transaction</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Description</label>
                        <input name="description" value={formData.description || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount ({currency.symbol})</label>
                            <input name="amount" type="number" step="0.01" value={Math.abs(formData.amount) || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type" value={formData.type || 'expense'} onChange={handleChange}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <input name="category" value={formData.category || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Account</label>
                            <input name="account" value={formData.account || ''} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input name="date" type="date" value={formData.date || ''} onChange={handleChange} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ScheduledTransactionsPage = ({ currency, formatAmount }) => {
    const [filters, setFilters] = useState({
        category: '',
        account: 'All accounts',
        fromDate: '',
        toDate: '',
        notes: '',
        types: { expenses: true, income: true, transfer: true, debts: true }
    });
    
    const [transactions, setTransactions] = useState([
        { id: 1, description: 'Entertainment (Subscription)', category: 'Entertainment', account: 'Bank account', amount: -12.00, date: '2025-09-27', type: 'subscription', icon: PartyPopper },
        { id: 2, description: 'Transportation', category: 'Transport', account: 'Bank account', amount: -37.00, date: '2025-10-01', type: 'expense', icon: Bus },
        { id: 3, description: 'Home', category: 'Housing', account: 'Bank account', amount: -30.00, date: '2025-10-01', type: 'expense', icon: Home },
        { id: 4, description: 'Technology (Subscription)', category: 'Technology', account: 'Bank account', amount: -14.00, date: '2025-10-03', type: 'subscription', icon: Lightbulb },
        { id: 5, description: 'Energy bill', category: 'Utilities', account: 'Wallet', amount: -145.00, date: '2025-10-08', type: 'expense', icon: Lightbulb },
        { id: 6, description: 'Home (Subscription)', category: 'Housing', account: 'Bank account', amount: -60.00, date: '2026-01-03', type: 'subscription', icon: Home }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [openMenuId, setOpenMenuId] = useState(null);


    const monthlyTotals = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const nextDate = new Date();
        nextDate.setMonth(now.getMonth() + 1);
        const nextMonth = nextDate.getMonth();
        const nextYear = nextDate.getFullYear();

        const thisMonthTotal = transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);

        const nextMonthTotal = transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getMonth() === nextMonth && transactionDate.getFullYear() === nextYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);

        return { thisMonth: thisMonthTotal, nextMonth: nextMonthTotal };
    }, [transactions]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleTypeChange = (type) => {
        setFilters(prev => ({
            ...prev,
            types: { ...prev.types, [type]: !prev.types[type] }
        }));
    };
    
    const resetFilters = () => {
        setFilters({
            category: '', account: 'All accounts', fromDate: '', toDate: '', notes: '',
            types: { expenses: true, income: true, transfer: true, debts: true }
        });
    };

    const groupedTransactions = useMemo(() => transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) acc[month] = [];
        acc[month].push(t);
        return acc;
    }, {}), [transactions]);

    const handleSaveTransaction = (transactionData) => {
        if (transactionData.id) {
            setTransactions(prev => prev.map(t => t.id === transactionData.id ? transactionData : t));
        } else {
            setTransactions(prev => [{ ...transactionData, id: Date.now() }, ...prev]);
        }
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleOpenModal = (transaction = null) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleDelete = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setOpenMenuId(null);
    };
    
    const handleBulkDelete = () => {
        if (selectedIds.size > 0 && window.confirm(`Are you sure you want to delete ${selectedIds.size} selected transaction(s)?`)) {
            setTransactions(prev => prev.filter(t => !selectedIds.has(t.id)));
            setSelectedIds(new Set());
        }
    };

    const handleSelect = (id) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(transactions.map(t => t.id)));
        } else {
            setSelectedIds(new Set());
        }
    };


    return (
        <div className="scheduled-transactions-page">
            <style>{`
                /* Global styles */
                .scheduled-transactions-page { display: flex; gap: 1.5rem; padding: 1.5rem; height: 100%; background-color: var(--main-bg, #F7F9FC); }
                body.dark-mode .scheduled-transactions-page { background-color: var(--main-bg, #1A202C); }
                .main-content-area { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; min-width: 0; }
                .filter-panel { width: 320px; flex-shrink: 0; background-color: var(--sidebar-bg, #fff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--sidebar-border-color, #e2e8f0); display: flex; flex-direction: column; }
                body.dark-mode .filter-panel { background-color: var(--sidebar-bg, #1f2937); border-color: var(--sidebar-border-color, #374151); }
                
                /* Header */
                .page-header { display: flex; justify-content: space-between; align-items: center; }
                .page-header h1 { font-size: 1.75rem; font-weight: 600; color: var(--sidebar-logo-text, #1a202c); }
                .header-actions { display: flex; gap: 0.75rem; }
                .header-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s; }
                .btn-primary { background-color: var(--sidebar-link-active-text, #3182CE); color: #fff; }
                .btn-primary:hover { opacity: 0.9; }
                .btn-secondary { background-color: var(--sidebar-link-hover-bg, #EDF2F7); color: var(--sidebar-logo-text, #1a202c); }
                .header-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                
                /* Summary Cards */
                .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
                .summary-card { background-color: var(--sidebar-bg, #fff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--sidebar-border-color, #e2e8f0); }
                body.dark-mode .summary-card { background-color: var(--sidebar-bg, #1f2937); border-color: var(--sidebar-border-color, #374151); }
                .summary-card-title { color: var(--sidebar-link-text, #718096); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .summary-card-amount { font-size: 1.75rem; font-weight: 600; color: var(--sidebar-logo-text, #1a202c); }
                
                /* Transactions List */
                .transactions-list-container { background-color: var(--sidebar-bg, #fff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--sidebar-border-color, #e2e8f0); flex-grow: 1; overflow-y: auto; }
                body.dark-mode .transactions-list-container { background-color: var(--sidebar-bg, #1f2937); border-color: var(--sidebar-border-color, #374151); }
                .month-group h3 { margin-top: 1.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--sidebar-border-color); color: var(--sidebar-link-text, #718096); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .month-group:first-child h3 { margin-top: 0; }
                .transaction-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 0.5rem; border-bottom: 1px solid var(--sidebar-border-color, #e2e8f0); }
                .month-group .transaction-item:last-child { border-bottom: none; }
                .transaction-selection input { width: 1.2em; height: 1.2em; }
                .transaction-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background-color: var(--sidebar-link-hover-bg, #EDF2F7); color: var(--sidebar-link-text, #718096); }
                .transaction-details { flex-grow: 1; }
                .transaction-description { font-weight: 500; color: var(--sidebar-logo-text, #1a202c); }
                .transaction-account { font-size: 0.8rem; color: var(--sidebar-link-text, #718096); }
                .transaction-amount { font-weight: 500; font-size: 1rem; color: #E53E3E; margin-left: auto; }
                body.dark-mode .transaction-amount { color: #FC8181; }
                .transaction-date { font-size: 0.9rem; color: var(--sidebar-link-text, #718096); width: 100px; text-align: right; }
                
                /* Filter Panel */
                .filter-header { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; color: var(--sidebar-logo-text, #1a202c); }
                .filter-form { flex-grow: 1; display: flex; flex-direction: column; gap: 1.25rem; }
                .filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .filter-group label { font-weight: 500; font-size: 0.9rem; color: var(--sidebar-link-text, #718096); }
                .filter-group input[type="text"], .filter-group input[type="date"] { width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid var(--sidebar-border-color, #e2e8f0); background-color: var(--main-bg, #F7F9FC); color: var(--sidebar-logo-text, #1a202c); transition: border-color 0.2s; }
                .filter-group input:focus { outline: none; border-color: var(--sidebar-link-active-text); }
                body.dark-mode .filter-group input { background-color: #2D3748; }
                .date-inputs { display: flex; gap: 0.5rem; }
                .checkbox-group { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                .checkbox-item { display: flex; align-items: center; }
                .checkbox-item input { height: 1.2em; width: 1.2em; margin-right: 0.5em; }
                .filter-actions { margin-top: auto; }

                /* Modal and Actions Menu */
                .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-content { background: var(--sidebar-bg, #fff); padding: 2rem; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                .modal-content h2 { color: var(--sidebar-logo-text); margin-top: 0; }
                .modal-content form { display: flex; flex-direction: column; gap: 1rem; }
                .modal-content .form-row { display: flex; gap: 1rem; }
                .modal-content .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
                .modal-content label { font-weight: 500; font-size: 0.9rem; color: var(--sidebar-link-text); }
                .modal-content input, .modal-content select { width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid var(--sidebar-border-color); background-color: var(--main-bg); color: var(--sidebar-logo-text); }
                body.dark-mode .modal-content input, body.dark-mode .modal-content select { background-color: #2D3748; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
                .transaction-actions { position: relative; }
                .actions-menu-btn { background: none; border: none; color: inherit; cursor: pointer; padding: 0.25rem; border-radius: 50%; }
                .actions-menu-btn:hover { background-color: var(--sidebar-link-hover-bg); }
                .actions-menu { position: absolute; right: 0; top: 28px; background: var(--sidebar-bg); border: 1px solid var(--sidebar-border-color); border-radius: 8px; padding: 0.5rem; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 120px; }
                .actions-menu button { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; padding: 0.5rem; width: 100%; text-align: left; cursor: pointer; border-radius: 6px; color: var(--sidebar-logo-text); }
                .actions-menu button:hover { background-color: var(--sidebar-link-hover-bg); }
                .actions-menu button.delete { color: #E53E3E; }
            `}</style>
            
            <TransactionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveTransaction}
                transaction={editingTransaction}
                currency={currency}
            />

            <div className="main-content-area">
                <div className="page-header">
                    <h1>Scheduled Transactions</h1>
                    <div className="header-actions">
                        <button className="header-btn btn-secondary" onClick={handleBulkDelete} disabled={selectedIds.size === 0}>
                            <Trash2 size={16} />
                            Remove ({selectedIds.size})
                        </button>
                        <button className="header-btn btn-primary" onClick={() => handleOpenModal()}>
                            <Plus size={16} />
                            Add New
                        </button>
                    </div>
                </div>

                <div className="summary-cards">
                    <div className="summary-card">
                        <h4 className="summary-card-title">This Month's Scheduled</h4>
                        <p className="summary-card-amount">{currency.symbol}{formatAmount(Math.abs(monthlyTotals.thisMonth))}</p>
                    </div>
                    <div className="summary-card">
                        <h4 className="summary-card-title">Next Month's Scheduled</h4>
                        <p className="summary-card-amount">{currency.symbol}{formatAmount(Math.abs(monthlyTotals.nextMonth))}</p>
                    </div>
                </div>

                <div className="transactions-list-container">
                    {Object.entries(groupedTransactions).map(([month, transactions]) => (
                        <div key={month} className="month-group">
                            <h3>{month}</h3>
                            {transactions.map(transaction => {
                                const IconComponent = transaction.icon;
                                return (
                                    <div key={transaction.id} className="transaction-item">
                                        <div className="transaction-selection">
                                            <input type="checkbox" checked={selectedIds.has(transaction.id)} onChange={() => handleSelect(transaction.id)} />
                                        </div>
                                        <div className="transaction-icon"><IconComponent size={20} /></div>
                                        <div className="transaction-details">
                                            <div className="transaction-description">{transaction.description}</div>
                                            <div className="transaction-account">{transaction.account}</div>
                                        </div>
                                        <div className="transaction-amount">{currency.symbol}{formatAmount(Math.abs(transaction.amount))}</div>
                                        <div className="transaction-date">{new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                                        <div className="transaction-actions">
                                            <button className="actions-menu-btn" onClick={() => setOpenMenuId(openMenuId === transaction.id ? null : transaction.id)}><MoreVertical size={18}/></button>
                                            {openMenuId === transaction.id && (
                                                <div className="actions-menu">
                                                    <button onClick={() => handleOpenModal(transaction)}><Edit size={14}/> Edit</button>
                                                    <button onClick={() => handleDelete(transaction.id)} className="delete"><Trash2 size={14}/> Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="filter-panel">
                <div className="filter-header">
                    <Filter size={20} />
                    <span>Filters</span>
                </div>
                <div className="filter-form">
                    <div className="filter-group">
                        <label>Category:</label>
                        <input type="text" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} />
                    </div>
                     <div className="filter-group">
                        <label>Account:</label>
                        <input type="text" value={filters.account} onChange={(e) => handleFilterChange('account', e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label>Date Range:</label>
                        <div className="date-inputs">
                            <input type="date" value={filters.fromDate} onChange={(e) => handleFilterChange('fromDate', e.target.value)} />
                            <input type="date" value={filters.toDate} onChange={(e) => handleFilterChange('toDate', e.target.value)} />
                        </div>
                    </div>
                     <div className="filter-group">
                        <label>Notes:</label>
                        <input type="text" value={filters.notes} onChange={(e) => handleFilterChange('notes', e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label>Type:</label>
                        <div className="checkbox-group">
                           {Object.keys(filters.types).map(type => (
                                <div className="checkbox-item" key={type}>
                                    <input 
                                        type="checkbox" 
                                        id={`type-${type}`}
                                        checked={filters.types[type]} 
                                        onChange={() => handleTypeChange(type)} 
                                    />
                                    <label htmlFor={`type-${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="filter-actions">
                    <button onClick={resetFilters} className="header-btn btn-secondary" style={{width: '100%'}}>
                        <X size={16} /> Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduledTransactionsPage;

