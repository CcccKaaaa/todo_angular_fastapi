from sqlalchemy.orm import Session

from . import models, schemas

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()

def add_task(db: Session, task:schemas.TaskCreate):
    task = models.Task(title=task.title, 
                       description=task.description,
                       due_date=task.due_date,
                       completed=task.completed)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def remove_task(db: Session, task_id: int):
    task_to_rm = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task_to_rm:
        db.delete(task_to_rm)
        db.commit()
    return True

def edit_task(db: Session, task:schemas.Task):
    task_to_edit = db.query(models.Task).filter(models.Task.id == task.id).first()
    if task_to_edit:
        task_data = task.model_dump(exclude_unset=True)
        for key, value in task_data.items():
            setattr(task_to_edit, key, value)
        db.commit()
        db.refresh(task_to_edit)  
    return task_to_edit
    