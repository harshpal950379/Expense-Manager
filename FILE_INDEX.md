# 📋 Complete File Index

## 🎯 Start Here
- **COMPLETION_SUMMARY.txt** ← Project overview
- **QUICKSTART.md** ← How to setup and run
- **README.md** ← Project documentation
- **PROJECT_SUMMARY.md** ← File structure and API reference

## 📚 Additional Documentation
- **DOCUMENTATION.md** ← Technical deep-dive
- **DEVELOPMENT.md** ← Developer guide
- **TESTING_CHECKLIST.md** ← QA testing guide

---

## 📂 Backend Files (20 files)

### Configuration
```
backend/.env                              Environment variables (MONGO_URI, JWT_SECRET, PORT)
backend/package.json                      Dependencies and scripts
backend/src/config/db.js                  MongoDB connection setup
```

### Models (5 schema files)
```
backend/src/models/User.js                User profile with password hashing
backend/src/models/Expense.js             Expense with category, tags, filters
backend/src/models/Income.js              Income with source and tags
backend/src/models/Group.js               Group definition with members
backend/src/models/SharedExpense.js       Shared expense with splits
```

### Controllers (5 business logic files)
```
backend/src/controllers/authController.js           Register, login, profile management
backend/src/controllers/expenseController.js        Expense CRUD and monthly summaries
backend/src/controllers/incomeController.js         Income CRUD and monthly summaries
backend/src/controllers/groupController.js          Group CRUD and member management
backend/src/controllers/sharedExpenseController.js  Shared expense splits and balance sheet
```

### Routes (5 API endpoint files)
```
backend/src/routes/authRoutes.js          /api/auth/* endpoints
backend/src/routes/expenseRoutes.js       /api/expenses/* endpoints
backend/src/routes/incomeRoutes.js        /api/income/* endpoints
backend/src/routes/groupRoutes.js         /api/groups/* endpoints
backend/src/routes/sharedExpenseRoutes.js /api/shared-expenses/* endpoints
```

### Middleware & Utils
```
backend/src/middleware/auth.js            JWT verification
backend/src/utils/generateToken.js        JWT token creation
backend/src/utils/autoCategori.js         Keyword-based categorization
backend/src/server.js                     Main Express application
```

---

## 📂 Frontend Files (13 JSX + supporting)

### Core App
```
frontend/src/main.jsx                     React entry point
frontend/src/App.jsx                      Main app with routing and auth
frontend/src/index.css                    Global styles (Tailwind)
```

### Configuration
```
frontend/.env                             API URL configuration
frontend/tailwind.config.js               Tailwind CSS configuration
frontend/vite.config.js                   Vite build configuration (auto-generated)
frontend/package.json                     Dependencies and scripts
```

### Context (State Management)
```
frontend/src/context/AuthContext.jsx      Global auth state and user info
```

### Components (Reusable)
```
frontend/src/components/Navbar.jsx        Top navigation + dark mode toggle
frontend/src/components/Layout.jsx        Page wrapper with navbar
frontend/src/components/ProtectedRoute.jsx Route protection wrapper
```

### Pages (Main Content)
```
frontend/src/pages/Login.jsx              Login page with validation
frontend/src/pages/Register.jsx           Registration page
frontend/src/pages/Dashboard.jsx          Dashboard with charts and insights
frontend/src/pages/Expenses.jsx           Expense management page
frontend/src/pages/Income.jsx             Income management page
frontend/src/pages/Groups.jsx             Groups list page
frontend/src/pages/GroupDetails.jsx       Group details and shared expenses
```

### Utilities
```
frontend/src/utils/api.js                 Axios API helpers for all endpoints
frontend/src/utils/helpers.js             CSV export, formatting, date functions
```

---

## 📊 API Endpoints (30 total)

### Authentication (4)
```
POST   /api/auth/register                 Register user
POST   /api/auth/login                    Login user
GET    /api/auth/me                       Get current user
PUT    /api/auth/update-profile           Update profile
```

### Expenses (6)
```
POST   /api/expenses                      Create expense
GET    /api/expenses                      Get all (with filters)
GET    /api/expenses/:id                  Get single
PUT    /api/expenses/:id                  Update expense
DELETE /api/expenses/:id                  Delete expense
GET    /api/expenses/summary/monthly      Get monthly summary
```

### Income (6)
```
POST   /api/income                        Create income
GET    /api/income                        Get all (with filters)
GET    /api/income/:id                    Get single
PUT    /api/income/:id                    Update income
DELETE /api/income/:id                    Delete income
GET    /api/income/summary/monthly        Get monthly summary
```

### Groups (7)
```
POST   /api/groups                        Create group
GET    /api/groups                        Get user's groups
GET    /api/groups/:id                    Get group details
PUT    /api/groups/:id                    Update group
POST   /api/groups/:id/members            Add member
DELETE /api/groups/:id/members/:memberId  Remove member
DELETE /api/groups/:id                    Delete group
```

### Shared Expenses (5)
```
POST   /api/shared-expenses               Create shared expense
GET    /api/shared-expenses/:groupId      Get group expenses
PUT    /api/shared-expenses/:id           Update shared expense
DELETE /api/shared-expenses/:id           Delete shared expense
GET    /api/shared-expenses/balance/:groupId  Get balance sheet
```

---

## 🗄️ Database Collections (5)

### MongoDB Collections
```
users              - User accounts and profiles
expenses           - User expenses with categories
incomes            - User income entries
groups             - Group definitions and members
sharedexpenses     - Shared expenses with splits and balances
```

---

## 📄 Documentation Files (7)

```
README.md                     Main project overview
QUICKSTART.md                 Setup and testing guide
DOCUMENTATION.md              Technical documentation
DEVELOPMENT.md                Developer guide
PROJECT_SUMMARY.md            File structure reference
TESTING_CHECKLIST.md          QA testing checklist
COMPLETION_SUMMARY.txt        Project completion details
```

---

## 🔧 Key Technologies in Each File

### Backend
- **server.js** → Express, CORS, Route setup
- **db.js** → Mongoose, MongoDB connection
- **User.js** → bcryptjs password hashing
- **Expense.js** → Mongoose validation, references
- **authController.js** → JWT token generation
- **auth.js** → Token verification middleware
- **autoCategori.js** → Keyword matching algorithm

### Frontend
- **App.jsx** → React Router, Context Provider
- **AuthContext.jsx** → React Context, Axios
- **Navbar.jsx** → Tailwind styling, dark mode toggle
- **Dashboard.jsx** → Recharts pie chart, data fetching
- **Expenses.jsx** → Form handling, filtering, CSV export
- **GroupDetails.jsx** → Balance sheet calculation, nested data
- **api.js** → Axios interceptors, API configuration
- **helpers.js** → CSV parsing, date formatting

---

## 📦 Dependencies

### Backend (8 core)
```
express           Web framework
mongoose          MongoDB ODM
jsonwebtoken      JWT authentication
bcryptjs          Password hashing
cors              Cross-origin support
dotenv            Environment variables
axios             HTTP requests
nodemon           Dev server auto-reload
```

### Frontend (7 core)
```
react             UI library
react-dom         React DOM rendering
react-router-dom  Client-side routing
axios             HTTP client
recharts          Charts and graphs
tailwindcss       CSS framework
vite              Build tool and dev server
```

---

## 🚀 Commands Quick Reference

### Backend
```bash
cd backend
npm install                 # Install dependencies (already done)
npm run dev                # Start development server
npm start                  # Production server
```

### Frontend
```bash
cd frontend
npm install                 # Install dependencies (already done)
npm run dev                # Start development server
npm run build              # Create production build
npm run preview            # Preview production build
```

---

## 🗂️ Project Organization

### By Feature
- **Authentication** → authController, AuthContext, Login/Register pages
- **Expenses** → Expense model/controller, Expenses page
- **Income** → Income model/controller, Income page
- **Groups** → Group model/controller, Groups/GroupDetails pages
- **Shared Expenses** → SharedExpense model/controller, GroupDetails page

### By Layer
- **Models** → Database schemas
- **Controllers** → Business logic
- **Routes** → API endpoints
- **Components** → UI elements
- **Pages** → Full-page views
- **Utils** → Helper functions

### By Concern
- **Authentication** → Auth files in backend and frontend
- **State Management** → AuthContext (frontend)
- **API Communication** → api.js (frontend) and routes (backend)
- **Styling** → Tailwind config and index.css
- **Data Persistence** → MongoDB via Mongoose

---

## 📈 File Relationship Diagram

```
Frontend (http://localhost:5173)
├── App.jsx
│   ├── React Router → Routes to pages
│   └── AuthProvider → Wraps app
│       └── AuthContext.jsx
│           ├── Manages user state
│           ├── Makes API calls via axios
│           └── Stores token in localStorage
│
├── Pages
│   ├── Login/Register → API calls to /api/auth/*
│   ├── Dashboard → Calls /api/expenses/summary, /api/income/summary
│   ├── Expenses → Calls /api/expenses/*
│   ├── Income → Calls /api/income/*
│   ├── Groups → Calls /api/groups/*
│   └── GroupDetails → Calls /api/groups/*, /api/shared-expenses/*
│
└── Utils
    ├── api.js → Axios instance with headers
    └── helpers.js → Formatting and CSV functions

Backend (http://localhost:5000)
├── server.js → Express app
│   ├── Routes
│   │   ├── /api/auth/* → authController
│   │   ├── /api/expenses/* → expenseController
│   │   ├── /api/income/* → incomeController
│   │   ├── /api/groups/* → groupController
│   │   └── /api/shared-expenses/* → sharedExpenseController
│   │
│   ├── Middleware
│   │   └── auth.js → Verifies JWT in Authorization header
│   │
│   └── Models (MongoDB)
│       ├── User → Hashed password
│       ├── Expense → User reference
│       ├── Income → User reference
│       ├── Group → Creator and members
│       └── SharedExpense → Group and splits

Database (MongoDB)
├── users
├── expenses
├── incomes
├── groups
└── sharedexpenses
```

---

## ✨ Feature Implementation Map

| Feature | Backend | Frontend | Database |
|---------|---------|----------|----------|
| Register | authController | Register.jsx | User model |
| Login | authController | Login.jsx | User model |
| Add Expense | expenseController | Expenses.jsx | Expense model |
| Filter Expenses | expenseController | Expenses.jsx | Query filters |
| Dashboard | expenseController, incomeController | Dashboard.jsx | Multiple models |
| Create Group | groupController | Groups.jsx | Group model |
| Shared Expense | sharedExpenseController | GroupDetails.jsx | SharedExpense model |
| Balance Sheet | sharedExpenseController | GroupDetails.jsx | SharedExpense model |
| Dark Mode | N/A | Navbar.jsx | localStorage |
| CSV Export | N/A | helpers.js | N/A |

---

## 🔐 Security Files

- **backend/src/middleware/auth.js** → JWT verification
- **backend/src/utils/generateToken.js** → Secure token creation
- **backend/src/models/User.js** → Password hashing on save
- **frontend/src/context/AuthContext.jsx** → Token storage and management
- **frontend/src/components/ProtectedRoute.jsx** → Route protection

---

## 📊 Data Flow Examples

### User Registration
```
Register.jsx form 
  → POST /api/auth/register (via axios)
  → authController.register()
  → User.create() (saves to MongoDB with hashed password)
  → generateToken() creates JWT
  → Returns token + user
  → AuthContext.jsx stores token
  → Redirect to Dashboard
```

### Add Expense
```
Expenses.jsx form 
  → POST /api/expenses (with JWT in headers)
  → auth middleware verifies token
  → expenseController.createExpense()
  → Auto-categorize if needed (autoCategori.js)
  → Expense.create() (saves to MongoDB)
  → Returns created expense
  → Frontend state updates
  → UI re-renders with new expense
```

### View Balance Sheet
```
GroupDetails.jsx mounts
  → GET /api/shared-expenses/balance/:groupId (with JWT)
  → auth middleware verifies token
  → sharedExpenseController.getBalanceSheet()
  → Calculates balance for each user
  → Generates settlement suggestions
  → Returns balances array
  → Frontend displays in UI
  → Charts and tables render
```

---

## 🎓 Learning Path

### To understand the project:
1. Start with **QUICKSTART.md** (setup)
2. Read **README.md** (overview)
3. Check **PROJECT_SUMMARY.md** (structure)
4. Review **frontend/src/App.jsx** (frontend entry)
5. Review **backend/src/server.js** (backend entry)
6. Study individual files by feature

### To extend the project:
1. Check **DEVELOPMENT.md** (guidelines)
2. Understand folder structure
3. Study existing controllers/components
4. Add new model/controller/route in backend
5. Create corresponding frontend page/component
6. Test with TESTING_CHECKLIST.md

---

## 📝 Quick File Reference

**Need to...**
- Add expense? → `frontend/src/pages/Expenses.jsx` + `backend/src/controllers/expenseController.js`
- Fix auth? → `frontend/src/context/AuthContext.jsx` + `backend/src/controllers/authController.js`
- Change styling? → `frontend/src/components/*.jsx` (Tailwind classes)
- Add API? → `backend/src/routes/*.js` + `backend/src/controllers/*.js` + `frontend/src/utils/api.js`
- Modify database? → `backend/src/models/*.js`

---

## ✅ All Files Accounted For

- ✅ 5 Backend Models
- ✅ 5 Backend Controllers
- ✅ 5 Backend Routes
- ✅ 1 Backend Middleware
- ✅ 2 Backend Utils
- ✅ 1 Backend Server
- ✅ 13 Frontend JSX Pages/Components
- ✅ 1 Frontend Context
- ✅ 2 Frontend Utils
- ✅ 7 Documentation files
- ✅ All supporting config files

**Total Source Files: 45+**

---

**Everything is organized, documented, and ready to use! 🎉**

For any file, check the documentation for detailed explanations.
