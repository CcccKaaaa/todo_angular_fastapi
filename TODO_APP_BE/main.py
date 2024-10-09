from typing import List

from fastapi import Depends, FastAPI, HTTPException, Form, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from base import crud, models, schemas
from base.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/get-tasks/', response_model=List[schemas.Task])
def get_tasks(db: Session = Depends(get_db), showCompleted: bool = True):
    return crud.get_tasks(db, showCompleted)

@app.get('/get-task/', response_model=schemas.Task)
def get_tasks(db: Session = Depends(get_db), id: int = 0 ):
    return crud.get_task(db, id)

@app.post('/add-task', response_model=schemas.Task)
def add_task(task:schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.add_task(db, task)

@app.post('/remove-task')
def remove_task(task:schemas.TaskEdit, db: Session = Depends(get_db)):
    return crud.remove_task(db, task.id)

@app.post('/edit-task')
def edit_task(task:schemas.TaskEdit, db: Session = Depends(get_db)):
    return crud.edit_task(db, task)
