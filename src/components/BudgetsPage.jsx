import React, { useState } from 'react';
import { Plus, MoreVertical, Target, DollarSign, TrendingUp, AlertTriangle, Edit, Trash2 } from 'lucide-react';

const BudgetsPage = ({ currency, budgets, handleAddBudget, formatAmount }) => {
    const [formValues, setFormValues] = useState({ category: '', total: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const total = parseFloat(formValues.total);
        if (!formValues.category || !total) return;

        const newBudget = {
            category: formValues.category,
            total: total,
            spent: 0,
        };
        handleAddBudget(newBudget);
        setFormValues({ category: '', total: '' });
        setShowAddForm(false);
    };

    const getBudgetStatus = (budget) => {
        const percentage = (budget.spent / budget.total) * 100;
        if (percentage >= 100) return 'over';
        if (percentage >= 80) return 'warning';
        return 'good';
    };

    const getBudgetColor = (budget) => {
        const status = getBudgetStatus(budget);
        switch (status) {
            case 'over': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#22c55e';
        }
    };

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.total, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalRemaining = totalBudget - totalSpent;

    return (
        <div className="budgets-page">
            <div className="budgets-header">
                <h2>Budgets</h2>
                <button 
                    className="add-budget-header-btn"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <Plus size={20} />
                    Add Budget
                </button>
            </div>

            {showAddForm && (
                <div className="add-budget-form-container">
                    <div className="add-budget-form-card">
                        <h3>Create New Budget</h3>
                        <form className="add-budget-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={formValues.category} onChange={handleInputChange}>
                                    <option value="">Select Category</option>
                                    <option>Groceries</option>
                                    <option>Dining</option>
                                    <option>Transport</option>
                                    <option>Entertainment</option>
                                    <option>Utilities</option>
                                    <option>Healthcare</option>
                                    <option>Education</option>
                                    <option>Travel</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Monthly Limit</label>
                                <input 
                                    type="number" 
                                    name="total" 
                                    value={formValues.total} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g. 500" 
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    <Plus size={20} />
                                    Add Budget
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="budgets-summary">
                <div className="summary-card">
                    <div className="summary-icon">
                        <Target size={24} />
                    </div>
                    <div className="summary-details">
                        <p>Total Budget</p>
                        <h4>{currency.symbol}{formatAmount(totalBudget)}</h4>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon">
                        <DollarSign size={24} />
                    </div>
                    <div className="summary-details">
                        <p>Total Spent</p>
                        <h4>{currency.symbol}{formatAmount(totalSpent)}</h4>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="summary-details">
                        <p>Remaining</p>
                        <h4>{currency.symbol}{formatAmount(totalRemaining)}</h4>
                    </div>
                </div>
            </div>

            <div className="budgets-list">
                <div className="budgets-list-header">
                    <h3>Your Budgets</h3>
                    <div className="budgets-stats">
                        <span className="budget-count">{budgets.length} budgets</span>
                    </div>
                </div>
                
                {budgets.length === 0 ? (
                    <div className="empty-state">
                        <Target size={48} />
                        <h4>No budgets yet</h4>
                        <p>Create your first budget to start tracking your spending</p>
                        <button 
                            className="create-first-budget-btn"
                            onClick={() => setShowAddForm(true)}
                        >
                            <Plus size={20} />
                            Create Budget
                        </button>
                    </div>
                ) : (
                    <div className="budgets-grid">
                        {budgets.map(budget => {
                            const percentage = (budget.spent / budget.total) * 100;
                            const status = getBudgetStatus(budget);
                            const color = getBudgetColor(budget);
                            
                            return (
                                <div key={budget.id} className="budget-item-card">
                                    <div className="budget-item-header">
                                        <div className="budget-category">
                                            <h4>{budget.category}</h4>
                                            <span className={`budget-status ${status}`}>
                                                {status === 'over' ? 'Over Budget' : 
                                                 status === 'warning' ? 'Warning' : 'On Track'}
                                            </span>
                                        </div>
                                        <div className="budget-actions">
                                            <button className="action-btn" title="Edit budget">
                                                <Edit size={16} />
                                            </button>
                                            <button className="action-btn" title="Delete budget">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="action-btn" title="More options">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="budget-amounts">
                                        <div className="budget-amount-row">
                                            <span className="amount-label">Spent</span>
                                            <span className="amount-value spent">
                                                {currency.symbol}{formatAmount(budget.spent)}
                                            </span>
                                        </div>
                                        <div className="budget-amount-row">
                                            <span className="amount-label">Budget</span>
                                            <span className="amount-value total">
                                                {currency.symbol}{formatAmount(budget.total)}
                                            </span>
                                        </div>
                                        <div className="budget-amount-row">
                                            <span className="amount-label">Remaining</span>
                                            <span className="amount-value remaining">
                                                {currency.symbol}{formatAmount(budget.total - budget.spent)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="budget-progress">
                                        <div className="budget-progress-bar">
                                            <div 
                                                className="budget-progress-fill" 
                                                style={{ 
                                                    width: `${Math.min(percentage, 100)}%`,
                                                    backgroundColor: color
                                                }}
                                            ></div>
                                        </div>
                                        <div className="budget-percentage">
                                            {percentage.toFixed(1)}%
                                        </div>
                                    </div>

                                    {status === 'over' && (
                                        <div className="budget-warning">
                                            <AlertTriangle size={16} />
                                            <span>You've exceeded your budget by {currency.symbol}{formatAmount(budget.spent - budget.total)}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetsPage;