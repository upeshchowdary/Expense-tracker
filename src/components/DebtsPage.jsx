import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, Calendar, DollarSign, Plus, Minus, MoreVertical } from 'lucide-react';

const DebtsPage = ({ currency, formatAmount }) => {
    const [debts, setDebts] = useState([
        {
            id: 1,
            name: 'Student Loan',
            lender: 'Federal Student Aid',
            originalAmount: 25000.00,
            currentBalance: 18500.00,
            interestRate: 4.5,
            minimumPayment: 250.00,
            dueDate: '2025-10-15',
            type: 'Education',
            status: 'Active',
            color: '#3b82f6'
        },
        {
            id: 2,
            name: 'Car Loan',
            lender: 'Auto Finance Co.',
            originalAmount: 15000.00,
            currentBalance: 8500.00,
            interestRate: 6.2,
            minimumPayment: 320.00,
            dueDate: '2025-10-20',
            type: 'Vehicle',
            status: 'Active',
            color: '#10b981'
        },
        {
            id: 3,
            name: 'Personal Loan',
            lender: 'Community Bank',
            originalAmount: 5000.00,
            currentBalance: 2200.00,
            interestRate: 8.9,
            minimumPayment: 180.00,
            dueDate: '2025-10-25',
            type: 'Personal',
            status: 'Active',
            color: '#f59e0b'
        },
        {
            id: 4,
            name: 'Credit Card Debt',
            lender: 'Chase Bank',
            originalAmount: 3000.00,
            currentBalance: 1890.00,
            interestRate: 18.99,
            minimumPayment: 50.00,
            dueDate: '2025-10-15',
            type: 'Credit Card',
            status: 'Active',
            color: '#ef4444'
        }
    ]);

    const getTotalDebt = () => {
        return debts.reduce((total, debt) => total + debt.currentBalance, 0);
    };

    const getTotalMinimumPayments = () => {
        return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
    };

    const getTotalPaidOff = () => {
        return debts.reduce((total, debt) => total + (debt.originalAmount - debt.currentBalance), 0);
    };

    const getUpcomingPayments = () => {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return debts.filter(debt => {
            const dueDate = new Date(debt.dueDate);
            return dueDate >= today && dueDate <= nextWeek;
        });
    };

    const upcomingPayments = getUpcomingPayments();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', lender: '', currentBalance: '', interestRate: '', minimumPayment: '', dueDate: '' });

    const startEdit = (debt) => {
        setEditingId(debt.id);
        setEditForm({
            name: debt.name,
            lender: debt.lender,
            currentBalance: debt.currentBalance,
            interestRate: debt.interestRate,
            minimumPayment: debt.minimumPayment,
            dueDate: debt.dueDate
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = () => {
        setDebts(prev => prev.map(d => d.id === editingId ? {
            ...d,
            name: editForm.name,
            lender: editForm.lender,
            currentBalance: Number(editForm.currentBalance) || 0,
            interestRate: Number(editForm.interestRate) || 0,
            minimumPayment: Number(editForm.minimumPayment) || 0,
            dueDate: editForm.dueDate
        } : d));
        setEditingId(null);
    };

    return (
        <div className="debts-page">
            <div className="debts-header">
                <h2>Debts</h2>
                <div className="debts-summary">
                    <div className="summary-card">
                        <div className="summary-icon">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="summary-details">
                            <p>Total Debt</p>
                            <h4>{currency.symbol}{formatAmount(getTotalDebt())}</h4>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon">
                            <DollarSign size={24} />
                        </div>
                        <div className="summary-details">
                            <p>Monthly Payments</p>
                            <h4>{currency.symbol}{formatAmount(getTotalMinimumPayments())}</h4>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon">
                            <TrendingDown size={24} />
                        </div>
                        <div className="summary-details">
                            <p>Paid Off</p>
                            <h4>{currency.symbol}{formatAmount(getTotalPaidOff())}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="debts-content">
                <div className="debts-list">
                    <div className="list-header">
                        <h3>Your Debts</h3>
                        <button className="add-debt-btn">
                            <Plus size={16} />
                            Add Debt
                        </button>
                    </div>

                    <div className="debts-grid">
                        {debts.map(debt => (
                            <div key={debt.id} className="debt-card">
                                <div className="debt-header">
                                    <div className="debt-icon" style={{ backgroundColor: debt.color }}>
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="debt-info">
                                        {editingId === debt.id ? (
                                            <>
                                                <input className="form-input" value={editForm.name} onChange={(e)=>setEditForm({...editForm,name:e.target.value})} />
                                                <input className="form-input" value={editForm.lender} onChange={(e)=>setEditForm({...editForm,lender:e.target.value})} />
                                            </>
                                        ) : (
                                            <>
                                                <h4>{debt.name}</h4>
                                                <p>{debt.lender}</p>
                                            </>
                                        )}
                                    </div>
                                    {editingId === debt.id ? null : (
                                        <button className="debt-menu" onClick={()=>startEdit(debt)} title="Edit">
                                            <MoreVertical size={16} />
                                        </button>
                                    )}
                                </div>
                                
                                <div className="debt-balance">
                                    <div className="balance-section">
                                        <span className="balance-label">Current Balance:</span>
                                        {editingId === debt.id ? (
                                            <input className="form-input" type="number" value={editForm.currentBalance} onChange={(e)=>setEditForm({...editForm,currentBalance:e.target.value})} />
                                        ) : (
                                            <span className="balance-amount">
                                                {currency.symbol}{formatAmount(debt.currentBalance)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="progress-section">
                                        <div className="progress-bar">
                                            <div className="progress-fill" 
                                                 style={{ 
                                                     width: `${((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100}%`,
                                                     backgroundColor: debt.color
                                                 }}>
                                            </div>
                                        </div>
                                        <span className="progress-text">
                                            {(((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100).toFixed(1)}% Paid Off
                                        </span>
                                    </div>
                                </div>

                                <div className="debt-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Original Amount:</span>
                                        <span className="detail-value">
                                            {currency.symbol}{formatAmount(debt.originalAmount)}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Interest Rate:</span>
                                        {editingId === debt.id ? (
                                            <input className="form-input" type="number" step="0.01" value={editForm.interestRate} onChange={(e)=>setEditForm({...editForm,interestRate:e.target.value})} />
                                        ) : (
                                            <span className="detail-value">{debt.interestRate}%</span>
                                        )}
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Minimum Payment:</span>
                                        {editingId === debt.id ? (
                                            <input className="form-input" type="number" value={editForm.minimumPayment} onChange={(e)=>setEditForm({...editForm,minimumPayment:e.target.value})} />
                                        ) : (
                                            <span className="detail-value">
                                                {currency.symbol}{formatAmount(debt.minimumPayment)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Due Date:</span>
                                        {editingId === debt.id ? (
                                            <input className="form-input" type="date" value={editForm.dueDate} onChange={(e)=>setEditForm({...editForm,dueDate:e.target.value})} />
                                        ) : (
                                            <span className="detail-value">
                                                {new Date(debt.dueDate).toLocaleDateString('en-GB')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Type:</span>
                                        <span className="detail-value">{debt.type}</span>
                                    </div>
                                </div>

                                <div className="debt-actions">
                                    {editingId === debt.id ? (
                                        <>
                                            <button className="action-btn save-btn" onClick={saveEdit}>Save</button>
                                            <button className="action-btn cancel-btn" onClick={cancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="action-btn pay-btn">Make Payment</button>
                                            <button className="action-btn view-btn">View Details</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="debt-strategies">
                    <h3>Debt Payoff Strategies</h3>
                    <div className="strategies-grid">
                        <div className="strategy-card">
                            <h4>Debt Snowball</h4>
                            <p>Pay minimums on all debts, then put extra money toward the smallest debt first.</p>
                            <button className="strategy-btn">Learn More</button>
                        </div>
                        <div className="strategy-card">
                            <h4>Debt Avalanche</h4>
                            <p>Pay minimums on all debts, then put extra money toward the highest interest rate debt.</p>
                            <button className="strategy-btn">Learn More</button>
                        </div>
                    </div>
                </div>

                <div className="upcoming-payments">
                    <h3>Upcoming Payments</h3>
                    {upcomingPayments.length > 0 ? (
                        <div className="payments-list">
                            {upcomingPayments.map(payment => (
                                <div key={payment.id} className="payment-item">
                                    <div className="payment-icon">
                                        <Calendar size={16} />
                                    </div>
                                    <div className="payment-details">
                                        <span className="payment-name">{payment.name}</span>
                                        <span className="payment-date">
                                            Due: {new Date(payment.dueDate).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                    <div className="payment-amount">
                                        {currency.symbol}{formatAmount(payment.minimumPayment)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-payments">No upcoming payments</p>
                    )}
                </div>
            </div>

            <div className="floating-actions">
                <button className="floating-btn add-btn">
                    <Plus size={20} />
                </button>
                <button className="floating-btn remove-btn">
                    <Minus size={20} />
                </button>
            </div>
        </div>
    );
};

export default DebtsPage;
