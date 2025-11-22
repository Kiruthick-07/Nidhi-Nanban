import React, { useState, useEffect } from 'react';
import * as financeService from '../services/financeService';
import { ArrowUpRight, ArrowDownLeft, Filter, Search } from 'lucide-react';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await financeService.getRecentTransactions(50);
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(t => {
        const matchesFilter = filter === 'all' || t.type === filter;
        const matchesSearch = t.transaction.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Calculate category totals for pie chart
    const expenseCategories = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const pieData = Object.entries(expenseCategories).map(([name, value]) => ({ name, value }));
    const totalExpense = pieData.reduce((sum, item) => sum + item.value, 0);

    // Generate Pie Chart Segments
    let cumulativePercent = 0;
    const pieSegments = pieData.map((item, index) => {
        const percent = item.value / totalExpense;
        const startAngle = cumulativePercent * 2 * Math.PI;
        const endAngle = (cumulativePercent + percent) * 2 * Math.PI;
        cumulativePercent += percent;

        const x1 = Math.cos(startAngle) * 100;
        const y1 = Math.sin(startAngle) * 100;
        const x2 = Math.cos(endAngle) * 100;
        const y2 = Math.sin(endAngle) * 100;

        const largeArcFlag = percent > 0.5 ? 1 : 0;

        // Colors
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];
        const color = colors[index % colors.length];

        return {
            d: `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
            color,
            name: item.name,
            percent: (percent * 100).toFixed(1)
        };
    });

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Transactions</h1>
                <p style={{ color: '#6b7280' }}>Manage and view your financial history</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {/* Expense Breakdown Chart */}
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(229, 231, 235, 0.5)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Expense Breakdown</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
                        <svg viewBox="-100 -100 200 200" width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                            {pieSegments.map((segment, i) => (
                                <path key={i} d={segment.d} fill={segment.color} stroke="white" strokeWidth="2" />
                            ))}
                            {pieSegments.length === 0 && <circle cx="0" cy="0" r="100" fill="#e5e7eb" />}
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {pieSegments.map((segment, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: segment.color }} />
                                    <span style={{ color: '#374151' }}>{segment.name}</span>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>{segment.percent}%</span>
                                </div>
                            ))}
                            {pieSegments.length === 0 && <span style={{ color: '#6b7280' }}>No expenses yet</span>}
                        </div>
                    </div>
                </div>

                {/* Filters & Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(229, 231, 235, 0.5)', flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Filters</h3>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <button
                                onClick={() => setFilter('all')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: filter === 'all' ? '#4f46e5' : '#e5e7eb',
                                    color: filter === 'all' ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('income')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: filter === 'income' ? '#10b981' : '#e5e7eb',
                                    color: filter === 'income' ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Income
                            </button>
                            <button
                                onClick={() => setFilter('expense')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: filter === 'expense' ? '#ef4444' : '#e5e7eb',
                                    color: filter === 'expense' ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Expense
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '16px' }} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 36px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(229, 231, 235, 0.5)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Transaction</th>
                            <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Date</th>
                            <th style={{ textAlign: 'right', padding: '12px', color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>Loading...</td></tr>
                        ) : filteredTransactions.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>No transactions found</td></tr>
                        ) : (
                            filteredTransactions.map((t) => (
                                <tr key={t._id || t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '16px 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '8px',
                                                backgroundColor: t.type === 'income' ? '#d1fae5' : '#fee2e2',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: t.type === 'income' ? '#059669' : '#dc2626'
                                            }}>
                                                {t.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#111827' }}>{t.transaction}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.account}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 12px', color: '#374151' }}>{t.category}</td>
                                    <td style={{ padding: '16px 12px', color: '#6b7280' }}>{new Date(t.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: '600', color: t.type === 'income' ? '#059669' : '#dc2626' }}>
                                        {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transaction;
