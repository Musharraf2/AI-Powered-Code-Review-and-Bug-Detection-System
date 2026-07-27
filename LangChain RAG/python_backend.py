from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

print("Loading Ollama Embeddings.It may take a few seconds or minutes ...")
embeddings = OllamaEmbeddings(
    model="nomic-embed-text",
    dimensions=1024,
)


vector_store = None
FAISS_INDEX_PATH = "faiss_index"

def process_and_embed(doc_id: int, provided_id: str, code: str, additional_info: str, text: str):

    doc = Document(
        page_content=text,
        metadata={
            "original_id": doc_id,
            "provided_id": provided_id,
            "raw_code": code,
            "additional_info": additional_info
        }
    )

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )



    chunks = text_splitter.split_documents([doc])
    print(f"Split document {provided_id} into {len(chunks)} chunks.")


    # 3. Store chunks in FAISS
    if os.path.exists(FAISS_INDEX_PATH):
        vector_store = FAISS.load_local(
            FAISS_INDEX_PATH, embeddings,
            allow_dangerous_deserialization=True
        )
        vector_store.add_documents(chunks)
    else:
        vector_store = FAISS.from_documents(chunks, embeddings)

    vector_store.save_local(FAISS_INDEX_PATH)

    return len(chunks)

chunks_list = process_and_embed(
    doc_id=1,
    provided_id="TEST_001",
    code="def hello(): print('world')",
    additional_info="Test run data",
    text="This is the main processed text that will be chunked and embedded by Ollama."
)

print(f"Total number of chunks: {chunks_list.__sizeof__()}")


