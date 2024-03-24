from sqlalchemy import  Column,Integer,BigInteger,String,ForeignKey
from sqlalchemy.orm import relationship
from database import Base

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
    tool_accounting = relationship("ToolAccounting", back_populates="user")

class ToolAccounting(Base):
    __tablename__ = "Toolsaccounting"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user=relationship("User", back_populates="tool_accounting",lazy="selectin")
    tool_id = Column(Integer, ForeignKey("Tools.id"))
    tool=relationship("Tool", back_populates="tool_accounting",lazy="selectin")
    tool_count=Column(BigInteger)