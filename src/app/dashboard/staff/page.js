'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { useStaff } from '@/hooks/useRealtimeData';
import { mockStaff } from '@/lib/mockData';

export default function StaffPage() {
  const { staff: realStaff, loading } = useStaff();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const displayStaff = realStaff.length > 0 ? realStaff : mockStaff;

  const filtered = displayStaff.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (s.department || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const available = displayStaff.filter(s => s.status === 'available').length;
  const responding = displayStaff.filter(s => s.status === 'responding').length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Staff Management</h1>
          <p className={styles.pageSubtitle}>{displayStaff.length} total staff • {responding} responding • {available} available</p>
        </div>
        <button className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add Staff
        </button>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.quickStat}>
          <div className={styles.qsValue} style={{color: 'var(--accent-blue)'}}>{displayStaff.length}</div>
          <div className={styles.qsLabel}>Total Staff</div>
        </div>
        <div className={styles.quickStat}>
          <div className={styles.qsValue} style={{color: 'var(--crisis-high)'}}>{responding}</div>
          <div className={styles.qsLabel}>Responding</div>
        </div>
        <div className={styles.quickStat}>
          <div className={styles.qsValue} style={{color: 'var(--crisis-low)'}}>{available}</div>
          <div className={styles.qsLabel}>Available</div>
        </div>
        <div className={styles.quickStat}>
          <div className={styles.qsValue} style={{color: 'var(--text-muted)'}}>0</div>
          <div className={styles.qsLabel}>Off Duty</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search staff by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterBtns}>
          {[
            { key: 'all', label: 'All' },
            { key: 'available', label: 'Available' },
            { key: 'responding', label: 'Responding' },
          ].map(f => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className={styles.staffGrid}>
        {filtered.map((staff) => (
          <div key={staff.id} className={styles.staffCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardAvatar}>{staff.avatar}</div>
              <span className={`badge ${staff.status === 'responding' ? 'badge-high' : staff.status === 'available' ? 'badge-low' : 'badge-info'}`}>
                {staff.status}
              </span>
            </div>
            <div className={styles.cardName}>{staff.name}</div>
            <div className={styles.cardId}>{staff.id}</div>
            <div className={styles.cardDetails}>
              <div className={styles.detailRow}>
                <span>Department</span>
                <span>{staff.department}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Location</span>
                <span>Floor {staff.floor}, {staff.zone}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Role</span>
                <span>{staff.role.replace('_', ' ')}</span>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className="btn btn-ghost btn-sm" style={{flex: 1}}>Message</button>
              <button className="btn btn-primary btn-sm" style={{flex: 1}}>Assign</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
