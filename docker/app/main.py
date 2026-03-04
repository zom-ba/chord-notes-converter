from fastapi import FastAPI

app = FastAPI()
@app.get("/api/predict")
def read_root():
    return {"chord_name": "C major"}
    
@app.get("/api/test")
def read_root():
    return {"message": "Hello World"}