from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional, List
from jose import JWTError, jwt
from datetime import datetime, timedelta
app = FastAPI(title="Task API ")

# -- Cors Section ----
# app.add_exception_handler(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True
# )

# -- Secret Key for JWT
SECRET_KEY = "abccdbbhcdh"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# -- Store Inside Memory
user_db: dict[int, dict] = {}
task_db: dict[int, dict] = {}
user_counter = 0
task_counter = 0

# Pydantic Use Model All Classes Modle

class UserResponse(BaseModel):
    id : int
    username : str
    email : str

class SignupRequest(BaseModel):
    username : str
    email : str
    password :str

class Login(BaseModel):
    email : str
    password :str

class LoginResponse(BaseModel):
    token : str
    user_id : int
    username : str

class TaskCreate(BaseModel):
    title : str
    description : str = ""
    status : str = "Open"

class TaskUpdate(BaseModel):
    title : Optional[str] = None
    description : Optional[str] = None
    status : Optional[str] = None

class TaskResposne(BaseModel):
    id : int
    user_id : int
    title : str
    description : str
    status : str

#Token Helper
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_id(Authorization: str = Header(None)) -> int:
        if not Authorization:
            raise HTTPException(status_code=401, detail="Authorization header missing")
        try:
            scheme, token = Authorization.split()
            if scheme.lower() != "bearer":
                raise HTTPException(status_code=401, detail="Invalid authentication scheme")
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return int(payload.get("sub"))
        except (JWTError, ValueError):
            raise HTTPException(status_code=401, detail="Invalid Token")


# Auth Endpoint Login and Signup
@app.post("/auth/signup:", response_model=UserResponse, status_code=200)
def signup(body : SignupRequest):
    global user_counter
    user_counter += 1
    # Making User Body
    user = {
        "id" : user_counter,
        "username" : body.username,
        "email" : body.email,
        "password" : body.password
    }

    user_db[user_counter] = user
    return UserResponse(id= user["id"], username=user["username"], email=user["email"])

@app.post("/auth/login", response_model=LoginResponse)
def login(body: Login):
    for u in user_db.values():
        if u["email"] == body.email and u["password"] == body.password:
            token = create_access_token(data={"sub": str(u["id"])})
            return LoginResponse(token=token, user_id=u["id"], username=u["username"])
    raise HTTPException(status_code=401, detail="Invalid email or password Provide")

# Task Endpoint
VALID_STATUSES = {"Open","In Progress","Completed"}

@app.post("/tasks", response_model=TaskResposne, status_code=201)
def create_task(body: TaskCreate, user_id: int = Depends(get_current_user_id)):
    global task_counter
    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid Status. Choose From {VALID_STATUSES}")
    task_counter += 1
    task= {
        "id": task_counter,
        "user_id": user_id,
        "title": body.title,
        "description": body.description,
        "status": body.status
    }
    task_db[task_counter] = task
    return task

@app.get("/tasks", response_model=List[TaskResposne])
def get_tasks(status: Optional[str] = None, user_id: int = Depends(get_current_user_id)):
    result = [t for t in task_db.values() if t["user_id"]==user_id]
    if status and status in VALID_STATUSES:
        result = [t for t in result if t["status"] == status]
    return result

@app.put("/task/{task_id}", response_model=TaskResposne)
def update_task(task_id : int, body : TaskUpdate, user_id: int = Depends(get_current_user_id)):
    task = task_db.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="No task to be deleted Becase it is not there")
    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="You are not the owner of this task")
    if body.title is not None:
        task["title"] = body.title
    if body.description is not None:
        task["description"] = body.description
    if body.status is not None:
        if body.status not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail="Invalid Input Status")
        task["status"] = body.status
    return task



@app.delete("/task/{task_id}", status_code=200)
def delete_task(task_id: int, user_id: int = Depends(get_current_user_id)):
    task = task_db.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="No task to be deleted Becase it is not there")
    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="You are not the owner of this task")
    del task_db[task_id]