# Deployment Guide - Render

This guide outlines the steps to deploy your **Gemini Flow Canvas** (MERN stack) on Render.

## 1. ⚙️ Prepare for Production

### Frontend
-   **VITE_API_BASE_URL**: Ensure your frontend points to the backend URL on Render.
-   Create a `.env` file in the `frontend` directory for testing or set it directly in Render.
    ```env
    VITE_API_BASE_URL=https://your-backend-url.onrender.com
    ```

### Backend
-   **Environment Variables**: You MUST set these in the Render dashboard:
    -   `GEMINI_API_KEY`: Your Google AI Studio API key.
    -   `MONGODB_URI`: Your MongoDB Atlas connection string.
    -   `PORT`: Set to `5001` or let Render provide one (the server uses `process.env.PORT || 5001`).

---

## 2. 🚀 Step-by-Step Deployment

### Step A: Deploy the Backend (Web Service)
1.  **Create New**: Select **"Web Service"** in Render.
2.  **Connect Repo**: Connect your GitHub repository.
3.  **Settings**:
    -   **Name**: `gemini-flow-backend`.
    -   **Root Directory**: `backend` (⚠️ **CRITICAL**)
    -   **Environment**: `Node`.
    -   **Build Command**: `npm install`.
    -   **Start Command**: `node server.js`.
4.  **Environment Variables**: Add your `GEMINI_API_KEY` and `MONGODB_URI`.

### Step B: Deploy the Frontend (Static Site)
1.  **Create New**: Select **"Static Site"**.
2.  **Connect Repo**: Connect the same GitHub repository.
3.  **Settings**:
    -   **Name**: `gemini-flow-canvas`.
    -   **Root Directory**: `frontend` (⚠️ **CRITICAL**)
    -   **Build Command**: `npm install && npm run build`.
    -   **Publish Directory**: `dist`.
4.  **Environment Variables**:
    -   `VITE_API_BASE_URL`: Paste the URL of your **Backend Web Service** from Step A.

---

## 3. 🛡️ Verification
1.  Once both services are "Live", open the Frontend URL.
2.  Try a prompt to verify the AI integration.
3.  Check the "Save" functionality to verify the database connection.

> [!NOTE]
> If you experience CORS issues, ensure your Backend `server.js` allows your Frontend URL (though current `cors()` allows all by default).
