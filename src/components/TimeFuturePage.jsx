import React, { useState } from 'react';

const TimeFuturePage = ({ currency, formatAmount }) => {
    const [formData, setFormData] = useState({
        period: 'months',
        numberOfPeriods: 6,
        account: 'All accounts',
        futureTransactions: true,
        scheduledTransactions: true,
        debtsCredits: true,
        creditCardPayments: true,
        chartType: 'pie',
        categories: 'main'
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="time-future-page">
            <h2>Charts: Future</h2>
            
            <div className="future-form">
                <div className="form-group">
                    <label>Period:</label>
                    <div className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="months"
                                name="period"
                                value="months"
                                checked={formData.period === 'months'}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="months">Months</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="days"
                                name="period"
                                value="days"
                                checked={formData.period === 'days'}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="days">Days</label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="numberOfPeriods">Number of periods:</label>
                    <input
                        type="number"
                        id="numberOfPeriods"
                        name="numberOfPeriods"
                        value={formData.numberOfPeriods}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="account">Account:</label>
                    <input
                        type="text"
                        id="account"
                        name="account"
                        value={formData.account}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Include transactions:</label>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="futureTransactions"
                                name="futureTransactions"
                                checked={formData.futureTransactions}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="futureTransactions">Future transactions</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="scheduledTransactions"
                                name="scheduledTransactions"
                                checked={formData.scheduledTransactions}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="scheduledTransactions">Scheduled transactions</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="debtsCredits"
                                name="debtsCredits"
                                checked={formData.debtsCredits}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="debtsCredits">Debts/Credits</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="creditCardPayments"
                                name="creditCardPayments"
                                checked={formData.creditCardPayments}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="creditCardPayments">Credit card payments</label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Chart type:</label>
                    <div className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="pie"
                                name="chartType"
                                value="pie"
                                checked={formData.chartType === 'pie'}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="pie">Pie chart</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="bar"
                                name="chartType"
                                value="bar"
                                checked={formData.chartType === 'bar'}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="bar">Bar chart</label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Categories:</label>
                    <div className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="main"
                                name="categories"
                                value="main"
                                checked={formData.categories === 'main'}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="main">Main category</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="sub"
                                name="categories"
                                value="sub"
                                checked={formData.categories === 'sub'}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="sub">Subcategory</label>
                        </div>
                    </div>
                </div>

                <button className="show-report-btn">SHOW REPORT</button>
            </div>
        </div>
    );
};

export default TimeFuturePage;