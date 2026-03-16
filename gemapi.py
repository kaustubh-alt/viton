from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form, Depends
import shutil
import os
import hmac
import sqlite3
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from tpo import getimg
from pydantic import BaseModel
from viton import get_db, init_db

app = FastAPI()

# Initialize the database when the app starts
init_db()

# CORS Middleware (Allow frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store uploaded images
UPLOAD_DIR = "C:/Programs/mini_project/stockapi/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


@app.post("/register")
def register(request: RegisterRequest):
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (request.name, request.email, request.password)
        )
        db.commit()
        return {"message": "Registration successful", "registered": True}

    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User already exists")

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        db.close()


@app.post("/login")
def login(request: LoginRequest):
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            "SELECT name, password FROM users WHERE email = ?",
            (request.email,)
        )
        result = cursor.fetchone()

        if not result:
            return {"message": "Invalid Credentials", "authentic": False, "name": None}

        stored_password = result['password']

        if hmac.compare_digest(request.password, stored_password):
            return {"message": "Login successful", "authentic": True, "name": result['name']}
        else:
            return {"message": "Invalid Password", "authentic": False, "name": None}

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


# Protected route (JWT required)
@app.post("/generate")
async def upload_images( image1: UploadFile = File(...), image2: UploadFile = File(...)):

    try:
        img1_path = f"{UPLOAD_DIR}/{image1.filename}"
        img2_path = f"{UPLOAD_DIR}/{image2.filename}"

        # Save images
        with open(img1_path, "wb") as buffer1:
            shutil.copyfileobj(image1.file, buffer1)

        with open(img2_path, "wb") as buffer2:
            shutil.copyfileobj(image2.file, buffer2)

        # Placeholder for AI processing (Replace with actual logic)
        generated_image_url = getimg(img1_path,img2_path)

        return JSONResponse(content={"message": "Images uploaded successfully!", "generated_image": generated_image_url})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
