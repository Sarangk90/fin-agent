from typing import List, Dict, Any, Optional

class StaticDataManager:
    """Manages static data for assets, liabilities, and expenses."""
    
    def __init__(self):
        # Asset data
        self.assets: List[Dict[str, Any]] = [
            {
                "id": "1", 
                "name": "Primary Savings Account", 
                "valueINR": 350000.0, 
                "assetClass": "Cash / Cash Equivalent", 
                "assetType": "Savings Account", 
                "fpAssetClass": "Emergency Fund"
            },
            {
                "id": "2", 
                "name": "Equity Portfolio", 
                "valueINR": 3050000.0, 
                "assetClass": "Equity", 
                "assetType": "Stocks (Direct Equity)", 
                "fpAssetClass": "Retirement"
            },
            {
                "id": "3", 
                "name": "Mutual Funds SIP", 
                "valueINR": 5500000.0, 
                "assetClass": "Equity", 
                "assetType": "Equity Mutual Fund", 
                "fpAssetClass": "Retirement"
            }
        ]
        self._next_asset_id = 4
        
        # Liability data
        self.liabilities: List[Dict[str, Any]] = [
            {
                "id": "1", 
                "name": "Home Loan", 
                "type": "Secured Loan", 
                "outstandingAmountINR": 2800000, 
                "interestRate": 8.75, 
                "dueDate": "2044-03-20"
            },
            {
                "id": "2", 
                "name": "Car Loan", 
                "type": "Secured Loan", 
                "outstandingAmountINR": 320000, 
                "interestRate": 9.5, 
                "dueDate": "2027-08-15"
            },
            {
                "id": "3", 
                "name": "Credit Card - HDFC", 
                "type": "Unsecured Loan", 
                "outstandingAmountINR": 28000, 
                "interestRate": 42.0, 
                "dueDate": "2024-01-15"
            }
        ]
        self._next_liability_id = 5
        
        # Expense data
        self.expenses: List[Dict[str, Any]] = [
            {"id": "1", "category": "Food", "details": "Groceries and household items", "amount": 8500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "2", "category": "Food", "details": "Dining out and food delivery", "amount": 6500, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "3", "category": "Housing", "details": "Apartment rent", "amount": 35000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "4", "category": "EMI", "details": "Home loan EMI", "amount": 42000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "5", "category": "EMI", "details": "Car loan EMI", "amount": 18500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "6", "category": "Transportation", "details": "Fuel and vehicle maintenance", "amount": 4500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "7", "category": "Transportation", "details": "Cab rides and public transport", "amount": 2800, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "8", "category": "Utilities", "details": "Electricity bill", "amount": 2800, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "9", "category": "Utilities", "details": "Internet and cable", "amount": 1800, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "10", "category": "Utilities", "details": "Mobile phone bill", "amount": 850, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "11", "category": "Utilities", "details": "Gas cylinder", "amount": 900, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "12", "category": "Utilities", "details": "Water bill", "amount": 450, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "13", "category": "Healthcare", "details": "Medical expenses and medicines", "amount": 2500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "14", "category": "Insurance", "details": "Health insurance premium", "amount": 1250, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "15", "category": "Insurance", "details": "Term life insurance", "amount": 2100, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "16", "category": "Shopping", "details": "Clothing and personal items", "amount": 4200, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "17", "category": "Entertainment", "details": "Movies, streaming, and hobbies", "amount": 3500, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "18", "category": "Professional", "details": "Courses and certifications", "amount": 5000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "19", "category": "Household", "details": "Cleaning and maintenance", "amount": 2200, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "20", "category": "Travel", "details": "Weekend trips and local travel", "amount": 8000, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "21", "category": "Savings", "details": "SIP investments", "amount": 15000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "22", "category": "Savings", "details": "PPF contribution", "amount": 12500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "23", "category": "Family", "details": "Parents support", "amount": 8000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "24", "category": "Insurance", "details": "Health insurance premium", "amount": 15000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "25", "category": "Insurance", "details": "Term life insurance", "amount": 25000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "26", "category": "Insurance", "details": "Vehicle insurance", "amount": 12000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "27", "category": "Travel", "details": "Annual vacation", "amount": 120000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"},
            {"id": "28", "category": "Professional", "details": "Annual conference and training", "amount": 35000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "29", "category": "Tax", "details": "Income tax and professional fees", "amount": 25000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "30", "category": "Gifts", "details": "Festival and birthday gifts", "amount": 18000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"}
        ]
        self._next_expense_id = 36
        
        # Goal data
        self.goals: List[Dict[str, Any]] = [
            {
                "id": "1",
                "name": "Emergency Fund",
                "targetAmount": 500000.0,
                "currentAmount": 350000.0,
                "targetDate": "2024-12-31",
                "priority": "high",
                "category": "Emergency Fund",
                "notes": "6 months of expenses as safety net"
            },
            {
                "id": "2",
                "name": "New Laptop Fund",
                "targetAmount": 150000.0,
                "currentAmount": 45000.0,
                "targetDate": "2025-06-30",
                "priority": "medium",
                "category": "Other",
                "notes": "High-end laptop for development work"
            },
            {
                "id": "3",
                "name": "Car Upgrade",
                "targetAmount": 1200000.0,
                "currentAmount": 280000.0,
                "targetDate": "2026-08-15",
                "priority": "medium",
                "category": "Car",
                "notes": "Upgrade to a better car with advanced features"
            },
            {
                "id": "4",
                "name": "International Certification",
                "targetAmount": 80000.0,
                "currentAmount": 25000.0,
                "targetDate": "2025-03-31",
                "priority": "high",
                "category": "Education",
                "notes": "AWS/Azure cloud certification and training"
            },
            {
                "id": "5",
                "name": "Japan Trip",
                "targetAmount": 250000.0,
                "currentAmount": 65000.0,
                "targetDate": "2025-12-15",
                "priority": "low",
                "category": "Vacation",
                "notes": "Solo trip to Japan for 10 days"
            }
        ]
        self._next_goal_id = 7
    
    # Asset operations
    def get_all_assets(self) -> List[Dict[str, Any]]:
        return self.assets.copy()
    
    def get_asset_by_id(self, asset_id: str) -> Optional[Dict[str, Any]]:
        return next((asset for asset in self.assets if asset["id"] == asset_id), None)
    
    def create_asset(self, asset_data: Dict[str, Any]) -> Dict[str, Any]:
        new_asset = {**asset_data, "id": str(self._next_asset_id)}
        self.assets.append(new_asset)
        self._next_asset_id += 1
        return new_asset
    
    def update_asset(self, asset_id: str, asset_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for i, asset in enumerate(self.assets):
            if asset["id"] == asset_id:
                self.assets[i] = {**asset, **asset_data, "id": asset_id}
                return self.assets[i]
        return None
    
    def delete_asset(self, asset_id: str) -> bool:
        original_length = len(self.assets)
        self.assets = [asset for asset in self.assets if asset["id"] != asset_id]
        return len(self.assets) < original_length
    
    # Liability operations
    def get_all_liabilities(self) -> List[Dict[str, Any]]:
        return self.liabilities.copy()
    
    def get_liability_by_id(self, liability_id: str) -> Optional[Dict[str, Any]]:
        return next((liability for liability in self.liabilities if liability["id"] == liability_id), None)
    
    def create_liability(self, liability_data: Dict[str, Any]) -> Dict[str, Any]:
        new_liability = {**liability_data, "id": str(self._next_liability_id)}
        self.liabilities.append(new_liability)
        self._next_liability_id += 1
        return new_liability
    
    def update_liability(self, liability_id: str, liability_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for i, liability in enumerate(self.liabilities):
            if liability["id"] == liability_id:
                self.liabilities[i] = {**liability, **liability_data, "id": liability_id}
                return self.liabilities[i]
        return None
    
    def delete_liability(self, liability_id: str) -> bool:
        original_length = len(self.liabilities)
        self.liabilities = [liability for liability in self.liabilities if liability["id"] != liability_id]
        return len(self.liabilities) < original_length
    
    # Expense operations
    def get_all_expenses(self) -> List[Dict[str, Any]]:
        return self.expenses.copy()
    
    def get_expense_by_id(self, expense_id: str) -> Optional[Dict[str, Any]]:
        return next((expense for expense in self.expenses if expense["id"] == expense_id), None)
    
    def create_expense(self, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        new_expense = {**expense_data, "id": str(self._next_expense_id)}
        self.expenses.append(new_expense)
        self._next_expense_id += 1
        return new_expense
    
    def update_expense(self, expense_id: str, expense_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for i, expense in enumerate(self.expenses):
            if expense["id"] == expense_id:
                self.expenses[i] = {**expense, **expense_data, "id": expense_id}
                return self.expenses[i]
        return None
    
    def delete_expense(self, expense_id: str) -> bool:
        original_length = len(self.expenses)
        self.expenses = [expense for expense in self.expenses if expense["id"] != expense_id]
        return len(self.expenses) < original_length
    
    # Goal operations
    def get_all_goals(self) -> List[Dict[str, Any]]:
        return self.goals.copy()
    
    def get_goal_by_id(self, goal_id: str) -> Optional[Dict[str, Any]]:
        return next((goal for goal in self.goals if goal["id"] == goal_id), None)
    
    def create_goal(self, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        new_goal = {**goal_data, "id": str(self._next_goal_id)}
        self.goals.append(new_goal)
        self._next_goal_id += 1
        return new_goal
    
    def update_goal(self, goal_id: str, goal_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for i, goal in enumerate(self.goals):
            if goal["id"] == goal_id:
                self.goals[i] = {**goal, **goal_data, "id": goal_id}
                return self.goals[i]
        return None
    
    def delete_goal(self, goal_id: str) -> bool:
        original_length = len(self.goals)
        self.goals = [goal for goal in self.goals if goal["id"] != goal_id]
        return len(self.goals) < original_length
