'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { mockStats, getTypeIcon, getSeverityColor } from '@/lib/mockData';
import { useIncidents, useStaff, useActivityLog } from '@/hooks/useRealtimeData';

export default function DashboardOverview() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const { incidents, loading: incLoading } = useIncidents();
  const { staff, loading: staffLoading } = useStaff();
  const { activities } = useActivityLog();

  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const respondingStaff = staff.filter(s => s.status === 'responding').length;
  
  // Real-time stats calculations
  const stats = {
    activeIncidents: activeIncidents.length,
    respondingStaff: respondingStaff,
    totalStaff: staff.length,
    guestsOnSite: 342, // Placeholder or fetch from venue
    avgResponseTime: '4m 12s' // Placeholder or calculate
  };

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Command Center</h1>
          <p className={styles.pageSubtitle}>Grand Horizon Resort & Spa — Real-time Overview</p>
        </div>
        <div className={styles.clock}>{time}</div>
      </div>

      {/* Stats cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCritical}`}>
          <div className={styles.statIcon}>🚨</div>
          <div className={styles.statValue}>{stats.activeIncidents}</div>
          <div className={styles.statLabel}>Active Incidents</div>
          <div className={styles.statTrend}>
            Live Monitoring
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statWarning}`}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statValue}>{stats.respondingStaff}</div>
          <div className={styles.statLabel}>Staff Responding</div>
          <div className={styles.statTrend}>of {stats.totalStaff} total</div>
        </div>

        <div className={`${styles.statCard} ${styles.statSuccess}`}>
          <div className={styles.statIcon}>⚡</div>
          <div className={styles.statValue}>{stats.avgResponseTime}</div>
          <div className={styles.statLabel}>Avg Response Time</div>
          <div className={styles.statTrend}>
            Optimized
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statInfo}`}>
          <div className={styles.statIcon}>🏨</div>
          <div className={styles.statValue}>{stats.guestsOnSite}</div>
          <div className={styles.statLabel}>Guests On-Site</div>
          <div className={styles.statTrend}>Live Occupancy</div>
        </div>
      </div>

      {/* Main content grid */}
      <div className={styles.mainGrid}>
        {/* Active Incidents Panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              <span className={styles.panelDot} style={{background: 'var(--crisis-critical)'}} />
              Active Incidents
            </h2>
            <Link href="/dashboard/incidents" className={styles.panelLink}>View All →</Link>
          </div>

          <div className={styles.incidentList}>
            {activeIncidents.map((incident) => (
              <div key={incident.id} className={styles.incidentCard}>
                <div className={styles.incidentSeverity} style={{background: getSeverityColor(incident.severity)}} />
                <div className={styles.incidentContent}>
                  <div className={styles.incidentTop}>
                    <span className={styles.incidentType}>{getTypeIcon(incident.type)}</span>
                    <span className={styles.incidentTitle}>{incident.title}</span>
                  </div>
                  <div className={styles.incidentMeta}>
                    <span>{incident.location.building} • Floor {incident.location.floor}</span>
                    <span className={`badge badge-${incident.severity}`}>{incident.severity.toUpperCase()}</span>
                  </div>
                  <div className={styles.incidentBottom}>
                    <span className={styles.incidentStatus}>
                      {incident.status === 'responding' && '🟢'}
                      {incident.status === 'acknowledged' && '🟡'}
                      {incident.status === 'reported' && '🔴'}
                      {' '}{incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                    <span className={styles.incidentStaff}>
                      {incident.assignedStaff.length} staff assigned
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightColumn}>
          {/* Staff Status */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>
                <span className={styles.panelDot} style={{background: 'var(--accent-blue)'}} />
                Staff Status
              </h2>
              <Link href="/dashboard/staff" className={styles.panelLink}>Manage →</Link>
            </div>

            <div className={styles.staffList}>
              {staffLoading ? (
                <div style={{color: 'var(--text-muted)', padding: 'var(--space-4)'}}>Loading staff...</div>
              ) : (
                staff.slice(0, 5).map((member) => (
                  <div key={member.id || member.uid} className={styles.staffRow}>
                    <div className={styles.staffAvatar}>{member.avatar || 'S'}</div>
                    <div className={styles.staffInfo}>
                      <div className={styles.staffName}>{member.name}</div>
                      <div className={styles.staffDept}>{member.department} {member.zone && `• ${member.zone}`}</div>
                    </div>
                    <span className={`badge ${member.status === 'responding' ? 'badge-high' : member.status === 'available' ? 'badge-low' : 'badge-info'}`}>
                      {member.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className={`${styles.panel} ${styles.aiPanel}`}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>
                <span className={styles.panelDot} style={{background: 'var(--accent-purple)'}} />
                Gemini AI Insights
              </h2>
            </div>

            <div className={styles.aiInsights}>
              {incidents.filter(i => i.aiAnalysis).slice(0, 3).map((inc, idx) => (
                <div key={inc.id || idx} className={styles.aiCard}>
                  <div className={styles.aiCardIcon}>{inc.severity === 'critical' ? '🔴' : '⚠️'}</div>
                  <div className={styles.aiCardContent}>
                    <div className={styles.aiCardTitle}>
                      AI Insight: {inc.title}
                      {inc.aiAnalysis.priority_score && (
                        <span className={styles.priorityBadge}>P{inc.aiAnalysis.priority_score}</span>
                      )}
                    </div>
                    <div className={styles.aiCardDesc}>
                      {inc.aiAnalysis.recommended_action || inc.aiAnalysis.summary}
                    </div>
                    {inc.aiAnalysis.vision_analysis && (
                      <div className={styles.visionTags}>
                        {inc.aiAnalysis.vision_analysis.detected_objects?.map((obj, i) => (
                          <span key={i} className={styles.visionTag}>👁️ {obj}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {incidents.filter(i => i.aiAnalysis).length === 0 && (
                <div className={styles.aiEmpty}>No recent AI insights available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className={styles.panel} style={{marginTop: 'var(--space-6)'}}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>
            <span className={styles.panelDot} style={{background: 'var(--accent-cyan)'}} />
            Live Activity Feed
          </h2>
        </div>
        <div className={styles.timeline}>
          {activities.length > 0 ? activities.map((event, i) => {
            const date = new Date(event.time || event.timestamp);
            const timeStr = date.toLocaleTimeString('en-US', { hour12: false });
            return (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineTime}>{timeStr}</div>
                <div className={`${styles.timelineDot} ${styles[`dot_${event.type}`]}`} />
                <div className={styles.timelineText}>{event.text || event.event}</div>
              </div>
            );
          }) : (
            <div style={{color: 'var(--text-muted)', padding: 'var(--space-4)'}}>No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}
