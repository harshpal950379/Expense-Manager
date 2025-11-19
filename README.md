# Expense & Income Manager + Smart Splitwise System

A comprehensive full-stack MERN application for managing personal finances with advanced features including expense tracking, income management, and group-based expense splitting (Splitwise-like functionality).

## Features

### 🔑 Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes

### 💸 Expense Management
- Add, edit, and delete expenses
- Categorize expenses (Food, Travel, Entertainment, Shopping, Utilities, Health, Education, Other)
- Filter by category, date range, and amount
- Tag-based organization
- Monthly expense summary with category breakdown
- Auto-categorization using keyword-based logic

### 💰 Income Management
- Track multiple income sources (Salary, Freelance, Investment, Bonus, Gift, Other)
- Add, edit, and delete income entries
- Filter by source and date range
- Monthly income summary
- Income trend analysis

### 📊 Dashboard
- Overview of total income and expenses
- Current month balance
- Category-wise expense pie chart
- Recent transactions
- Smart insights and savings rate

### 🤖 Smart Features
- **Auto-categorization**: Automatically categorizes expenses based on keywords
- **Spending insights**: Detects spending patterns and provides recommendations
- **Budget tracking**: Monitor your spending across categories

### 👥 Group Management (Splitwise-like)
- Create and manage expense groups
- Add/remove members from groups
- Share expenses within groups
- Support for equal and custom splits
- **Balance sheet** showing who owes whom
- Settle-up suggestions for quick reconciliation
- Group activity tracking

### 📥 Import/Export
- Export expenses and income to CSV
- Bulk import from CSV files
- Easy data backup and migration

### 🌙 Dark Mode
- Toggle between light and dark themes
- Preference saved to localStorage

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Context API** - State management

## Project Structure

```
Expense Manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── expenseController.js
│   │   │   ├── incomeController.js
│   │   │   ├── groupController.js
│   │   │   └── sharedExpenseController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Expense.js
│   │   │   ├── Income.js
│   │   │   ├── Group.js
│   │   │   └── SharedExpense.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   ├── incomeRoutes.js
│   │   │   ├── groupRoutes.js
│   │   │   └── sharedExpenseRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── autoCategori.js
│   │   └── server.js           # Main server file
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Groups.jsx
│   │   │   └── GroupDetails.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── tailwind.config.js
│   └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
MONGO_URI=mongodb://localhost:27017/expense-income-manager
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` if backend is on different URL:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Run frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary/monthly` - Get monthly summary

### Income
- `POST /api/income` - Create income
- `GET /api/income` - Get all income (with filters)
- `GET /api/income/:id` - Get single income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income
- `GET /api/income/summary/monthly` - Get monthly summary

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `POST /api/groups/:id/members` - Add member
- `DELETE /api/groups/:id/members/:memberId` - Remove member
- `DELETE /api/groups/:id` - Delete group

### Shared Expenses
- `POST /api/shared-expenses` - Create shared expense
- `GET /api/shared-expenses/:groupId` - Get group expenses
- `PUT /api/shared-expenses/:id` - Update shared expense
- `DELETE /api/shared-expenses/:id` - Delete shared expense
- `GET /api/shared-expenses/balance/:groupId` - Get balance sheet

## Usage

### Registration & Login
1. Open `http://localhost:5173`
2. Register with email and password
3. Login to access dashboard

### Adding Expenses
1. Go to Expenses page
2. Click "Add Expense"
3. Fill in amount, category, date, and notes
4. Optional: Add tags for organization
5. Save

### Managing Income
1. Go to Income page
2. Click "Add Income"
3. Select source (Salary, Freelance, etc.)
4. Enter amount and date
5. Save

### Creating Groups
1. Go to Groups page
2. Click "Create Group"
3. Enter group name and description
4. Save
5. Add members by their user ID
6. Add shared expenses and track settlements

### Dashboard Insights
- View monthly income vs expenses
- See spending breakdown by category
- Check current balance
- Review recent transactions
- Get savings insights

## Features in Detail

### Auto-Categorization
The system automatically categorizes expenses based on keywords:
- "Zomato", "Swiggy" → Food
- "Uber", "Ola" → Travel
- "Movie", "Netflix" → Entertainment
- Fully customizable in `autoCategori.js`

### Balance Sheet
For groups, the system calculates:
- Total amount paid by each member
- Total amount owed by each member
- Net balance (positive = owed, negative = owes)
- Optimal settlement suggestions

### Dark Mode
- Click the moon icon in navbar to toggle
- Preference automatically saved
- Automatic theme loading on app start

## Best Practices

1. **Secure API calls** - Always use tokens from localStorage
2. **Input validation** - Both frontend and backend validate data
3. **Error handling** - User-friendly error messages
4. **Responsive design** - Works on mobile and desktop
5. **Performance** - Optimized queries and lazy loading

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in `.env`
- Verify network connectivity to MongoDB

### API Connection Error
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend `.env`
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Ensure token is being sent in headers
- Check JWT_SECRET matches between requests

## Future Enhancements

- [ ] Email notifications for group expenses
- [ ] Budget planning and alerts
- [ ] Recurring expenses
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Multi-currency support
- [ ] Advanced analytics and reports
- [ ] Social sharing features
- [ ] OCR for receipt scanning
- [ ] Expense prediction using ML

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.

---

**Happy Expense Tracking! 💰**
