from datetime import timedelta

import os

#Security Config
SECRET_KEY = os.getenv("SECRET_KEY", "a-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

#Database Config
# In Docker, the host is usually the service name (e.g., 'db')
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "taskflow")
