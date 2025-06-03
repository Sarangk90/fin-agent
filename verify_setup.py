#!/usr/bin/env python3
"""
Verification script to check if the database setup is working correctly.
"""

import asyncio
import sys
import os
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

async def verify_database():
    """Verify that the database is set up correctly."""
    print("🔍 Verifying database setup...")
    
    try:
        from app.database import AsyncSessionLocal
        from app.repositories import AssetRepository, LiabilityRepository, ExpenseRepository, GoalRepository
        
        async with AsyncSessionLocal() as session:
            asset_repo = AssetRepository(session)
            liability_repo = LiabilityRepository(session)
            expense_repo = ExpenseRepository(session)
            goal_repo = GoalRepository(session)
            
            # Check if we have data (assuming user_id = 1)
            assets = await asset_repo.get_all(1)
            liabilities = await liability_repo.get_all(1)
            expenses = await expense_repo.get_all(1)
            goals = await goal_repo.get_all(1)
            
            print(f"✅ Found {len(assets)} assets")
            print(f"✅ Found {len(liabilities)} liabilities")
            print(f"✅ Found {len(expenses)} expenses")
            print(f"✅ Found {len(goals)} goals")
            
            if len(assets) > 0 and len(liabilities) > 0 and len(expenses) > 0 and len(goals) > 0:
                print("\n🎉 Database is properly set up with sample data!")
                return True
            else:
                print("\n❌ Database exists but missing sample data. Run setup_dev.py")
                return False
                
    except Exception as e:
        print(f"❌ Database verification failed: {e}")
        print("💡 Try running: python setup_dev.py")
        return False

def check_database_file():
    """Check if database file exists."""
    db_file = Path("backend/financial_agent.db")
    if db_file.exists():
        print(f"✅ Database file exists: {db_file}")
        return True
    else:
        print(f"❌ Database file not found: {db_file}")
        return False

async def main():
    """Main verification function."""
    print("🔍 Financial Agent - Database Verification")
    print("=" * 50)
    
    if not check_database_file():
        print("💡 Run: python setup_dev.py")
        sys.exit(1)
    
    success = await verify_database()
    if not success:
        sys.exit(1)
    
    print("\n📋 Next steps:")
    print("1. cd backend && uvicorn main:app --reload --port 5001")
    print("2. cd ui && npm install && npm run dev")
    print("3. Open http://localhost:5173")

if __name__ == "__main__":
    asyncio.run(main())
