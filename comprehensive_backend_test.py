#!/usr/bin/env python3
import requests
import json
import sys
from datetime import datetime, timedelta

# Use local URL for testing
BACKEND_URL = "http://localhost:8001/api"

def clean_test_data():
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

def test_transaction_crud():
    print("\n=== Testing Transaction CRUD API ===")
    results = {}
    
    # Create transaction
    print("Testing transaction creation...")
    test_transaction = {
        "type": "income",
        "category": "Salary",
        "amount": 2500.00,
        "description": "Monthly salary payment",
        "date": "2023-05-15"
    }
    response = requests.post(f"{BACKEND_URL}/transactions", json=test_transaction)
    if response.status_code == 200:
        transaction = response.json()
        print(f"✅ PASS - Created transaction with ID: {transaction['id']}")
        transaction_id = transaction["id"]
        results["create_transaction"] = True
    else:
        print(f"❌ FAIL - Could not create transaction: {response.text}")
        results["create_transaction"] = False
        return results
    
    # Get all transactions
    print("Testing get all transactions...")
    response = requests.get(f"{BACKEND_URL}/transactions")
    if response.status_code == 200:
        transactions = response.json()
        if len(transactions) > 0:
            print(f"✅ PASS - Retrieved {len(transactions)} transactions")
            results["get_transactions"] = True
        else:
            print("❌ FAIL - No transactions found")
            results["get_transactions"] = False
    else:
        print(f"❌ FAIL - Could not retrieve transactions: {response.text}")
        results["get_transactions"] = False
    
    # Get transaction by ID
    print("Testing get transaction by ID...")
    response = requests.get(f"{BACKEND_URL}/transactions/{transaction_id}")
    if response.status_code == 200:
        transaction = response.json()
        if transaction["id"] == transaction_id:
            print(f"✅ PASS - Retrieved transaction by ID")
            results["get_transaction_by_id"] = True
        else:
            print("❌ FAIL - Retrieved wrong transaction")
            results["get_transaction_by_id"] = False
    else:
        print(f"❌ FAIL - Could not retrieve transaction by ID: {response.text}")
        results["get_transaction_by_id"] = False
    
    # Update transaction
    print("Testing update transaction...")
    update_data = {
        "description": "Updated salary payment",
        "amount": 3000.00
    }
    response = requests.put(f"{BACKEND_URL}/transactions/{transaction_id}", json=update_data)
    if response.status_code == 200:
        updated_transaction = response.json()
        if (updated_transaction["description"] == update_data["description"] and 
            updated_transaction["amount"] == update_data["amount"]):
            print("✅ PASS - Updated transaction successfully")
            results["update_transaction"] = True
        else:
            print("❌ FAIL - Transaction not updated correctly")
            results["update_transaction"] = False
    else:
        print(f"❌ FAIL - Could not update transaction: {response.text}")
        results["update_transaction"] = False
    
    # Delete transaction
    print("Testing delete transaction...")
    response = requests.delete(f"{BACKEND_URL}/transactions/{transaction_id}")
    if response.status_code == 200:
        print("✅ PASS - Deleted transaction successfully")
        results["delete_transaction"] = True
        
        # Verify deletion
        response = requests.get(f"{BACKEND_URL}/transactions/{transaction_id}")
        if response.status_code == 404:
            print("✅ PASS - Transaction no longer exists")
            results["verify_deletion"] = True
        else:
            print("❌ FAIL - Transaction still exists after deletion")
            results["verify_deletion"] = False
    else:
        print(f"❌ FAIL - Could not delete transaction: {response.text}")
        results["delete_transaction"] = False
    
    # Test error handling for non-existent transaction
    print("Testing error handling for non-existent transaction...")
    non_existent_id = "00000000-0000-0000-0000-000000000000"
    response = requests.get(f"{BACKEND_URL}/transactions/{non_existent_id}")
    if response.status_code == 404:
        print("✅ PASS - Correctly returned 404 for non-existent transaction")
        results["error_handling_get"] = True
    else:
        print(f"❌ FAIL - Did not handle non-existent transaction correctly: {response.status_code}")
        results["error_handling_get"] = False
    
    return results

def test_recurring_transaction_crud():
    print("\n=== Testing Recurring Transaction CRUD API ===")
    results = {}
    
    # Create recurring transaction
    print("Testing recurring transaction creation...")
    test_recurring = {
        "type": "income",
        "category": "Freelance",
        "amount": 500.00,
        "description": "Monthly freelance payment",
        "frequency": "monthly"
    }
    response = requests.post(f"{BACKEND_URL}/recurring", json=test_recurring)
    if response.status_code == 200:
        recurring = response.json()
        print(f"✅ PASS - Created recurring transaction with ID: {recurring['id']}")
        recurring_id = recurring["id"]
        results["create_recurring"] = True
        
        # Verify nextDate calculation
        now = datetime.now()
        next_month = now.replace(month=now.month + 1 if now.month < 12 else 1, 
                                year=now.year if now.month < 12 else now.year + 1)
        next_date = datetime.strptime(recurring["nextDate"], "%Y-%m-%d")
        if abs((next_date - next_month).days) <= 2:  # Allow 2 days difference due to month lengths
            print(f"✅ PASS - Next date calculated correctly: {recurring['nextDate']}")
            results["next_date_calculation"] = True
        else:
            print(f"❌ FAIL - Next date calculation incorrect: {recurring['nextDate']}")
            results["next_date_calculation"] = False
    else:
        print(f"❌ FAIL - Could not create recurring transaction: {response.text}")
        results["create_recurring"] = False
        return results
    
    # Get all recurring transactions
    print("Testing get all recurring transactions...")
    response = requests.get(f"{BACKEND_URL}/recurring")
    if response.status_code == 200:
        recurring_transactions = response.json()
        if len(recurring_transactions) > 0:
            print(f"✅ PASS - Retrieved {len(recurring_transactions)} recurring transactions")
            results["get_recurring_transactions"] = True
        else:
            print("❌ FAIL - No recurring transactions found")
            results["get_recurring_transactions"] = False
    else:
        print(f"❌ FAIL - Could not retrieve recurring transactions: {response.text}")
        results["get_recurring_transactions"] = False
    
    # Get recurring transaction by ID
    print("Testing get recurring transaction by ID...")
    response = requests.get(f"{BACKEND_URL}/recurring/{recurring_id}")
    if response.status_code == 200:
        recurring = response.json()
        if recurring["id"] == recurring_id:
            print(f"✅ PASS - Retrieved recurring transaction by ID")
            results["get_recurring_by_id"] = True
        else:
            print("❌ FAIL - Retrieved wrong recurring transaction")
            results["get_recurring_by_id"] = False
    else:
        print(f"❌ FAIL - Could not retrieve recurring transaction by ID: {response.text}")
        results["get_recurring_by_id"] = False
    
    # Update recurring transaction
    print("Testing update recurring transaction...")
    update_data = {
        "description": "Updated freelance payment",
        "amount": 600.00
    }
    response = requests.put(f"{BACKEND_URL}/recurring/{recurring_id}", json=update_data)
    if response.status_code == 200:
        updated_recurring = response.json()
        if (updated_recurring["description"] == update_data["description"] and 
            updated_recurring["amount"] == update_data["amount"]):
            print("✅ PASS - Updated recurring transaction successfully")
            results["update_recurring"] = True
        else:
            print("❌ FAIL - Recurring transaction not updated correctly")
            results["update_recurring"] = False
    else:
        print(f"❌ FAIL - Could not update recurring transaction: {response.text}")
        results["update_recurring"] = False
    
    # Delete recurring transaction
    print("Testing delete recurring transaction...")
    response = requests.delete(f"{BACKEND_URL}/recurring/{recurring_id}")
    if response.status_code == 200:
        print("✅ PASS - Deleted recurring transaction successfully")
        results["delete_recurring"] = True
        
        # Verify deletion
        response = requests.get(f"{BACKEND_URL}/recurring/{recurring_id}")
        if response.status_code == 404:
            print("✅ PASS - Recurring transaction no longer exists")
            results["verify_recurring_deletion"] = True
        else:
            print("❌ FAIL - Recurring transaction still exists after deletion")
            results["verify_recurring_deletion"] = False
    else:
        print(f"❌ FAIL - Could not delete recurring transaction: {response.text}")
        results["delete_recurring"] = False
    
    # Test different frequencies
    print("Testing different recurring transaction frequencies...")
    
    # Weekly
    weekly_recurring = {
        "type": "income",
        "category": "Freelance",
        "amount": 100.00,
        "description": "Weekly payment",
        "frequency": "weekly"
    }
    response = requests.post(f"{BACKEND_URL}/recurring", json=weekly_recurring)
    if response.status_code == 200:
        weekly_data = response.json()
        next_date = datetime.strptime(weekly_data["nextDate"], "%Y-%m-%d")
        today = datetime.now()
        if 6 <= (next_date - today).days <= 8:  # Allow some flexibility
            print(f"✅ PASS - Weekly frequency next date correct: {weekly_data['nextDate']}")
            results["weekly_frequency"] = True
        else:
            print(f"❌ FAIL - Weekly frequency next date incorrect: {weekly_data['nextDate']}")
            results["weekly_frequency"] = False
    else:
        print(f"❌ FAIL - Could not create weekly recurring transaction: {response.text}")
        results["weekly_frequency"] = False
    
    # Yearly
    yearly_recurring = {
        "type": "expense",
        "category": "Insurance",
        "amount": 1200.00,
        "description": "Annual insurance premium",
        "frequency": "yearly"
    }
    response = requests.post(f"{BACKEND_URL}/recurring", json=yearly_recurring)
    if response.status_code == 200:
        yearly_data = response.json()
        next_date = datetime.strptime(yearly_data["nextDate"], "%Y-%m-%d")
        today = datetime.now()
        if next_date.year == today.year + 1:
            print(f"✅ PASS - Yearly frequency next date correct: {yearly_data['nextDate']}")
            results["yearly_frequency"] = True
        else:
            print(f"❌ FAIL - Yearly frequency next date incorrect: {yearly_data['nextDate']}")
            results["yearly_frequency"] = False
    else:
        print(f"❌ FAIL - Could not create yearly recurring transaction: {response.text}")
        results["yearly_frequency"] = False
    
    return results

def test_analytics_api():
    print("\n=== Testing Analytics API ===")
    results = {}
    
    # Create test transactions for analytics
    transactions = [
        {
            "type": "income",
            "category": "Salary",
            "amount": 3000.00,
            "description": "Monthly salary",
            "date": "2023-05-01"
        },
        {
            "type": "income",
            "category": "Freelance",
            "amount": 500.00,
            "description": "Side project",
            "date": "2023-05-15"
        },
        {
            "type": "expense",
            "category": "Groceries",
            "amount": 200.00,
            "description": "Weekly groceries",
            "date": "2023-05-05"
        },
        {
            "type": "expense",
            "category": "Groceries",
            "amount": 150.00,
            "description": "Weekly groceries",
            "date": "2023-05-12"
        },
        {
            "type": "expense",
            "category": "Utilities",
            "amount": 100.00,
            "description": "Electricity bill",
            "date": "2023-05-20"
        }
    ]
    
    # Create all test transactions
    for transaction in transactions:
        requests.post(f"{BACKEND_URL}/transactions", json=transaction)
    
    # Test summary endpoint
    print("Testing analytics summary...")
    response = requests.get(f"{BACKEND_URL}/analytics/summary")
    if response.status_code == 200:
        summary = response.json()
        expected_income = 3500.00  # 3000 + 500
        expected_expenses = 450.00  # 200 + 150 + 100
        expected_balance = expected_income - expected_expenses
        
        if abs(summary["income"] - expected_income) < 0.01:
            print(f"✅ PASS - Income calculation correct: {summary['income']}")
            results["income_calculation"] = True
        else:
            print(f"❌ FAIL - Income calculation incorrect: {summary['income']} (expected {expected_income})")
            results["income_calculation"] = False
        
        if abs(summary["expenses"] - expected_expenses) < 0.01:
            print(f"✅ PASS - Expenses calculation correct: {summary['expenses']}")
            results["expenses_calculation"] = True
        else:
            print(f"❌ FAIL - Expenses calculation incorrect: {summary['expenses']} (expected {expected_expenses})")
            results["expenses_calculation"] = False
        
        if abs(summary["balance"] - expected_balance) < 0.01:
            print(f"✅ PASS - Balance calculation correct: {summary['balance']}")
            results["balance_calculation"] = True
        else:
            print(f"❌ FAIL - Balance calculation incorrect: {summary['balance']} (expected {expected_balance})")
            results["balance_calculation"] = False
    else:
        print(f"❌ FAIL - Could not retrieve analytics summary: {response.text}")
        results["analytics_summary"] = False
    
    # Test categories endpoint
    print("Testing analytics categories...")
    response = requests.get(f"{BACKEND_URL}/analytics/categories")
    if response.status_code == 200:
        categories = response.json()
        
        # Should have 3 categories: Salary, Freelance, Groceries, Utilities
        if len(categories) == 3:
            print(f"✅ PASS - Retrieved correct number of categories: {len(categories)}")
            results["categories_count"] = True
        else:
            print(f"❌ FAIL - Retrieved incorrect number of categories: {len(categories)} (expected 3)")
            results["categories_count"] = False
        
        # Check individual categories
        salary_category = next((c for c in categories if c["category"] == "Salary"), None)
        freelance_category = next((c for c in categories if c["category"] == "Freelance"), None)
        groceries_category = next((c for c in categories if c["category"] == "Groceries"), None)
        utilities_category = next((c for c in categories if c["category"] == "Utilities"), None)
        
        if salary_category and abs(salary_category["income"] - 3000.00) < 0.01:
            print(f"✅ PASS - Salary category income correct: {salary_category['income']}")
            results["salary_category"] = True
        else:
            print(f"❌ FAIL - Salary category income incorrect or missing")
            results["salary_category"] = False
        
        if freelance_category and abs(freelance_category["income"] - 500.00) < 0.01:
            print(f"✅ PASS - Freelance category income correct: {freelance_category['income']}")
            results["freelance_category"] = True
        else:
            print(f"❌ FAIL - Freelance category income incorrect or missing")
            results["freelance_category"] = False
        
        if groceries_category and abs(groceries_category["expense"] - 350.00) < 0.01:
            print(f"✅ PASS - Groceries category expense correct: {groceries_category['expense']}")
            results["groceries_category"] = True
        else:
            print(f"❌ FAIL - Groceries category expense incorrect or missing")
            results["groceries_category"] = False
        
        if utilities_category and abs(utilities_category["expense"] - 100.00) < 0.01:
            print(f"✅ PASS - Utilities category expense correct: {utilities_category['expense']}")
            results["utilities_category"] = True
        else:
            print(f"❌ FAIL - Utilities category expense incorrect or missing")
            results["utilities_category"] = False
    else:
        print(f"❌ FAIL - Could not retrieve analytics categories: {response.text}")
        results["analytics_categories"] = False
    
    return results

def test_mongodb_integration():
    print("\n=== Testing MongoDB Integration ===")
    results = {}
    
    # Clean up any existing data
    clean_test_data()
    
    # Test data persistence by creating multiple transactions
    print("Testing data persistence...")
    transaction1 = {
        "type": "income",
        "category": "Salary",
        "amount": 3000.00,
        "description": "Monthly salary",
        "date": "2023-05-01"
    }
    transaction2 = {
        "type": "expense",
        "category": "Rent",
        "amount": 1200.00,
        "description": "Monthly rent",
        "date": "2023-05-02"
    }
    
    # Create first transaction
    response = requests.post(f"{BACKEND_URL}/transactions", json=transaction1)
    if response.status_code == 200:
        transaction1_id = response.json()["id"]
        print(f"✅ PASS - Created first transaction with ID: {transaction1_id}")
    else:
        print(f"❌ FAIL - Could not create first transaction: {response.text}")
        results["create_transaction1"] = False
        return results
    
    # Create second transaction
    response = requests.post(f"{BACKEND_URL}/transactions", json=transaction2)
    if response.status_code == 200:
        transaction2_id = response.json()["id"]
        print(f"✅ PASS - Created second transaction with ID: {transaction2_id}")
    else:
        print(f"❌ FAIL - Could not create second transaction: {response.text}")
        results["create_transaction2"] = False
        return results
    
    # Verify both transactions are retrievable
    response = requests.get(f"{BACKEND_URL}/transactions")
    if response.status_code == 200:
        transactions = response.json()
        if len(transactions) == 2:
            print(f"✅ PASS - Retrieved both transactions")
            results["retrieve_both_transactions"] = True
        else:
            print(f"❌ FAIL - Did not retrieve both transactions: found {len(transactions)}")
            results["retrieve_both_transactions"] = False
    else:
        print(f"❌ FAIL - Could not retrieve transactions: {response.text}")
        results["retrieve_transactions"] = False
    
    # Delete one transaction and verify the other still exists
    response = requests.delete(f"{BACKEND_URL}/transactions/{transaction1_id}")
    if response.status_code == 200:
        print(f"✅ PASS - Deleted first transaction")
        
        # Verify first transaction is gone
        response = requests.get(f"{BACKEND_URL}/transactions/{transaction1_id}")
        if response.status_code == 404:
            print(f"✅ PASS - First transaction no longer exists")
            results["delete_verification"] = True
        else:
            print(f"❌ FAIL - First transaction still exists after deletion")
            results["delete_verification"] = False
        
        # Verify second transaction still exists
        response = requests.get(f"{BACKEND_URL}/transactions/{transaction2_id}")
        if response.status_code == 200:
            print(f"✅ PASS - Second transaction still exists")
            results["persistence_after_delete"] = True
        else:
            print(f"❌ FAIL - Second transaction no longer exists")
            results["persistence_after_delete"] = False
    else:
        print(f"❌ FAIL - Could not delete first transaction: {response.text}")
        results["delete_transaction"] = False
    
    return results

def run_all_tests():
    print("=== STARTING COMPREHENSIVE BACKEND TESTS ===")
    
    # Clean up any existing test data
    clean_test_data()
    
    # Run all test suites
    transaction_results = test_transaction_crud()
    recurring_results = test_recurring_transaction_crud()
    analytics_results = test_analytics_api()
    mongodb_results = test_mongodb_integration()
    
    # Combine all results
    all_results = {
        **transaction_results,
        **recurring_results,
        **analytics_results,
        **mongodb_results
    }
    
    # Print overall summary
    print("\n=== OVERALL TEST RESULTS SUMMARY ===")
    passed = sum(1 for result in all_results.values() if result)
    failed = sum(1 for result in all_results.values() if not result)
    total = len(all_results)
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed} ({passed/total*100:.1f}%)")
    print(f"Failed: {failed} ({failed/total*100:.1f}%)")
    
    if failed == 0:
        print("\n✅ ALL TESTS PASSED! The backend API is working correctly.")
    else:
        print(f"\n❌ {failed} TESTS FAILED. Please check the detailed results above.")
    
    # Return overall success
    return failed == 0

if __name__ == "__main__":
    print(f"Testing Budget Planner API at: {BACKEND_URL}")
    success = run_all_tests()
    sys.exit(0 if success else 1)