from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import add_identifier, check_identifier

app = FastAPI()

class IdentifierRequest(BaseModel):
    identifier: str

@app.post("/check-and-add")
async def check_and_add(request: IdentifierRequest):
    identifier = request.identifier
    if check_identifier(identifier):
        return {"isDuplicate": True, "message": "Duplicate identifier."}
    return add_identifier(identifier)
