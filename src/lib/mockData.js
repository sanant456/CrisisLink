// Mock data for the entire application
export const mockIncidents = [
  {
    id: 'INC-001',
    type: 'fire',
    severity: 'critical',
    status: 'responding',
    title: 'Kitchen Fire — Building A',
    description: 'Grease fire reported in the main kitchen on Floor 1. Smoke detected by sensors. Staff attempting to contain with fire extinguisher.',
    reportedBy: { name: 'Maria Santos', room: 'Kitchen Staff', phone: '+1-555-0101' },
    location: { building: 'Main Hotel', floor: 1, zone: 'Kitchen Wing' },
    assignedStaff: ['STF-001', 'STF-003', 'STF-005'],
    timeline: [
      { time: '14:23:10', event: 'Incident reported by kitchen staff', type: 'report' },
      { time: '14:23:15', event: 'AI classified severity as CRITICAL', type: 'ai' },
      { time: '14:23:18', event: 'Auto-alert sent to Fire Safety team', type: 'alert' },
      { time: '14:23:45', event: 'Security team acknowledged', type: 'ack' },
      { time: '14:24:30', event: 'Fire Safety team en route', type: 'dispatch' },
      { time: '14:25:00', event: 'Floor 1 evacuation initiated', type: 'action' },
    ],
    aiAnalysis: {
      severity: 'critical',
      confidence: 0.96,
      suggestedActions: [
        'Evacuate Floor 1 Kitchen Wing immediately',
        'Activate fire suppression system',
        'Alert local fire department (Auto-dispatched)',
        'Redirect guests away from Building A east exits',
        'Prepare medical team on standby'
      ],
      summary: 'Active grease fire in main kitchen. High risk of spread due to cooking oil proximity. Immediate evacuation recommended for Floor 1.'
    },
    createdAt: '2026-04-27T14:23:10Z',
    updatedAt: '2026-04-27T14:25:00Z',
  },
  {
    id: 'INC-002',
    type: 'medical',
    severity: 'high',
    status: 'responding',
    title: 'Guest Medical Emergency — Room 412',
    description: 'Guest reported chest pain and difficulty breathing. Appears to be a cardiac event. Guest is conscious but in distress.',
    reportedBy: { name: 'James Chen', room: '412', phone: '+1-555-0202' },
    location: { building: 'Main Hotel', floor: 4, zone: 'East Wing' },
    assignedStaff: ['STF-002', 'STF-006'],
    timeline: [
      { time: '14:18:00', event: 'Guest pressed emergency button in Room 412', type: 'report' },
      { time: '14:18:05', event: 'AI classified severity as HIGH', type: 'ai' },
      { time: '14:18:10', event: 'Medical team alerted', type: 'alert' },
      { time: '14:18:45', event: 'Dr. Patel acknowledged and en route', type: 'ack' },
      { time: '14:20:00', event: 'AED and first aid kit dispatched', type: 'dispatch' },
    ],
    aiAnalysis: {
      severity: 'high',
      confidence: 0.91,
      suggestedActions: [
        'Deploy medical team with AED immediately',
        'Call 911 for cardiac emergency',
        'Clear elevator access to Floor 4',
        'Have guest medical records ready',
        'Prepare gurney at service elevator'
      ],
      summary: 'Possible cardiac event in Room 412. Guest is conscious but symptomatic. Immediate medical attention required. EMS recommended.'
    },
    createdAt: '2026-04-27T14:18:00Z',
    updatedAt: '2026-04-27T14:20:00Z',
  },
  {
    id: 'INC-003',
    type: 'security',
    severity: 'medium',
    status: 'acknowledged',
    title: 'Unauthorized Access — Parking Level B2',
    description: 'Security cameras detected unauthorized individual in restricted parking area. Subject appears to be attempting vehicle break-in.',
    reportedBy: { name: 'CCTV System', room: 'Auto-Detection', phone: 'N/A' },
    location: { building: 'Parking Structure', floor: -2, zone: 'Section B' },
    assignedStaff: ['STF-004'],
    timeline: [
      { time: '14:10:30', event: 'Motion detected in restricted zone B2', type: 'report' },
      { time: '14:10:35', event: 'AI classified severity as MEDIUM', type: 'ai' },
      { time: '14:10:40', event: 'Security team notified', type: 'alert' },
      { time: '14:11:15', event: 'Officer Rodriguez acknowledged', type: 'ack' },
    ],
    aiAnalysis: {
      severity: 'medium',
      confidence: 0.84,
      suggestedActions: [
        'Dispatch security to Parking B2 Section B',
        'Lock down parking level exits',
        'Review CCTV footage for identification',
        'Alert local police if confrontation occurs'
      ],
      summary: 'Unauthorized individual detected in restricted parking area via CCTV. Possible vehicle break-in attempt. Security response recommended.'
    },
    createdAt: '2026-04-27T14:10:30Z',
    updatedAt: '2026-04-27T14:11:15Z',
  },
  {
    id: 'INC-004',
    type: 'natural_disaster',
    severity: 'low',
    status: 'reported',
    title: 'Minor Water Leak — Floor 6 Hallway',
    description: 'Water seeping from ceiling near Room 608. Appears to be a pipe issue, not storm-related. Small puddle forming.',
    reportedBy: { name: 'Tom Williams', room: '605', phone: '+1-555-0404' },
    location: { building: 'Main Hotel', floor: 6, zone: 'West Wing' },
    assignedStaff: [],
    timeline: [
      { time: '14:05:00', event: 'Guest reported water leak via app', type: 'report' },
      { time: '14:05:05', event: 'AI classified severity as LOW', type: 'ai' },
      { time: '14:05:10', event: 'Maintenance team notified', type: 'alert' },
    ],
    aiAnalysis: {
      severity: 'low',
      confidence: 0.89,
      suggestedActions: [
        'Send maintenance team to inspect',
        'Place wet floor signs',
        'Check rooms above for source',
        'Monitor for escalation'
      ],
      summary: 'Minor plumbing leak on Floor 6. Low immediate risk. Maintenance response adequate.'
    },
    createdAt: '2026-04-27T14:05:00Z',
    updatedAt: '2026-04-27T14:05:10Z',
  },
];

export const mockStaff = [
  { id: 'STF-001', name: 'Carlos Rodriguez', role: 'security', department: 'Security', status: 'responding', floor: 1, zone: 'Lobby', avatar: '👮' },
  { id: 'STF-002', name: 'Dr. Priya Patel', role: 'medical', department: 'Medical', status: 'responding', floor: 4, zone: 'East Wing', avatar: '👩‍⚕️' },
  { id: 'STF-003', name: 'Mike Thompson', role: 'fire_safety', department: 'Fire Safety', status: 'responding', floor: 1, zone: 'Kitchen Wing', avatar: '🧑‍🚒' },
  { id: 'STF-004', name: 'Sarah Kim', role: 'security', department: 'Security', status: 'responding', floor: -2, zone: 'Parking B', avatar: '👮‍♀️' },
  { id: 'STF-005', name: 'David Okafor', role: 'maintenance', department: 'Maintenance', status: 'responding', floor: 1, zone: 'Kitchen Wing', avatar: '🔧' },
  { id: 'STF-006', name: 'Lisa Chang', role: 'medical', department: 'Medical', status: 'available', floor: 2, zone: 'Medical Office', avatar: '👩‍⚕️' },
  { id: 'STF-007', name: 'Ahmad Hassan', role: 'security', department: 'Security', status: 'available', floor: 1, zone: 'Lobby', avatar: '👮' },
  { id: 'STF-008', name: 'Jenny Martinez', role: 'management', department: 'Management', status: 'available', floor: 1, zone: 'Front Desk', avatar: '👩‍💼' },
];

export const mockVenue = {
  name: 'Grand Horizon Resort & Spa',
  address: '1200 Ocean Boulevard, Pacific City, CA 90210',
  buildings: [
    { name: 'Main Hotel', floors: 12, zones: ['Lobby', 'East Wing', 'West Wing', 'Kitchen Wing', 'Pool Area'] },
    { name: 'Conference Center', floors: 3, zones: ['Hall A', 'Hall B', 'Breakout Rooms'] },
    { name: 'Parking Structure', floors: 4, zones: ['Level P1', 'Level B1', 'Level B2', 'Level B3'] },
  ],
  totalRooms: 450,
  currentOccupancy: 387,
  assemblyPoints: ['Main Entrance Plaza', 'Pool Deck', 'Parking Lot C'],
};

export const mockStats = {
  activeIncidents: 4,
  respondingStaff: 5,
  avgResponseTime: '1m 42s',
  guestsOnSite: 387,
  resolvedToday: 3,
  totalStaff: 8,
};

export const emergencyTypes = [
  { id: 'fire', label: 'Fire', icon: '🔥', color: '#ef4444', description: 'Fire, smoke, or gas leak detected' },
  { id: 'medical', label: 'Medical', icon: '🏥', color: '#f97316', description: 'Medical emergency or health crisis' },
  { id: 'security', label: 'Security', icon: '🛡️', color: '#eab308', description: 'Security threat or suspicious activity' },
  { id: 'natural_disaster', label: 'Disaster', icon: '🌊', color: '#8b5cf6', description: 'Natural disaster or severe weather' },
  { id: 'other', label: 'Other', icon: '⚠️', color: '#3b82f6', description: 'Other emergency or hazard' },
];

export function getTimeAgo(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function getSeverityColor(severity) {
  const map = {
    critical: 'var(--crisis-critical)',
    high: 'var(--crisis-high)',
    medium: 'var(--crisis-medium)',
    low: 'var(--crisis-low)',
  };
  return map[severity] || 'var(--text-muted)';
}

export function getStatusLabel(status) {
  const map = {
    reported: 'Reported',
    acknowledged: 'Acknowledged',
    responding: 'Responding',
    contained: 'Contained',
    resolved: 'Resolved',
  };
  return map[status] || status;
}

export function getTypeIcon(type) {
  const map = {
    fire: '🔥',
    medical: '🏥',
    security: '🛡️',
    natural_disaster: '🌊',
    other: '⚠️',
  };
  return map[type] || '⚠️';
}
