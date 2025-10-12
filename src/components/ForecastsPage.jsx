import React, { useState } from 'react';
import { Cloud, TrendingUp, Target, AlertCircle, Plus, Minus } from 'lucide-react';

const ForecastsPage = ({ currency, formatAmount }) => {
    const [forecastType, setForecastType] = useState('budget');
    const [timeHorizon, setTimeHorizon] = useState('6months');

    const forecasts = {
        budget: [
            {
                category: 'Food & Dining',
                current: 450,
                forecast: 480,
                variance: 30,
                confidence: 'High'
            },
            {
                category: 'Transportation',
                current: 280,
                forecast: 295,
                variance: 15,
                confidence: 'Medium'
            },
            {
                category: 'Entertainment',
                current: 120,
                forecast: 135,
                variance: 15,
                confidence: 'High'
            },
            {
                category: 'Healthcare',
                current: 150,
                forecast: 160,
                variance: 10,
                confidence: 'Low'
            }
        ],
        income: [
            {
                source: 'Salary',
                current: 4500,
                forecast: 4725,
                variance: 225,
                confidence: 'High'
            },
            {
                source: 'Freelance',
                current: 800,
                forecast: 850,
                variance: 50,
                confidence: 'Medium'
            },
            {
                source: 'Investments',
                current: 200,
                forecast: 220,
                variance: 20,
                confidence: 'Low'
            }
        ],
        savings: [
            {
                goal: 'Emergency Fund',
                current: 5000,
                target: 10000,
                forecast: 7500,
                monthsToGoal: 8,
                confidence: 'High'
            },
            {
                goal: 'Vacation Fund',
                current: 1200,
                target: 3000,
                forecast: 2400,
                monthsToGoal: 6,
                confidence: 'Medium'
            },
            {
                goal: 'Home Down Payment',
                current: 15000,
                target: 50000,
                forecast: 25000,
                monthsToGoal: 24,
                confidence: 'Low'
            }
        ]
    };

    const getForecastData = () => {
        return forecasts[forecastType] || [];
    };

    const getConfidenceColor = (confidence) => {
        switch (confidence) {
            case 'High': return '#10b981';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <div className="forecasts-page">
            <div className="forecasts-header">
                <h2>Financial Forecasts</h2>
                <div className="forecast-controls">
                    <div className="forecast-type-selector">
                        <button 
                            className={forecastType === 'budget' ? 'active' : ''}
                            onClick={() => setForecastType('budget')}
                        >
                            Budget Forecast
                        </button>
                        <button 
                            className={forecastType === 'income' ? 'active' : ''}
                            onClick={() => setForecastType('income')}
                        >
                            Income Forecast
                        </button>
                        <button 
                            className={forecastType === 'savings' ? 'active' : ''}
                            onClick={() => setForecastType('savings')}
                        >
                            Savings Forecast
                        </button>
                    </div>
                    <div className="time-horizon-selector">
                        <label>Time Horizon:</label>
                        <select 
                            value={timeHorizon} 
                            onChange={(e) => setTimeHorizon(e.target.value)}
                        >
                            <option value="3months">3 Months</option>
                            <option value="6months">6 Months</option>
                            <option value="1year">1 Year</option>
                            <option value="2years">2 Years</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="forecasts-content">
                <div className="forecast-summary">
                    <div className="summary-card">
                        <div className="summary-icon">
                            <Cloud size={24} />
                        </div>
                        <div className="summary-details">
                            <p>Forecast Accuracy</p>
                            <h4>85%</h4>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon">
                            <TrendingUp size={24} />
                        </div>
                        <div className="summary-details">
                            <p>Predicted Growth</p>
                            <h4>+12.5%</h4>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon">
                            <Target size={24} />
                        </div>
                        <div className="summary-details">
                            <p>Goals Achievable</p>
                            <h4>3/4</h4>
                        </div>
                    </div>
                </div>

                <div className="forecast-chart">
                    <h3>{forecastType === 'budget' ? 'Budget Forecast' : forecastType === 'income' ? 'Income Forecast' : 'Savings Forecast'}</h3>
                    <div className="chart-container">
                        <div className="forecast-bars">
                            {getForecastData().map((item, index) => (
                                <div key={index} className="forecast-bar">
                                    <div className="bar-container">
                                        <div 
                                            className="current-bar" 
                                            style={{ 
                                                height: `${(item.current / Math.max(...getForecastData().map(i => Math.max(i.current, i.forecast)))) * 100}%` 
                                            }}
                                        ></div>
                                        <div 
                                            className="forecast-bar-fill" 
                                            style={{ 
                                                height: `${(item.forecast / Math.max(...getForecastData().map(i => Math.max(i.current, i.forecast)))) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <div className="forecast-label">
                                        {forecastType === 'budget' ? item.category : forecastType === 'income' ? item.source : item.goal}
                                    </div>
                                    <div className="forecast-values">
                                        <div className="current-value">
                                            {currency.symbol}{formatAmount(item.current)}
                                        </div>
                                        <div className="forecast-value">
                                            {currency.symbol}{formatAmount(item.forecast)}
                                        </div>
                                        {item.variance && (
                                            <div className={`variance-value ${item.variance >= 0 ? 'positive' : 'negative'}`}>
                                                {item.variance >= 0 ? '+' : ''}{currency.symbol}{formatAmount(item.variance)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="confidence-indicator">
                                        <div 
                                            className="confidence-dot" 
                                            style={{ backgroundColor: getConfidenceColor(item.confidence) }}
                                        ></div>
                                        <span>{item.confidence}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="forecast-table">
                    <h3>Detailed Forecasts</h3>
                    <div className="table-container">
                        <table className="forecast-table-content">
                            <thead>
                                <tr>
                                    <th>{forecastType === 'budget' ? 'Category' : forecastType === 'income' ? 'Source' : 'Goal'}</th>
                                    <th>Current</th>
                                    <th>Forecast</th>
                                    <th>Variance</th>
                                    <th>Confidence</th>
                                    {forecastType === 'savings' && <th>Months to Goal</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {getForecastData().map((item, index) => (
                                    <tr key={index}>
                                        <td>{forecastType === 'budget' ? item.category : forecastType === 'income' ? item.source : item.goal}</td>
                                        <td className="current-cell">
                                            {currency.symbol}{formatAmount(item.current)}
                                        </td>
                                        <td className="forecast-cell">
                                            {currency.symbol}{formatAmount(item.forecast)}
                                        </td>
                                        <td className={`variance-cell ${item.variance >= 0 ? 'positive' : 'negative'}`}>
                                            {item.variance ? `${item.variance >= 0 ? '+' : ''}${currency.symbol}${formatAmount(item.variance)}` : 'N/A'}
                                        </td>
                                        <td className="confidence-cell">
                                            <span 
                                                className="confidence-badge" 
                                                style={{ backgroundColor: getConfidenceColor(item.confidence) }}
                                            >
                                                {item.confidence}
                                            </span>
                                        </td>
                                        {forecastType === 'savings' && (
                                            <td className="months-cell">
                                                {item.monthsToGoal} months
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="forecast-insights">
                    <h3>Forecast Insights</h3>
                    <div className="insights-grid">
                        <div className="insight-card">
                            <div className="insight-icon">
                                <AlertCircle size={20} />
                            </div>
                            <div className="insight-content">
                                <h4>High Confidence Predictions</h4>
                                <p>Most budget categories show stable spending patterns with high forecast accuracy.</p>
                            </div>
                        </div>
                        <div className="insight-card">
                            <div className="insight-icon">
                                <TrendingUp size={20} />
                            </div>
                            <div className="insight-content">
                                <h4>Growth Opportunities</h4>
                                <p>Income forecasts suggest potential for increased earnings through freelance work.</p>
                            </div>
                        </div>
                        <div className="insight-card">
                            <div className="insight-icon">
                                <Target size={20} />
                            </div>
                            <div className="insight-content">
                                <h4>Goal Achievement</h4>
                                <p>Emergency fund goal is on track, while vacation fund may need adjustment.</p>
                            </div>
                        </div>
                    </div>
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

export default ForecastsPage;
