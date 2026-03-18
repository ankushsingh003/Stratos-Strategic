from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import dotenv
import os

# Load environment variables from .env
dotenv.load_dotenv()

from backend.routers import analyze, predict, report, chat, ws_signals, market, rag

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
app.include_router(rag.router, prefix="/api/rag", tags=["Knowledge RAG"])
app.include_router(ws_signals.router, tags=["Streams"])  # WS routes don't use /api prefix

from backend.services.market_engine.intelligence_service import intelligence_service

@app.get("/api/intelligence/full-report")
async def get_full_intelligence_report(industry: str = "Medical"):
    """
    Returns data for all 5 consultancy panels, grounded in the specified industry.
    """
    print(f"INFO: Generating full report for {industry}...")
    return await intelligence_service.get_full_report(industry=industry)

@app.get("/")
def read_root():
    return {"status": "Market Intelligence API is running"}
