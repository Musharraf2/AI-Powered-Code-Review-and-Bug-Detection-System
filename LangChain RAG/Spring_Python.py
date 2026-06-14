from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
import os

app = FastAPI()

# --- GLOBAL CONFIGURATION VARIABLES ---
# Defining these globally fixes the 'Unresolved reference' errors
FAISS_INDEX_PATH = "faiss_index"

print("Initializing Ollama Embeddings...")
embeddings = OllamaEmbeddings(model="nomic-embed-text")


# --- PYDANTIC MODELS ---
class ReceiverData(BaseModel):
    id: int
    providedId: Optional[str] = "DEFAULT_ID"
    code: str
    additionalInformation: Optional[str] = "No info provided"
    processedText: Optional[str] = ""


class QueryRequest(BaseModel):
    question: str
    top_k: int = 3


# --- ENDPOINT 1: DATA INGESTION ---
@app.post("/api/ingest")
async def receive_from_spring(data: ReceiverData):
    print(f"\n[E2E Test] Received data from Spring Boot for ID: {data.id}")

    text_to_embed = data.processedText if data.processedText else data.code

    try:
        # Run your LangChain logic
        doc = Document(
            page_content=text_to_embed,
            metadata={"original_id": data.id, "provided_id": data.providedId, "raw_code": data.code}
        )
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_documents([doc])

        if os.path.exists(FAISS_INDEX_PATH):
            vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
            vector_store.add_documents(chunks)
        else:
            vector_store = FAISS.from_documents(chunks, embeddings)
        vector_store.save_local(FAISS_INDEX_PATH)

        # HARDCODED OUTPUT: This specific string will travel all the way back to Spring Boot and Postman
        return {
            "status": "Success",
            "message": f"HARDCODED OUTPUT: Python pipeline complete! Embedded {len(chunks)} chunks successfully."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Python pipeline failed: {str(e)}")


# --- ENDPOINT 2: VECTOR STORE SEARCH ---
@app.post("/api/query")
async def query_vector_store(request: QueryRequest):
    print(f"\n[Search] Received query: '{request.question}'")

    if not os.path.exists(FAISS_INDEX_PATH):
        raise HTTPException(status_code=404, detail="Vector store index not found. Please ingest documents first.")

    try:
        db = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
        matched_docs = db.similarity_search(request.question, k=request.top_k)

        results = []
        for doc in matched_docs:
            results.append({
                "matched_text": doc.page_content,
                "metadata": {
                    "db_id": doc.metadata.get("original_id"),
                    "spring_id": doc.metadata.get("provided_id"),
                    "associated_code": doc.metadata.get("raw_code"),
                    "extra_info": doc.metadata.get("additional_info")
                }
            })

        return {"status": "Success", "query": request.question, "matches": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search pipeline error: {str(e)}")