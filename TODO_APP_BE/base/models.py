from sqlalchemy import Boolean, Column, DateTime, Integer, String

from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    completed = Column(Boolean, default=False,  nullable=False)
    due_date = Column(DateTime)