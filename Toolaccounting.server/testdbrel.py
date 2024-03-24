from sqlalchemy import create_engine
from sqlalchemy.orm import Session,sessionmaker, DeclarativeBase
import json
from sqlalchemy import  Column,Integer,BigInteger,String,ForeignKey
from sqlalchemy.orm import relationship,subqueryload,selectinload,Mapped
from database import Base
from sqlalchemy.orm import joinedload
from sqlalchemy import select

# with open('config.json', 'r') as f:
#   data = json.load(f)
   
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app2.db"
 
# создаем движок SqlAlchemy
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False},echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class Base(DeclarativeBase): pass
  
class Tool(Base):
    __tablename__ = "Tools"
    id = Column(Integer, primary_key=True, index=True)
    name=Column(String)
    count=Column(BigInteger)
    tool_accounting = relationship("ToolAccounting", back_populates="tool")

class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    full_name=Column(String)
    tool_accounting = relationship("ToolAccounting", back_populates="user",lazy="selectin")

class ToolAccounting(Base):
    __tablename__ = "Toolsaccounting"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user=relationship("User", back_populates="tool_accounting",lazy="joined")
    tool_id = Column(Integer, ForeignKey("Tools.id"))
    tool=relationship("Tool", back_populates="tool_accounting")
    tool_count=Column(BigInteger)


  

if __name__ == "__main__":
  # Base.metadata.create_all(bind=engine)
  # print("База данных и таблица созданы")
  #a1=select(ToolAccounting).options(joinedload(ToolAccounting.user))
  #print(a1)

  Session = sessionmaker(autoflush=False, bind=engine)
  # создаем саму сессию базы данных
  with Session(autoflush=False, bind=engine) as db:
      # n1=User(full_name="Jack")
      # t1=ToolAccounting(user=n1,tool=Tool(name="Molotok",count=19),tool_count=3)
      # db.add(t1)
      # db.commit()
      # print(t1.id)
     
    #  tooac=db.query(ToolAccounting).options(selectinload(User.full_name)).all()
    #  for item in tooac:
    #     #print(item.id,item.user.full_name,item.tool.name,item.tool_count)
    #     #print(item)

    tooac=db.query(ToolAccounting).options(joinedload(ToolAccounting.user)).all()
    for item in tooac:
        print(item)
      
