'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useIncidents } from '@/hooks/useRealtimeData';
import { assignStaffToIncident, updateIncidentStatus, updateStaffStatus } from '@/lib/firestoreService';
import { getTypeIcon, getSeverityColor, getStatusLabel } from '@/lib/mockData';

export default function StaffPortal() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { incidents, loading: incLoading } = useIncidents();
  const [tab, setTab] = useState('alerts');
  const [expandedId, setExpandedId] = useState(null);

  const staffId = user?.uid || 'STF-003';
  const myTasks = incidents.filter(i => i.assignedStaff?.includes(staffId));
  const allAlerts = incidents.filter(i => i.status !== 'resolved');

  if (authLoading || incLoading) {
    return <div className={styles.loading}>Loading Staff Portal...</div>;
  }

  return (
    <div className={styles.page}>
      {/* Staff Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/" className={styles.backBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className={styles.headerTitle}>Staff Portal</div>
          <div className={styles.headerAvatar}>🧑‍🚒</div>
        </div>
        <div className={styles.staffInfo}>
          <div className={styles.staffName}>{userProfile?.name || 'Staff Member'}</div>
          <div className={styles.staffRole}>{userProfile?.department || 'Emergency Response'} • {userProfile?.zone || 'All Zones'}</div>
          <div className={styles.staffStatus}>
            <span className={styles.statusDot} style={{background: userProfile?.status === 'responding' ? 'var(--crisis-high)' : 'var(--crisis-low)'}} />
            On Duty — {userProfile?.status || 'available'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'alerts' ? styles.tabActive : ''}`}
          onClick={() => setTab('alerts')}
        >
          🚨 Alerts
          <span className={styles.tabBadge}>{allAlerts.length}</span>
        </button>
        <button
          className={`${styles.tab} ${tab === 'tasks' ? styles.tabActive : ''}`}
          onClick={() => setTab('tasks')}
        >
          📋 My Tasks
          <span className={styles.tabBadge}>{myTasks.length}</span>
        </button>
        <button
          className={`${styles.tab} ${tab === 'checkin' ? styles.tabActive : ''}`}
          onClick={() => setTab('checkin')}
        >
          ✅ Check-In
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {tab === 'alerts' && (
          <div className={styles.alertList}>
            {allAlerts.map((incident) => (
              <div key={incident.id} className={styles.alertCard}>
                <div
                  className={styles.alertMain}
                  onClick={() => setExpandedId(expandedId === incident.id ? null : incident.id)}
                >
                  <div className={styles.alertSeverity} style={{background: getSeverityColor(incident.severity)}} />
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>
                      {getTypeIcon(incident.type)} {incident.title}
                    </div>
                    <div className={styles.alertMeta}>
                      <span className={`badge badge-${incident.severity}`}>{incident.severity}</span>
                      <span>{incident.location.building} • Floor {incident.location.floor}</span>
                    </div>
                    <div className={styles.alertStatus}>
                      {getStatusLabel(incident.status)} • {incident.assignedStaff.length} staff
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{transform: expandedId === incident.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {expandedId === incident.id && (
                  <div className={styles.alertExpanded}>
                    <p className={styles.alertDesc}>{incident.description}</p>

                    <div className={styles.aiBox}>
                      <div className={styles.aiBoxTitle}>🤖 AI Suggested Actions:</div>
                      <ul>
                        {incident.aiAnalysis.suggestedActions.slice(0, 3).map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.alertActions}>
                      <button 
                        className="btn btn-primary btn-sm" 
                        style={{flex: 1}}
                        onClick={() => assignStaffToIncident(incident.id, user.uid, userProfile.name)}
                      >
                        Accept & Respond
                      </button>
                      <button className="btn btn-ghost btn-sm">Escalate</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'tasks' && (
          <div className={styles.taskList}>
            {myTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>✅</span>
                <h3>No active tasks</h3>
                <p>You have no assigned tasks at the moment. Stay alert for incoming alerts.</p>
              </div>
            ) : (
              myTasks.map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <span className={`badge badge-${task.severity}`}>{task.severity}</span>
                    <span className={styles.taskId}>{task.id}</span>
                  </div>
                  <h3 className={styles.taskTitle}>{getTypeIcon(task.type)} {task.title}</h3>
                  <p className={styles.taskDesc}>{task.description}</p>
                  <div className={styles.taskLocation}>
                    📍 {task.location.building}, Floor {task.location.floor}, {task.location.zone}
                  </div>
                  <div className={styles.taskActions}>
                    <button 
                      className="btn btn-primary btn-sm" 
                      style={{flex: 1}}
                      onClick={() => {
                        updateIncidentStatus(task.id, 'resolved');
                        updateStaffStatus(user.uid, 'available');
                      }}
                    >
                      Mark Complete
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{flex: 1}}>Update Status</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'checkin' && (
          <div className={styles.checkinContent}>
            <div className={styles.checkinCard}>
              <h3>Zone Safety Check-In</h3>
              <p>Report the status of your assigned zones</p>

              <div className={styles.zoneList}>
                {['Kitchen Wing', 'Lobby', 'Dining Hall', 'Service Corridor'].map((zone, i) => (
                  <div key={i} className={styles.zoneItem}>
                    <span className={styles.zoneName}>{zone}</span>
                    <div className={styles.zoneActions}>
                      <button className={`${styles.zoneBtn} ${styles.zoneSafe}`}>✅ Safe</button>
                      <button className={`${styles.zoneBtn} ${styles.zoneHazard}`}>⚠️ Hazard</button>
                      <button className={`${styles.zoneBtn} ${styles.zoneEvac}`}>🚨 Evacuate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.checkinCard}>
              <h3>Quick Update</h3>
              <textarea
                className="input"
                placeholder="Send a quick status update to the command center..."
                rows={3}
              />
              <button className="btn btn-primary" style={{width: '100%', marginTop: 'var(--space-3)'}}>
                Send Update
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SOS Button (floating) */}
      <Link href="/report" className={styles.sosFloat}>
        <span>🚨</span>
        SOS
      </Link>
    </div>
  );
}
