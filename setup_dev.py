#!/usr/bin/env python3
"""
Development setup script for Financial Agent application.
This script will:
1. Set up the database
2. Run data migration
3. Provide instructions for running the application
"""

import asyncio
import sys
import os
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

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
            print("\n📋 Next Steps:")
            print("1. Start the backend server:")
            print("   cd backend && uvicorn main:app --reload --port 5001")
            print("\n2. In a new terminal, start the frontend:")
            print("   cd ui && npm install && npm run dev")
            print("\n3. Access the application:")
            print("   - Frontend: http://localhost:5173")
            print("   - Backend API: http://localhost:5001")
            print("   - API Docs: http://localhost:5001/docs")
            print("\n🎉 Happy coding!")
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
    if not check_requirements():
        sys.exit(1)
    
    success = await setup_database()
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
