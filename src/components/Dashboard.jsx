import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SpendSummaryChart = ({ transactions }) => {
    const [spendSummaryData, setSpendSummaryData] = useState([]);

    useEffect(() => {
        if (!transactions || !Array.isArray(transactions)) {
            setSpendSummaryData([]);
            return;
        }
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlySpend = monthNames.map(m => ({ name: m, spent: 0 }));

        transactions.forEach(t => {
            if (t.type === 'expense' && t.date) {
                const monthIndex = new Date(t.date).getMonth();
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthlySpend[monthIndex].spent += Math.abs(t.amount);
                }
            }
        });
        setSpendSummaryData(monthlySpend);
    }, [transactions]);

    return (
        <div className="dashboard-chart-container">
            <h3>Spend Summary</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={spendSummaryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                        <Line type="monotone" dataKey="spent" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const Dashboard = ({ currency, navigateToTransactions, transactions, budgets, formatAmount }) => {
    // Defensive checks
    if (!transactions || !Array.isArray(transactions)) return <div>No transactions data.</div>;
    if (!currency || !currency.symbol) return <div>No currency data.</div>;
    if (!budgets || !Array.isArray(budgets)) return <div>No budgets data.</div>;
    if (!formatAmount || typeof formatAmount !== 'function') return <div>No formatAmount function.</div>;

    const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), [transactions]);
    const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0), [transactions]);
    const balance = useMemo(() => totalIncome + totalExpense, [totalIncome, totalExpense]);

    const { monthIncome, monthExpense } = useMemo(() => {
        const now = new Date();
        const m = now.getMonth();
        const y = now.getFullYear();
        let mi = 0;
        let me = 0;
        for (const t of transactions) {
            const d = new Date(t.date);
            if (!isNaN(d) && d.getMonth() === m && d.getFullYear() === y) {
                if (t.type === 'income') mi += t.amount;
                if (t.type === 'expense') me += Math.abs(t.amount);
            }
        }
        return { monthIncome: mi, monthExpense: me };
    }, [transactions]);

    return (
        <div className="dashboard-page">
            <h2>Dashboard</h2>
            <div className="dashboard-summary-row">
                <div className="summary-card income">
                    <div className="summary-icon"><TrendingUp /></div>
                    <div className="summary-details">
                        <p>This Month Income</p>
                        <h4>{currency.symbol}{formatAmount(monthIncome)}</h4>
                    </div>
                </div>
                <div className="summary-card expense">
                    <div className="summary-icon"><TrendingDown /></div>
                    <div className="summary-details">
                        <p>This Month Expense</p>
                        <h4>{currency.symbol}{formatAmount(monthExpense)}</h4>
                    </div>
                </div>
                <div className="summary-card balance">
                    <div className="summary-icon"><DollarSign /></div>
                    <div className="summary-details">
                        <p>Total Balance</p>
                        <h4>{currency.symbol}{formatAmount(balance)}</h4>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="lg-col-span-2">
                    <SpendSummaryChart transactions={transactions} />
                </div>
                <div className="dashboard-card-group">
                    <div className="dashboard-card" onClick={() => navigateToTransactions('income')}>
                        <div className="icon-container income"><TrendingUp /></div>
                        <div className="details">
                            <p>Total Income</p>
                            <p>{currency.symbol}{formatAmount(totalIncome)}</p>
                        </div>
                    </div>
                    <div className="dashboard-card" onClick={() => navigateToTransactions('expense')}>
                        <div className="icon-container expense"><TrendingDown /></div>
                        <div className="details">
                            <p>Total Expense</p>
                            <p>{currency.symbol}{formatAmount(Math.abs(totalExpense))}</p>
                        </div>
                    </div>
                    <div className="dashboard-card" onClick={() => navigateToTransactions('all')}>
                        <div className="icon-container balance"><DollarSign /></div>
                        <div className="details">
                            <p>Balance</p>
                            <p>{currency.symbol}{formatAmount(balance)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dashboard-grid mt-6">
                <div className="dashboard-quick-filters">
                    <button className="chip all" onClick={() => navigateToTransactions('all')}>All</button>
                    <button className="chip income" onClick={() => navigateToTransactions('income')}>Income</button>
                    <button className="chip expense" onClick={() => navigateToTransactions('expense')}>Expense</button>
                </div>
                <div className="dashboard-recent-transactions">
                    <h3>Recent Transactions</h3>
                    <ul>
                        {transactions.slice(0, 4).map(t => (
                            <li key={t.id}>
                                <div className="transaction-info">
                                    <div className={`transaction-icon ${t.type}`}>
                                        {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div className="transaction-details">
                                        <p>{t.description}</p>
                                        <p>{t.date}</p>
                                    </div>
                                </div>
                                <p className={`transaction-amount ${t.type}`}>
                                    {t.type === 'income' ? '+' : ''}{currency.symbol}{formatAmount(Math.abs(t.amount))}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="dashboard-budget-overview">
                    <h3>Budget Overview</h3>
                    <div>
                        {budgets.map(budget => (
                            <div key={budget.id} className="budget-item">
                                <div className="budget-details">
                                    <span>{budget.category}</span>
                                    <span>{currency.symbol}{formatAmount(budget.spent)} / {currency.symbol}{formatAmount(budget.total)}</span>
                                </div>
                                <div className="budget-progress-bar">
                                    <div
                                        className="budget-progress-bar-fill"
                                        style={{ width: `${budget.total > 0 ? (budget.spent / budget.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;