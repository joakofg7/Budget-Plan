import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ArrowLeft, Save, X } from "lucide-react";
import { incomeCategories, expenseCategories } from "../data/mock";
import { useToast } from "../hooks/use-toast";

const TransactionForm = ({ transactions, onSubmit, onCancel, isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isEditing && id && transactions) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setFormData(transaction);
      }
    }
  }, [isEditing, id, transactions]);

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

      if (isEditing) {
        await onSubmit(id, transactionData);
        toast({
          title: "Transaction updated",
          description: "Your transaction has been updated successfully.",
        });
      } else {
        await onSubmit(transactionData);
        toast({
          title: "Transaction added",
          description: "Your transaction has been added successfully.",
        });
      }
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Transaction" : "Add New Transaction"}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update your transaction details" : "Record a new income or expense"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
            <Badge 
              variant={formData.type === "income" ? "default" : "secondary"}
              className={formData.type === "income" ? 
                "bg-green-100 text-green-800 border-green-300" : 
                "bg-red-100 text-red-800 border-red-300"
              }
            >
              {formData.type === "income" ? "Income" : "Expense"}
            </Badge>
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="border-purple-200 focus:border-purple-400 min-h-20"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="border-purple-200 focus:border-purple-400"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Transaction" : "Add Transaction"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/")}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;