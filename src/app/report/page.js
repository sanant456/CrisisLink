'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { emergencyTypes } from '@/lib/mockData';
import { createIncident, logActivity } from '@/lib/firestoreService';

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ floor: '', room: '' });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [incidentId, setIncidentId] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    const fetchWithRetry = async (url, options, retries = 3, backoff = 1000) => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return response;
      } catch (err) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, backoff));
          return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw err;
      }
    };

    const id = `INC-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setIncidentId(id);
    setSubmitted(true);
    setAnalyzing(true);

    try {
      const locationStr = `${location.floor || 'Unknown floor'}, ${location.room || 'Unknown room'}`;
      const fullDesc = `Type: ${selectedType}. ${description}. Location: ${locationStr}`;
      
      const formData = new FormData();
      formData.append('description', fullDesc);
      if (image) formData.append('image', image);
      
      const response = await fetch('/api/ai/analyze-incident', {
        method: 'POST',
        body: formData
      });
      
      let analysis = null;
      if (response.ok) {
        analysis = await response.json();
        setAiResult(analysis);
      }
      
      // Get Live GPS Location
      let liveLat = null;
      let liveLng = null;
      if (navigator.geolocation) {
        setLocating(true);
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
          });
          liveLat = position.coords.latitude;
          liveLng = position.coords.longitude;
        } catch (geoErr) {
          console.warn("Geolocation failed or denied:", geoErr);
        } finally {
          setLocating(false);
        }
      }
      
      // Save to Firestore
      const incidentData = {
        type: selectedType,
        title: analysis?.summary || `${selectedType} Report`,
        description,
        location: {
          building: 'Main',
          floor: location.floor || 'Unknown',
          room: location.room || 'Unknown',
          lat: liveLat,
          lng: liveLng
        },
        reporter: {
          name: name || 'Anonymous',
          phone: phone || 'Not provided'
        },
        severity: analysis?.severity || 'medium',
        aiAnalysis: analysis
      };
      
      const savedDoc = await createIncident(incidentData);
      setIncidentId(savedDoc.id);
      
      await logActivity({
        type: 'report',
        event: `New ${analysis?.severity || 'medium'} severity incident reported`,
        incidentId: savedDoc.id
      });
      
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>Emergency Reported</h1>
            <p className={styles.successDesc}>
              Your report has been received and is being processed. Help is on the way.
            </p>
            <div className={styles.incidentBadge}>
              Incident ID: <strong>{incidentId}</strong>
            </div>

            <div className={styles.statusTracker}>
              <div className={`${styles.statusStep} ${styles.statusActive}`}>
                <div className={styles.statusDot} />
                <div>
                  <div className={styles.statusLabel}>Reported</div>
                  <div className={styles.statusTime}>Just now</div>
                </div>
              </div>
              <div className={styles.statusConnector} />
              <div className={`${styles.statusStep} ${analyzing ? styles.statusActive : aiResult ? styles.statusComplete : styles.statusPending}`}>
                <div className={styles.statusDot} />
                <div>
                  <div className={styles.statusLabel}>AI Analyzing</div>
                  <div className={styles.statusTime}>{analyzing ? 'Processing...' : aiResult ? `Severity: ${aiResult.severity.toUpperCase()}` : 'Pending'}</div>
                </div>
              </div>
              <div className={styles.statusConnector} />
              <div className={`${styles.statusStep} ${styles.statusPending}`}>
                <div className={styles.statusDot} />
                <div>
                  <div className={styles.statusLabel}>Staff Dispatched</div>
                  <div className={styles.statusTime}>Pending</div>
                </div>
              </div>
              <div className={styles.statusConnector} />
              <div className={`${styles.statusStep} ${styles.statusPending}`}>
                <div className={styles.statusDot} />
                <div>
                  <div className={styles.statusLabel}>Responding</div>
                  <div className={styles.statusTime}>Pending</div>
                </div>
              </div>
            </div>

            <div className={styles.safetyTips}>
              <h3>🛡️ While you wait:</h3>
              <ul>
                <li>Stay calm and stay in a safe location</li>
                <li>Keep your phone accessible</li>
                <li>Follow any evacuation instructions</li>
                <li>Do not return to danger areas</li>
              </ul>
            </div>

            {/* AI Analysis Results */}
            {aiResult && (
              <div className={styles.aiResults}>
                <h3>🤖 Gemini Intelligence</h3>
                <div className={styles.aiSeverity}>
                  <span className={`badge badge-${aiResult.severity}`}>{aiResult.severity.toUpperCase()}</span>
                  {aiResult.priority_score && (
                    <span className={styles.priorityLabel}>Priority: {aiResult.priority_score}/10</span>
                  )}
                  {aiResult.vision_analysis?.confidence_score && (
                    <span className={styles.aiConfidence}>Confidence: {aiResult.vision_analysis.confidence_score}%</span>
                  )}
                </div>
                <p className={styles.aiSummary}>{aiResult.summary}</p>
                
                {aiResult.vision_analysis?.detected_objects?.length > 0 && (
                  <div className={styles.visionFindings}>
                    <strong>Visual Detections:</strong>
                    <div className={styles.visionTags}>
                      {aiResult.vision_analysis.detected_objects.map((obj, i) => (
                        <span key={i} className={styles.visionTag}>👁️ {obj}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.aiActions}>
                  <strong>Recommended Action:</strong>
                  <p>{aiResult.recommended_action}</p>
                </div>
                <div className={styles.aiEta}>⏱️ AI Priority Level: {aiResult.priority_score >= 8 ? 'URGENT' : 'Standard'}</div>
              </div>
            )}
            {analyzing && (
              <div className={styles.aiLoading}>
                <div className={styles.spinner} />
                <span>{locating ? '📡 Capturing live location...' : '🤖 Gemini AI is analyzing the incident...'}</span>
              </div>
            )}

            <Link href="/" className="btn btn-primary btn-lg" style={{width: '100%'}}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Emergency header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
        <div className={styles.headerCenter}>
          <div className={styles.sosIndicator}>
            <span className={styles.sosPulse} />
            Emergency Report
          </div>
        </div>
        <div />
      </div>

      <div className={styles.container}>
        {/* Progress bar */}
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{width: `${(step / 3) * 100}%`}} />
        </div>
        <div className={styles.stepLabel}>Step {step} of 3</div>

        {/* Step 1: Emergency Type */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>What type of emergency?</h1>
            <p className={styles.subtitle}>Select the category that best describes your situation</p>

            <div className={styles.typeGrid}>
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  className={`${styles.typeCard} ${selectedType === type.id ? styles.typeSelected : ''}`}
                  onClick={() => setSelectedType(type.id)}
                  style={{
                    '--type-color': type.color,
                    borderColor: selectedType === type.id ? type.color : undefined
                  }}
                >
                  <span className={styles.typeIcon}>{type.icon}</span>
                  <span className={styles.typeLabel}>{type.label}</span>
                  <span className={styles.typeDesc}>{type.description}</span>
                  {selectedType === type.id && (
                    <div className={styles.checkMark}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{width: '100%', marginTop: 'var(--space-6)'}}
              disabled={!selectedType}
              onClick={() => setStep(2)}
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Describe the situation</h1>
            <p className={styles.subtitle}>Provide as much detail as you can — this helps responders prepare</p>

            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>What is happening? *</label>
                <div className={styles.textareaWrapper}>
                  <textarea
                    className="input"
                    placeholder="Describe the emergency situation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                  <button 
                    type="button"
                    className={`${styles.micBtn} ${isListening ? styles.listening : ''}`}
                    onClick={toggleVoiceInput}
                    title="Voice SOS"
                  >
                    {isListening ? '🛑' : '🎤'}
                  </button>
                </div>
                {isListening && <p className={styles.voiceHint}>Listening... Speak clearly into your microphone.</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Visual Evidence (Optional)</label>
                <div className={styles.imageUpload}>
                  {imagePreview ? (
                    <div className={styles.previewContainer}>
                      <img src={imagePreview} alt="Preview" className={styles.preview} />
                      <button className={styles.removeImg} onClick={() => { setImage(null); setImagePreview(null); }}>✕</button>
                    </div>
                  ) : (
                    <label className={styles.uploadBox}>
                      <input type="file" accept="image/*" onChange={handleImageChange} className={styles.hiddenInput} />
                      <span className={styles.uploadIcon}>📷</span>
                      <span>Upload Image</span>
                      <span className={styles.uploadHint}>Detects fire, smoke, and hazards</span>
                    </label>
                  )}
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Floor / Level</label>
                  <input
                    className="input"
                    placeholder="e.g., Floor 4"
                    value={location.floor}
                    onChange={(e) => setLocation({...location, floor: e.target.value})}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Room / Area</label>
                  <input
                    className="input"
                    placeholder="e.g., Room 412"
                    value={location.room}
                    onChange={(e) => setLocation({...location, room: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.mediaUpload}>
                <div className={styles.uploadZone}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Tap to add photo or video</span>
                  <span className={styles.uploadHint}>Optional — helps responders assess the situation</span>
                </div>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className="btn btn-ghost btn-lg" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn btn-primary btn-lg"
                style={{flex: 1}}
                disabled={!description}
                onClick={() => setStep(3)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact (Optional) */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Your information</h1>
            <p className={styles.subtitle}>Optional — helps staff reach you directly if needed</p>

            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Your Name</label>
                <input
                  className="input"
                  placeholder="Optional"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone Number</label>
                <input
                  className="input"
                  placeholder="Optional"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Summary */}
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Report Summary</h3>
              <div className={styles.summaryRow}>
                <span>Type</span>
                <span>{emergencyTypes.find(t => t.id === selectedType)?.icon} {emergencyTypes.find(t => t.id === selectedType)?.label}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Description</span>
                <span>{description.substring(0, 60)}...</span>
              </div>
              {location.floor && (
                <div className={styles.summaryRow}>
                  <span>Location</span>
                  <span>{location.floor}{location.room ? `, ${location.room}` : ''}</span>
                </div>
              )}
            </div>

            <div className={styles.btnRow}>
              <button className="btn btn-ghost btn-lg" onClick={() => setStep(2)}>Back</button>
              <button
                className="btn btn-danger btn-lg"
                style={{flex: 1}}
                onClick={handleSubmit}
              >
                🚨 Submit Emergency Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
