export const mockTransactions = [
  {
    id: "1",
    type: "income",
    category: "Salary",
    amount: 5000,
    description: "Monthly salary",
    date: "2025-01-01"
  },
  {
    id: "2",
    type: "income",
    category: "Freelance",
    amount: 1200,
    description: "Web development project",
    date: "2025-01-05"
  },
  {
    id: "3",
    type: "expense",
    category: "Food",
    amount: 450,
    description: "Groceries",
    date: "2025-01-03"
  },
  {
    id: "4",
    type: "expense",
    category: "Transportation",
    amount: 120,
    description: "Monthly bus pass",
    date: "2025-01-02"
  },
  {
    id: "5",
    type: "expense",
    category: "Entertainment",
    amount: 80,
    description: "Movie tickets",
    date: "2025-01-10"
  },
  {
    id: "6",
    type: "expense",
    category: "Bills",
    amount: 200,
    description: "Internet bill",
    date: "2025-01-08"
  },
  {
    id: "7",
    type: "expense",
    category: "Food",
    amount: 25,
    description: "Coffee shop",
    date: "2025-01-12"
  },
  {
    id: "8",
    type: "income",
    category: "Freelance",
    amount: 800,
    description: "Logo design",
    date: "2025-01-15"
  },
  {
    id: "9",
    type: "expense",
    category: "Transportation",
    amount: 35,
    description: "Gas",
    date: "2025-01-14"
  },
  {
    id: "10",
    type: "expense",
    category: "Entertainment",
    amount: 60,
    description: "Streaming services",
    date: "2025-01-16"
  }
];

export const mockRecurringTransactions = [
  {
    id: "r1",
    type: "income",
    category: "Salary",
    amount: 5000,
    description: "Monthly salary",
    frequency: "monthly",
    nextDate: "2025-02-01"
  },
  {
    id: "r2",
    type: "expense",
    category: "Food",
    amount: 100,
    description: "Weekly groceries",
    frequency: "weekly",
    nextDate: "2025-01-20"
  },
  {
    id: "r3",
    type: "expense",
    category: "Bills",
    amount: 200,
    description: "Internet bill",
    frequency: "monthly",
    nextDate: "2025-02-08"
  },
  {
    id: "r4",
    type: "expense",
    category: "Transportation",
    amount: 120,
    description: "Monthly bus pass",
    frequency: "monthly",
    nextDate: "2025-02-02"
  }
];

export const incomeCategories = ["Salary", "Freelance", "Investment", "Business", "Other"];
export const expenseCategories = ["Food", "Transportation", "Entertainment", "Bills", "Healthcare", "Shopping", "Other"];

export const frequencyOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" }
];