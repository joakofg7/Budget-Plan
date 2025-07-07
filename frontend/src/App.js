import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import RecurringTransactions from "./components/RecurringTransactions";
import { Toaster } from "./components/ui/toaster";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch recurring transactions from backend
  const fetchRecurringTransactions = async () => {
    try {
      const response = await axios.get(`${API}/recurring`);
      setRecurringTransactions(response.data);
    } catch (error) {
      console.error("Error fetching recurring transactions:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchRecurringTransactions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const response = await axios.post(`${API}/transactions`, transaction);
      setTransactions(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const response = await axios.put(`${API}/transactions/${id}`, updatedTransaction);
      setTransactions(prev => prev.map(t => t.id === id ? response.data : t));
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API}/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  const addRecurringTransaction = async (recurringTransaction) => {
    try {
      const response = await axios.post(`${API}/recurring`, recurringTransaction);
      setRecurringTransactions(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding recurring transaction:", error);
      throw error;
    }
  };

  const updateRecurringTransaction = async (id, updatedRecurring) => {
    try {
      const response = await axios.put(`${API}/recurring/${id}`, updatedRecurring);
      setRecurringTransactions(prev => prev.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (error) {
      console.error("Error updating recurring transaction:", error);
      throw error;
    }
  };

  const deleteRecurringTransaction = async (id) => {
    try {
      await axios.delete(`${API}/recurring/${id}`);
      setRecurringTransactions(prev => prev.filter(r => r.id !== id));
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
        </div>
      </div>
    );
  }

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