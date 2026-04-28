'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { subscribeToIncidents, subscribeToStaff, subscribeToActivityLog } from '@/lib/firestoreService';
import { mockIncidents, mockStaff } from '@/lib/mockData';

export function useIncidents() {
  const { loading } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Subscribe to real Firestore data
    const unsubscribe = subscribeToIncidents((data) => {
      setIncidents(data);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [loading]);

  return { incidents, loading: dataLoading || loading };
}

export function useStaff() {
  const { loading } = useAuth();
  const [staff, setStaff] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Subscribe to real Firestore data
    const unsubscribe = subscribeToStaff((data) => {
      setStaff(data);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [loading]);

  return { staff, loading: dataLoading || loading };
}

// Generate mock activity log from mock incidents for demo mode
const getMockActivity = () => {
  const timeline = [];
  mockIncidents.forEach(inc => {
    if (inc.timeline) {
      inc.timeline.forEach(event => {
        timeline.push({ ...event, incidentId: inc.id });
      });
    }
  });
  return timeline.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 15);
};

export function useActivityLog() {
  const { loading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    const unsubscribe = subscribeToActivityLog((data) => {
      setActivities(data);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [loading]);

  return { activities, loading: dataLoading || loading };
}
