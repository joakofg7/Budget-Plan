#!/usr/bin/env python3
import requests
import json
import sys

# Get the backend URL from frontend/.env
BACKEND_URL = "https://57e7edc8-0ee3-4fd3-90b6-6dcd007cecff.preview.emergentagent.com/api"

def test_root_endpoint():
    print("Testing root endpoint...")
    response = requests.get(f"{BACKEND_URL}/")
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_transaction_create():
    print("Testing transaction creation...")
    test_transaction = {
        "type": "income",
        "category": "Salary",
        "amount": 2500.00,
        "description": "Monthly salary payment",
        "date": "2023-05-15"
    }
    response = requests.post(f"{BACKEND_URL}/transactions", json=test_transaction)
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return True, response.json()["id"]
    else:
        print(f"Error: {response.text}")
        return False, None

def test_get_transactions():
    print("Testing get all transactions...")
    response = requests.get(f"{BACKEND_URL}/transactions")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        transactions = response.json()
        print(f"Found {len(transactions)} transactions")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_get_transaction_by_id(transaction_id):
    print(f"Testing get transaction by ID: {transaction_id}")
    response = requests.get(f"{BACKEND_URL}/transactions/{transaction_id}")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_update_transaction(transaction_id):
    print(f"Testing update transaction: {transaction_id}")
    update_data = {
        "description": "Updated description",
        "amount": 3000.00
    }
    response = requests.put(f"{BACKEND_URL}/transactions/{transaction_id}", json=update_data)
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_delete_transaction(transaction_id):
    print(f"Testing delete transaction: {transaction_id}")
    response = requests.delete(f"{BACKEND_URL}/transactions/{transaction_id}")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_recurring_transaction_create():
    print("Testing recurring transaction creation...")
    test_recurring = {
        "type": "income",
        "category": "Freelance",
        "amount": 500.00,
        "description": "Monthly freelance payment",
        "frequency": "monthly"
    }
    response = requests.post(f"{BACKEND_URL}/recurring", json=test_recurring)
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return True, response.json()["id"]
    else:
        print(f"Error: {response.text}")
        return False, None

def test_get_recurring_transactions():
    print("Testing get all recurring transactions...")
    response = requests.get(f"{BACKEND_URL}/recurring")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        transactions = response.json()
        print(f"Found {len(transactions)} recurring transactions")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_analytics_summary():
    print("Testing analytics summary...")
    response = requests.get(f"{BACKEND_URL}/analytics/summary")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_analytics_categories():
    print("Testing analytics categories...")
    response = requests.get(f"{BACKEND_URL}/analytics/categories")
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def run_all_tests():
    results = {}
    
    # Test root endpoint
    results["root_endpoint"] = test_root_endpoint()
    
    # Test transaction CRUD
    success, transaction_id = test_transaction_create()
    results["transaction_create"] = success
    
    if success:
        results["get_transactions"] = test_get_transactions()
        results["get_transaction_by_id"] = test_get_transaction_by_id(transaction_id)
        results["update_transaction"] = test_update_transaction(transaction_id)
        results["delete_transaction"] = test_delete_transaction(transaction_id)
    
    # Test recurring transactions
    success, recurring_id = test_recurring_transaction_create()
    results["recurring_transaction_create"] = success
    
    if success:
        results["get_recurring_transactions"] = test_get_recurring_transactions()
    
    # Test analytics
    results["analytics_summary"] = test_analytics_summary()
    results["analytics_categories"] = test_analytics_categories()
    
    # Print summary
    print("\n=== TEST RESULTS SUMMARY ===")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    # Return overall success
    return all(results.values())

if __name__ == "__main__":
    print(f"Testing Budget Planner API at: {BACKEND_URL}")
    success = run_all_tests()
    sys.exit(0 if success else 1)