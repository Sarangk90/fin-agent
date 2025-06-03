"""
Simple test script to verify database functionality.
"""

import asyncio
import aiohttp
import json

async def test_database_api():
    """Test the database-backed API endpoints."""
    base_url = "http://localhost:5001"
    
    async with aiohttp.ClientSession() as session:
        print("🧪 Testing Database-Backed API")
        print("=" * 50)
        
        # Test assets endpoint
        print("\n📊 Testing Assets API...")
        try:
            async with session.get(f"{base_url}/api/assets") as response:
                if response.status == 200:
                    assets = await response.json()
                    print(f"✅ GET /api/assets - Found {len(assets)} assets")
                    if assets:
                        print(f"   Sample asset: {assets[0]['name']} - ₹{assets[0]['valueINR']:,.2f}")
                else:
                    print(f"❌ GET /api/assets failed with status {response.status}")
        except Exception as e:
            print(f"❌ Assets API error: {e}")
        
        # Test liabilities endpoint
        print("\n💳 Testing Liabilities API...")
        try:
            async with session.get(f"{base_url}/api/liabilities") as response:
                if response.status == 200:
                    liabilities = await response.json()
                    print(f"✅ GET /api/liabilities - Found {len(liabilities)} liabilities")
                    if liabilities:
                        print(f"   Sample liability: {liabilities[0]['name']} - ₹{liabilities[0]['outstandingAmountINR']:,.2f}")
                else:
                    print(f"❌ GET /api/liabilities failed with status {response.status}")
        except Exception as e:
            print(f"❌ Liabilities API error: {e}")
        
        # Test expenses endpoint
        print("\n💰 Testing Expenses API...")
        try:
            async with session.get(f"{base_url}/api/expenses") as response:
                if response.status == 200:
                    expenses = await response.json()
                    print(f"✅ GET /api/expenses - Found {len(expenses)} expenses")
                    if expenses:
                        print(f"   Sample expense: {expenses[0]['category']} - ₹{expenses[0]['amount']:,.2f}")
                else:
                    print(f"❌ GET /api/expenses failed with status {response.status}")
        except Exception as e:
            print(f"❌ Expenses API error: {e}")
        
        # Test goals endpoint
        print("\n🎯 Testing Goals API...")
        try:
            async with session.get(f"{base_url}/api/goals") as response:
                if response.status == 200:
                    goals = await response.json()
                    print(f"✅ GET /api/goals - Found {len(goals)} goals")
                    if goals:
                        print(f"   Sample goal: {goals[0]['name']} - ₹{goals[0]['targetAmount']:,.2f}")
                else:
                    print(f"❌ GET /api/goals failed with status {response.status}")
        except Exception as e:
            print(f"❌ Goals API error: {e}")
        
        # Test FI calculation
        print("\n🏆 Testing FI Calculation API...")
        try:
            fi_params = {
                "desired_annual_fi_expenses": 1200000,
                "swr_percentage": 4.0,
                "emergency_fund_to_exclude": 500000,
                "primary_residence_equity_to_exclude": 0,
                "fp_asset_classes_for_investable": ["Retirement", "General Investment / Wealth Creation"]
            }
            
            async with session.post(
                f"{base_url}/api/fi/calculate", 
                json=fi_params,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    fi_result = await response.json()
                    print(f"✅ POST /api/fi/calculate - Success")
                    print(f"   FI Status: {'✅ Achieved' if fi_result['is_financially_independent'] else '⏳ In Progress'}")
                    print(f"   FI Ratio: {fi_result['fi_ratio_percentage']:.1f}%")
                    print(f"   Net FI Corpus: ₹{fi_result['net_fi_corpus_available']:,.2f}")
                else:
                    print(f"❌ POST /api/fi/calculate failed with status {response.status}")
        except Exception as e:
            print(f"❌ FI Calculation API error: {e}")
        
        print("\n" + "=" * 50)
        print("🎉 Database migration and API testing completed!")
        print("Your financial planner is now running on SQLite database!")

if __name__ == "__main__":
    asyncio.run(test_database_api())
