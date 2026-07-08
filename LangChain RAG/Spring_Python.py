from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
import os
import json

app = FastAPI()

# --- GLOBAL CONFIGURATION VARIABLES ---
# Defining these globally fixes the 'Unresolved reference' errors
FAISS_INDEX_PATH = "faiss_index"

print("Initializing Ollama Embeddings...")
embeddings = OllamaEmbeddings(model="nomic-embed-text")

print("Initializing ChatOllama for Code Analysis (model: qwen2.5-coder:7b)...")
llm = ChatOllama(model="qwen2.5-coder:7b", format="json", temperature=0.1)

system_prompt = (
    "You are a professional senior code reviewer and bug detection assistant.\n"
    "Analyze the provided code carefully and identify ALL bugs, logical errors, compilation warnings, "
    "syntax problems, security vulnerabilities, code quality issues, and potential improvements.\n\n"
    "The code has been formatted with line number prefixes like '1: code line'. Use these line prefixes to identify the correct line numbers.\n\n"
    "You MUST return a JSON object with the following structure:\n"
    "{\n"
    "  \"highlights\": [\n"
    "    { \"line\": 12, \"severity\": \"critical\" }\n"
    "  ],\n"
    "  \"issues\": [\n"
    "    {\n"
    "      \"id\": \"issue-1\",\n"
    "      \"agent\": \"Bug Detection\" | \"Security Agent\" | \"Code Quality\" | \"Improvement Suggestions\",\n"
    "      \"severity\": \"critical\" | \"warning\" | \"info\",\n"
    "      \"line\": 12,\n"
    "      \"title\": \"<short title describing the issue>\",\n"
    "      \"description\": \"<detailed explanation of the bug and how to fix it>\",\n"
    "      \"oldCode\": \"<exact original line or lines with the issue, WITHOUT the line number prefix>\",\n"
    "      \"newCode\": \"<exact suggested replacement line or lines, WITHOUT the line number prefix>\"\n"
    "    }\n"
    "  ],\n"
    "  \"metrics\": {\n"
    "    \"security\": 0,\n"
    "    \"bugs\": 0,\n"
    "    \"quality\": 0,\n"
    "    \"improvements\": 0\n"
    "  }\n"
    "}\n\n"
    "CRITICAL INSTRUCTIONS:\n"
    "1. Do NOT limit your review to just one issue. Find and list ALL valid problems in the code. If there are 3 issues, the \"issues\" array must have 3 objects, \"highlights\" must have 3 corresponding entries, and the metrics counts must match.\n"
    "2. Line numbers must be 1-based, pointing to the exact line number of the code line where the issue is found.\n"
    "3. The 'agent' field must match the category of the issue:\n"
    "   - 'Bug Detection': logical errors, compilation issues, runtime crash risks, bounds checks, index errors.\n"
    "   - 'Security Agent': SQL injection, hardcoded credentials, buffer overflow risks, unsafe configuration.\n"
    "   - 'Code Quality': code smells, console print statements instead of logging, long methods, naming conventions.\n"
    "   - 'Improvement Suggestions': performance bottlenecks, modern syntax alternatives, cleaner loops.\n"
    "4. Return ONLY the raw JSON object conforming to the schema. Do not include markdown code block formatting (such as ```json) in your response."
)

def analyze_code_with_llm(code: str) -> dict:
    try:
        # Prefix each line of code with its 1-based index to help LLM find exact line numbers
        lines = code.split("\n")
        numbered_code = "\n".join(f"{i+1}: {line}" for i, line in enumerate(lines))

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Here is the code to review:\n\n{numbered_code}")
        ]
        response = llm.invoke(messages)
        result = json.loads(response.content)
        result["code"] = code
        return result
    except Exception as e:
        print(f"Error calling Ollama LLM: {e}")
        # Fallback to static analyzer if LLM fails
        return analyze_code_statically(code)


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


def analyze_code_statically(code: str) -> dict:
    lines = code.split("\n")
    issues = []
    highlights = []
    
    security_count = 0
    bugs_count = 0
    quality_count = 0
    improvements_count = 0
    
    for i, line in enumerate(lines):
        line_num = i + 1
        line_lower = line.lower()
        
        # 1. SQL Injection Risk
        if ("select" in line_lower or "insert" in line_lower or "update" in line_lower or "delete" in line_lower) and \
           ("+" in line_lower or "%" in line_lower or "concat" in line_lower or "{" in line_lower):
            security_count += 1
            issues.append({
                "id": f"sec-{line_num}",
                "agent": "Security Agent",
                "severity": "critical",
                "line": line_num,
                "title": "Potential SQL Injection",
                "description": "Direct string concatenation or formatting inside a SQL query allows potential SQL injection attacks. Use parameterized queries or prepared statements instead.",
                "oldCode": line.strip(),
                "newCode": "// Use prepared statements or query builder instead, e.g.:\n// PreparedStatement stmt = conn.prepareStatement(\"SELECT * FROM users WHERE id = ?\");\n// stmt.setInt(1, id);"
            })
            highlights.append({"line": line_num, "severity": "critical"})
            
        # 2. Hardcoded Secrets
        elif any(secret_key in line_lower for secret_key in ["password =", "passwd =", "secret =", "api_key =", "apikey =", "token ="]) and \
             any(quote in line for quote in ["\"", "'"]):
            security_count += 1
            issues.append({
                "id": f"sec-secret-{line_num}",
                "agent": "Security Agent",
                "severity": "critical",
                "line": line_num,
                "title": "Hardcoded Credential / Secret Key",
                "description": "A hardcoded secret, token, or password was detected in the code source. Secrets should be retrieved from environment variables, configuration files, or a vault service.",
                "oldCode": line.strip(),
                "newCode": "String secretKey = System.getenv(\"API_SECRET_KEY\");"
            })
            highlights.append({"line": line_num, "severity": "critical"})
            
        # 3. System print statement (Code Quality)
        elif "system.out.print" in line_lower or "console.log" in line_lower or ("print(" in line_lower and "logging" not in line_lower):
            quality_count += 1
            issues.append({
                "id": f"qual-{line_num}",
                "agent": "Code Quality",
                "severity": "warning",
                "line": line_num,
                "title": "Use Loggers Instead of Console Print",
                "description": "Avoid writing direct outputs to stdout/stderr using System.out.println, console.log, or print(). Use a standard logging framework (e.g., SLF4J Logger, winston, or logging module) to support log levels, rotation, and central log management.",
                "oldCode": line.strip(),
                "newCode": "logger.info(\"Message\");"
            })
            highlights.append({"line": line_num, "severity": "warning"})
            
        # 4. Null pointer risk
        elif "." in line and not any(kw in line_lower for kw in ["if", "return", "new", "import", "package", "class", "public", "private", "protected", "void"]) and \
             any(char.isalnum() for char in line) and \
             ("getname()" in line_lower or "getvalue()" in line_lower or "user." in line_lower or "data." in line_lower):
            bugs_count += 1
            issues.append({
                "id": f"bug-{line_num}",
                "agent": "Bug Detection",
                "severity": "warning",
                "line": line_num,
                "title": "Potential Null Pointer Reference",
                "description": "Accessing properties on an object without verification could lead to a Null Pointer Exception if the base object is null.",
                "oldCode": line.strip(),
                "newCode": "if (object != null) {\n    " + line.strip() + "\n}"
            })
            highlights.append({"line": line_num, "severity": "warning"})

        # 5. Inefficient loop or standard iterator suggestions
        elif "for (int i =" in line_lower or "for i in range(" in line_lower:
            improvements_count += 1
            issues.append({
                "id": f"imp-{line_num}",
                "agent": "Improvement Suggestions",
                "severity": "info",
                "line": line_num,
                "title": "Use Modern Iterators / Collections Loop",
                "description": "Consider using modern enhanced loops, iterator stream APIs, or list comprehensions for cleaner syntax and potential memory/speed optimizations.",
                "oldCode": line.strip(),
                "newCode": "// For example, use: list.forEach(item -> process(item));"
            })
            highlights.append({"line": line_num, "severity": "info"})

    # If no issues found, add one nice improvement suggestion
    if not issues:
        improvements_count += 1
        issues.append({
            "id": "imp-1",
            "agent": "Improvement Suggestions",
            "severity": "info",
            "line": 1,
            "title": "Add Documentation / Docstrings",
            "description": "This file is clean, but could benefit from class/method level documentation explaining its responsibilities and APIs.",
            "oldCode": code.split("\n")[0][:60] if code else "",
            "newCode": "/**\n * Description of class/method responsibilities.\n */"
        })
        highlights.append({"line": 1, "severity": "info"})
        
    return {
        "code": code,
        "highlights": highlights,
        "issues": issues,
        "metrics": {
            "security": security_count,
            "bugs": bugs_count,
            "quality": quality_count,
            "improvements": improvements_count
        }
    }


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

        # Generate and return dynamic code review results
        return analyze_code_with_llm(data.code)

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