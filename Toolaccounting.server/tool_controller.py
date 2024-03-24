from fastapi.encoders import jsonable_encoder
from database import *
from model import Tool
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, Body
from fastapi.responses import JSONResponse

Base.metadata.create_all(bind=engine)
 
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
 

@app.get("/")
def get_tools(db: Session = Depends(get_db)):
    json_data = jsonable_encoder(db.query(Tool).all())
    return JSONResponse(content=json_data)

@app.get("/toolforac")
def get_all(db: Session = Depends(get_db)):
    return db.query(Tool).filter(Tool.count>0).all()

@app.post("/")
def add(data=Body(),db: Session = Depends(get_db)):
    tool=Tool(name=data["Name"],count=data["Count"])
    db.add(tool)
    db.commit()

@app.delete("/{id}")
def add(id,db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.id == id).first()
    if tool == None:
        return JSONResponse( status_code=404, content={ "message": "Инструмент не найден"})
    db.delete(tool)
    db.commit()  


