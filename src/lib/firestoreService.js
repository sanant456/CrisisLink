import {
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, limit, onSnapshot, serverTimestamp,
  arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// === INCIDENTS ===

export async function createIncident(data) {
  const incident = {
    ...data, status: 'reported', assignedStaff: [],
    timeline: [{ time: new Date().toISOString(), event: `Incident reported: ${data.title || data.type}`, type: 'report' }],
    aiAnalysis: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), resolvedAt: null,
  };
  const docRef = await addDoc(collection(db, 'incidents'), incident);
  return { id: docRef.id, ...incident };
}

export async function updateIncident(id, updates) {
  await updateDoc(doc(db, 'incidents', id), { ...updates, updatedAt: serverTimestamp() });
}

export async function addTimelineEvent(id, event) {
  await updateDoc(doc(db, 'incidents', id), {
    timeline: arrayUnion({ time: new Date().toISOString(), event: event.text, type: event.type || 'update' }),
    updatedAt: serverTimestamp(),
  });
}

export async function updateIncidentStatus(id, newStatus) {
  const labels = { acknowledged: 'Incident acknowledged', responding: 'Response team en route', contained: 'Situation contained', resolved: 'Incident resolved' };
  await updateDoc(doc(db, 'incidents', id), {
    status: newStatus, updatedAt: serverTimestamp(),
    ...(newStatus === 'resolved' ? { resolvedAt: serverTimestamp() } : {}),
    timeline: arrayUnion({ time: new Date().toISOString(), event: labels[newStatus] || `Status: ${newStatus}`, type: newStatus === 'resolved' ? 'resolve' : 'action' }),
  });
}

export async function assignStaffToIncident(incidentId, staffId, staffName) {
  await updateDoc(doc(db, 'incidents', incidentId), {
    assignedStaff: arrayUnion(staffId), updatedAt: serverTimestamp(),
    timeline: arrayUnion({ time: new Date().toISOString(), event: `${staffName} assigned`, type: 'dispatch' }),
  });
  await updateDoc(doc(db, 'users', staffId), { status: 'responding' });
}

export function subscribeToIncidents(callback) {
  const q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.()?.toISOString(), updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() })));
  });
}

export function subscribeToIncident(id, callback) {
  return onSnapshot(doc(db, 'incidents', id), (d) => { if (d.exists()) callback({ id: d.id, ...d.data() }); });
}

// === STAFF ===

export function subscribeToStaff(callback) {
  const q = query(collection(db, 'users'), orderBy('name'));
  return onSnapshot(q, (snap) => { callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); });
}

export async function updateStaffStatus(staffId, status) {
  await updateDoc(doc(db, 'users', staffId), { status });
}

export async function saveUserFCMToken(userId, token) {
  await updateDoc(doc(db, 'users', userId), { fcmToken: token });
}

// === VENUE ===

export async function getVenue(venueId) {
  const d = await getDoc(doc(db, 'venues', venueId));
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

// === FILE UPLOADS ===

export async function uploadIncidentMedia(incidentId, file) {
  const fileRef = ref(storage, `incidents/${incidentId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  return getDownloadURL(snapshot.ref);
}

// === ACTIVITY LOG ===

export async function logActivity(event) {
  await addDoc(collection(db, 'activity_log'), { ...event, timestamp: serverTimestamp() });
}

export function subscribeToActivityLog(callback, max = 20) {
  const q = query(collection(db, 'activity_log'), orderBy('timestamp', 'desc'), limit(max));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toDate?.()?.toISOString() })));
  });
}
