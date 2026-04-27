'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { mockIncidents, getTypeIcon, getSeverityColor, getStatusLabel } from '@/lib/mockData';

export default function IncidentsPage() {
  const [filter, setFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(mockIncidents[0]);

  const filtered = filter === 'all' ? mockIncidents : mockIncidents.filter(i => i.severity === filter);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Incident Management</h1>
        <div className={styles.filters}>
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className={styles.filterCount}>
                  {mockIncidents.filter(i => i.severity === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.splitView}>
        {/* Incident List */}
        <div className={styles.listPanel}>
          {filtered.map((incident) => (
            <button
              key={incident.id}
              className={`${styles.listItem} ${selectedIncident?.id === incident.id ? styles.listItemActive : ''}`}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className={styles.listSeverity} style={{background: getSeverityColor(incident.severity)}} />
              <div className={styles.listContent}>
                <div className={styles.listTop}>
                  <span>{getTypeIcon(incident.type)} {incident.title}</span>
                </div>
                <div className={styles.listMeta}>
                  <span>{incident.id}</span>
                  <span className={`badge badge-${incident.severity}`}>{incident.severity}</span>
                </div>
                <div className={styles.listBottom}>
                  <span>{incident.location.building} • Floor {incident.location.floor}</span>
                  <span>{getStatusLabel(incident.status)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Incident Detail */}
        {selectedIncident && (
          <div className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <div>
                <div className={styles.detailId}>{selectedIncident.id}</div>
                <h2 className={styles.detailTitle}>
                  {getTypeIcon(selectedIncident.type)} {selectedIncident.title}
                </h2>
              </div>
              <span className={`badge badge-${selectedIncident.severity}`} style={{fontSize: '0.8rem', padding: '4px 12px'}}>
                {selectedIncident.severity.toUpperCase()}
              </span>
            </div>

            <p className={styles.detailDesc}>{selectedIncident.description}</p>

            {/* Info Grid */}
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Status</div>
                <div className={styles.infoValue}>{getStatusLabel(selectedIncident.status)}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Location</div>
                <div className={styles.infoValue}>{selectedIncident.location.building}, Floor {selectedIncident.location.floor}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Zone</div>
                <div className={styles.infoValue}>{selectedIncident.location.zone}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Reported By</div>
                <div className={styles.infoValue}>{selectedIncident.reportedBy.name}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Staff Assigned</div>
                <div className={styles.infoValue}>{selectedIncident.assignedStaff.length} personnel</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Contact</div>
                <div className={styles.infoValue}>{selectedIncident.reportedBy.phone}</div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className={styles.aiSection}>
              <h3 className={styles.sectionTitle}>🤖 Gemini AI Analysis</h3>
              <div className={styles.aiSummary}>
                <div className={styles.aiConfidence}>
                  Confidence: <strong>{Math.round(selectedIncident.aiAnalysis.confidence * 100)}%</strong>
                </div>
                <p className={styles.aiText}>{selectedIncident.aiAnalysis.summary}</p>
              </div>
              <div className={styles.aiActions}>
                <h4>Suggested Actions:</h4>
                <ul>
                  {selectedIncident.aiAnalysis.suggestedActions.map((action, i) => (
                    <li key={i}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2">
                        <polyline points="9 11 12 14 22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.timelineSection}>
              <h3 className={styles.sectionTitle}>📋 Incident Timeline</h3>
              <div className={styles.detailTimeline}>
                {selectedIncident.timeline.map((event, i) => (
                  <div key={i} className={styles.timelineRow}>
                    <div className={styles.timelineTime}>{event.time}</div>
                    <div className={styles.timelineConnector}>
                      <div className={styles.timelineDot} />
                      {i < selectedIncident.timeline.length - 1 && <div className={styles.timelineLine} />}
                    </div>
                    <div className={styles.timelineEvent}>{event.event}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionBar}>
              <button className="btn btn-primary">Assign Staff</button>
              <button className="btn btn-ghost">Broadcast Update</button>
              <button className="btn btn-ghost" style={{color: 'var(--crisis-low)'}}>Mark Resolved</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
