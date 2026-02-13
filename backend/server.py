from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'datalyn_secret_key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 1 week

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ========== MODELS ==========

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessageCreate(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: str
    role: str
    content: str
    reasoning_steps: Optional[List[dict]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DashboardMetrics(BaseModel):
    mrr: float
    mrr_change: float
    active_users: int
    active_users_change: float
    conversions: int
    conversions_change: float
    churn_rate: float
    churn_rate_change: float
    chart_data: List[dict]
    anomalies: List[dict]

class SettingsUpdate(BaseModel):
    name: Optional[str] = None
    email_notifications: Optional[bool] = None
    report_schedule: Optional[str] = None

class Integration(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    connected: bool

# ========== AUTH HELPERS ==========

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        
        user = await db.users.find_one({'id': user_id}, {'_id': 0, 'password_hash': 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ========== AUTH ROUTES ==========

@api_router.post("/auth/signup", status_code=201)
async def signup(user_data: UserCreate):
    existing = await db.users.find_one({'email': user_data.email}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['password_hash'] = hash_password(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['email_notifications'] = True
    user_dict['report_schedule'] = 'weekly'
    
    await db.users.insert_one(user_dict)
    
    token = create_token(user.id)
    return {
        'token': token,
        'user': {'id': user.id, 'email': user.email, 'name': user.name}
    }

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    user = await db.users.find_one({'email': login_data.email}, {'_id': 0})
    if not user or not verify_password(login_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'])
    return {
        'token': token,
        'user': {'id': user['id'], 'email': user['email'], 'name': user['name']}
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# ========== DASHBOARD ROUTES ==========

@api_router.get("/dashboard/metrics", response_model=DashboardMetrics)
async def get_metrics(current_user: dict = Depends(get_current_user)):
    chart_data = [
        {"date": "Jan 1", "revenue": 12500},
        {"date": "Jan 3", "revenue": 13200},
        {"date": "Jan 5", "revenue": 13800},
        {"date": "Jan 7", "revenue": 14100},
        {"date": "Jan 9", "revenue": 13900},
        {"date": "Jan 11", "revenue": 15200},
        {"date": "Jan 13", "revenue": 15800},
        {"date": "Jan 15", "revenue": 16200},
        {"date": "Jan 17", "revenue": 15900},
        {"date": "Jan 19", "revenue": 16800},
        {"date": "Jan 21", "revenue": 17200},
        {"date": "Jan 23", "revenue": 17800},
        {"date": "Jan 25", "revenue": 18100},
        {"date": "Jan 27", "revenue": 18900},
        {"date": "Jan 29", "revenue": 19500},
        {"date": "Jan 31", "revenue": 20100}
    ]
    
    anomalies = [
        {
            "id": "1",
            "type": "warning",
            "title": "Conversion rate dip detected",
            "description": "Your trial-to-paid conversion dropped 12% this week. This correlates with a spike in failed payment attempts.",
            "timestamp": "2 hours ago"
        },
        {
            "id": "2",
            "type": "positive",
            "title": "MRR growth accelerating",
            "description": "Monthly recurring revenue grew 8.2% vs last month — your highest growth rate in Q1 2026.",
            "timestamp": "5 hours ago"
        },
        {
            "id": "3",
            "type": "critical",
            "title": "Churn spike in Enterprise tier",
            "description": "3 enterprise accounts churned this week (14% of segment). Exit surveys cite missing integrations.",
            "timestamp": "1 day ago"
        }
    ]
    
    return DashboardMetrics(
        mrr=20100.0,
        mrr_change=8.2,
        active_users=1847,
        active_users_change=3.4,
        conversions=89,
        conversions_change=-12.0,
        churn_rate=3.2,
        churn_rate_change=0.8,
        chart_data=chart_data,
        anomalies=anomalies
    )

# ========== CHAT ROUTES ==========

@api_router.post("/chat/message")
async def send_message(msg: ChatMessageCreate, current_user: dict = Depends(get_current_user)):
    session_id = msg.session_id or str(uuid.uuid4())
    user_id = current_user['id']
    
    user_msg = ChatMessage(
        session_id=session_id,
        user_id=user_id,
        role='user',
        content=msg.message
    )
    user_msg_dict = user_msg.model_dump()
    user_msg_dict['created_at'] = user_msg_dict['created_at'].isoformat()
    await db.chat_messages.insert_one(user_msg_dict)
    
    try:
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=session_id,
            system_message="""You are Datalyn, an expert business analyst AI. When users ask business questions, you must:
1. Break down your analysis into clear reasoning steps
2. State what data you examined
3. Identify patterns or issues
4. Provide actionable recommendations

Format your response as JSON with this structure:
{
  "summary": "Brief answer to the question",
  "reasoning_steps": [
    {"step": 1, "title": "Step title", "description": "What you did"},
    {"step": 2, "title": "Step title", "description": "What you found"},
    {"step": 3, "title": "Step title", "description": "Your recommendation"}
  ],
  "recommendation": "Clear action item"
}

Be specific and use realistic business metrics in your responses."""
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        user_message = UserMessage(text=msg.message)
        ai_response = await chat.send_message(user_message)
        
        try:
            response_data = json.loads(ai_response)
            content = response_data.get('summary', ai_response)
            reasoning_steps = response_data.get('reasoning_steps', [])
        except:
            content = ai_response
            reasoning_steps = [
                {"step": 1, "title": "Analyzed query", "description": "Processed your business question"},
                {"step": 2, "title": "Retrieved insights", "description": "Examined relevant metrics and patterns"},
                {"step": 3, "title": "Generated recommendation", "description": "Formulated actionable advice based on data"}
            ]
        
        ai_msg = ChatMessage(
            session_id=session_id,
            user_id=user_id,
            role='assistant',
            content=content,
            reasoning_steps=reasoning_steps
        )
        ai_msg_dict = ai_msg.model_dump()
        ai_msg_dict['created_at'] = ai_msg_dict['created_at'].isoformat()
        await db.chat_messages.insert_one(ai_msg_dict)
        
        return {
            'session_id': session_id,
            'message': {
                'id': ai_msg.id,
                'role': 'assistant',
                'content': content,
                'reasoning_steps': reasoning_steps,
                'created_at': ai_msg.created_at.isoformat()
            }
        }
    except Exception as e:
        logging.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, current_user: dict = Depends(get_current_user)):
    messages = await db.chat_messages.find(
        {'session_id': session_id, 'user_id': current_user['id']},
        {'_id': 0}
    ).sort('created_at', 1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at']).isoformat()
    
    return {'messages': messages}

@api_router.get("/chat/sessions")
async def get_sessions(current_user: dict = Depends(get_current_user)):
    pipeline = [
        {'$match': {'user_id': current_user['id']}},
        {'$sort': {'created_at': -1}},
        {'$group': {
            '_id': '$session_id',
            'last_message': {'$first': '$content'},
            'last_updated': {'$first': '$created_at'}
        }},
        {'$sort': {'last_updated': -1}},
        {'$limit': 20}
    ]
    
    sessions = await db.chat_messages.aggregate(pipeline).to_list(20)
    
    return {
        'sessions': [
            {
                'session_id': s['_id'],
                'preview': s['last_message'][:60] + '...' if len(s['last_message']) > 60 else s['last_message'],
                'last_updated': s['last_updated'].isoformat() if isinstance(s['last_updated'], datetime) else s['last_updated']
            }
            for s in sessions
        ]
    }

# ========== SETTINGS ROUTES ==========

@api_router.get("/settings")
async def get_settings(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({'id': current_user['id']}, {'_id': 0, 'password_hash': 0})
    return {
        'name': user.get('name'),
        'email': user.get('email'),
        'email_notifications': user.get('email_notifications', True),
        'report_schedule': user.get('report_schedule', 'weekly')
    }

@api_router.put("/settings")
async def update_settings(settings: SettingsUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    
    if update_data:
        await db.users.update_one(
            {'id': current_user['id']},
            {'$set': update_data}
        )
    
    return {'message': 'Settings updated successfully'}

# ========== INTEGRATIONS ROUTES ==========

@api_router.get("/integrations", response_model=List[Integration])
async def get_integrations(current_user: dict = Depends(get_current_user)):
    integrations = [
        Integration(id="sheets", name="Google Sheets", description="Sync data to and from Google Sheets", icon="Sheet", connected=False),
        Integration(id="quickbooks", name="QuickBooks", description="Connect your accounting data", icon="FileText", connected=False),
        Integration(id="notion", name="Notion", description="Push reports to your Notion workspace", icon="FileText", connected=False),
        Integration(id="slack", name="Slack", description="Get alerts in your Slack channels", icon="MessageSquare", connected=True),
        Integration(id="hubspot", name="HubSpot", description="Analyze your CRM and sales data", icon="Users", connected=False),
        Integration(id="stripe", name="Stripe", description="Connect payment and revenue data", icon="CreditCard", connected=True)
    ]
    return integrations

@api_router.post("/integrations/{integration_id}/toggle")
async def toggle_integration(integration_id: str, current_user: dict = Depends(get_current_user)):
    return {'message': f'Integration {integration_id} toggled', 'connected': True}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()