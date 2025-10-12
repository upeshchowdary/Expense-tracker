import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Coffee, Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage = ({ currency, transactions, formatAmount }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7; // Monday=0

    const getTransactionsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        // Ensure the date part of the transaction matches exactly
        return transactions.filter(t => t.date.startsWith(dateStr));
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid issues with different month lengths
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 0));
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(<div key={`prev-${i}`} className="calendar-day other-month"><span className="day-number">{prevMonthDays - i}</span></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayTransactions = getTransactionsForDate(date);
            const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${dayTransactions.length > 0 ? 'has-events' : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="day-number">{day}</span>
                    {total !== 0 && (
                        <div className={`day-total ${total > 0 ? 'income' : 'expense'}`}>
                            {total > 0 ? '+' : '-'}{currency.symbol}{formatAmount(Math.abs(total))}
                        </div>
                    )}
                </div>
            );
        }

        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (firstDay + daysInMonth);
        for (let i = 1; i <= remainingCells; i++) {
            days.push(<div key={`next-${i}`} className="calendar-day other-month"><span className="day-number">{i}</span></div>);
        }

        return days;
    };

    const selectedDateTransactions = getTransactionsForDate(selectedDate);
    const selectedDateTotals = selectedDateTransactions.reduce((acc, t) => {
        if (t.amount > 0) acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
    }, { income: 0, expense: 0 });

    return (
        <div className="calendar-page">
            <style>{`
                /* Global Styles */
                .calendar-page { display: flex; gap: 1.5rem; padding: 1.5rem; height: 100%; background-color: var(--main-bg, #F7F9FC); }
                body.dark-mode .calendar-page { background-color: var(--main-bg, #1A202C); }

                /* Main Calendar Area */
                .calendar-main { flex: 1; display: flex; flex-direction: column; background-color: var(--sidebar-bg, #fff); border-radius: 12px; border: 1px solid var(--sidebar-border-color, #e2e8f0); padding: 1.5rem; }
                body.dark-mode .calendar-main { background-color: var(--sidebar-bg, #1f2937); border-color: var(--sidebar-border-color, #374151); }
                .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .month-year { font-size: 1.5rem; font-weight: 600; color: var(--sidebar-logo-text, #1a202c); }
                .nav-button, .today-button { background: none; border: 1px solid var(--sidebar-border-color); color: var(--sidebar-link-text); cursor: pointer; border-radius: 8px; padding: 0.5rem 0.8rem; display: flex; align-items: center; transition: all 0.2s; }
                .nav-button:hover, .today-button:hover { background-color: var(--sidebar-link-hover-bg); color: var(--sidebar-logo-text); }
                .header-controls { display: flex; gap: 0.75rem; }

                /* Calendar Grid */
                .calendar-grid { display: grid; grid-template-rows: auto 1fr; flex-grow: 1; }
                .calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 500; color: var(--sidebar-link-text); padding-bottom: 0.75rem; border-bottom: 1px solid var(--sidebar-border-color); }
                .calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; flex-grow: 1; border-left: 1px solid var(--sidebar-border-color); }
                .calendar-day { border-right: 1px solid var(--sidebar-border-color); border-bottom: 1px solid var(--sidebar-border-color); padding: 0.75rem; transition: background-color 0.2s; cursor: pointer; }
                .calendar-day:hover { background-color: var(--sidebar-link-hover-bg); }
                .day-number { font-weight: 500; color: var(--sidebar-logo-text); }
                .other-month .day-number { opacity: 0.4; }
                .calendar-day.today { background-color: var(--sidebar-link-active-bg); }
                .calendar-day.today .day-number { color: var(--sidebar-link-active-text); font-weight: 700; }
                .calendar-day.selected { border: 2px solid var(--sidebar-link-active-text); padding: calc(0.75rem - 2px); }
                .day-total { font-size: 0.8rem; margin-top: 0.5rem; text-align: right; font-weight: 500; }
                .day-total.income { color: #10B981; }
                .day-total.expense { color: #EF4444; }

                /* Details Panel */
                .details-panel { width: 350px; flex-shrink: 0; display: flex; flex-direction: column; gap: 1.5rem; }
                .details-card { background-color: var(--sidebar-bg, #fff); border-radius: 12px; border: 1px solid var(--sidebar-border-color, #e2e8f0); padding: 1.5rem; }
                body.dark-mode .details-card { background-color: var(--sidebar-bg, #1f2937); border-color: var(--sidebar-border-color, #374151); }
                .details-header h3 { font-size: 1.25rem; font-weight: 600; color: var(--sidebar-logo-text); margin: 0; }
                .details-header p { color: var(--sidebar-link-text); margin: 0.25rem 0 0; }
                .details-summary { display: flex; justify-content: space-around; padding: 1rem 0; border-top: 1px solid var(--sidebar-border-color); border-bottom: 1px solid var(--sidebar-border-color); margin-top: 1rem; }
                .summary-item { text-align: center; }
                .summary-item .summary-label { font-size: 0.8rem; color: var(--sidebar-link-text); }
                .summary-item .summary-amount { font-size: 1.1rem; font-weight: 600; }
                .summary-item.income .summary-amount { color: #10B981; }
                .summary-item.expense .summary-amount { color: #EF4444; }
                .transactions-list { flex-grow: 1; overflow-y: auto; }
                .transactions-list h4 { font-weight: 600; color: var(--sidebar-logo-text); margin-bottom: 1rem; }
                .empty-state { text-align: center; padding: 2rem; color: var(--sidebar-link-text); }
                .transaction-item-details { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; }
                .transaction-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: var(--sidebar-link-hover-bg); color: var(--sidebar-link-text); }
                .transaction-info { flex-grow: 1; }
                .transaction-description { font-weight: 500; color: var(--sidebar-logo-text); }
                .transaction-account { font-size: 0.8rem; color: var(--sidebar-link-text); }
                .transaction-amount-details { font-weight: 500; }
                .transaction-amount-details.income { color: #10B981; }
                .transaction-amount-details.expense { color: #EF4444; }
            `}</style>
            
            <div className="calendar-main">
                <div className="calendar-header">
                    <h2 className="month-year">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <div className="header-controls">
                        <button className="nav-button" onClick={() => navigateMonth(-1)}><ChevronLeft size={20} /></button>
                        <button className="today-button" onClick={goToToday}>Today</button>
                        <button className="nav-button" onClick={() => navigateMonth(1)}><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="calendar-grid">
                    <div className="calendar-weekdays">
                        {dayNames.map(day => <div key={day} className="weekday">{day}</div>)}
                    </div>
                    <div className="calendar-days">{renderCalendarDays()}</div>
                </div>
            </div>

            <div className="details-panel">
                <div className="details-card">
                    <div className="details-header">
                        <h3>{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</h3>
                        <p>{selectedDate.toLocaleDateString('en-GB', { weekday: 'long' })}</p>
                    </div>
                    <div className="details-summary">
                        <div className="summary-item income">
                            <span className="summary-label">Income</span>
                            <span className="summary-amount">{currency.symbol}{formatAmount(selectedDateTotals.income)}</span>
                        </div>
                        <div className="summary-item expense">
                            <span className="summary-label">Expenses</span>
                            <span className="summary-amount">{currency.symbol}{formatAmount(Math.abs(selectedDateTotals.expense))}</span>
                        </div>
                    </div>
                </div>
                <div className="details-card transactions-list">
                    <h4>Transactions on this day</h4>
                    {selectedDateTransactions.length > 0 ? (
                        selectedDateTransactions.map((t, index) => (
                            <div key={index} className="transaction-item-details">
                                <div className="transaction-icon"><Coffee size={18} /></div>
                                <div className="transaction-info">
                                    <div className="transaction-description">{t.description}</div>
                                    <div className="transaction-account">{t.category}</div>
                                </div>
                                <div className={`transaction-amount-details ${t.amount > 0 ? 'income' : 'expense'}`}>{currency.symbol}{formatAmount(Math.abs(t.amount))}</div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <CalendarIcon size={40} strokeWidth={1} />
                            <p>No transactions for this day.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
