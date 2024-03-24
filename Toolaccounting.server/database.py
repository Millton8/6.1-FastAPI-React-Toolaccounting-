from sqlalchemy import create_engine
from sqlalchemy.orm import Session,sessionmaker, DeclarativeBase
import json

with open('config.json', 'r') as f:
  data = json.load(f)
   
SQLALCHEMY_DATABASE_URL = f"sqlite:///./{data["dbname"]}.db"
 

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False},echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class Base(DeclarativeBase): pass
  
