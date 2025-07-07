import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import RecurringTransactions from "./components/RecurringTransactions";
import { mockTransactions, mockRecurringTransactions } from "./data/mock";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);

  useEffect(() => {
    // Load mock data on startup
    const savedTransactions = localStorage.getItem('budgetTransactions');
    const savedRecurring = localStorage.getItem('budgetRecurring');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(mockTransactions);
      localStorage.setItem('budgetTransactions', JSON.stringify(mockTransactions));
    }
    
    if (savedRecurring) {
      setRecurringTransactions(JSON.parse(savedRecurring));
    } else {
      setRecurringTransactions(mockRecurringTransactions);
      localStorage.setItem('budgetRecurring', JSON.stringify(mockRecurringTransactions));
    }
  }, []);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('budgetTransactions', JSON.stringify(updatedTransactions));
  };

  const updateTransaction = (id, updatedTransaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...updatedTransaction, id } : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('budgetTransactions', JSON.stringify(updatedTransactions));
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('budgetTransactions', JSON.stringify(updatedTransactions));
  };

  const addRecurringTransaction = (recurringTransaction) => {
    const newRecurring = {
      ...recurringTransaction,
      id: Date.now().toString(),
      nextDate: new Date().toISOString().split('T')[0]
    };
    const updatedRecurring = [...recurringTransactions, newRecurring];
    setRecurringTransactions(updatedRecurring);
    localStorage.setItem('budgetRecurring', JSON.stringify(updatedRecurring));
  };

  const updateRecurringTransaction = (id, updatedRecurring) => {
    const updatedRecurringTransactions = recurringTransactions.map(r => 
      r.id === id ? { ...updatedRecurring, id } : r
    );
    setRecurringTransactions(updatedRecurringTransactions);
    localStorage.setItem('budgetRecurring', JSON.stringify(updatedRecurringTransactions));
  };

  const deleteRecurringTransaction = (id) => {
    const updatedRecurring = recurringTransactions.filter(r => r.id !== id);
    setRecurringTransactions(updatedRecurring);
    localStorage.setItem('budgetRecurring', JSON.stringify(updatedRecurring));
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <BrowserRouter>
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                transactions={transactions}
                recurringTransactions={recurringTransactions}
                onUpdateTransaction={updateTransaction}
                onDeleteTransaction={deleteTransaction}
              />
            } />
            <Route path="/add-transaction" element={
              <TransactionForm 
                onSubmit={addTransaction}
                onCancel={() => window.history.back()}
              />
            } />
            <Route path="/edit-transaction/:id" element={
              <TransactionForm 
                transactions={transactions}
                onSubmit={updateTransaction}
                onCancel={() => window.history.back()}
                isEditing={true}
              />
            } />
            <Route path="/recurring" element={
              <RecurringTransactions 
                recurringTransactions={recurringTransactions}
                onAdd={addRecurringTransaction}
                onUpdate={updateRecurringTransaction}
                onDelete={deleteRecurringTransaction}
              />
            } />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;