// FinanceDashboardFixed.jsx
import React, { useState } from 'react';
import { TrendingUp, User, LogOut, HelpCircle, Download } from 'lucide-react';

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const lineChartData = [
    { month: 'Jan', value: 24520.54 },
    { month: 'Feb', value: 23800.32 },
    { month: 'Mar', value: 25100.75 },
    { month: 'Apr', value: 24300.45 },
    { month: 'May', value: 26500.80 },
    { month: 'Jun', value: 24520.54 }
  ];

  const budgetData = {
    total: 5500,
    categories: [
      { name: 'Savings', amount: 1500, color: '#10B981' },
      { name: 'Expenses', amount: 3952, color: '#6366F1' },
      { name: 'Left in budget', amount: 548, color: '#F59E0B' }
    ]
  };

  const transactions = [
    { id: 1, account: 'US Bank (****)', transaction: 'Walmart', category: 'Groceries', date: '05/20/2023', amount: -78.20, type: 'expense' },
    { id: 2, account: 'Wells', transaction: 'Fiverr International', category: 'Other Income', date: '05/19/2023', amount: 502, type: 'income' },
    { id: 3, account: 'Chase', transaction: 'Amazon Purchase', category: 'Shopping', date: '05/18/2023', amount: -156.45, type: 'expense' },
    { id: 4, account: 'US Bank', transaction: 'Salary Deposit', category: 'Income', date: '05/15/2023', amount: 2500, type: 'income' }
  ];

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
    const total = budgetData.total;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercentage = 0;

    return budgetData.categories.map((category) => {
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
    background: 'linear-gradient(135deg, #f1f5f9 0%, #dbeafe 50%, #e0e7ff 100%)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(229, 231, 235, 0.5)',
    transition: 'all 0.3s ease'
  };
  const statuscontainer={

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
              >
                ADD EXPENSE
              </button>
            </div>
          </div>
        </div>

        <div style={contentStyle}>
          {/* Balance Cards (individual instead of duplicates) */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  marginBottom: '32px'
}}>
  {/* Example: Balance Card 1 */}
  <div style={{ ...cardCommon }}>
    <p style={{color:'gray'}}>Current Balance</p>
    <p style={{backgroundColor:'#b8e7ed',display:'inline',padding:'15px',borderRadius:'10px'}}>💰</p>
    <h2 style={{fontWeight:'bold', fontSize:'40px'}}>$12,500</h2>
  </div>

  {/* Example: Balance Card 2 */}
  <div style={{ ...cardCommon }}>
    <p style={{color:'gray'}}>Income</p>
    <p style={{backgroundColor:'#b8e7ed',display:'inline',padding:'15px',borderRadius:'10px'}}>📈</p>
    <h2 style={{fontWeight:'bold' , fontSize:'40px'}}>$1,500</h2>
  </div>

  {/* Example: Balance Card 3 */}
  <div style={{ ...cardCommon }}>
    <p style={{color:'gray'}}>Expense</p>
    <p style={{backgroundColor:'#b8e7ed',display:'inline',padding:'15px',borderRadius:'10px'}}>📉</p>
    <h2 style={{fontWeight:'bold', fontSize:'40px'}}>$3,200</h2>
  </div>
</div>


          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Account Overview */}
            <div style={cardCommon}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>ACCOUNT OVERVIEW</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Last 6 months</p>
                </div>
                <button style={{ color: '#4f46e5', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}>See more</button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>$24,520.54</div>
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

                  <path d={`${generatePath(lineChartData)} L 280,120 L 0,120 Z`} fill="url(#areaGradient)" />
                  <path d={generatePath(lineChartData)} fill="none" stroke="url(#lineGradient)" strokeWidth="3" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />

                  {lineChartData.map((point, index) => {
                    const maxValue = Math.max(...lineChartData.map(d => d.value));
                    const minValue = Math.min(...lineChartData.map(d => d.value));
                    const range = maxValue - minValue || 1;
                    const x = (index / (lineChartData.length - 1)) * 280;
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
                {lineChartData.map((point) => <span key={point.month}>{point.month}</span>)}
              </div>
            </div>

            {/* Monthly Budget - Donut Chart */}
            <div style={cardCommon}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>MONTHLY BUDGET</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Jun 30, 2023</p>
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
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>$5,500</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Total</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {budgetData.categories.map((category, index) => (
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

            {/* Additional Budget Card */}
            <div style={cardCommon}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Current Balance</h3>
                <div style={{ fontSize: '32px' }}>💰</div>
              </div>

              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>$12,500</div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: '600', marginBottom: '24px' }}>
                <TrendingUp style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                +2.5%
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'linear-gradient(90deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Savings</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>$1,500</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Investments</span>
                  <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>$3,200</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Emergency Fund</span>
                  <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>$548</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={cardCommon}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>RECENT TRANSACTIONS</h3>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ color: '#4f46e5', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}>
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
                    <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 13, color: '#475569' }}>ACCOUNT</th>
                    <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 13, color: '#475569' }}>TRANSACTION</th>
                    <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 13, color: '#475569' }}>CATEGORY</th>
                    <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 13, color: '#475569' }}>DATE</th>
                    <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: 13, color: '#475569' }}>AMOUNT</th>
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
                      <td style={{ padding: '12px 4px', fontSize: 14 }}>{transaction.account}</td>
                      <td style={{ padding: '12px 4px', fontSize: 14 }}>{transaction.transaction}</td>
                      <td style={{ padding: '12px 4px', fontSize: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: transaction.type === 'income' ? '#10b981' : '#7c3aed' }} />
                          <span style={{ color: '#6b7280' }}>{transaction.category}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 4px', fontSize: 14, color: '#6b7280' }}>{transaction.date}</td>
                      <td style={{ padding: '12px 4px', fontSize: 14, textAlign: 'right', fontWeight: 600, color: transaction.type === 'income' ? '#10b981' : '#111827' }}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount)}
                      </td>
                      <td style={{ padding: '12px 4px' }}>
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
        </div>
      </div>
    </div>
  );
}
