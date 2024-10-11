from typing import List
from datetime import datetime

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing_extensions import Annotated

from base.http.middleware import Request, session_handler
from todo_app.todo_models import Task

todo_api = APIRouter()

class TaskBase(BaseModel):
    id: int | None = None
    title: str
    description: str | None = None
    due_date: datetime | None = None
    completed: bool = False

class RequestTask(TaskBase):
    pass

class ReponseTask(TaskBase):
    pass

class FilterParams(BaseModel):
    showCompleted: bool = True
    task_id: int = 0
    q: str = ''

def _get_model(request) -> Task:
    return request.env['tasks']

@todo_api.get('/get-tasks/', response_model=List[ReponseTask])
@session_handler
def get_tasks(request: Request, filter_query: Annotated[FilterParams, Query()]):
    result = _get_model(request).get_tasks(filter_query.showCompleted, filter_query.task_id, filter_query.q)
    return result

@todo_api.post('/add-task', response_model=ReponseTask)
@session_handler
def add_task(request: Request, payloads: RequestTask):
    result = _get_model(request).add_task(payloads.model_dump())
    return result

@todo_api.post('/remove-task')
@session_handler
def remove_task(request: Request, payloads: dict):
    result = _get_model(request).remove_task(payloads)
    return result

@todo_api.post('/edit-task')
@session_handler
def edit_task(request: Request, payloads: RequestTask):
    result = _get_model(request).edit_task(payloads.model_dump())
    return result