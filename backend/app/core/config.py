from datetime import timedelta

#Security Config
SECRET_KEY = "a-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#Database Config
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "taskflow"
