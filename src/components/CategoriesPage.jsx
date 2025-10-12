import React, { useState } from 'react';
import { Plus, Minus, Edit, Trash2, ChevronRight, DollarSign } from 'lucide-react';

const CategoriesPage = ({ currency, formatAmount }) => {
    const [categories] = useState([
        {
            id: 1,
            name: 'Food & Dining',
            color: '#ef4444',
            spent: 450.00,
            budget: 600.00,
            subcategories: ['Groceries', 'Restaurants', 'Coffee', 'Fast Food']
        },
        {
            id: 2,
            name: 'Transportation',
            color: '#3b82f6',
            spent: 280.00,
            budget: 400.00,
            subcategories: ['Gas', 'Public Transport', 'Parking', 'Car Maintenance']
        },
        {
            id: 3,
            name: 'Entertainment',
            color: '#8b5cf6',
            spent: 120.00,
            budget: 200.00,
            subcategories: ['Movies', 'Games', 'Sports', 'Hobbies']
        }
    ]);

    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
    const totalIncome = 0; // This would come from props in a real app

    const getUsagePercentage = (spent, budget) => {
        return Math.round((spent / budget) * 100);
    };

    const getRemaining = (spent, budget) => {
        return budget - spent;
    };

    return (
        <div className="categories-page">
            <h2>Categories</h2>
            
            {/* Summary Cards */}
            <div className="categories-summary">
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
                        <DollarSign size={24} />
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
                        <p>Total Income</p>
                        <h4>{currency.symbol}{formatAmount(totalIncome)}</h4>
                    </div>
                </div>
            </div>

            {/* Expense Categories Section */}
            <div className="expense-categories-section">
                <div className="section-header">
                    <h3>Expense Categories</h3>
                    <button className="add-category-btn">
                        <Plus size={16} />
                        Add Category
                    </button>
                </div>

                <div className="categories-list">
                    {categories.map(category => {
                        const usagePercentage = getUsagePercentage(category.spent, category.budget);
                        const remaining = getRemaining(category.spent, category.budget);
                        
                        return (
                            <div key={category.id} className="category-item" style={{ backgroundColor: category.color }}>
                                <div className="category-header">
                                    <h4 className="category-name">{category.name}</h4>
                                    <div className="category-actions">
                                        <span className="subcategory-count">{category.subcategories.length} subcategories</span>
                                        <button className="action-btn edit-btn">
                                            <Edit size={14} />
                                        </button>
                                        <button className="action-btn delete-btn">
                                            <Trash2 size={14} />
                                        </button>
                                        <button className="action-btn chevron-btn">
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="category-details">
                                    <div className="amount-info">
                                        <span className="amount-spent">
                                            {currency.symbol}{formatAmount(category.spent)} / {currency.symbol}{formatAmount(category.budget)}
                                        </span>
                                        <span className="remaining">
                                            Remaining: {currency.symbol}{formatAmount(remaining)}
                                        </span>
                                        <span className="usage">
                                            Usage: {usagePercentage}%
                                        </span>
                                    </div>
                                    
                                    <div className="subcategories">
                                        <span className="subcategories-label">Subcategories:</span>
                                        <span className="subcategories-list">
                                            {category.subcategories.join(' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Floating Action Buttons */}
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

export default CategoriesPage;