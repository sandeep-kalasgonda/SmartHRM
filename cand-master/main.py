from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import mysql.connector
import uuid
from dotenv import load_dotenv
from datetime import date
# Load environment variables from .env file
load_dotenv()
# Initialize FastAPI app
app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DB")
# MySQL connection function
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB
        )
        return conn
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Database connection failed.")
# Define Pydantic model for Candidate
class Candidate(BaseModel):
    cd_id:str
    cd_first_name: str
    cd_last_name: Optional[str] = None
    cd_email: EmailStr
    cd_phno: str
    cd_qual: str
    cd_total_exp: int
    cd_related_exp: Optional[int] = None
    cd_loc: str
    cd_cur_ctc: float
    cd_exp_ctc: float
    cd_notice: str
    cd_work_mode: str
    cd_valid_passport: Optional[bool] = None
    created_by: Optional[str] = None
# Define Pydantic model for Requirement
class Requirement(BaseModel):
    rq_id: str
    rq_name: str
# Define Pydantic model for Client (for dropdown)
class Client(BaseModel):
    cl_id: str
    cl_name: str
# 1. Get all clients for dropdown (GET)
@app.get("/clients", response_model=List[Client])
def get_clients():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT cl_id, cl_name FROM clients")
        clients = cursor.fetchall()
        return clients
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Failed to retrieve clients.")
    finally:
        cursor.close()
        conn.close()
# 2. Get all requirements for dropdown (GET)
@app.get("/requirements", response_model=List[Requirement])
def get_requirements():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT rq_id, rq_name FROM requirements")
        requirements = cursor.fetchall()
        return requirements
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Failed to retrieve requirements.")
    finally:
        cursor.close()
        conn.close()
# 2. Create a new candidate for a specific requirement (POST)
@app.post("/candidates/{rq_id}")
def create_candidate(rq_id: str, candidate: Candidate):
    cd_uuid = uuid.uuid4()  # Generate UUID for the new candidate
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Ensure the requirement exists before creating the candidate
        cursor.execute("SELECT * FROM requirements WHERE rq_id = %s", (rq_id,))
        requirement = cursor.fetchone()
        if not requirement:
            raise HTTPException(status_code=404, detail="Requirement not found.")
        # Insert the new candidate with the provided rq_id
        cursor.execute(
            """INSERT INTO candidates (cd_id, rq_id, cd_first_name, cd_last_name, cd_email, cd_phno,
               cd_qual, cd_total_exp, cd_related_exp, cd_loc, cd_cur_ctc, cd_exp_ctc, cd_notice,
               cd_work_mode, cd_valid_passport, created_by)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (cd_uuid.hex, rq_id, candidate.cd_first_name, candidate.cd_last_name, candidate.cd_email,
             candidate.cd_phno, candidate.cd_qual, candidate.cd_total_exp, candidate.cd_related_exp,
             candidate.cd_loc, candidate.cd_cur_ctc, candidate.cd_exp_ctc, candidate.cd_notice,
             candidate.cd_work_mode, candidate.cd_valid_passport, candidate.created_by)
        )
        conn.commit()
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail="Failed to create candidate.")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Candidate created successfully.", "candidate_id": cd_uuid.hex}

@app.post("/candidates/{rq_id}")
async def create_candidate(rq_id: str, candidate: Candidate):
    cd_uuid = uuid.uuid4()  # Generate UUID for the new candidate
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Ensure the requirement exists before creating the candidate
        cursor.execute("SELECT * FROM requirements WHERE rq_id = %s", (rq_id,))
        requirement = cursor.fetchone()
        if not requirement:
            raise HTTPException(status_code=404, detail="Requirement not found.")

        # Insert the new candidate with the provided rq_id
        cursor.execute(
            """INSERT INTO candidates (cd_id, rq_id, cd_first_name, cd_last_name, cd_email, cd_phno,
               cd_qual, cd_total_exp, cd_related_exp, cd_loc, cd_cur_ctc, cd_exp_ctc, cd_notice,
               cd_work_mode, cd_valid_passport, created_by)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (cd_uuid.hex, rq_id, candidate.cd_first_name, candidate.cd_last_name, candidate.cd_email,
             candidate.cd_phno, candidate.cd_qual, candidate.cd_total_exp, candidate.cd_related_exp,
             candidate.cd_loc, candidate.cd_cur_ctc, candidate.cd_exp_ctc, candidate.cd_notice,
             candidate.cd_work_mode, candidate.cd_valid_passport, candidate.created_by)
        )
        conn.commit()
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail="Failed to create candidate.")
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Candidate created successfully.", "candidate_id": cd_uuid.hex}

# 1. Get all candidates (GET)
@app.get("/candidates", response_model=List[Candidate])
def get_candidates():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM candidates")
        candidates = cursor.fetchall()
        return candidates
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Failed to retrieve candidates.")
    finally:
        cursor.close()
        conn.close()
# 3. Get a specific candidate by ID (GET)
@app.get("/candidates/{cd_id}", response_model=Candidate)
def get_candidate(cd_id: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM candidates WHERE cd_id = %s", (cd_id,))
        candidate = cursor.fetchone()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found.")
        return candidate
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Failed to retrieve candidate.")
    finally:
        cursor.close()
        conn.close()
# 4. Update a candidate by ID (PUT)
@app.put("/candidates/{cd_id}")
def update_candidate(cd_id: str, candidate: Candidate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """UPDATE candidates SET cd_first_name = %s, cd_last_name = %s, cd_email = %s, cd_phno = %s,
               cd_qual = %s, cd_total_exp = %s, cd_related_exp = %s, cd_loc = %s, cd_cur_ctc = %s,
               cd_exp_ctc = %s, cd_notice = %s, cd_work_mode = %s, cd_valid_passport = %s,
               created_by = %s WHERE cd_id = %s""",
            (candidate.cd_first_name, candidate.cd_last_name, candidate.cd_email, candidate.cd_phno,
             candidate.cd_qual, candidate.cd_total_exp, candidate.cd_related_exp, candidate.cd_loc,
             candidate.cd_cur_ctc, candidate.cd_exp_ctc, candidate.cd_notice, candidate.cd_work_mode,
             candidate.cd_valid_passport, candidate.created_by, cd_id)
        )
        conn.commit()
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail="Failed to update candidate.")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Candidate updated successfully."}
# 5. Delete a candidate by ID (DELETE)
@app.delete("/candidates/{cd_id}")
def delete_candidate(cd_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM candidates WHERE cd_id = %s", (cd_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Candidate not found.")
    except mysql.connector.Error as err:
        logger.error(f"Error: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete candidate.")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Candidate deleted successfully."}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)