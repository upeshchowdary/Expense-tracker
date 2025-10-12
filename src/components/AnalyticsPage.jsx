import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const AnalyticsPage = ({ currency, transactions, formatAmount }) => {
    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, transaction) => {
            const category = transaction.category;
            const amount = Math.abs(transaction.amount);
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += amount;
            return acc;
        }, {});

    const expenseCategoryData = Object.keys(expenseByCategory).map(category => ({
        name: category,
        amount: expenseByCategory[category],
    })).sort((a, b) => b.amount - a.amount);

    const [incomeVsExpenseData, setIncomeVsExpenseData] = useState([]);

    useEffect(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = monthNames.map(m => ({name: m, income: 0, expense: 0}));

        transactions.forEach(t => {
            if (t.date) {
                const monthIndex = new Date(t.date).getMonth();
                if (t.type === 'income') {
                    monthlyData[monthIndex].income += t.amount;
                } else {
                    monthlyData[monthIndex].expense += Math.abs(t.amount);
                }
            }
        });
        setIncomeVsExpenseData(monthlyData);
    }, [transactions]);


    const IncomeExpenseChart = () => (
        <div className="analytics-chart-card">
            <h3>Income vs Expense</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <ComposedChart data={incomeVsExpenseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Bar dataKey="income" fill="#22c55e" barSize={20} />
                        <Bar dataKey="expense" fill="#ef4444" barSize={20} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const ExpenseCategoryChart = () => (
        <div className="analytics-chart-card">
            <h3>Expense by Category</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={expenseCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(value) => `${currency.symbol}${value/1000}k`} />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                            formatter={(value) => [`${currency.symbol}${formatAmount(value)}`, 'Amount']}
                        />
                        <Bar dataKey="amount" fill="#3b82f6" barSize={20} radius={[0, 4, 4, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const WeeklyTrendChart = () => {
        const weeklyData = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
            const weekKey = weekStart.toISOString().split('T')[0];
            
            if (!acc[weekKey]) {
                acc[weekKey] = { 
                    income: 0, 
                    expense: 0, 
                    week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                };
            }
            
            if (transaction.type === 'income') {
                acc[weekKey].income += transaction.amount;
            } else {
                acc[weekKey].expense += Math.abs(transaction.amount);
            }
            return acc;
        }, {});

        const weeklyChartData = Object.values(weeklyData).slice(0, 8); // Last 8 weeks

        return (
            <div className="analytics-chart-card">
                <h3>Weekly Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={weeklyChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="week" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                formatter={(value) => [`${currency.symbol}${formatAmount(value)}`, '']}
                            />
                            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
                            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const CategoryPieChart = () => {
        const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        
        return (
            <div className="analytics-chart-card">
                <h3>Expense Distribution</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={expenseCategoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="amount"
                            >
                                {expenseCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${currency.symbol}${formatAmount(value)}`, 'Amount']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const NetIncomeAreaChart = () => {
        const netIncomeData = incomeVsExpenseData.map(item => ({
            ...item,
            net: item.income - item.expense
        }));

        return (
            <div className="analytics-chart-card">
                <h3>Net Income Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={netIncomeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                formatter={(value) => [`${currency.symbol}${formatAmount(value)}`, 'Net Income']}
                            />
                            <Area type="monotone" dataKey="net" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <div className="analytics-page">
            <h2>Analytics</h2>
            <div className="analytics-grid">
                <IncomeExpenseChart />
                <ExpenseCategoryChart />
                <WeeklyTrendChart />
                <CategoryPieChart />
                <NetIncomeAreaChart />
            </div>
        </div>
    );
};

export default AnalyticsPage;