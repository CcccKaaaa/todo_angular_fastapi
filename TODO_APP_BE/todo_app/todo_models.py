from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.exc import SQLAlchemyError

from base.models import Base
from base.exceptions import AccessError, RecordNotFoundError, ValidationError, UserError

# Define a decorator for exception handling
def handle_exceptions(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except SQLAlchemyError as e:
            raise AccessError(f"Database error occurred: {e}")
        except Exception as e:
            raise UserError(f"Unexpected error: {e}")
    return wrapper

class Task(Base):
    __tablename__ = "tasks"

    title = Column(String, nullable=False)
    description = Column(String)
    completed = Column(Boolean, default=False, nullable=False)
    due_date = Column(DateTime)

    @handle_exceptions
    def get_tasks(self, showCompleted: Boolean = True, task_id: int = 0, q: str = ''):
        task_filter = [] if showCompleted else [Task.completed == showCompleted]
        if task_id:
            task_filter.append(Task.id == task_id)
        if q:
            task_filter.append(Task.title.like(f"%{q}%"))
        tasks = self.search(filters=task_filter)
        return tasks

    @handle_exceptions
    def add_task(self, create_val: dict):
        create_val.pop('id', None)  # Safely remove 'id' if it exists

        if not create_val.get('title'):
            raise ValidationError("Task must have a title.")

        return self.create(create_val)

    @handle_exceptions
    def remove_task(self, task_id) -> bool:
        task = self.browse(task_id)
        if not task:
            raise RecordNotFoundError(f"Task with id {task_id} not found.")

        return task.delete()

    @handle_exceptions
    def edit_task(self, val: dict):
        edit_val = val.copy()
        task_id = edit_val.pop('id', None)

        if not task_id:
            raise ValidationError("Task ID is required for editing.")

        task = self.browse(task_id)
        if not task:
            raise RecordNotFoundError(f"Task with id {task_id} not found.")

        return task.update(edit_val)
