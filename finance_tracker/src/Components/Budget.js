import React, { useState, useEffect } from 'react';
import * as financeService from '../services/financeService';
import { Edit2, Check, X, TrendingUp, AlertCircle } from 'lucide-react';

const Budget = () => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState('');
    const [error, setError] = useState(null);

    const fetchBudget = async () => {
        try {
            setLoading(true);
            const data = await financeService.getFinancialSummary();
            setBudgetData(data);
            setNewBudget(data.budgetBreakdown.total.toString());
        } catch (err) {
            console.error('Error fetching budget:', err);
            setError('Failed to load budget data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudget();
    }, []);

    const handleUpdateBudget = async () => {
        try {
            const amount = parseFloat(newBudget);
            if (isNaN(amount) || amount < 0) {
                alert('Please enter a valid positive amount');
                return;
            }

            await financeService.updateBudget(amount);
            setIsEditing(false);
            fetchBudget(); // Refresh data
        } catch (err) {
            console.error('Error updating budget:', err);
            alert('Failed to update budget');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading budget data...</div>;
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

    const { totalExpenses } = budgetData;
    const totalBudget = budgetData.budgetBreakdown.total;
    const percentageUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
    const isOverBudget = totalExpenses > totalBudget;

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Budget Management</h1>
                <p style={{ color: '#6b7280' }}>Track your spending against your monthly budget</p>
            </div>

            {/* Main Budget Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Budget</h2>
                        {isEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827' }}>$</span>
                                <input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', border: 'none', borderBottom: '2px solid #4f46e5', width: '200px', outline: 'none' }}
                                    autoFocus
                                />
                                <button onClick={handleUpdateBudget} style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}><Check size={20} /></button>
                                <button onClick={() => setIsEditing(false)} style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>${totalBudget.toLocaleString()}</span>
                                <button onClick={() => setIsEditing(true)} style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#6b7280', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}><Edit2 size={16} /></button>
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Spent</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: isOverBudget ? '#ef4444' : '#111827' }}>${totalExpenses.toLocaleString()}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                        <span style={{ color: isOverBudget ? '#ef4444' : '#4f46e5' }}>{percentageUsed.toFixed(1)}% Used</span>
                        <span style={{ color: '#6b7280' }}>${Math.max(0, totalBudget - totalExpenses).toLocaleString()} Remaining</span>
                    </div>
                    <div style={{ width: '100%', height: '16px', backgroundColor: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min(percentageUsed, 100)}%`,
                            height: '100%',
                            backgroundColor: isOverBudget ? '#ef4444' : '#4f46e5',
                            borderRadius: '999px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                {isOverBudget && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px', color: '#b91c1c', fontSize: '14px' }}>
                        <AlertCircle size={16} />
                        You have exceeded your monthly budget by ${(totalExpenses - totalBudget).toLocaleString()}.
                    </div>
                )}
            </div>

            {/* Categories Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#ecfdf5', borderRadius: '12px', color: '#059669' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Savings Goal (40%)</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>${(totalBudget * 0.4).toLocaleString()}</div>
                        </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>Recommended savings based on your budget.</p>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#eff6ff', borderRadius: '12px', color: '#3b82f6' }}>
                            <TrendingUp size={24} style={{ transform: 'scaleY(-1)' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Daily Safe Spend</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                                ${Math.max(0, (totalBudget - totalExpenses) / (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>Amount you can spend daily for the rest of the month.</p>
                </div>
            </div>
        </div>
    );
};

export default Budget;
