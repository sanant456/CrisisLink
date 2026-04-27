'use client';
import styles from './page.module.css';

const responseData = [
  { hour: '08:00', incidents: 1, avgResponse: 95 },
  { hour: '09:00', incidents: 0, avgResponse: 0 },
  { hour: '10:00', incidents: 2, avgResponse: 78 },
  { hour: '11:00', incidents: 1, avgResponse: 62 },
  { hour: '12:00', incidents: 3, avgResponse: 105 },
  { hour: '13:00', incidents: 2, avgResponse: 88 },
  { hour: '14:00', incidents: 4, avgResponse: 102 },
];

const incidentsByType = [
  { type: 'Medical', count: 12, percentage: 38, color: '#f97316' },
  { type: 'Fire', count: 8, percentage: 25, color: '#ef4444' },
  { type: 'Security', count: 7, percentage: 22, color: '#eab308' },
  { type: 'Other', count: 5, percentage: 15, color: '#3b82f6' },
];

const performanceMetrics = [
  { label: 'Avg Detection Time', value: '12s', trend: '-3s', positive: true },
  { label: 'Avg Response Time', value: '1m 42s', trend: '-18s', positive: true },
  { label: 'Avg Resolution Time', value: '14m 30s', trend: '-2m', positive: true },
  { label: 'First Contact Rate', value: '94%', trend: '+3%', positive: true },
  { label: 'Escalation Rate', value: '12%', trend: '-5%', positive: true },
  { label: 'False Alarm Rate', value: '4%', trend: '+1%', positive: false },
];

const recentResolved = [
  { id: 'INC-098', title: 'Power Outage — Floor 8', type: 'other', resolvedIn: '8m 15s', time: '12:45 PM' },
  { id: 'INC-097', title: 'Guest Slip & Fall — Pool', type: 'medical', resolvedIn: '12m 30s', time: '11:20 AM' },
  { id: 'INC-096', title: 'Fire Alarm — False Trigger', type: 'fire', resolvedIn: '4m 05s', time: '10:15 AM' },
];

export default function AnalyticsPage() {
  const maxIncidents = Math.max(...responseData.map(d => d.incidents));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Analytics & Reports</h1>
          <p className={styles.pageSubtitle}>Performance metrics and incident analytics — Today</p>
        </div>
        <div className={styles.dateRange}>
          <button className={`${styles.dateBtn} ${styles.dateBtnActive}`}>Today</button>
          <button className={styles.dateBtn}>Week</button>
          <button className={styles.dateBtn}>Month</button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={styles.metricsGrid}>
        {performanceMetrics.map((metric, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValue}>{metric.value}</div>
            <div className={`${styles.metricTrend} ${metric.positive ? styles.trendPos : styles.trendNeg}`}>
              {metric.positive ? '↓' : '↑'} {metric.trend}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        {/* Incidents by Hour */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Incidents by Hour</h3>
          <div className={styles.barChart}>
            {responseData.map((d, i) => (
              <div key={i} className={styles.barGroup}>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${maxIncidents > 0 ? (d.incidents / maxIncidents) * 100 : 0}%`,
                      background: d.incidents >= 3 ? 'var(--crisis-critical)' : d.incidents >= 2 ? 'var(--crisis-high)' : 'var(--accent-blue)',
                    }}
                  >
                    {d.incidents > 0 && <span className={styles.barValue}>{d.incidents}</span>}
                  </div>
                </div>
                <div className={styles.barLabel}>{d.hour}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents by Type */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Incidents by Type</h3>
          <div className={styles.typeChart}>
            {incidentsByType.map((type, i) => (
              <div key={i} className={styles.typeRow}>
                <div className={styles.typeInfo}>
                  <div className={styles.typeDot} style={{background: type.color}} />
                  <span className={styles.typeName}>{type.type}</span>
                  <span className={styles.typeCount}>{type.count}</span>
                </div>
                <div className={styles.typeBarWrap}>
                  <div className={styles.typeBar} style={{width: `${type.percentage}%`, background: type.color}} />
                </div>
                <span className={styles.typePerc}>{type.percentage}%</span>
              </div>
            ))}
          </div>

          <div className={styles.totalIncidents}>
            <span>Total Incidents Today</span>
            <strong>32</strong>
          </div>
        </div>
      </div>

      {/* Resolved Incidents */}
      <div className={styles.resolvedSection}>
        <h3 className={styles.chartTitle}>Recently Resolved</h3>
        <div className={styles.resolvedTable}>
          <div className={styles.tableHeader}>
            <span>Incident</span>
            <span>Title</span>
            <span>Resolved In</span>
            <span>Time</span>
          </div>
          {recentResolved.map((item, i) => (
            <div key={i} className={styles.tableRow}>
              <span className={styles.tableId}>{item.id}</span>
              <span className={styles.tableTitle}>{item.title}</span>
              <span className={styles.tableResolved}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--crisis-low)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item.resolvedIn}
              </span>
              <span className={styles.tableTime}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
