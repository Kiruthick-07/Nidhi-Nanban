import React, { useState, useEffect } from 'react';
import { TrendingUp, User, LogOut, HelpCircle, Download } from 'lucide-react';
import * as financeService from '../services/financeService';
import Transaction from './Transaction';
import Budget from './Budget';

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // State for financial data from backend
  const [financialData, setFinancialData] = useState({
    currentBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyData: [],
    budgetBreakdown: {
      total: 0,
      categories: []
    }
  });

  // State for transactions from backend
  const [transactions, setTransactions] = useState([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income'); // 'income' or 'expense'

  // form inputs for modal
  const [form, setForm] = useState({
    account: '',
    transaction: '',
    category: '',
    amount: '',
    date: ''
  });

  // Load financial data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [summary, recentTransactions] = await Promise.all([
          financeService.getFinancialSummary(),
          financeService.getRecentTransactions(10)
        ]);

        setFinancialData(summary);
        setTransactions(recentTransactions);
      } catch (error) {
        console.error('Error loading financial data:', error);
        setError('Failed to load financial data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setForm({
      account: '',
      transaction: '',
      category: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10) // default to today in yyyy-mm-dd
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.transaction || !form.amount || !form.date) {
      alert('Please fill transaction name, amount and date.');
      return;
    }

    const parsedAmount = parseFloat(form.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Enter a valid positive amount.');
      return;
    }

    try {
      // Add transaction via API
      const response = await financeService.addTransaction({
        account: form.account || 'Unknown Account',
        transaction: form.transaction,
        category: form.category || (modalType === 'income' ? 'Income' : 'Expense'),
        amount: parsedAmount,
        date: form.date,
        type: modalType
      });

      // Update local state with the new transaction
      setTransactions(prev => [response.transaction, ...prev]);

      // Refresh financial summary
      const summary = await financeService.getFinancialSummary();
      setFinancialData(summary);

      // close modal
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const generatePath = (data) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    const width = 280;
    const height = 120;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.value - minValue) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const generateDonutChart = () => {
    const total = financialData.budgetBreakdown.total;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercentage = 0;

    return financialData.budgetBreakdown.categories.map((category) => {
      const percentage = (category.amount / total) * 100;
      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -(cumulativePercentage / 100) * circumference;
      cumulativePercentage += percentage;
      return {
        ...category,
        strokeDasharray,
        strokeDashoffset,
        percentage: percentage.toFixed(1)
      };
    });
  };

  const donutSegments = generateDonutChart();

  /* ---------- Styles (inline objects) ---------- */
  const rootStyle = {
    display: 'flex',
    height: '100vh',
    background: '#f3f4f6', // Softer gray background
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
  };

  const sidebarStyle = {
    width: '256px',
    background: 'linear-gradient(180deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const profileStyle = {
    padding: '24px',
    borderBottom: '1px solid rgba(79, 70, 229, 0.3)'
  };

  const navStyle = { flex: 1, padding: '16px' };

  const sectionHeaderStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(199, 210, 254, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 12px 0'
  };

  const mainStyle = { flex: 1, overflow: 'auto' };

  const stickyHeaderStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
    padding: '24px',
    position: 'sticky',
    top: 0,
    zIndex: 10
  };

  const contentStyle = { padding: '24px' };

  const cardCommon = {
    backgroundColor: '#ffffff',
    borderRadius: '20px', // More rounded
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Softer shadow
    border: '1px solid rgba(229, 231, 235, 0.4)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default'
  };

  return (
    <div style={rootStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={profileStyle}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.3)',
            marginBottom: '16px'
          }}>
            <User style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>USER NAME</h3>
        </div>

        {/* Navigation */}
        <nav style={navStyle}>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={sectionHeaderStyle}>Main</h4>
            {['Dashboard', 'Transaction', 'Budget'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === item ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: activeTab === item ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                  boxShadow: activeTab === item ? '0 8px 25px -5px rgba(0, 0, 0, 0.1)' : 'none',
                  cursor: 'pointer',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={sectionHeaderStyle}>Tools</h4>
            {[
              { name: 'Finance Advisor', icon: HelpCircle },
              { name: 'Export Transaction', icon: Download }
            ].map((item) => (
              <button
                key={item.name}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <item.icon style={{ width: '16px', height: '16px' }} />
                {item.name}
              </button>
            ))}
          </div>

          <div>
            <h4 style={sectionHeaderStyle}>Settings</h4>
            {[
              { name: 'Account', icon: User },
              { name: 'Log out', icon: LogOut }
            ].map((item) => (
              <button
                key={item.name}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <item.icon style={{ width: '16px', height: '16px' }} />
                {item.name}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        {/* Header */}
        <div style={stickyHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>DASHBOARD</h1>
              <p style={{ color: '#6b7280', margin: 0 }}>Overview of your finances</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => openModal('income')}
              >
                ADD INCOME
              </button>

              <button
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => openModal('expense')}
              >
                ADD EXPENSE
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={contentStyle}>
          {activeTab === 'Transaction' && <Transaction />}
          {activeTab === 'Budget' && <Budget />}

          {activeTab === 'Dashboard' && (
            <>
              {/* Loading and Error States */}
              {isLoading && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                  fontSize: '18px',
                  color: '#6b7280'
                }}>
                  Loading financial data...
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  color: '#dc2626'
                }}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              {!isLoading && !error && (
                <>
                  {/* Balance Cards - Now using calculated values */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    {/* Current Balance Card */}
                    <div
                      style={{ ...cardCommon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                          💰
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>Current Balance</p>
                      </div>
                      <h2 style={{ fontWeight: '800', fontSize: '36px', margin: 0, letterSpacing: '-0.02em' }}>
                        ${financialData.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                    </div>

                    {/* Income Card */}
                    <div
                      style={{ ...cardCommon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                          📈
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>Total Income</p>
                      </div>
                      <h2 style={{ fontWeight: '800', fontSize: '36px', margin: 0, letterSpacing: '-0.02em' }}>
                        ${financialData.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                    </div>

                    {/* Expense Card */}
                    <div
                      style={{ ...cardCommon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(239, 68, 68, 0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                          📉
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>Total Expenses</p>
                      </div>
                      <h2 style={{ fontWeight: '800', fontSize: '36px', margin: 0, letterSpacing: '-0.02em' }}>
                        ${financialData.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    {/* Account Overview - Now using calculated balance */}
                    <div style={cardCommon}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>ACCOUNT OVERVIEW</h3>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Last 6 months</p>
                        </div>
                        <button style={{ color: '#4f46e5', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}>See more</button>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                          ${financialData.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div style={{ position: 'relative', height: '128px', marginBottom: '16px' }}>
                        <svg width="100%" height="100%" viewBox="0 0 300 120" style={{ overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#6366F1" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          <path d={`${generatePath(financialData.monthlyData)} L 280,120 L 0,120 Z`} fill="url(#areaGradient)" />
                          <path d={generatePath(financialData.monthlyData)} fill="none" stroke="url(#lineGradient)" strokeWidth="3" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />

                          {financialData.monthlyData.map((point, index) => {
                            const maxValue = Math.max(...financialData.monthlyData.map(d => d.value));
                            const minValue = Math.min(...financialData.monthlyData.map(d => d.value));
                            const range = maxValue - minValue || 1;
                            const x = (index / (financialData.monthlyData.length - 1)) * 280;
                            const y = 120 - ((point.value - minValue) / range) * 120;
                            return (
                              <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#6366F1"
                                style={{ cursor: 'pointer', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', transition: 'r 0.2s ease' }}
                                onMouseEnter={(e) => e.currentTarget.setAttribute('r', '6')}
                                onMouseLeave={(e) => e.currentTarget.setAttribute('r', '4')}
                              />
                            );
                          })}
                        </svg>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                        {financialData.monthlyData.map((point) => <span key={point.month}>{point.month}</span>)}
                      </div>
                    </div>

                    {/* Monthly Budget - Donut Chart with calculated data */}
                    <div style={cardCommon}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>MONTHLY BUDGET</h3>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Current Period</p>
                        </div>
                        <button style={{ color: '#4f46e5', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}>Manage Budget</button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <div style={{ position: 'relative' }}>
                          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                            {donutSegments.map((segment, index) => (
                              <circle
                                key={index}
                                cx="70"
                                cy="70"
                                r="60"
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="20"
                                strokeDasharray={segment.strokeDasharray}
                                strokeDashoffset={segment.strokeDashoffset}
                                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))', transition: 'stroke-width 0.3s ease', cursor: 'pointer' }}
                                onMouseEnter={(e) => e.currentTarget.setAttribute('stroke-width', '22')}
                                onMouseLeave={(e) => e.currentTarget.setAttribute('stroke-width', '20')}
                              />
                            ))}
                          </svg>

                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                              ${financialData.budgetBreakdown.total.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {financialData.budgetBreakdown.categories.map((category, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: category.color, marginRight: '8px' }} />
                              <span>{category.name}</span>
                            </div>
                            <span style={{ fontWeight: '600', color: '#111827' }}>${category.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Budget Card with calculated balance */}
                    <div style={cardCommon}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Current Balance</h3>
                        <div style={{ fontSize: '32px' }}>💰</div>
                      </div>

                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                        ${financialData.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: financialData.currentBalance >= 0 ? '#10b981' : '#ef4444', fontWeight: '600', marginBottom: '24px' }}>
                        <TrendingUp style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        {financialData.currentBalance >= 0 ? '+' : ''}
                        {((financialData.currentBalance / Math.max(financialData.totalIncome, 1)) * 100).toFixed(1)}%
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'linear-gradient(90deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Available Balance</span>
                          <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                            ${financialData.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Total Income</span>
                          <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                            ${financialData.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Total Expenses</span>
                          <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                            ${financialData.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div style={cardCommon}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>RECENT TRANSACTIONS</h3>

                      <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                          style={{ color: '#4f46e5', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}
                          onClick={() => openModal('income')}
                        >
                          + Add new transaction
                        </button>
                        <button style={{ color: '#4f46e5', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}>
                          See more
                        </button>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: 12, fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>ACCOUNT</th>
                            <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: 12, fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>TRANSACTION</th>
                            <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: 12, fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>CATEGORY</th>
                            <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: 12, fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>DATE</th>
                            <th style={{ textAlign: 'right', padding: '16px 8px', fontSize: 12, fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>AMOUNT</th>
                            <th style={{ width: 60 }} />
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr
                              key={transaction.id}
                              onMouseEnter={() => setHoveredRow(transaction.id)}
                              onMouseLeave={() => setHoveredRow(null)}
                              style={{ borderTop: '1px solid rgba(0,0,0,0.03)', background: hoveredRow === transaction.id ? 'rgba(99,102,241,0.03)' : 'transparent', transition: 'background 0.15s ease' }}
                            >
                              <td style={{ padding: '16px 8px', fontSize: 14, fontWeight: '500', color: '#1f2937' }}>{transaction.account}</td>
                              <td style={{ padding: '16px 8px', fontSize: 14, color: '#4b5563' }}>{transaction.transaction}</td>
                              <td style={{ padding: '16px 8px', fontSize: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: transaction.type === 'income' ? '#10b981' : '#ef4444' }} />
                                  <span style={{ color: '#4b5563' }}>{transaction.category}</span>
                                </div>
                              </td>
                              <td style={{ padding: '16px 8px', fontSize: 14, color: '#9ca3af' }}>{transaction.date}</td>
                              <td style={{ padding: '16px 8px', fontSize: 14, textAlign: 'right', fontWeight: 600, color: transaction.type === 'income' ? '#059669' : '#dc2626' }}>
                                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                              </td>
                              <td style={{ padding: '16px 8px' }}>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                  <button style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}>⋯</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal (Add Income / Add Expense) */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.35)'
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              background: 'white',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 20px 50px rgba(2,6,23,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{modalType === 'income' ? 'Add Income' : 'Add Expense'}</h3>
              <button onClick={closeModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: 13, color: '#374151' }}>
                Account
                <input
                  name="account"
                  value={form.account}
                  onChange={handleFormChange}
                  placeholder="e.g. US Bank"
                  style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </label>

              <label style={{ fontSize: 13, color: '#374151' }}>
                Transaction name
                <input
                  name="transaction"
                  value={form.transaction}
                  onChange={handleFormChange}
                  placeholder="e.g. Grocery shopping"
                  style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </label>

              <label style={{ fontSize: 13, color: '#374151' }}>
                Category
                <input
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  placeholder="e.g. Groceries / Salary"
                  style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ flex: 1, fontSize: 13, color: '#374151' }}>
                  Amount
                  <input
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    placeholder="e.g. 150.00"
                    style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </label>

                <label style={{ width: 140, fontSize: 13, color: '#374151' }}>
                  Date
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <button type="button" onClick={closeModal} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'transparent', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: modalType === 'income' ? '#10b981' : '#ef4444', color: 'white', cursor: 'pointer' }}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}