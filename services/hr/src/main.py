from fastapi import FastAPI, UploadFile, File
import os
import boto3
from botocore.client import Config
from sqlalchemy import create_engine

app = FastAPI(title="ERP HR Service")

# Neon.tech Database Connection
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# MinIO Connection
s3 = boto3.client(
    's3',
    endpoint_url=f"http://{os.getenv('MINIO_ENDPOINT')}",
    aws_access_key_id=os.getenv('MINIO_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('MINIO_SECRET_KEY'),
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'
)

BUCKET_NAME = os.getenv("MINIO_BUCKET", "hr-files")

@app.get("/")
def read_root():
    return {"message": "Welcome to ERP HR Service", "database": "Connected to Neon.tech"}

@app.get("/employees")
def get_employees():
    # Mock data for now
    return [{"id": 1, "name": "Jane Smith", "position": "Developer"}]

@app.post("/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
    try:
        # Create bucket if it doesn't exist
        try:
            s3.create_bucket(Bucket=BUCKET_NAME)
        except:
            pass
            
        s3.upload_fileobj(file.file, BUCKET_NAME, f"cvs/{file.filename}")
        return {"filename": file.filename, "status": "CV Uploaded to MinIO"}
    except Exception as e:
        return {"error": str(e)}
