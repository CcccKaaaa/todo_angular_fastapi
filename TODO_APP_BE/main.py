from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

tasks_pool = [
        {'id' : 1, 'name': 'task 1'},
        {'id': 2, 'name': 'task 2'}
    ]

current_task_id = 2

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {"message": "root"}

@app.get('/get-tasks')
def get_tasks():
    return _get_tasks()

def _get_tasks():
    return tasks_pool

@app.post('/add-task')
def add_task(task_name:str=Form(...)):
    print(task_name)
    return _add_task(task_name)

def _add_task(task_name:str):
    global current_task_id
    current_task_id += 1
    
    tasks_pool.append({
        'id': current_task_id,
        'name': task_name
    })

    return "Success"

@app.post('/remove-task')
def remove_task(task_id:int=Form(...)):
    return _remove_task(task_id)

def _remove_task(task_id:int):
    global tasks_pool
    tasks_pool = [task for task in tasks_pool if task['id'] != task_id]

    return "Success"