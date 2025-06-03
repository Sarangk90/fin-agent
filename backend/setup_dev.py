#!/usr/bin/env python3
"""
Development setup script for Financial Agent application.
This script can:
1. Set up the database and run data migration (default)
2. Verify existing database setup (--verify flag)
3. Reset database with fresh data (--reset flag)
"""

import asyncio
import sys
import os
import argparse
from pathlib import Path

async def setup_database():
    """Set up the database and migrate sample data."""
    print("🚀 Setting up Financial Agent Development Environment")
    print("=" * 60)
    
    try:
        # Import after adding to path
        from app.migrate_data import migrate_static_data_to_database, verify_migration
        
        print("📊 Setting up database and migrating sample data...")
        await migrate_static_data_to_database()
        
        print("\n🔍 Verifying migration...")
        success = await verify_migration()
        
        if success:
            print("\n✅ Database setup completed successfully!")
            print_next_steps()
        else:
            print("\n❌ Migration verification failed. Please check the logs above.")
            return False
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're running this from the project root directory.")
        return False
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False
    
    return True

async def verify_database():
    """Verify that the database is set up correctly."""
    print("🔍 Financial Agent - Database Verification")
    print("=" * 50)
    
    # Check if database file exists
    db_file = Path("financial_agent.db")
    if not db_file.exists():
        print(f"❌ Database file not found: {db_file}")
        print("💡 Run: python setup_dev.py")
        return False
    
    print(f"✅ Database file exists: {db_file}")
    
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
                print_next_steps()
                return True
            else:
                print("\n❌ Database exists but missing sample data.")
                print("💡 Run: python setup_dev.py --reset")
                return False
                
    except Exception as e:
        print(f"❌ Database verification failed: {e}")
        print("💡 Try running: python setup_dev.py --reset")
        return False

async def reset_database():
    """Reset the database by deleting it and setting up fresh."""
    print("🔄 Resetting Financial Agent Database")
    print("=" * 40)
    
    db_file = Path("financial_agent.db")
    if db_file.exists():
        print(f"🗑️  Removing existing database: {db_file}")
        db_file.unlink()
    
    print("🆕 Setting up fresh database...")
    return await setup_database()

def print_next_steps():
    """Print the next steps for running the application."""
    print("\n📋 Next Steps:")
    print("1. Start the backend server (from this directory):")
    print("   uvicorn main:app --reload --port 5001")
    print("\n2. In a new terminal, start the frontend:")
    print("   cd ../ui && npm install && npm run dev")
    print("\n3. Access the application:")
    print("   - Frontend: http://localhost:5173")
    print("   - Backend API: http://localhost:5001")
    print("   - API Docs: http://localhost:5001/docs")
    print("\n🎉 Happy coding!")

def check_requirements():
    """Check if required dependencies are available."""
    print("🔍 Checking requirements...")
    
    # Check if backend requirements are installed
    try:
        import fastapi
        import sqlalchemy
        print("✅ Backend dependencies found")
    except ImportError:
        print("❌ Backend dependencies missing. Please run:")
        print("   cd backend && pip install -r requirements.txt")
        return False
    
    return True

async def main():
    """Main setup function."""
    parser = argparse.ArgumentParser(
        description="Financial Agent Development Setup",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python setup_dev.py           # Set up database with sample data
  python setup_dev.py --verify  # Verify existing database setup
  python setup_dev.py --reset   # Reset database with fresh data
        """
    )
    parser.add_argument(
        "--verify", 
        action="store_true", 
        help="Verify existing database setup"
    )
    parser.add_argument(
        "--reset", 
        action="store_true", 
        help="Reset database with fresh sample data"
    )
    
    args = parser.parse_args()
    
    if not check_requirements():
        sys.exit(1)
    
    success = False
    
    if args.verify:
        success = await verify_database()
    elif args.reset:
        success = await reset_database()
    else:
        success = await setup_database()
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
