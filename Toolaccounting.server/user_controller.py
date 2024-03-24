from database import *
from model import User,ToolAccounting,Tool
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
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.post("/")
def add(data=Body(),db: Session = Depends(get_db)):
    user=User(full_name=data["FullName"])
    db.add(user)
    db.commit()

@app.delete("/{id}")
def add(id,db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if user == None:
        return JSONResponse( status_code=404, content={ "message": "Пользователь не найден"})
    tools_accounting=db.query(ToolAccounting).filter(ToolAccounting.user_id==id)
    if(tools_accounting==None):
        db.delete(user)
        db.commit()
    tools=db.query(Tool).all()
    for row in tools_accounting:
        tool=db.query(Tool).filter(Tool.id==row.tool_id).first()
        if(tool==None):
            return JSONResponse( status_code=404, content={ "message": "Инструмент от пользователя не найден"})
        tool.count+=row.tool_count
        db.commit()
         