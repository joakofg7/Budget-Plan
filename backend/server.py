from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from bson import ObjectId


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Budget Planner API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Transaction(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # "income" or "expense"
    category: str
    amount: float
    description: str
    date: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TransactionCreate(BaseModel):
    type: str
    category: str
    amount: float
    description: str
    date: str

class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[str] = None

class RecurringTransaction(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # "income" or "expense"
    category: str
    amount: float
    description: str
    frequency: str  # "weekly", "monthly", "yearly"
    nextDate: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RecurringTransactionCreate(BaseModel):
    type: str
    category: str
    amount: float
    description: str
    frequency: str

class RecurringTransactionUpdate(BaseModel):
    type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    frequency: Optional[str] = None

class SummaryResponse(BaseModel):
    income: float
    expenses: float
    balance: float

class CategoryBreakdown(BaseModel):
    category: str
    income: float
    expense: float

# Helper function to convert ObjectId to string
def transaction_helper(transaction) -> dict:
    return {
        "id": transaction["id"],
        "type": transaction["type"],
        "category": transaction["category"],
        "amount": transaction["amount"],
        "description": transaction["description"],
        "date": transaction["date"],
        "created_at": transaction["created_at"],
        "updated_at": transaction["updated_at"]
    }

def recurring_transaction_helper(transaction) -> dict:
    return {
        "id": transaction["id"],
        "type": transaction["type"],
        "category": transaction["category"],
        "amount": transaction["amount"],
        "description": transaction["description"],
        "frequency": transaction["frequency"],
        "nextDate": transaction["nextDate"],
        "created_at": transaction["created_at"],
        "updated_at": transaction["updated_at"]
    }

# Routes
@api_router.get("/")
async def root():
    return {"message": "Budget Planner API is running!"}

# Transaction routes
@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    transaction_dict = transaction.dict()
    transaction_obj = Transaction(**transaction_dict)
    result = await db.transactions.insert_one(transaction_obj.dict())
    if result.inserted_id:
        return transaction_obj
    raise HTTPException(status_code=400, detail="Transaction creation failed")

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions():
    transactions = await db.transactions.find().to_list(1000)
    return [Transaction(**transaction_helper(transaction)) for transaction in transactions]

@api_router.get("/transactions/{transaction_id}", response_model=Transaction)
async def get_transaction(transaction_id: str):
    transaction = await db.transactions.find_one({"id": transaction_id})
    if transaction:
        return Transaction(**transaction_helper(transaction))
    raise HTTPException(status_code=404, detail="Transaction not found")

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: str, transaction_update: TransactionUpdate):
    update_data = {k: v for k, v in transaction_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.transactions.update_one(
        {"id": transaction_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count:
        updated_transaction = await db.transactions.find_one({"id": transaction_id})
        return Transaction(**transaction_helper(updated_transaction))
    raise HTTPException(status_code=404, detail="Transaction not found")

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str):
    result = await db.transactions.delete_one({"id": transaction_id})
    if result.deleted_count:
        return {"message": "Transaction deleted successfully"}
    raise HTTPException(status_code=404, detail="Transaction not found")

# Recurring transaction routes
@api_router.post("/recurring", response_model=RecurringTransaction)
async def create_recurring_transaction(recurring_transaction: RecurringTransactionCreate):
    recurring_dict = recurring_transaction.dict()
    # Calculate next date based on frequency
    from datetime import datetime, timedelta
    now = datetime.now()
    if recurring_dict["frequency"] == "weekly":
        next_date = (now + timedelta(weeks=1)).strftime("%Y-%m-%d")
    elif recurring_dict["frequency"] == "monthly":
        next_date = (now.replace(month=now.month + 1) if now.month < 12 else now.replace(year=now.year + 1, month=1)).strftime("%Y-%m-%d")
    else:  # yearly
        next_date = now.replace(year=now.year + 1).strftime("%Y-%m-%d")
    
    recurring_dict["nextDate"] = next_date
    recurring_obj = RecurringTransaction(**recurring_dict)
    result = await db.recurring_transactions.insert_one(recurring_obj.dict())
    if result.inserted_id:
        return recurring_obj
    raise HTTPException(status_code=400, detail="Recurring transaction creation failed")

@api_router.get("/recurring", response_model=List[RecurringTransaction])
async def get_recurring_transactions():
    recurring_transactions = await db.recurring_transactions.find().to_list(1000)
    return [RecurringTransaction(**recurring_transaction_helper(rt)) for rt in recurring_transactions]

@api_router.get("/recurring/{recurring_id}", response_model=RecurringTransaction)
async def get_recurring_transaction(recurring_id: str):
    recurring_transaction = await db.recurring_transactions.find_one({"id": recurring_id})
    if recurring_transaction:
        return RecurringTransaction(**recurring_transaction_helper(recurring_transaction))
    raise HTTPException(status_code=404, detail="Recurring transaction not found")

@api_router.put("/recurring/{recurring_id}", response_model=RecurringTransaction)
async def update_recurring_transaction(recurring_id: str, recurring_update: RecurringTransactionUpdate):
    update_data = {k: v for k, v in recurring_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.recurring_transactions.update_one(
        {"id": recurring_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count:
        updated_recurring = await db.recurring_transactions.find_one({"id": recurring_id})
        return RecurringTransaction(**recurring_transaction_helper(updated_recurring))
    raise HTTPException(status_code=404, detail="Recurring transaction not found")

@api_router.delete("/recurring/{recurring_id}")
async def delete_recurring_transaction(recurring_id: str):
    result = await db.recurring_transactions.delete_one({"id": recurring_id})
    if result.deleted_count:
        return {"message": "Recurring transaction deleted successfully"}
    raise HTTPException(status_code=404, detail="Recurring transaction not found")

# Analytics routes
@api_router.get("/analytics/summary", response_model=SummaryResponse)
async def get_summary():
    transactions = await db.transactions.find().to_list(1000)
    
    income = sum(t["amount"] for t in transactions if t["type"] == "income")
    expenses = sum(t["amount"] for t in transactions if t["type"] == "expense")
    balance = income - expenses
    
    return SummaryResponse(income=income, expenses=expenses, balance=balance)

@api_router.get("/analytics/categories", response_model=List[CategoryBreakdown])
async def get_category_breakdown():
    transactions = await db.transactions.find().to_list(1000)
    
    categories = {}
    for transaction in transactions:
        category = transaction["category"]
        if category not in categories:
            categories[category] = {"income": 0, "expense": 0}
        categories[category][transaction["type"]] += transaction["amount"]
    
    return [
        CategoryBreakdown(
            category=category,
            income=data["income"],
            expense=data["expense"]
        )
        for category, data in categories.items()
    ]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
