# Frontend - TaskFlow Client

This is the React + Vite frontend for the TaskFlow application.

## 📦 Requirements
- Node.js 18+
- NPM

## 🚀 Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    npm ci
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the app at [http://localhost:5173](http://localhost:5173).

## 🔨 Build for Production

To create a static production build (which can be served via Nginx):

```bash
npm run build
```
The output will be in the `dist` folder.

## ⚙️ Configuration
The frontend communicates with the backend via the `vite.config.js` proxy or direct URL.
- **Proxy**: Requests to `/api` are forwarded to `http://localhost:8000`.
