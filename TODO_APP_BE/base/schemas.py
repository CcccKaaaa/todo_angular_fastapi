from datetime import datetime

from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int

class TaskEdit(Task):
    id: int
    title: str | None = None