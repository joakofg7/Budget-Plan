import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, Repeat } from "lucide-react";
import { incomeCategories, expenseCategories, frequencyOptions } from "../data/mock";
import { useToast } from "../hooks/use-toast";

const RecurringTransactions = ({ recurringTransactions, onAdd, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    frequency: "monthly"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingTransaction) {
        await onUpdate(editingTransaction.id, transactionData);
        toast({
          title: "Recurring transaction updated",
          description: "Your recurring transaction has been updated successfully.",
        });
        setEditingTransaction(null);
      } else {
        await onAdd(transactionData);
        toast({
          title: "Recurring transaction added",
          description: "Your recurring transaction has been added successfully.",
        });
      }
      
      setFormData({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        frequency: "monthly"
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save recurring transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      frequency: transaction.frequency
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    onDelete(id);
    toast({
      title: "Recurring transaction deleted",
      description: "The recurring transaction has been removed successfully.",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFrequencyLabel = (frequency) => {
    return frequencyOptions.find(f => f.value === frequency)?.label || frequency;
  };

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      frequency: "monthly"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/")}
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Recurring Transactions</h1>
            <p className="text-gray-600">Manage your recurring income and expenses</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <Plus className="mr-2 h-4 w-4" />
              Add Recurring Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-700">
                {editingTransaction ? "Edit Recurring Transaction" : "Add Recurring Transaction"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Transaction Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter transaction description..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="border-purple-200 focus:border-purple-400 min-h-16"
                  required
                />
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {editingTransaction ? "Update" : "Add"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeDialog}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recurring Transactions List */}
      <div className="grid gap-4">
        {recurringTransactions.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recurring Transactions</h3>
              <p className="text-gray-500 text-center mb-6">
                Set up recurring transactions to automatically track your regular income and expenses.
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Recurring Transaction
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recurringTransactions.map((transaction) => (
              <Card key={transaction.id} className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={transaction.type === "income" ? "default" : "secondary"}
                          className={transaction.type === "income" ? 
                            "bg-green-100 text-green-800 border-green-300" : 
                            "bg-red-100 text-red-800 border-red-300"
                          }
                        >
                          {transaction.type === "income" ? "Income" : "Expense"}
                        </Badge>
                        <Badge variant="outline" className="border-purple-300 text-purple-600">
                          <Repeat className="h-3 w-3 mr-1" />
                          {getFrequencyLabel(transaction.frequency)}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-lg">{transaction.description}</div>
                        <div className="text-sm text-gray-600">
                          {transaction.category} • Next: {formatDate(transaction.nextDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-xl font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(transaction)}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringTransactions;