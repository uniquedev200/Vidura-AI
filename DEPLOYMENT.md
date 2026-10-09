# VIDURA-AI DEPLOYMENT GUIDE

This repository is structured to deploy the **Backend on Render** and the **Frontend on Vercel** independently, or run both locally.

```
vidura-ai/
├── backend/          # FastAPI REST & SSE Streaming Service (Deploy on Render)
├── frontend/         # Next.js 14+ App Router & Sūtra Scroll UI (Deploy on Vercel)
├── render.yaml       # Render Blueprint Configuration
├── DEPLOYMENT.md     # Deployment Reference
└── README.md         # Product Overview & Architecture
```

---

## 1. Deploy Backend on Render

### Method A: One-Click / Blueprint Deployment
1. Log in to [Render](https://render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository (`Vidura-AI`).
4. Render will read `render.yaml` automatically and configure the `vidura-ai-backend` web service.
5. In the Environment Variables settings, fill in your secret credentials:
   - `GROQ_API_KEY`: Your Groq Cloud API key
   - `UPSTASH_VECTOR_REST_URL`: Your Upstash Vector REST URL
   - `UPSTASH_VECTOR_REST_TOKEN`: Your Upstash Vector token
   - `SUPABASE_DATABASE_URL`: PostgreSQL connection string

### Method B: Manual Web Service Setup
1. On Render, click **New +** > **Web Service**.
2. Connect your repository.
3. Configure settings:
   - **Name**: `vidura-ai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables**:
   ```env
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=openai/gpt-oss-120b
   UPSTASH_VECTOR_REST_URL=https://loving-stingray-28519-us1-vector.upstash.io
   UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
   SUPABASE_DATABASE_URL=postgresql://postgres:...@...supabase.com:5432/postgres
   ```
5. Click **Deploy Web Service**.
6. Once deployed, copy your backend URL (e.g., `https://vidura-ai-backend.onrender.com`).

---

## 2. Deploy Frontend on Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project** and import your GitHub repository (`Vidura-AI`).
3. In the project setup screen, configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select `frontend` (crucial for monorepo detection).
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
4. Add **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://vidura-ai-backend.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://niehzpildcvzhsshzkyp.supabase.co
   NEXT_PUBLIC_GROQ_MODEL=openai/gpt-oss-120b
   ```
   *(Replace `NEXT_PUBLIC_API_URL` with your live Render backend URL from Step 1)*.
5. Click **Deploy**.
6. Your Next.js frontend will be live on Vercel (e.g. `https://vidura-ai.vercel.app`).

---

## 3. Local Development

### Run Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs available at: `http://127.0.0.1:8000/docs`

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.
