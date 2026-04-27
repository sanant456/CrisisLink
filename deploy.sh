#!/bin/bash
# ============================================
# CrisisLink — Google Cloud Run Deploy Script
# ============================================
# Usage: bash deploy.sh
# Prerequisites:
#   - gcloud CLI installed & authenticated
#   - Docker installed
#   - .env.local filled with all values

set -e

# ---- CONFIG (edit these) ----
PROJECT_ID="crisislink"          # your GCP project ID
SERVICE_NAME="crisislink"
REGION="us-central1"
IMAGE="gcr.io/$PROJECT_ID/$SERVICE_NAME"
# ------------------------------

echo "🔍 Loading environment variables from .env.local..."
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found. Please create it with your Firebase & Gemini keys."
  exit 1
fi

export $(grep -v '^#' .env.local | grep -v '^$' | xargs)

echo "🐳 Building Docker image..."
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" \
  --build-arg NEXT_PUBLIC_GEMINI_API_KEY="$NEXT_PUBLIC_GEMINI_API_KEY" \
  -t "$IMAGE" .

echo "📤 Pushing image to Google Container Registry..."
docker push "$IMAGE"

echo "🚀 Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production"

echo ""
echo "✅ CrisisLink deployed successfully!"
echo "🌐 URL: $(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')"
