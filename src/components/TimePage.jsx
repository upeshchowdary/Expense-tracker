import React, { useState } from 'react';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';

const TimePage = ({ currency, formatAmount }) => {
    const [timeData] = useState({
        totalTime: 168, // hours per week
        workTime: 40,
        personalTime: 32,
        sleepTime: 56,
        freeTime: 40
    });

    return (
        <div className="time-page">
            <h2>Time</h2>
            
            <div className="time-content">
                <div className="time-card">
                    <h3>Time Allocation</h3>
                    <div className="time-stats">
                        <div className="time-stat">
                            <div className="time-stat-value">{timeData.workTime}h</div>
                            <div className="time-stat-label">Work</div>
                        </div>
                        <div className="time-stat">
                            <div className="time-stat-value">{timeData.personalTime}h</div>
                            <div className="time-stat-label">Personal</div>
                        </div>
                        <div className="time-stat">
                            <div className="time-stat-value">{timeData.sleepTime}h</div>
                            <div className="time-stat-label">Sleep</div>
                        </div>
                        <div className="time-stat">
                            <div className="time-stat-value">{timeData.freeTime}h</div>
                            <div className="time-stat-label">Free Time</div>
                        </div>
                    </div>
                </div>

                <div className="time-card">
                    <h3>Time Trends</h3>
                    <div className="time-chart">
                        <TrendingUp size={48} />
                        <span style={{ marginLeft: '1rem' }}>Time analysis chart will be displayed here</span>
                    </div>
                </div>
            </div>

            <div className="time-card">
                <h3>Weekly Time Breakdown</h3>
                <div className="time-stats">
                    <div className="time-stat">
                        <div className="time-stat-value">{timeData.totalTime}h</div>
                        <div className="time-stat-label">Total Hours</div>
                    </div>
                    <div className="time-stat">
                        <div className="time-stat-value">24h</div>
                        <div className="time-stat-label">Per Day</div>
                    </div>
                    <div className="time-stat">
                        <div className="time-stat-value">7</div>
                        <div className="time-stat-label">Days</div>
                    </div>
                    <div className="time-stat">
                        <div className="time-stat-value">100%</div>
                        <div className="time-stat-label">Utilization</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimePage;