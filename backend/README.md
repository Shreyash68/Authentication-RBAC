# Backend - TaskFlow API

This is the FastAPI backend for the TaskFlow application.

## 📦 Requirements
- Python 3.10+
- MongoDB (Running locally or remote)

## 🚀 Setup & Run

1.  **Create Virtual Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure Environment**:
    The app uses defaults suitable for local development. You can override settings via environment variables:
    - `MONGO_URI`: (Default: `mongodb://localhost:27017`)
    - `DB_NAME`: (Default: `taskflow`)
    - `SECRET_KEY`: JWT Secret
    - `ALGORITHM`: JWT Algorithm (Default: HS256)

4.  **Run Server**:
    ```bash
    uvicorn app.main:app --reload
    ```

5.  **Docs**:
    Open [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.
