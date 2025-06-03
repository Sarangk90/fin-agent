"""
Data migration script to move from static data to database.
This script will:
1. Create database tables
2. Create a default user
3. Migrate all existing static data to the database
"""

import asyncio
from datetime import datetime, date
from .database import create_tables, AsyncSessionLocal
from .repositories import UserRepository, AssetRepository, LiabilityRepository, ExpenseRepository, GoalRepository
from .data.static_data import StaticDataManager

def convert_string_to_date(date_string):
    """Convert string date to Python date object."""
    if date_string and isinstance(date_string, str):
        try:
            return datetime.strptime(date_string, '%Y-%m-%d').date()
        except ValueError:
            return None
    return date_string

async def migrate_static_data_to_database():
    """Migrate all static data to the database."""
    print("Starting data migration...")
    
    # Create tables
    print("Creating database tables...")
    await create_tables()
    print("✓ Database tables created")
    
    # Get static data
    static_data = StaticDataManager()
    
    async with AsyncSessionLocal() as session:
        # Create repositories
        user_repo = UserRepository(session)
        asset_repo = AssetRepository(session)
        liability_repo = LiabilityRepository(session)
        expense_repo = ExpenseRepository(session)
        goal_repo = GoalRepository(session)
        
        # Create or get default user
        print("Creating/getting default user...")
        try:
            default_user = await user_repo.create({
                "email": "default@financialagent.com",
                "name": "Default User"
            })
            print(f"✓ Created default user with ID: {default_user.id}")
        except Exception as e:
            if "UNIQUE constraint failed" in str(e):
                # Rollback the session and start fresh
                await session.rollback()
                # User already exists, get it with a fresh session
                async with AsyncSessionLocal() as fresh_session:
                    fresh_user_repo = UserRepository(fresh_session)
                    default_user = await fresh_user_repo.get_by_email("default@financialagent.com")
                    print(f"✓ Using existing default user with ID: {default_user.id}")
            else:
                raise e
        
        # Migrate assets
        print("Migrating assets...")
        assets_data = static_data.get_all_assets()
        for asset_data in assets_data:
            # Convert field names to match API expectations
            api_asset_data = {
                "name": asset_data["name"],
                "valueINR": asset_data["valueINR"],
                "assetClass": asset_data["assetClass"],
                "assetType": asset_data["assetType"],
                "fpAssetClass": asset_data["fpAssetClass"]
            }
            await asset_repo.create(api_asset_data, default_user.id)
        print(f"✓ Migrated {len(assets_data)} assets")
        
        # Migrate liabilities
        print("Migrating liabilities...")
        liabilities_data = static_data.get_all_liabilities()
        for liability_data in liabilities_data:
            # Convert field names to match API expectations
            api_liability_data = {
                "name": liability_data["name"],
                "type": liability_data["type"],
                "outstandingAmountINR": liability_data["outstandingAmountINR"],
                "interestRate": liability_data.get("interestRate"),
                "dueDate": convert_string_to_date(liability_data.get("dueDate"))
            }
            await liability_repo.create(api_liability_data, default_user.id)
        print(f"✓ Migrated {len(liabilities_data)} liabilities")
        
        # Migrate expenses
        print("Migrating expenses...")
        expenses_data = static_data.get_all_expenses()
        for expense_data in expenses_data:
            # Convert field names to match API expectations
            api_expense_data = {
                "category": expense_data["category"],
                "details": expense_data.get("details"),
                "amount": expense_data["amount"],
                "frequency": expense_data["frequency"],
                "needWant": expense_data["needWant"],
                "date": convert_string_to_date(expense_data["date"])
            }
            await expense_repo.create(api_expense_data, default_user.id)
        print(f"✓ Migrated {len(expenses_data)} expenses")
        
        # Migrate goals
        print("Migrating goals...")
        goals_data = static_data.get_all_goals()
        for goal_data in goals_data:
            # Convert field names to match API expectations
            api_goal_data = {
                "name": goal_data["name"],
                "targetAmount": goal_data["targetAmount"],
                "currentAmount": goal_data["currentAmount"],
                "targetDate": convert_string_to_date(goal_data["targetDate"]),
                "priority": goal_data["priority"],
                "category": goal_data["category"],
                "notes": goal_data.get("notes")
            }
            await goal_repo.create(api_goal_data, default_user.id)
        print(f"✓ Migrated {len(goals_data)} goals")
    
    print("✅ Data migration completed successfully!")
    print("\nMigration Summary:")
    print(f"- Created 1 default user")
    print(f"- Migrated {len(assets_data)} assets")
    print(f"- Migrated {len(liabilities_data)} liabilities")
    print(f"- Migrated {len(expenses_data)} expenses")
    print(f"- Migrated {len(goals_data)} goals")
    print("\nYou can now switch to using the database-backed services!")

async def verify_migration():
    """Verify that the migration was successful by checking data counts."""
    print("\nVerifying migration...")
    
    async with AsyncSessionLocal() as session:
        asset_repo = AssetRepository(session)
        liability_repo = LiabilityRepository(session)
        expense_repo = ExpenseRepository(session)
        goal_repo = GoalRepository(session)
        
        assets = await asset_repo.get_all(1)
        liabilities = await liability_repo.get_all(1)
        expenses = await expense_repo.get_all(1)
        goals = await goal_repo.get_all(1)
        
        print(f"✓ Found {len(assets)} assets in database")
        print(f"✓ Found {len(liabilities)} liabilities in database")
        print(f"✓ Found {len(expenses)} expenses in database")
        print(f"✓ Found {len(goals)} goals in database")
        
        return len(assets) > 0 and len(liabilities) > 0 and len(expenses) > 0 and len(goals) > 0

if __name__ == "__main__":
    asyncio.run(migrate_static_data_to_database())
    asyncio.run(verify_migration())
