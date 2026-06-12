from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


# 1. This matches the data Spring Boot is sending over
class ReceiverData(BaseModel):
    id: int  # Assuming Spring generates this ID
    providedId: str
    code: str
    additionalInformation: str
    processedText: str


# 2. This creates the endpoint Spring Boot is looking for (http://localhost:8000/api/ingest)
@app.post("/api/ingest")
async def receive_from_spring(data: ReceiverData):
    print(f"I received code with ID: {data.providedId} from Spring Boot!")
    print(f"Here is the formatted text ready for LangChain:\n {data.processedText}")

    # NEXT STEPS: Here is where you will turn data.processedText into
    # a LangChain Document, chunk it, and embed it!

    return {"status": "Success", "message": "Python caught the data!"}