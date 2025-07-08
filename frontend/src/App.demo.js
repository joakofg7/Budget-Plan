import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import RecurringTransactions from "./components/RecurringTransactions";
import { Toaster } from "./components/ui/toaster";
import { mockTransactions, mockRecurringTransactions } from "./data/mock";

// Demo version for GitHub Pages - uses mock data instead of backend API
function App() {
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and use mock data for demo
    const loadDemoData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load mock data for demo
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
      
      setLoading(false);
    };
    
    loadDemoData();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      localStorage.setItem('budgetTransactions', JSON.stringify(updatedTransactions));
      return newTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updated = {
        ...updatedTransaction,
        id,
        updated_at: new Date().toISOString()
      };
      const updatedTransactions = transactions.map(t => t.id === id ? updated : t);
      setTransactions(updatedTransactions);
      localStorage.setItem('budgetTransactions', JSON.stringify(updatedTransactions));
      return updated;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem('budgetTransactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  const addRecurringTransaction = async (recurringTransaction) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate next date based on frequency
      const now = new Date();
      let nextDate;
      if (recurringTransaction.frequency === "weekly") {
        nextDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      } else if (recurringTransaction.frequency === "monthly") {
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        nextDate = nextMonth.toISOString().split('T')[0];
      } else { // yearly
        const nextYear = new Date(now);
        nextYear.setFullYear(now.getFullYear() + 1);
        nextDate = nextYear.toISOString().split('T')[0];
      }
      
      const newRecurring = {
        ...recurringTransaction,
        id: Date.now().toString(),
        nextDate: nextDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const updatedRecurring = [...recurringTransactions, newRecurring];
      setRecurringTransactions(updatedRecurring);
      localStorage.setItem('budgetRecurring', JSON.stringify(updatedRecurring));
      return newRecurring;
    } catch (error) {
      console.error("Error adding recurring transaction:", error);
      throw error;
    }
  };

  const updateRecurringTransaction = async (id, updatedRecurring) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updated = {
        ...updatedRecurring,
        id,
        updated_at: new Date().toISOString()
      };
      const updatedRecurringTransactions = recurringTransactions.map(r => r.id === id ? updated : r);
      setRecurringTransactions(updatedRecurringTransactions);
      localStorage.setItem('budgetRecurring', JSON.stringify(updatedRecurringTransactions));
      return updated;
    } catch (error) {
      console.error("Error updating recurring transaction:", error);
      throw error;
    }
  };

  const deleteRecurringTransaction = async (id) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedRecurring = recurringTransactions.filter(r => r.id !== id);
      setRecurringTransactions(updatedRecurring);
      localStorage.setItem('budgetRecurring', JSON.stringify(updatedRecurring));
    } catch (error) {
      console.error("Error deleting recurring transaction:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="App min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your budget data...</p>
          <p className="text-gray-500 text-sm mt-2">🚀 This is a demo version for GitHub Pages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 px-4">
        <p className="text-sm">
          🚀 <strong>Live Demo</strong> - This is a demo version with mock data. For the full app with backend integration, see the repository!
        </p>
      </div>
      
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