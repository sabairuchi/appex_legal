import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../../services/adminApi';
import '../../styles/admin.css';

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAnalytics({
        period,
        startDate: period === 'custom' ? customStart : '',
        endDate: period === 'custom' ? customEnd : '',
      });
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics load error:', err);
      setError(err.message || 'Error loading analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCustomRange = (e) => {
    e.preventDefault();
    if (period === 'custom') {
      loadAnalytics();
    }
  };

  const calculatePercentage = (val, total) => {
    if (!total || total === 0) return 0;
    return Math.round((val / total) * 100);
  };

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Data & Performance Analytics</h1>
          <p style={{ color: '#64748B', margin: 0 }}>
            Real queried platform metrics, appointment conversion distributions, and growth activity over time
          </p>
        </div>
      </div>

      {/* Date Range Selector Toolbar */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>Timeframe Filter:</span>
            <button
              className={`admin-btn admin-btn-sm ${period === '7d' ? 'admin-btn-navy' : 'admin-btn-outline'}`}
              style={{ backgroundColor: period === '7d' ? '#0B132B' : 'transparent', color: period === '7d' ? '#FFF' : '#0F172A' }}
              onClick={() => setPeriod('7d')}
            >
              Last 7 Days
            </button>
            <button
              className={`admin-btn admin-btn-sm ${period === '30d' ? 'admin-btn-navy' : 'admin-btn-outline'}`}
              style={{ backgroundColor: period === '30d' ? '#0B132B' : 'transparent', color: period === '30d' ? '#FFF' : '#0F172A' }}
              onClick={() => setPeriod('30d')}
            >
              Last 30 Days
            </button>
            <button
              className={`admin-btn admin-btn-sm ${period === '90d' ? 'admin-btn-navy' : 'admin-btn-outline'}`}
              style={{ backgroundColor: period === '90d' ? '#0B132B' : 'transparent', color: period === '90d' ? '#FFF' : '#0F172A' }}
              onClick={() => setPeriod('90d')}
            >
              Last 90 Days
            </button>
            <button
              className={`admin-btn admin-btn-sm ${period === 'custom' ? 'admin-btn-navy' : 'admin-btn-outline'}`}
              style={{ backgroundColor: period === 'custom' ? '#0B132B' : 'transparent', color: period === 'custom' ? '#FFF' : '#0F172A' }}
              onClick={() => setPeriod('custom')}
            >
              Custom Range
            </button>
          </div>

          {period === 'custom' && (
            <form onSubmit={handleApplyCustomRange} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="date"
                className="admin-search-input"
                style={{ width: '150px' }}
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <span style={{ color: '#64748B' }}>to</span>
              <input
                type="date"
                className="admin-search-input"
                style={{ width: '150px' }}
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
              <button type="submit" className="admin-btn admin-btn-gold admin-btn-sm">
                Apply
              </button>
            </form>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="admin-loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: '#64748B' }}>Querying database analytics...</p>
        </div>
      ) : error ? (
        <div className="admin-card" style={{ borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }}>
          <p style={{ color: '#991B1B', margin: 0 }}>{error}</p>
        </div>
      ) : (
        <div>
          {/* Summary Metric Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon clients">👥</div>
              <div>
                <div className="admin-stat-val">{analytics?.totalClients ?? 0}</div>
                <div className="admin-stat-label">Total Clients</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon lawyers">⚖️</div>
              <div>
                <div className="admin-stat-val">{analytics?.totalLawyers ?? 0}</div>
                <div className="admin-stat-label">Total Attorneys</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon appointments">📅</div>
              <div>
                <div className="admin-stat-val">{analytics?.totalAppointments ?? 0}</div>
                <div className="admin-stat-label">Total Consultations</div>
              </div>
            </div>
          </div>

          {/* Status Breakdown & Distribution */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Consultation Status Breakdown</h3>
            </div>

            {analytics?.totalAppointments === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">📊</div>
                <div className="admin-empty-title">No consultation data available for this timeframe</div>
                <p>Status distribution will populate as appointments are scheduled.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', borderRadius: '10px', color: '#92400E' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>PENDING</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>
                      {analytics?.statusBreakdown?.pending ?? 0}
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {calculatePercentage(analytics?.statusBreakdown?.pending, analytics?.totalAppointments)}% of total
                    </div>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#D1FAE5', borderRadius: '10px', color: '#065F46' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>CONFIRMED</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>
                      {analytics?.statusBreakdown?.confirmed ?? 0}
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {calculatePercentage(analytics?.statusBreakdown?.confirmed, analytics?.totalAppointments)}% of total
                    </div>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#E0E7FF', borderRadius: '10px', color: '#3730A3' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>RESCHEDULED</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>
                      {analytics?.statusBreakdown?.rescheduled ?? 0}
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {calculatePercentage(analytics?.statusBreakdown?.rescheduled, analytics?.totalAppointments)}% of total
                    </div>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#DCFCE7', borderRadius: '10px', color: '#166534' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>COMPLETED</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>
                      {analytics?.statusBreakdown?.completed ?? 0}
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {calculatePercentage(analytics?.statusBreakdown?.completed, analytics?.totalAppointments)}% of total
                    </div>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#FEE2E2', borderRadius: '10px', color: '#991B1B' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>CANCELLED</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>
                      {analytics?.statusBreakdown?.cancelled ?? 0}
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {calculatePercentage(analytics?.statusBreakdown?.cancelled, analytics?.totalAppointments)}% of total
                    </div>
                  </div>
                </div>

                {/* Status Bar Visualization */}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginBottom: '0.5rem' }}>
                    Proportional Status Distribution Bar
                  </div>
                  <div
                    style={{
                      height: '24px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      backgroundColor: '#E2E8F0',
                    }}
                  >
                    <div
                      style={{
                        width: `${calculatePercentage(analytics?.statusBreakdown?.confirmed, analytics?.totalAppointments)}%`,
                        backgroundColor: '#059669',
                      }}
                      title="Confirmed"
                    />
                    <div
                      style={{
                        width: `${calculatePercentage(analytics?.statusBreakdown?.pending, analytics?.totalAppointments)}%`,
                        backgroundColor: '#D97706',
                      }}
                      title="Pending"
                    />
                    <div
                      style={{
                        width: `${calculatePercentage(analytics?.statusBreakdown?.rescheduled, analytics?.totalAppointments)}%`,
                        backgroundColor: '#4F46E5',
                      }}
                      title="Rescheduled"
                    />
                    <div
                      style={{
                        width: `${calculatePercentage(analytics?.statusBreakdown?.completed, analytics?.totalAppointments)}%`,
                        backgroundColor: '#16A34A',
                      }}
                      title="Completed"
                    />
                    <div
                      style={{
                        width: `${calculatePercentage(analytics?.statusBreakdown?.cancelled, analytics?.totalAppointments)}%`,
                        backgroundColor: '#DC2626',
                      }}
                      title="Cancelled"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Over Time Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Appointment Activity Over Time</h3>
              </div>

              {!analytics?.appointmentTrends || analytics.appointmentTrends.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">📈</div>
                  <div className="admin-empty-title">No timeline activity</div>
                  <p>Consultations booked during this range will chart here.</p>
                </div>
              ) : (
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '180px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                    {analytics.appointmentTrends.map((item, idx) => {
                      const maxCount = Math.max(...analytics.appointmentTrends.map((t) => t.count), 1);
                      const heightPct = Math.round((item.count / maxCount) * 100);
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', marginBottom: '0.25rem' }}>{item.count}</div>
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '36px',
                              height: `${heightPct}%`,
                              backgroundColor: '#0B132B',
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.3s ease',
                            }}
                          />
                          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.5rem', transform: 'rotate(-45deg)', transformOrigin: 'top left' }}>
                            {item.date}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">User Registration Activity</h3>
              </div>

              {!analytics?.userRegistrationTrends || analytics.userRegistrationTrends.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">👥</div>
                  <div className="admin-empty-title">No new registrations</div>
                  <p>User account creations during this period will chart here.</p>
                </div>
              ) : (
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '180px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                    {analytics.userRegistrationTrends.map((item, idx) => {
                      const maxCount = Math.max(...analytics.userRegistrationTrends.map((t) => t.count), 1);
                      const heightPct = Math.round((item.count / maxCount) * 100);
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.25rem' }}>{item.count}</div>
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '36px',
                              height: `${heightPct}%`,
                              backgroundColor: '#D4AF37',
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.3s ease',
                            }}
                          />
                          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.5rem', transform: 'rotate(-45deg)', transformOrigin: 'top left' }}>
                            {item.date}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
