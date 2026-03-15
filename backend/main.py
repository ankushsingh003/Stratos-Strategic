from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import analyze, predict, report, chat, ws_signals, market

app = FastAPI(
    title="Market Intelligence Platform API",
    description="Backend services for V2 Strategy Engine (with RAG, Ensemble ML, Observability, Kafka WS)",
    version="2.0.0"
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(report.router, prefix="/api", tags=["Reporting"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(market.router, prefix="/api", tags=["Market Intelligence"])
app.include_router(ws_signals.router, tags=["Streams"])  # WS routes don't use /api prefix

@app.get("/")
def read_root():
    return {"status": "Market Intelligence API is running"}
