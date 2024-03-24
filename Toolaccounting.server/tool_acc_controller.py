from database import *
from model import *
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
    return db.query(ToolAccounting).all()

@app.post("/")
def add(data=Body(),db: Session = Depends(get_db),):
    db.add(ToolAccounting(user_id=data["UserId"],tool_id=data["ToolId"],tool_count=data["tool_count"]))
    db.commit()

@app.delete("/{id}/{del_count}")
def add(id:int,del_count:int,db: Session = Depends(get_db),):
    row=db.query(ToolAccounting).filter(ToolAccounting.id==id).first()
    if (row==None):
        return JSONResponse( status_code=404, content={ "message": "Запись не найдена"})
    row.tool_count-=del_count
    if(row.tool_count==0):
        db.delete(row)
    db.commit()