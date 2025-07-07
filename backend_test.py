#!/usr/bin/env python3
import requests
import json
import unittest
import uuid
from datetime import datetime, timedelta

# Get the backend URL from frontend/.env
BACKEND_URL = "https://57e7edc8-0ee3-4fd3-90b6-6dcd007cecff.preview.emergentagent.com/api"

class BudgetPlannerAPITest(unittest.TestCase):
    def setUp(self):
        # Clean up any test data before each test
        self.clean_test_data()
        
        # Test data for transactions
        self.test_transaction = {
            "type": "income",
            "category": "Salary",
            "amount": 2500.00,
            "description": "Monthly salary payment",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        
        self.test_expense = {
            "type": "expense",
            "category": "Groceries",
            "amount": 150.75,
            "description": "Weekly grocery shopping",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        
        # Test data for recurring transactions
        self.test_recurring = {
            "type": "income",
            "category": "Freelance",
            "amount": 500.00,
            "description": "Monthly freelance payment",
            "frequency": "monthly"
        }
        
        self.test_recurring_expense = {
            "type": "expense",
            "category": "Subscription",
            "amount": 15.99,
            "description": "Netflix subscription",
            "frequency": "monthly"
        }
    
    def tearDown(self):
        # Clean up test data after each test
        self.clean_test_data()
    
    def clean_test_data(self):
        # Get all transactions and delete them
        response = requests.get(f"{BACKEND_URL}/transactions")
        if response.status_code == 200:
            transactions = response.json()
            for transaction in transactions:
                requests.delete(f"{BACKEND_URL}/transactions/{transaction['id']}")
        
        # Get all recurring transactions and delete them
        response = requests.get(f"{BACKEND_URL}/recurring")
        if response.status_code == 200:
            recurring_transactions = response.json()
            for transaction in recurring_transactions:
                requests.delete(f"{BACKEND_URL}/recurring/{transaction['id']}")
    
    # Transaction CRUD API Tests
    def test_transaction_crud(self):
        # Test 1: Create a transaction
        print("Testing transaction creation...")
        response = requests.post(f"{BACKEND_URL}/transactions", json=self.test_transaction)
        self.assertEqual(response.status_code, 200)
        transaction = response.json()
        self.assertEqual(transaction["type"], self.test_transaction["type"])
        self.assertEqual(transaction["category"], self.test_transaction["category"])
        self.assertEqual(transaction["amount"], self.test_transaction["amount"])
        self.assertEqual(transaction["description"], self.test_transaction["description"])
        self.assertEqual(transaction["date"], self.test_transaction["date"])
        self.assertIn("id", transaction)
        transaction_id = transaction["id"]
        
        # Test 2: Get all transactions
        print("Testing get all transactions...")
        response = requests.get(f"{BACKEND_URL}/transactions")
        self.assertEqual(response.status_code, 200)
        transactions = response.json()
        self.assertEqual(len(transactions), 1)
        
        # Test 3: Get transaction by ID
        print("Testing get transaction by ID...")
        response = requests.get(f"{BACKEND_URL}/transactions/{transaction_id}")
        self.assertEqual(response.status_code, 200)
        transaction = response.json()
        self.assertEqual(transaction["id"], transaction_id)
        
        # Test 4: Update transaction
        print("Testing transaction update...")
        update_data = {
            "description": "Updated description",
            "amount": 3000.00
        }
        response = requests.put(f"{BACKEND_URL}/transactions/{transaction_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        updated_transaction = response.json()
        self.assertEqual(updated_transaction["description"], update_data["description"])
        self.assertEqual(updated_transaction["amount"], update_data["amount"])
        
        # Test 5: Delete transaction
        print("Testing transaction deletion...")
        response = requests.delete(f"{BACKEND_URL}/transactions/{transaction_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Transaction deleted successfully")
        
        # Verify deletion
        response = requests.get(f"{BACKEND_URL}/transactions/{transaction_id}")
        self.assertEqual(response.status_code, 404)
    
    def test_transaction_error_handling(self):
        # Test 1: Get non-existent transaction
        print("Testing get non-existent transaction...")
        non_existent_id = str(uuid.uuid4())
        response = requests.get(f"{BACKEND_URL}/transactions/{non_existent_id}")
        self.assertEqual(response.status_code, 404)
        
        # Test 2: Update non-existent transaction
        print("Testing update non-existent transaction...")
        response = requests.put(f"{BACKEND_URL}/transactions/{non_existent_id}", 
                               json={"description": "This should fail"})
        self.assertEqual(response.status_code, 404)
        
        # Test 3: Delete non-existent transaction
        print("Testing delete non-existent transaction...")
        response = requests.delete(f"{BACKEND_URL}/transactions/{non_existent_id}")
        self.assertEqual(response.status_code, 404)
    
    # Recurring Transaction CRUD API Tests
    def test_recurring_transaction_crud(self):
        # Test 1: Create a recurring transaction
        print("Testing recurring transaction creation...")
        response = requests.post(f"{BACKEND_URL}/recurring", json=self.test_recurring)
        self.assertEqual(response.status_code, 200)
        recurring = response.json()
        self.assertEqual(recurring["type"], self.test_recurring["type"])
        self.assertEqual(recurring["category"], self.test_recurring["category"])
        self.assertEqual(recurring["amount"], self.test_recurring["amount"])
        self.assertEqual(recurring["description"], self.test_recurring["description"])
        self.assertEqual(recurring["frequency"], self.test_recurring["frequency"])
        self.assertIn("nextDate", recurring)
        self.assertIn("id", recurring)
        recurring_id = recurring["id"]
        
        # Test 2: Get all recurring transactions
        print("Testing get all recurring transactions...")
        response = requests.get(f"{BACKEND_URL}/recurring")
        self.assertEqual(response.status_code, 200)
        recurring_transactions = response.json()
        self.assertEqual(len(recurring_transactions), 1)
        
        # Test 3: Get recurring transaction by ID
        print("Testing get recurring transaction by ID...")
        response = requests.get(f"{BACKEND_URL}/recurring/{recurring_id}")
        self.assertEqual(response.status_code, 200)
        recurring = response.json()
        self.assertEqual(recurring["id"], recurring_id)
        
        # Test 4: Update recurring transaction
        print("Testing recurring transaction update...")
        update_data = {
            "description": "Updated recurring description",
            "amount": 600.00
        }
        response = requests.put(f"{BACKEND_URL}/recurring/{recurring_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        updated_recurring = response.json()
        self.assertEqual(updated_recurring["description"], update_data["description"])
        self.assertEqual(updated_recurring["amount"], update_data["amount"])
        
        # Test 5: Delete recurring transaction
        print("Testing recurring transaction deletion...")
        response = requests.delete(f"{BACKEND_URL}/recurring/{recurring_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Recurring transaction deleted successfully")
        
        # Verify deletion
        response = requests.get(f"{BACKEND_URL}/recurring/{recurring_id}")
        self.assertEqual(response.status_code, 404)
    
    def test_recurring_transaction_frequencies(self):
        # Test weekly frequency
        print("Testing weekly recurring transaction...")
        weekly_recurring = self.test_recurring.copy()
        weekly_recurring["frequency"] = "weekly"
        response = requests.post(f"{BACKEND_URL}/recurring", json=weekly_recurring)
        self.assertEqual(response.status_code, 200)
        weekly_data = response.json()
        
        # Verify next date is approximately 1 week from now
        next_date = datetime.strptime(weekly_data["nextDate"], "%Y-%m-%d")
        today = datetime.now()
        self.assertTrue(6 <= (next_date - today).days <= 8)
        
        # Test monthly frequency
        print("Testing monthly recurring transaction...")
        monthly_recurring = self.test_recurring.copy()
        monthly_recurring["frequency"] = "monthly"
        response = requests.post(f"{BACKEND_URL}/recurring", json=monthly_recurring)
        self.assertEqual(response.status_code, 200)
        monthly_data = response.json()
        
        # Verify next date is in the next month
        next_date = datetime.strptime(monthly_data["nextDate"], "%Y-%m-%d")
        today = datetime.now()
        if today.month == 12:
            self.assertEqual(next_date.month, 1)
            self.assertEqual(next_date.year, today.year + 1)
        else:
            self.assertEqual(next_date.month, today.month + 1)
            self.assertEqual(next_date.year, today.year)
        
        # Test yearly frequency
        print("Testing yearly recurring transaction...")
        yearly_recurring = self.test_recurring.copy()
        yearly_recurring["frequency"] = "yearly"
        response = requests.post(f"{BACKEND_URL}/recurring", json=yearly_recurring)
        self.assertEqual(response.status_code, 200)
        yearly_data = response.json()
        
        # Verify next date is in the next year
        next_date = datetime.strptime(yearly_data["nextDate"], "%Y-%m-%d")
        today = datetime.now()
        self.assertEqual(next_date.year, today.year + 1)
    
    def test_recurring_transaction_error_handling(self):
        # Test 1: Get non-existent recurring transaction
        print("Testing get non-existent recurring transaction...")
        non_existent_id = str(uuid.uuid4())
        response = requests.get(f"{BACKEND_URL}/recurring/{non_existent_id}")
        self.assertEqual(response.status_code, 404)
        
        # Test 2: Update non-existent recurring transaction
        print("Testing update non-existent recurring transaction...")
        response = requests.put(f"{BACKEND_URL}/recurring/{non_existent_id}", 
                               json={"description": "This should fail"})
        self.assertEqual(response.status_code, 404)
        
        # Test 3: Delete non-existent recurring transaction
        print("Testing delete non-existent recurring transaction...")
        response = requests.delete(f"{BACKEND_URL}/recurring/{non_existent_id}")
        self.assertEqual(response.status_code, 404)
    
    # Analytics API Tests
    def test_analytics_summary(self):
        print("Testing analytics summary...")
        # Create test transactions
        requests.post(f"{BACKEND_URL}/transactions", json=self.test_transaction)  # Income: 2500
        requests.post(f"{BACKEND_URL}/transactions", json=self.test_expense)      # Expense: 150.75
        
        # Test summary endpoint
        response = requests.get(f"{BACKEND_URL}/analytics/summary")
        self.assertEqual(response.status_code, 200)
        summary = response.json()
        
        # Verify calculations
        self.assertEqual(summary["income"], 2500.00)
        self.assertEqual(summary["expenses"], 150.75)
        self.assertEqual(summary["balance"], 2500.00 - 150.75)
    
    def test_analytics_categories(self):
        print("Testing analytics categories...")
        # Create test transactions with different categories
        requests.post(f"{BACKEND_URL}/transactions", json=self.test_transaction)  # Income: 2500, Category: Salary
        requests.post(f"{BACKEND_URL}/transactions", json=self.test_expense)      # Expense: 150.75, Category: Groceries
        
        # Add another transaction in the same category
        second_expense = self.test_expense.copy()
        second_expense["amount"] = 75.25
        requests.post(f"{BACKEND_URL}/transactions", json=second_expense)  # Expense: 75.25, Category: Groceries
        
        # Test categories endpoint
        response = requests.get(f"{BACKEND_URL}/analytics/categories")
        self.assertEqual(response.status_code, 200)
        categories = response.json()
        
        # Verify category breakdown
        self.assertEqual(len(categories), 2)  # Should have 2 categories: Salary and Groceries
        
        # Find each category in the response
        salary_category = next((c for c in categories if c["category"] == "Salary"), None)
        groceries_category = next((c for c in categories if c["category"] == "Groceries"), None)
        
        self.assertIsNotNone(salary_category)
        self.assertIsNotNone(groceries_category)
        
        # Verify amounts
        self.assertEqual(salary_category["income"], 2500.00)
        self.assertEqual(salary_category["expense"], 0)
        
        self.assertEqual(groceries_category["income"], 0)
        self.assertEqual(groceries_category["expense"], 150.75 + 75.25)
    
    # MongoDB Integration Tests
    def test_data_persistence(self):
        print("Testing data persistence...")
        # Create multiple transactions
        response1 = requests.post(f"{BACKEND_URL}/transactions", json=self.test_transaction)
        self.assertEqual(response1.status_code, 200)
        transaction1_id = response1.json()["id"]
        
        response2 = requests.post(f"{BACKEND_URL}/transactions", json=self.test_expense)
        self.assertEqual(response2.status_code, 200)
        transaction2_id = response2.json()["id"]
        
        # Verify both transactions are retrievable
        response = requests.get(f"{BACKEND_URL}/transactions")
        self.assertEqual(response.status_code, 200)
        transactions = response.json()
        self.assertEqual(len(transactions), 2)
        
        # Verify individual retrieval
        response = requests.get(f"{BACKEND_URL}/transactions/{transaction1_id}")
        self.assertEqual(response.status_code, 200)
        
        response = requests.get(f"{BACKEND_URL}/transactions/{transaction2_id}")
        self.assertEqual(response.status_code, 200)
        
        # Delete one transaction and verify the other still exists
        response = requests.delete(f"{BACKEND_URL}/transactions/{transaction1_id}")
        self.assertEqual(response.status_code, 200)
        
        response = requests.get(f"{BACKEND_URL}/transactions")
        self.assertEqual(response.status_code, 200)
        transactions = response.json()
        self.assertEqual(len(transactions), 1)
        self.assertEqual(transactions[0]["id"], transaction2_id)

if __name__ == "__main__":
    print(f"Testing Budget Planner API at: {BACKEND_URL}")
    unittest.main(verbosity=2)