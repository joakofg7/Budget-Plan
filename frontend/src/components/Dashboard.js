import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PlusCircle, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import Charts from "./Charts";
import { useToast } from "../hooks/use-toast";

const Dashboard = ({ transactions, recurringTransactions, onUpdateTransaction, onDeleteTransaction }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const { toast } = useToast();

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case "current-month":
        // For demo purposes, show January 2025 data when current month is selected
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === 0 && // January (0-indexed)
                 transactionDate.getFullYear() === 2025;
        });
      case "last-3-months":
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
      case "yearly":
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getFullYear() === 2025; // Show 2025 data
        });
      default:
        return transactions;
    }
  }, [transactions, selectedPeriod]);

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, balance: income - expenses };
  }, [filteredTransactions]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    filteredTransactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = { income: 0, expense: 0 };
      }
      breakdown[t.category][t.type] += t.amount;
    });
    return breakdown;
  }, [filteredTransactions]);

  const handleDelete = (id) => {
    onDeleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed successfully.",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Budget Planner</h1>
          <p className="text-gray-600">Track your income and expenses with ease</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/add-transaction">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
          <Link to="/recurring">
            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-200">
              <Calendar className="mr-2 h-4 w-4" />
              Recurring
            </Button>
          </Link>
        </div>
      </div>

      {/* Period Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-gray-700">Time Period</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full max-w-xs border-purple-200 focus:border-purple-400">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Income</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{formatCurrency(summary.income)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-100 to-pink-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Total Expenses</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800">{formatCurrency(summary.expenses)}</div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-100 to-indigo-100 border-blue-200' : 'from-orange-100 to-red-100 border-orange-200'} shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Balance</CardTitle>
            <DollarSign className={`h-5 w-5 ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              {formatCurrency(summary.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Charts transactions={filteredTransactions} />

      {/* Category Breakdown */}
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryBreakdown).map(([category, data]) => (
              <div key={category} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                {data.income > 0 && (
                  <div className="text-sm text-green-700 mb-1">
                    Income: {formatCurrency(data.income)}
                  </div>
                )}
                {data.expense > 0 && (
                  <div className="text-sm text-red-700">
                    Expense: {formatCurrency(data.expense)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={transaction.type === "income" ? "default" : "secondary"}
                    className={transaction.type === "income" ? 
                      "bg-green-100 text-green-800 border-green-300" : 
                      "bg-red-100 text-red-800 border-red-300"
                    }
                  >
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </Badge>
                  <div>
                    <div className="font-semibold text-gray-800">{transaction.description}</div>
                    <div className="text-sm text-gray-600">{transaction.category} • {formatDate(transaction.date)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/edit-transaction/${transaction.id}`}>
                      <Button variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(transaction.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected period.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;