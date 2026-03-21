# Gemini Flow Canvas - Project Guide

This document provides an overview of the project's folder structure, workflow, and technical implementation.

## 📂 Project Structure

### 🖥️ Frontend (`/frontend`)
Built with **Vite + React** and **React Flow**.
-   **`src/FlowComponent.jsx`**: Core component for the interactive canvas and AI logic.
-   **`src/FlowComponent.css`**: Styling for the custom nodes.

### ⚙️ Backend (`/backend`)
Built with **Node.js + Express** (Modular Architecture).
-   **`server.js`**: Application entry point. Loads middleware and routes.
-   **`config/db.js`**: MongoDB connection configuration.
-   **`controllers/aiController.js`**: Logic for AI generation and data saving.
-   **`routes/aiRoutes.js`**: API endpoint definitions.
-   **`models/Interaction.js`**: Database schema for interactions.

---

## 🔄 AI Workflow

1.  **User Input**: User enters a message into the **User Prompt** node.
2.  **Flow Execution**: Clicking **"Run Flow"** triggers an Axios POST request to `/api/ask-ai`.
3.  **AI Processing (Controller)**: The `aiController` receives the prompt, initializes the **Gemini 2.5 Flash** model, and returns the response.
4.  **UI Update**: Frontend updates the **AI Response** node with the result.
5.  **Persistence**: Clicking **"Save"** stores the interaction in MongoDB via the `/api/save` route.

---

## 🛠️ Key Technologies
-   **AI**: Gemini 2.5 Flash (Google AI SDK)
-   **Canvas**: React Flow
-   **Architecture**: Controller-Router Pattern
-   **Database**: MongoDB + Mongoose
