# Development Guide

## Adding New Features

### Example: Adding a Budget Feature

#### Backend Implementation

1. **Create Budget Model** (`backend/src/models/Budget.js`)
```javascript
const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  limitAmount: Number,
  month: Number,
  year: Number,
  alerts: Boolean,
  createdAt: Date,
  updatedAt: Date
});
```

2. **Create Budget Controller** (`backend/src/controllers/budgetController.js`)
```javascript
const createBudget = async (req, res) => {
  try {
    const budget = await Budget.create({
      user: req.userId,
      ...req.body
    });
    res.status(201).json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.status(200).json({ success: true, budgets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

3. **Create Budget Routes** (`backend/src/routes/budgetRoutes.js`)
```javascript
const express = require('express');
const auth = require('../middleware/auth');
const { createBudget, getBudgets } = require('../controllers/budgetController');

const router = express.Router();
router.post('/', auth, createBudget);
router.get('/', auth, getBudgets);

module.exports = router;
```

4. **Register Routes in server.js**
```javascript
const budgetRoutes = require('./routes/budgetRoutes');
app.use('/api/budgets', budgetRoutes);
```

#### Frontend Implementation

1. **Create Budget Page** (`frontend/src/pages/Budgets.jsx`)
```javascript
import React, { useState } from 'react';
// Implementation...
```

2. **Add to Navigation** (`frontend/src/components/Navbar.jsx`)
```javascript
<Link to="/budgets" className="...">
  Budgets
</Link>
```

3. **Add Route** (`frontend/src/App.jsx`)
```javascript
<Route
  path="/budgets"
  element={
    <ProtectedRoute>
      <Layout>
        <Budgets />
      </Layout>
    </ProtectedRoute>
  }
/>
```

4. **Create API Helper** (`frontend/src/utils/api.js`)
```javascript
export const budgetAPI = {
  create: (data, token) =>
    axios.post(`${API_URL}/budgets`, data, { headers: getHeaders(token) }),
  getAll: (token) =>
    axios.get(`${API_URL}/budgets`, { headers: getHeaders(token) }),
  // ... other methods
};
```

## Code Style Guidelines

### Backend (Node.js/Express)

**Function Naming:**
```javascript
// Controllers
const getExpenses = async (req, res) => { }
const createExpense = async (req, res) => { }
const updateExpense = async (req, res) => { }
const deleteExpense = async (req, res) => { }

// Routes
router.get('/path', middleware, controller);
router.post('/path', middleware, controller);
```

**Error Handling:**
```javascript
try {
  // Operation
} catch (error) {
  res.status(500).json({ message: error.message });
}

// Input validation
if (!email || !password) {
  return res.status(400).json({ message: 'Required fields missing' });
}
```

**Comments:**
```javascript
// Use comments for complex logic
// Keep them concise and meaningful
```

### Frontend (React/JSX)

**Component Structure:**
```javascript
export default function ComponentName() {
  // 1. State
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // Setup
  }, [dependencies]);
  
  // 3. Handlers
  const handleClick = () => { };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**Props Validation:**
```javascript
// Use prop types or TypeScript
function ExpenseCard({ expense, onEdit, onDelete }) {
  // Component logic
}
```

**Styling:**
```javascript
// Use Tailwind classes
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

// For dark mode:
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"

// For responsive:
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## Git Workflow

### Commit Message Format
```
feat: add budget feature
fix: resolve expense filter bug
docs: update README
style: format code
refactor: improve error handling
test: add budget tests
```

### Branch Naming
```
feature/budget-tracking
bugfix/expense-filter
docs/api-documentation
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## Testing
Steps to test the changes

## Screenshots (if UI change)
Attach screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Added comments for complex logic
- [ ] Updated documentation
- [ ] Tested thoroughly
```

## Environment Setup for Development

### VS Code Extensions Recommended
```
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- MongoDB for VS Code
- Thunder Client (API testing)
- Tailwind CSS IntelliSense
```

### VS Code Settings (.vscode/settings.json)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ]
}
```

## Performance Debugging

### React DevTools
```
1. Install React DevTools extension
2. Open DevTools in browser
3. Go to Profiler tab
4. Record interaction
5. Identify slow components
```

### Network Debugging
```
1. Open DevTools → Network tab
2. Perform action
3. Check API response times
4. Look for large payloads
5. Optimize queries if needed
```

### Bundle Analysis
```bash
# Frontend
npm install -D webpack-bundle-analyzer
npm run build
# Analyze the build output
```

## Database Optimization

### Indexes to Add
```javascript
// In MongoDB Compass or shell
db.expenses.createIndex({ user: 1, date: -1 })
db.expenses.createIndex({ user: 1, category: 1 })
db.income.createIndex({ user: 1, date: -1 })
db.sharedexpenses.createIndex({ group: 1, date: -1 })
```

### Query Optimization
```javascript
// Bad: Fetching all fields
Expense.find({ user: userId })

// Good: Fetching only needed fields
Expense.find({ user: userId })
  .select('amount category date note')
  .limit(50)
  .sort({ date: -1 })
```

## Testing

### Backend Testing with Jest
```bash
npm install -D jest supertest
```

**Example Test:**
```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
```

### Frontend Testing with Vitest
```bash
npm install -D vitest @testing-library/react
```

## Common Development Tasks

### Adding a New Expense Category

1. **Backend** - Update `expenseSchema`:
```javascript
category: {
  enum: [
    'Food', 'Travel', 'Entertainment', 'Shopping',
    'Utilities', 'Health', 'Education', 'NewCategory', 'Other'
  ]
}
```

2. **Backend** - Update `autoCategori.js`:
```javascript
CATEGORY_KEYWORDS = {
  NewCategory: ['keyword1', 'keyword2']
}
```

3. **Frontend** - Update dropdown in form:
```javascript
<option>NewCategory</option>
```

4. **Frontend** - Add to filter dropdown:
```javascript
<option>NewCategory</option>
```

### Adding a New API Endpoint

1. **Create controller method**
```javascript
const methodName = async (req, res) => {
  // Implementation
};
module.exports = { methodName };
```

2. **Add route**
```javascript
router.get('/path', auth, methodName);
```

3. **Create API helper in frontend**
```javascript
methodName: (params, token) =>
  axios.get(`${API_URL}/endpoint`, {
    params,
    headers: getHeaders(token)
  })
```

4. **Use in component**
```javascript
const response = await endpointAPI.methodName(params, token);
```

## Debugging Tips

### Backend Debugging
```javascript
// Add console logs
console.log('Data received:', req.body);
console.log('User ID:', req.userId);
console.error('Error:', error);

// Use Node debugger
// Run: node --inspect src/server.js
// Open chrome://inspect
```

### Frontend Debugging
```javascript
// Console logs
console.log('State:', state);
console.error('Error:', error);

// React DevTools Profiler
// Check component render times

// Network tab
// Check API requests and responses
```

### Database Debugging
```javascript
// Use MongoDB Compass
// Visual query builder
// Can inspect collections
// Check indexes

// Or MongoDB shell
db.expenses.find({ user: ObjectId("...") }).limit(5)
```

## Dependency Management

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

### Adding New Dependencies
```bash
# Frontend
cd frontend && npm install package-name

# Backend
cd backend && npm install package-name
```

## Deployment Checklist

### Before Pushing to Production
- [ ] All tests passing
- [ ] No console errors
- [ ] No broken links
- [ ] All features tested
- [ ] Error handling in place
- [ ] Performance acceptable
- [ ] Security review done
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Documentation updated

## Useful Commands

### Backend
```bash
npm run dev          # Development server
npm start            # Production server
npm run test         # Run tests (when added)
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Run linter (when added)
```

### MongoDB
```bash
mongod               # Start MongoDB
mongo                # Open MongoDB shell
db.collection.find() # Query database
db.collection.drop() # Delete collection
```

## Resources for Developers

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn)
- [MongoDB University](https://university.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

Happy Coding! 🚀
