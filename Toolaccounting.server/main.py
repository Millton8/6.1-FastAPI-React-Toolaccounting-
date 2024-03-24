from database import *
#from model import *
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, Body,APIRouter
from fastapi.responses import JSONResponse, FileResponse,HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from tool_controller import app as tool_controller_app
from user_controller import app as user_controller_app
from tool_acc_controller import app as tool_acc_controller_app

 
Base.metadata.create_all(bind=engine)

 
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/accounting", tool_acc_controller_app)
app.mount("/tool", tool_controller_app)
app.mount("/user", user_controller_app)