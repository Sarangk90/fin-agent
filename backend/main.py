from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost",         # Allow your local development URL
    "http://localhost:3000",    # Common React dev port
    "http://localhost:5173",    # Added your Vite/frontend dev port
    # Add any other origins your frontend might be served from
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Pydantic model for Asset data (optional but good practice for request body validation)
class AssetIn(BaseModel):
    name: str
    valueINR: float
    assetClass: str         # E.g., Cash, Equity, Debt, Real Estate, Commodities
    assetType: str          # E.g., Savings Account, Stocks, FD, Residential Property (was "Asset Sub Class")
    fpAssetClass: str       # E.g., Emergency Fund, Retirement, Goal-Specific

class AssetOut(AssetIn):
    id: str

# Dummy data (will be replaced by database later)
# Ensure dummy data matches the new model structure
dummy_assets_db: List[AssetOut] = [
    AssetOut(id="1", name="Fixed Deposit", valueINR=50000, assetClass="Debt", assetType="Fixed Deposit (FD)", fpAssetClass="General Investment / Wealth Creation"),
    AssetOut(id="2", name="Reliance Shares", valueINR=120000, assetClass="Equity", assetType="Stocks (Direct Equity)", fpAssetClass="General Investment / Wealth Creation")
]
next_id = 3

@app.get("/api/assets", response_model=List[AssetOut])
async def get_assets():
    return dummy_assets_db

@app.post("/api/assets", response_model=AssetOut, status_code=201)
async def create_asset(asset: AssetIn):
    global next_id
    print("Received data:", asset.model_dump())
    new_asset = AssetOut(id=str(next_id), **asset.model_dump())
    dummy_assets_db.append(new_asset)
    next_id += 1
    return new_asset

# To run this app: uvicorn main:app --reload --port 5001
# Add this to your main block if you want to run it with python main.py directly
# (though uvicorn command is standard for development)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001) 