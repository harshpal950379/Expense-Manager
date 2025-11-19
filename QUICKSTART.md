# Quick Start Guide

## Prerequisites
- Node.js v14+ installed
- MongoDB (either local installation or MongoDB Atlas cloud account)
- Visual Studio Code or any code editor

## Step-by-Step Setup

### 1. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Windows: Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
# Install and ensure MongoDB service is running

# Or start MongoDB manually:
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string like: `mongodb+srv://user:password@cluster.mongodb.net/expense-income-manager`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd "c:\Users\harsh\OneDrive\Desktop\Expense Manager\backend"

# Install dependencies (already done)
npm install

# Create/Edit .env file with:
# MONGO_URI=mongodb://localhost:27017/expense-income-manager  (for local)
# OR
# MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/expense-income-manager (for Atlas)
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development

# Start backend server
npm run dev

# You should see: 🚀 Server running on port 5000
```

### 3. Frontend Setup

```bash
# In new terminal, navigate to frontend directory
cd "c:\Users\harsh\OneDrive\Desktop\Expense Manager\frontend"

# Install dependencies (already done)
npm install

# Start frontend dev server
npm run dev

# You should see: ➜ Local: http://localhost:5173/
```

### 4. Access Application

1. Open browser and go to `http://localhost:5173`
2. You'll be redirected to login page
3. Click "Register here" to create new account
4. Fill in:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
5. Click Register
6. You'll be logged in and redirected to Dashboard

## Testing the Application

### Test Data - Users
Create multiple accounts to test group features:
- User 1: john@example.com / password123
- User 2: jane@example.com / password123
- User 3: bob@example.com / password123

### Test Workflow

#### 1. Add Expenses
1. Go to Expenses page
2. Click "Add Expense"
3. Enter:
   - Amount: 500
   - Category: Food
   - Note: Lunch at restaurant
4. Click "Add Expense"
5. Repeat with different categories

#### 2. Add Income
1. Go to Income page
2. Click "Add Income"
3. Enter:
   - Amount: 50000
   - Source: Salary
   - Note: Monthly salary
4. Click "Add Income"

#### 3. View Dashboard
1. Go to Dashboard
2. See summary cards: Total Income, Total Expenses, Balance
3. View pie chart of expenses by category
4. Check recent transactions

#### 4. Create Group (Splitwise)
1. Go to Groups page
2. Click "Create Group"
3. Enter:
   - Group Name: "Trip to Goa"
   - Description: "Group expenses for vacation"
4. Click "Create Group"
5. Go to group details
6. Add members (you'll need user IDs from other registered users)
7. Click "Add Shared Expense"
8. Enter:
   - Amount: 3000
   - Description: "Hotel booking"
   - Split Type: "Equal"
9. View balance sheet and settlements

#### 5. Export Data
1. Go to Expenses page
2. Click "Export CSV"
3. File will download as `expenses.csv`
4. Open in Excel to verify

#### 6. Toggle Dark Mode
1. Click the moon icon (🌙) in top right navbar
2. Theme will switch to dark mode
3. Refresh page - preference is saved

## Troubleshooting

### Issue: "Cannot GET /api/auth/me"
**Solution:** Backend is not running. Run `npm run dev` in backend directory.

### Issue: "Network Error" in frontend
**Solution:** 
- Check backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Ensure CORS is enabled (it is by default)

### Issue: MongoDB Connection Failed
**Solution:**
- If using local: Start MongoDB service
- If using Atlas: Check connection string in .env
- Verify internet connection

### Issue: Port Already in Use
**Solution:**
```bash
# Find process using port 5000 or 5173
netstat -ano | findstr :5000
# Kill process
taskkill /PID <PID> /F
```

### Issue: "Cannot find module" errors
**Solution:**
```bash
# In affected directory
npm install
```

## API Testing with Postman

### 1. Register User
- Method: POST
- URL: http://localhost:5000/api/auth/register
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
- Method: POST
- URL: http://localhost:5000/api/auth/login
- Body (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Response will contain: token, user data

### 3. Add Expense (with token)
- Method: POST
- URL: http://localhost:5000/api/expenses
- Headers: Authorization: Bearer <token>
- Body (JSON):
```json
{
  "amount": 500,
  "category": "Food",
  "note": "Lunch",
  "tags": ["lunch", "restaurant"]
}
```

### 4. Get Expenses
- Method: GET
- URL: http://localhost:5000/api/expenses?category=Food&startDate=2025-01-01
- Headers: Authorization: Bearer <token>

## Environment Files

### Backend .env Location
`c:\Users\harsh\OneDrive\Desktop\Expense Manager\backend\.env`

```env
MONGO_URI=mongodb://localhost:27017/expense-income-manager
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend .env Location
`c:\Users\harsh\OneDrive\Desktop\Expense Manager\frontend\.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

### Backend Deployment (Render.com, Railway, etc.)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables on hosting platform
4. Deploy

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build frontend: `npm run build`
2. Deploy `dist` folder to hosting service
3. Set VITE_API_URL to production backend URL

## Features Checklist

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Add/Edit/Delete Expenses
- ✅ Expense Filters (Category, Date, Amount)
- ✅ Add/Edit/Delete Income
- ✅ Dashboard with Charts
- ✅ Category-wise Pie Chart
- ✅ Monthly Summaries
- ✅ Export to CSV
- ✅ Create Groups
- ✅ Add/Remove Group Members
- ✅ Shared Expenses with Splits
- ✅ Balance Sheet & Settlements
- ✅ Dark Mode Toggle
- ✅ Auto-Categorization (keywords)
- ✅ Responsive Design
- ✅ Error Handling

## Performance Tips

1. **Use filters** on Expenses/Income pages to reduce data loaded
2. **Delete old transactions** regularly for better performance
3. **Export large datasets** periodically as backup
4. **Clear browser cache** if experiencing issues

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check terminal logs for error messages
4. Ensure all ports (5000, 5173) are available

---

**You're all set! Start managing your finances! 💰**
