from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from backend.services.llm_engine.gemini_client import gemini_client

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    text: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

@router.post("/chat")
async def chat_consultant(req: ChatRequest):
    """
    Universal RAG-based market intelligence consultant.
    Answers any question about any industry using Gemini AI with conversational context.
    """

    # Build conversational history context
    history_text = ""
    if req.history:
        for msg in req.history[-6:]:  # last 3 exchanges for context
            role_label = "User" if msg.role == "user" else "Vantage AI Consultant"
            history_text += f"{role_label}: {msg.text}\n"

    system_prompt = f"""You are Vantage AI — an elite market intelligence consultant combining the expertise of McKinsey, BCG, and Goldman Sachs analysts.

Your knowledge covers all industries: Oil & Gas, Finance & Banking, Pharmaceuticals, Technology, Retail, Real Estate, Aviation, Logistics, Agriculture, Media, Healthcare, Insurance, Coal & Mining, Renewable Energy, Cosmetics, and more.

### DYNAMIC CARD SURFACING (CRITICAL)
If the user's query is primarily about a specific industry vertical, you MUST append a hidden metadata tag at the VERY END of your response. 
Format: [INDUSTRY:<slug>]
Supported Slugs:
- oil (Oil & Gas)
- tech (Technology)
- pharma (Pharmaceuticals)
- cosmetics (Cosmetics)
- finance (Finance)
- retail (Retail)
- real_estate (Real Estate)
- energy (Renewable Energy)
- aviation (Aviation)
- logistics (Logistics)
- agriculture (Agriculture)
- media (Media & Entertainment)
- healthcare (Healthcare)
- insurance (Insurance)
- coal (Coal Mining)
- printing (Industrial Printing)

Example: "The oil industry is seeing high volatility... [INDUSTRY:oil]"

Guidelines:
- Be precise, data-driven, and concise
- Use real company names and real statistics where possible
- Structure answers clearly with bullet points or sections when helpful
- If asked about a specific company, provide detailed financial intelligence
- If asked about market share, give percentage breakdowns across real competitors
- Maintain conversation context from the history below

{f"Conversation history:{chr(10)}{history_text}" if history_text else ""}
User: {req.message}
Vantage AI Consultant:"""

    try:
        response = await gemini_client.generate(system_prompt, max_tokens=1500)
        # Clean up if it echoes the role label
        reply = response.strip()
        if reply.startswith("Vantage AI Consultant:"):
            reply = reply[len("Vantage AI Consultant:"):].strip()
        return {"reply": reply, "status": "success"}
    except Exception as e:
        return {"reply": f"I encountered an error processing your request: {str(e)}", "status": "error"}
