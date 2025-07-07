import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, BarChart3, TrendingUp } from "lucide-react";

const Charts = ({ transactions }) => {
  const chartData = useMemo(() => {
    const income = transactions.filter(t => t.type === "income");
    const expenses = transactions.filter(t => t.type === "expense");
    
    const incomeByCategory = {};
    const expensesByCategory = {};
    
    income.forEach(t => {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    });
    
    expenses.forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
    
    const monthlyData = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      monthlyData[month][t.type === "income" ? "income" : "expenses"] += t.amount;
    });
    
    return { incomeByCategory, expensesByCategory, monthlyData };
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const getRandomColor = (index) => {
    const colors = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-cyan-400',
      'from-green-400 to-emerald-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
      'from-indigo-400 to-purple-400',
      'from-teal-400 to-blue-400',
      'from-orange-400 to-red-400'
    ];
    return colors[index % colors.length];
  };

  const PieChartComponent = ({ data, title, type }) => {
    const total = Object.values(data).reduce((sum, amount) => sum + amount, 0);
    const categories = Object.entries(data).sort(([,a], [,b]) => b - a);
    
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {type} data available
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map(([category, amount], index) => {
                const percentage = total > 0 ? (amount / total) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(amount)} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${getRandomColor(index)} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const BarChartComponent = ({ data }) => {
    const months = Object.keys(data);
    const maxAmount = Math.max(...months.map(month => 
      Math.max(data[month].income, data[month].expenses)
    ));
    
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {months.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No monthly data available
            </div>
          ) : (
            <div className="space-y-4">
              {months.map(month => (
                <div key={month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{month}</span>
                    <span className="text-sm text-gray-600">
                      Income: {formatCurrency(data[month].income)} | 
                      Expenses: {formatCurrency(data[month].expenses)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="text-xs text-green-600">Income</div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                          style={{ width: `${maxAmount > 0 ? (data[month].income / maxAmount) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs text-red-600">Expenses</div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="h-4 rounded-full bg-gradient-to-r from-red-400 to-pink-400 transition-all duration-500"
                          style={{ width: `${maxAmount > 0 ? (data[month].expenses / maxAmount) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const TrendLineComponent = ({ data }) => {
    const months = Object.keys(data);
    const balances = months.map(month => data[month].income - data[month].expenses);
    
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Balance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {months.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No trend data available
            </div>
          ) : (
            <div className="space-y-4">
              {months.map((month, index) => {
                const balance = balances[index];
                const isPositive = balance >= 0;
                
                return (
                  <div key={month} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{month}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(balance)}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <PieChartComponent 
        data={chartData.expensesByCategory} 
        title="Expenses by Category" 
        type="expense" 
      />
      <PieChartComponent 
        data={chartData.incomeByCategory} 
        title="Income by Category" 
        type="income" 
      />
      <BarChartComponent data={chartData.monthlyData} />
      <TrendLineComponent data={chartData.monthlyData} />
    </div>
  );
};

export default Charts;