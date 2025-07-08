# 💰 Budget Planner

A beautiful, modern budget tracking application that helps you manage your income and expenses with ease. Built with React and FastAPI, featuring a clean pastel UI and comprehensive financial tracking capabilities.

![Budget Planner Dashboard](https://img.shields.io/badge/Status-Active-green) ![React](https://img.shields.io/badge/React-18+-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## 🚀 Live Demo

**[🎯 Try the Live Demo](https://yourusername.github.io/budget-planner)** - Experience the full app functionality with mock data!

> **Note**: The live demo uses mock data and local storage. For the full backend-integrated version, clone and run the repository locally.

## 📸 Screenshots

### 🏠 Dashboard Overview
![Dashboard](https://user-images.githubusercontent.com/placeholder/dashboard_main.png)
*Clean, intuitive dashboard with financial summaries, time filters, and visual charts*

### 📝 Transaction Management  
![Add Transaction](https://user-images.githubusercontent.com/placeholder/add_transaction_filled.png)
*Easy-to-use forms for adding income and expenses with category selection*

### 🔄 Recurring Transactions
![Recurring Transactions](https://user-images.githubusercontent.com/placeholder/recurring_page.png)
*Manage recurring income and expenses with automatic scheduling*

### 📊 Analytics & Charts
![Charts View](https://user-images.githubusercontent.com/placeholder/charts_view.png)
*Comprehensive charts showing spending patterns and financial trends*

## ✨ Features

### 📊 **Dashboard & Analytics**
- **Real-time Overview**: Track total income, expenses, and balance at a glance
- **Visual Charts**: Interactive pie charts, bar charts, and trend lines
- **Category Breakdown**: Detailed analysis of spending patterns
- **Time Filters**: View data by current month, last 3 months, or yearly

### 💳 **Transaction Management**
- **Easy Entry**: Quick transaction input with categorization
- **Full CRUD**: Add, edit, delete, and manage all transactions
- **Smart Categories**: Predefined categories for income and expenses
- **Date Tracking**: Organize transactions by date with calendar integration

### 🔄 **Recurring Transactions**
- **Automated Tracking**: Set up weekly, monthly, or yearly recurring transactions
- **Smart Scheduling**: Automatic calculation of next due dates
- **Flexible Management**: Edit or remove recurring transactions anytime
- **Visual Indicators**: Clear frequency labels and status tracking

### 🎨 **Modern Design**
- **Pastel Theme**: Beautiful gradient color scheme with purple, pink, and blue tones
- **Responsive UI**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Micro-interactions and hover effects throughout
- **Glass Morphism**: Modern design with backdrop blur effects

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Chart Visualization** - Custom chart components

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database with Motor async driver
- **Pydantic** - Data validation and serialization
- **Python-dotenv** - Environment variable management

### DevOps & Tools
- **Docker** - Containerized development environment
- **Supervisor** - Process management
- **CORS** - Cross-origin resource sharing
- **Local Storage** - Client-side data persistence

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **Docker** (optional, for containerized setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-planner
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your backend URL
   ```

4. **Start the Application**
   ```bash
   # Start backend (from backend directory)
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   
   # Start frontend (from frontend directory)
   yarn start
   ```

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8001`
   - API Documentation: `http://localhost:8001/docs`

## 📱 Usage Guide

### Adding Transactions
1. Click **"Add Transaction"** from the dashboard
2. Select transaction type (Income/Expense)
3. Choose appropriate category
4. Enter amount and description
5. Set the transaction date
6. Click **"Add Transaction"** to save

### Managing Recurring Transactions
1. Navigate to **"Recurring"** from the dashboard
2. Click **"Add Recurring Transaction"**
3. Set up transaction details and frequency
4. The system will track next due dates automatically
5. Edit or delete recurring transactions as needed

### Viewing Analytics
- **Summary Cards**: View totals at the top of dashboard
- **Charts Section**: Analyze spending patterns with visual charts
- **Category Breakdown**: See detailed category-wise analysis
- **Time Filters**: Use dropdown to filter by different time periods

### Data Management
- All data is automatically saved
- Use edit buttons to modify existing transactions
- Delete transactions with the trash icon
- Export functionality available in settings

## 📁 Project Structure

```
budget-planner/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── Dashboard.js # Main dashboard
│   │   │   ├── TransactionForm.js
│   │   │   ├── RecurringTransactions.js
│   │   │   └── Charts.js    # Chart components
│   │   ├── data/           # Mock data and utilities
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.js          # Main App component
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── backend/                 # FastAPI backend application
│   ├── server.py           # Main FastAPI application
│   ├── models/             # Pydantic models
│   ├── routes/             # API route handlers
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
└── README.md              # Project documentation
```

## 🎯 Key Features Deep Dive

### Transaction Categories
- **Income**: Salary, Freelance, Investment, Business, Other
- **Expenses**: Food, Transportation, Entertainment, Bills, Healthcare, Shopping, Other

### Chart Types
- **Expense Pie Chart**: Visual breakdown of spending by category
- **Income Pie Chart**: Distribution of income sources
- **Monthly Bar Chart**: Income vs expenses comparison
- **Balance Trend**: Track financial progress over time

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet-Friendly**: Perfect layout for tablet usage
- **Desktop Enhanced**: Full-featured desktop experience

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Recurring Transactions
- `GET /api/recurring` - Get recurring transactions
- `POST /api/recurring` - Create recurring transaction
- `PUT /api/recurring/{id}` - Update recurring transaction
- `DELETE /api/recurring/{id}` - Delete recurring transaction

### Analytics
- `GET /api/analytics/summary` - Get financial summary
- `GET /api/analytics/categories` - Get category breakdown
- `GET /api/analytics/trends` - Get trend data

## 🚀 Deployment

### GitHub Pages Demo Setup

1. **Fork/Clone this repository**
2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as source
3. **Update the homepage URL** in `package.demo.json`:
   ```json
   "homepage": "https://yourusername.github.io/budget-planner"
   ```
4. **Push to main branch** - GitHub Actions will automatically deploy the demo

### Local Development

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_BACKEND_URL=http://localhost:8001

# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=budget_planner
```

### Production Deployment
1. Build the frontend: `yarn build`
2. Configure production environment variables
3. Deploy backend to your preferred platform (Heroku, Vercel, etc.)
4. Serve frontend static files
5. Configure reverse proxy (nginx recommended)

### Demo vs Full Version

| Feature | GitHub Pages Demo | Full Version |
|---------|------------------|--------------|
| **Frontend** | ✅ Complete UI | ✅ Complete UI |
| **Data Storage** | 📱 Local Storage | 🗄️ MongoDB Database |
| **Backend API** | ❌ Mock Data | ✅ FastAPI Server |
| **Real-time Sync** | ❌ Browser Only | ✅ Cross-device |
| **Scalability** | ❌ Limited | ✅ Production Ready |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Include tests for new features
- Update documentation as needed
- Ensure responsive design principles

## 📋 Roadmap

### Upcoming Features
- [ ] **Budget Goals**: Set and track monthly budget limits
- [ ] **Data Export**: Export transactions to CSV/PDF
- [ ] **Multi-Currency**: Support for different currencies
- [ ] **Bill Reminders**: Notifications for upcoming bills
- [ ] **Investment Tracking**: Track stocks and investments
- [ ] **Receipt Scanner**: OCR for receipt processing
- [ ] **Bank Integration**: Connect to bank accounts (Plaid)
- [ ] **Mobile App**: React Native mobile application

### Technical Improvements
- [ ] **Real-time Updates**: WebSocket for live data
- [ ] **Offline Support**: Progressive Web App features
- [ ] **Performance**: Code splitting and lazy loading
- [ ] **Testing**: Comprehensive test coverage
- [ ] **Docker**: Complete containerization
- [ ] **CI/CD**: Automated deployment pipeline

## 🐛 Known Issues

- None currently reported

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** in this README
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information
4. **Contact support** at [your-email@domain.com]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **FastAPI** for the high-performance backend
- **Tailwind CSS** for the utility-first styling
- **Radix UI** for accessible components
- **Lucide** for beautiful icons
- **Community** for feedback and contributions

---

**Built with ❤️ for better financial management**

![Footer](https://img.shields.io/badge/Made%20with-React%20%2B%20FastAPI-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-green) ![License](https://img.shields.io/badge/License-MIT-yellow)
