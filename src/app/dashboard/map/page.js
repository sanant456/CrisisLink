'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { mockIncidents, mockStaff } from '@/lib/mockData';

const floors = [
  { id: 12, label: 'Floor 12', zones: ['Penthouse Suite', 'Rooftop Bar'] },
  { id: 11, label: 'Floor 11', zones: ['Premium Suites'] },
  { id: 10, label: 'Floor 10', zones: ['Executive Rooms'] },
  { id: 9, label: 'Floor 9', zones: ['Standard Rooms'] },
  { id: 8, label: 'Floor 8', zones: ['Standard Rooms'] },
  { id: 7, label: 'Floor 7', zones: ['Standard Rooms'] },
  { id: 6, label: 'Floor 6', zones: ['West Wing', 'East Wing'], hasIncident: true, incidentType: 'low' },
  { id: 5, label: 'Floor 5', zones: ['Standard Rooms'] },
  { id: 4, label: 'Floor 4', zones: ['East Wing', 'West Wing'], hasIncident: true, incidentType: 'high' },
  { id: 3, label: 'Floor 3', zones: ['Conference Rooms'] },
  { id: 2, label: 'Floor 2', zones: ['Restaurant', 'Medical Office'] },
  { id: 1, label: 'Floor 1', zones: ['Lobby', 'Kitchen Wing', 'Pool Area'], hasIncident: true, incidentType: 'critical' },
  { id: -1, label: 'Level B1', zones: ['Storage', 'Staff Area'] },
  { id: -2, label: 'Level B2', zones: ['Parking Section A', 'Section B'], hasIncident: true, incidentType: 'medium' },
];

export default function MapPage() {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const currentFloor = floors.find(f => f.id === selectedFloor);

  const floorIncidents = mockIncidents.filter(i => i.location.floor === selectedFloor);
  const floorStaff = mockStaff.filter(s => s.floor === selectedFloor);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Venue Map</h1>
        <p className={styles.pageSubtitle}>Grand Horizon Resort & Spa — Interactive Floor Plan</p>
      </div>

      <div className={styles.mapLayout}>
        {/* Building Schematic */}
        <div className={styles.buildingView}>
          <div className={styles.buildingHeader}>
            <h2 className={styles.buildingTitle}>Main Hotel Building</h2>
            <div className={styles.legend}>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background: 'var(--crisis-critical)'}} /> Critical</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background: 'var(--crisis-high)'}} /> High</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background: 'var(--crisis-medium)'}} /> Medium</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background: 'var(--crisis-low)'}} /> Low</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background: 'var(--accent-blue)'}} /> Staff</span>
            </div>
          </div>

          <div className={styles.building}>
            {floors.map((floor) => (
              <button
                key={floor.id}
                className={`${styles.floorRow} ${selectedFloor === floor.id ? styles.floorSelected : ''} ${floor.hasIncident ? styles[`floor_${floor.incidentType}`] : ''}`}
                onClick={() => setSelectedFloor(floor.id)}
              >
                <div className={styles.floorLabel}>{floor.label}</div>
                <div className={styles.floorBar}>
                  <div className={styles.floorZones}>
                    {floor.zones.map((zone, i) => (
                      <div key={i} className={styles.zoneBlock}>
                        {zone}
                      </div>
                    ))}
                  </div>
                  {floor.hasIncident && (
                    <div className={`${styles.floorAlert} ${styles[`alert_${floor.incidentType}`]}`}>
                      ⚠️
                    </div>
                  )}
                </div>
                <div className={styles.floorMeta}>
                  {mockStaff.filter(s => s.floor === floor.id).length > 0 && (
                    <span className={styles.staffBadge}>
                      👤 {mockStaff.filter(s => s.floor === floor.id).length}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Floor Detail Panel */}
        <div className={styles.floorDetail}>
          <div className={styles.detailHeader}>
            <h2 className={styles.detailTitle}>{currentFloor?.label}</h2>
            <div className={styles.detailZones}>
              {currentFloor?.zones.map((z, i) => (
                <span key={i} className={styles.zoneBadge}>{z}</span>
              ))}
            </div>
          </div>

          {/* Floor Map Visualization */}
          <div className={styles.floorMap}>
            <div className={styles.mapGrid}>
              {currentFloor?.zones.map((zone, i) => (
                <div key={i} className={styles.mapZone}>
                  <div className={styles.mapZoneLabel}>{zone}</div>
                  {floorIncidents.filter(inc => inc.location.zone === zone).map((inc) => (
                    <div key={inc.id} className={`${styles.mapIncident} ${styles[`map_${inc.severity}`]}`}>
                      <span className={styles.mapIncidentPulse} />
                      <span>🚨 {inc.type.toUpperCase()}</span>
                    </div>
                  ))}
                  {floorStaff.filter(s => s.zone === zone).map((s) => (
                    <div key={s.id} className={styles.mapStaff}>
                      <span>{s.avatar}</span>
                      <span>{s.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Active on this floor */}
          {floorIncidents.length > 0 && (
            <div className={styles.floorIncidents}>
              <h3>Active Incidents on {currentFloor?.label}</h3>
              {floorIncidents.map((inc) => (
                <div key={inc.id} className={styles.floorIncidentCard}>
                  <div className={styles.incSeverity} style={{background: `var(--crisis-${inc.severity})`}} />
                  <div className={styles.incInfo}>
                    <div className={styles.incTitle}>{inc.title}</div>
                    <div className={styles.incMeta}>{inc.location.zone} • {inc.status} • {inc.assignedStaff.length} staff</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {floorStaff.length > 0 && (
            <div className={styles.floorStaff}>
              <h3>Staff on {currentFloor?.label}</h3>
              <div className={styles.staffGrid}>
                {floorStaff.map((s) => (
                  <div key={s.id} className={styles.staffCard}>
                    <span className={styles.staffEmoji}>{s.avatar}</span>
                    <div className={styles.staffName}>{s.name}</div>
                    <div className={styles.staffRole}>{s.department}</div>
                    <span className={`badge ${s.status === 'responding' ? 'badge-high' : 'badge-low'}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evacuation Routes */}
          <div className={styles.evacSection}>
            <h3>🚪 Assembly Points</h3>
            <div className={styles.evacList}>
              <div className={styles.evacItem}>
                <span className={styles.evacIcon}>🅰️</span>
                <div>
                  <div className={styles.evacName}>Main Entrance Plaza</div>
                  <div className={styles.evacDist}>~120m from lobby</div>
                </div>
              </div>
              <div className={styles.evacItem}>
                <span className={styles.evacIcon}>🅱️</span>
                <div>
                  <div className={styles.evacName}>Pool Deck</div>
                  <div className={styles.evacDist}>~80m from east wing</div>
                </div>
              </div>
              <div className={styles.evacItem}>
                <span className={styles.evacIcon}>🅲</span>
                <div>
                  <div className={styles.evacName}>Parking Lot C</div>
                  <div className={styles.evacDist}>~200m from building</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
