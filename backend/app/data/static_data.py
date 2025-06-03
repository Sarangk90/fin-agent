from typing import List, Dict, Any, Optional

class StaticDataManager:
    """Manages static data for assets, liabilities, and expenses."""
    
    def __init__(self):
        # Asset data
        self.assets: List[Dict[str, Any]] = [
            {
                "id": "1", 
                "name": "Saving Account", 
                "valueINR": 500000.0, 
                "assetClass": "Cash / Cash Equivalent", 
                "assetType": "Savings Account", 
                "fpAssetClass": "Emergency Fund"
            },
            {
                "id": "2", 
                "name": "Shares", 
                "valueINR": 10000000.0, 
                "assetClass": "Equity", 
                "assetType": "Stocks (Direct Equity)", 
                "fpAssetClass": "Retirement"
            },
            {
                "id": "3", 
                "name": "Other Asset", 
                "valueINR": 200000.0, 
                "assetClass": "Equity", 
                "assetType": "Stocks (Direct Equity)", 
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
                "outstandingAmountINR": 3500000, 
                "interestRate": 8.5, 
                "dueDate": "2043-05-15"
            },
            {
                "id": "2", 
                "name": "Car Loan", 
                "type": "Secured Loan", 
                "outstandingAmountINR": 450000, 
                "interestRate": 9.2, 
                "dueDate": "2028-11-01"
            },
            {
                "id": "3", 
                "name": "Credit Card Due - ICICI", 
                "type": "Unsecured Loan", 
                "outstandingAmountINR": 35000, 
                "interestRate": 36.0, 
                "dueDate": "2023-11-20"
            },
            {
                "id": "4", 
                "name": "Personal Loan", 
                "type": "Unsecured Loan", 
                "outstandingAmountINR": 150000, 
                "interestRate": 14.0, 
                "dueDate": "2026-07-01"
            }
        ]
        self._next_liability_id = 5
        
        # Expense data
        self.expenses: List[Dict[str, Any]] = [
            {"id": "1", "category": "Childcare", "details": "Kid 1 school fees broken into monthly", "amount": 16667, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "2", "category": "Childcare", "details": "Kid 2 school fees broken into monthly", "amount": 16667, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "3", "category": "Food", "details": "Veg groceries food expense", "amount": 7500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "4", "category": "Food", "details": "Restaurent food expense", "amount": 10000, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "5", "category": "Helper", "details": "Helper Cook", "amount": 6500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "6", "category": "Helper", "details": "Helper Sweeping", "amount": 1000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "7", "category": "Helper", "details": "Helper Dish Washing", "amount": 1000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "8", "category": "Helper", "details": "Helper Bathroom", "amount": 1500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "9", "category": "Insurance", "details": "Medical Super Top Up", "amount": 833, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "10", "category": "Insurance", "details": "Medical", "amount": 417, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "11", "category": "Rent", "details": "House Rent", "amount": 70000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "12", "category": "EMI", "details": "House EMI", "amount": 50000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "13", "category": "Shopping", "details": "General shopping", "amount": 5000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "14", "category": "Tax", "details": "Dad Tax Filing", "amount": 1200, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "15", "category": "Tax", "details": "Mom Tax Filing", "amount": 1200, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "16", "category": "Trip", "details": "International Trip", "amount": 41667, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "17", "category": "Trip", "details": "Long Trip", "amount": 16667, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "18", "category": "Trip", "details": "Short Trip", "amount": 8333, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
            {"id": "19", "category": "Utilities", "details": "Electricity Bill", "amount": 3500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "20", "category": "Utilities", "details": "Internet Bill", "amount": 1500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "22", "category": "Utilities", "details": "Gas Bill", "amount": 750, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "23", "category": "Utilities", "details": "Dry Cleaning Bill", "amount": 500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "24", "category": "Utilities", "details": "Mom Phone Bill", "amount": 450, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "25", "category": "Utilities", "details": "Water Bill", "amount": 400, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "26", "category": "Utilities", "details": "Dad Phone Bill", "amount": 500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "27", "category": "Utilities", "details": "Ironing Bill", "amount": 500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "28", "category": "Utilities", "details": "Car Petrol Bill", "amount": 3000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
            {"id": "29", "category": "Childcare", "details": "Kid 1 school fees broken into monthly", "amount": 200000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "30", "category": "Childcare", "details": "Kid 2 school fees broken into monthly", "amount": 200000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "31", "category": "Trip", "details": "Short Trip", "amount": 100000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"},
            {"id": "32", "category": "Trip", "details": "Long Trip", "amount": 200000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"},
            {"id": "33", "category": "Trip", "details": "International Trip", "amount": 1000000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"},
            {"id": "34", "category": "Insurance", "details": "Family Medical Super Top Up Insurance", "amount": 30000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
            {"id": "35", "category": "Insurance", "details": "Family Medical Insurance", "amount": 10000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"}
        ]
        self._next_expense_id = 36
        
        # Goal data
        self.goals: List[Dict[str, Any]] = [
            {
                "id": "1",
                "name": "House Down Payment",
                "targetAmount": 2000000.0,
                "currentAmount": 500000.0,
                "targetDate": "2026-12-31",
                "priority": "high",
                "category": "House",
                "notes": "Saving for 3BHK apartment down payment"
            },
            {
                "id": "2",
                "name": "Kids Education Fund",
                "targetAmount": 1500000.0,
                "currentAmount": 300000.0,
                "targetDate": "2030-06-01",
                "priority": "high",
                "category": "Education",
                "notes": "Higher education fund for both kids"
            },
            {
                "id": "3",
                "name": "Dream Car",
                "targetAmount": 800000.0,
                "currentAmount": 150000.0,
                "targetDate": "2025-12-31",
                "priority": "medium",
                "category": "Car",
                "notes": "SUV for family trips"
            },
            {
                "id": "4",
                "name": "Emergency Fund",
                "targetAmount": 600000.0,
                "currentAmount": 450000.0,
                "targetDate": "2024-12-31",
                "priority": "high",
                "category": "Emergency Fund",
                "notes": "6 months of expenses as emergency fund"
            },
            {
                "id": "5",
                "name": "Europe Vacation",
                "targetAmount": 400000.0,
                "currentAmount": 80000.0,
                "targetDate": "2025-08-15",
                "priority": "low",
                "category": "Vacation",
                "notes": "Family trip to Europe for 2 weeks"
            },
            {
                "id": "6",
                "name": "Retirement Corpus",
                "targetAmount": 50000000.0,
                "currentAmount": 8000000.0,
                "targetDate": "2045-01-01",
                "priority": "high",
                "category": "Retirement",
                "notes": "Target retirement corpus for financial independence"
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
