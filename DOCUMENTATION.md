# Complete Project Documentation

## Project Overview

**Expense & Income Manager + Smart Splitwise System** is a full-stack web application built with MERN (MongoDB, Express, React, Node.js) that enables users to:

1. Track personal income and expenses
2. Categorize and filter financial transactions
3. Visualize spending patterns with charts
4. Create groups and split expenses (like Splitwise)
5. Auto-categorize transactions using AI-like keyword matching
6. Export/import data in CSV format
7. Toggle between light and dark themes

## Architecture Overview

### Frontend Architecture
```
├── Single Page Application (SPA)
├── React Router for client-side routing
├── Context API for global state management
├── Axios for API communication
├── Tailwind CSS for styling
└── Recharts for data visualization
```

### Backend Architecture
```
├── Express REST API
├── MongoDB with Mongoose ODM
├── JWT-based authentication
├── MVC folder structure
├── Route-specific controllers
└── Middleware for authorization
```

## Component Hierarchy

### Frontend Components
```
App
├── AuthProvider (Context)
│   └── AppRoutes
│       ├── Login Page
│       ├── Register Page
│       └── Layout
│           ├── Navbar
│           └── Page Content
│               ├── Dashboard
│               ├── Expenses
│               ├── Income
│               ├── Groups
│               └── GroupDetails
```

## Database Schema

### User Schema
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Schema
```
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  amount: Number,
  category: String (enum: [...]),
  date: Date,
  note: String,
  tags: [String],
  isShared: Boolean,
  sharedGroup: ObjectId (ref: Group),
  createdAt: Date,
  updatedAt: Date
}
```

### Income Schema
```
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  amount: Number,
  source: String (enum: [...]),
  date: Date,
  note: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Group Schema
```
{
  _id: ObjectId,
  name: String,
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### SharedExpense Schema
```
{
  _id: ObjectId,
  group: ObjectId (ref: Group),
  paidBy: ObjectId (ref: User),
  amount: Number,
  description: String,
  splitType: String (enum: ['equal', 'manual']),
  splits: [
    {
      userId: ObjectId (ref: User),
      amountOwed: Number
    }
  ],
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Flow Diagrams

### Authentication Flow
```
1. User submits registration form
   ↓
2. Frontend: POST /api/auth/register
   ↓
3. Backend validates data
   ├─ Checks if email exists
   ├─ Hashes password with bcrypt
   └─ Creates user in MongoDB
   ↓
4. Backend generates JWT token
   ↓
5. Token sent to frontend
   ↓
6. Frontend stores token in localStorage
   ↓
7. Frontend redirects to dashboard
```

### Expense Creation Flow
```
1. User fills expense form
   ↓
2. Frontend: POST /api/expenses
   ├─ Authorization: Bearer <token>
   ├─ Body: {amount, category, date, note, tags}
   ↓
3. Backend auth middleware validates JWT
   ↓
4. Backend controller processes data
   ├─ Validates required fields
   ├─ Auto-categorizes if needed
   └─ Saves to MongoDB
   ↓
5. Response: Created expense object
   ↓
6. Frontend adds to local state
   ↓
7. UI updates with new expense
```

### Group Expense Split Flow
```
1. Creator adds shared expense
   ↓
2. System calculates splits
   ├─ Equal: amount / number of members
   └─ Manual: use provided amounts
   ↓
3. Creates SharedExpense document
   ├─ paidBy: current user
   ├─ splits: [{ userId, amountOwed }, ...]
   ↓
4. Balance calculation
   ├─ For each member: totalPaid - totalOwed
   ↓
5. Settlement suggestions generated
   ├─ Finds efficient payment paths
   └─ Displays "X owes Y ₹amount"
```

## State Management

### AuthContext
```javascript
{
  user: { id, name, email, avatar },
  token: JWT_token,
  loading: Boolean,
  isAuthenticated: Boolean,
  API_URL: String,
  register: Function,
  login: Function,
  logout: Function,
  updateProfile: Function
}
```

### Page-level State (Examples)

**Expenses Page:**
- expenses: Array
- loading: Boolean
- showForm: Boolean
- editingId: String | null
- filter: { category, startDate, endDate }
- formData: { amount, category, date, note, tags }

**Groups Page:**
- groups: Array
- loading: Boolean
- showForm: Boolean
- formData: { name, description }

## Key Algorithms

### Auto-Categorization Algorithm
```
Input: expense note/description
Output: category string

Process:
1. Convert input to lowercase
2. For each category in CATEGORY_KEYWORDS:
   - For each keyword in category:
     - If input contains keyword:
       - Return category
3. If no match found:
   - Return 'Other'
```

### Balance Sheet Calculation
```
Input: All SharedExpenses for group
Output: Settlements array

Process:
1. Initialize balances for all members = 0
2. For each SharedExpense:
   - paidBy.balance += amount
   - For each split:
     - userId.balance -= amountOwed
3. Calculate settlements:
   - Find users with positive balance (owed)
   - Find users with negative balance (owes)
   - Match them optimally
```

### Monthly Summary Calculation
```
Process:
1. Filter transactions by month/year
2. Group by category (expenses) or source (income)
3. Sum amounts for each group
4. Calculate totals
5. Calculate percentages
6. Return data for charts
```

## Error Handling Strategy

### Frontend Error Handling
```javascript
try {
  // API call or operation
} catch (error) {
  // Handle different error types
  if (error.response?.status === 401) {
    // Token expired, logout
  } else if (error.response?.status === 403) {
    // Not authorized
  } else if (error.response?.status === 404) {
    // Resource not found
  } else {
    // Generic error
  }
  // Show user-friendly message
}
```

### Backend Error Handling
```javascript
// Middleware validates JWT
// If invalid:
  res.status(401).json({ message: 'Token is not valid' })

// Authorization check
if (expense.user.toString() !== req.userId) {
  res.status(403).json({ message: 'Not authorized' })
}

// Resource check
if (!expense) {
  res.status(404).json({ message: 'Expense not found' })
}
```

## Security Considerations

1. **Password Security**
   - Hashed with bcrypt (salt rounds: 10)
   - Never stored in plain text
   - Never returned in API responses

2. **JWT Security**
   - 30-day expiration
   - Stored in localStorage
   - Sent in Authorization header
   - SECRET key stored in .env (not in code)

3. **Request Authorization**
   - All protected routes require valid JWT
   - User ID extracted from token
   - Verified against resource owner

4. **Data Validation**
   - Frontend: Basic HTML5 validation
   - Backend: Comprehensive Mongoose schema validation
   - Input sanitization for text fields

5. **CORS**
   - Enabled for frontend domain
   - Prevents unauthorized cross-origin requests

## Performance Optimization

1. **Frontend**
   - Lazy loading of routes
   - Conditional rendering
   - Memoization of components
   - CSS optimization with Tailwind

2. **Backend**
   - Indexed MongoDB fields
   - Efficient query filters
   - Pagination support
   - Response caching potential

3. **Database**
   - Foreign key relationships with refs
   - Query optimization
   - Index on frequently searched fields (email, user_id)

## Scalability Considerations

### Current Limitations
- Single MongoDB database
- Single Node.js server
- No caching layer
- No message queue

### Scaling Path
1. **Horizontal Scaling**
   - Load balancer (nginx)
   - Multiple Node.js instances
   - Redis for session management

2. **Database Scaling**
   - MongoDB replica sets
   - Read replicas for analytics
   - Database sharding

3. **Caching**
   - Redis for hot data
   - CDN for static assets

## Testing Strategy

### Backend Testing
```
Unit Tests:
- Password hashing
- Token generation
- Calculation functions

Integration Tests:
- API endpoints
- Database operations
- Authorization

End-to-End Tests:
- Complete workflows
- User scenarios
```

### Frontend Testing
```
Component Tests:
- Form submissions
- Data display
- User interactions

Integration Tests:
- API communication
- State management
- Navigation
```

## Deployment Checklist

### Backend
- [ ] Set production MongoDB connection
- [ ] Update JWT_SECRET (strong random string)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Setup email notifications (optional)
- [ ] Configure logging
- [ ] Setup monitoring/alerts
- [ ] Database backups

### Frontend
- [ ] Build production bundle
- [ ] Set VITE_API_URL to production backend
- [ ] Enable gzip compression
- [ ] Setup CDN
- [ ] Configure redirects
- [ ] Setup error tracking
- [ ] Configure analytics (optional)

## File Size Analysis

### Bundle Size
```
Frontend (estimated):
- React + dependencies: ~200KB (gzipped)
- Tailwind CSS: ~50KB (gzipped)
- Recharts: ~100KB (gzipped)
- Custom code: ~150KB (gzipped)
- Total: ~500KB (gzipped)

Backend (estimated):
- Node modules: ~200MB (not deployed)
- Source code: ~500KB
```

## Database Size Estimation

For 1000 users with average 100 transactions each:
```
- Users: 1000 documents × ~0.5KB = 500KB
- Expenses: 100,000 documents × 0.3KB = 30MB
- Income: 30,000 documents × 0.3KB = 10MB
- Groups: 5,000 documents × 0.3KB = 1.5MB
- SharedExpenses: 10,000 documents × 0.5KB = 5MB
- Total: ~47MB (well within free tier)
```

## Maintenance Tasks

### Regular (Weekly)
- Check error logs
- Monitor database size
- Backup user data

### Monthly
- Review security updates
- Update dependencies
- Analyze usage patterns

### Quarterly
- Performance audit
- Code review
- User feedback analysis

### Annually
- Security audit
- Architecture review
- Capacity planning

## Future Enhancement Roadmap

### Phase 2
- Email notifications
- Budget alerts
- Recurring expenses
- Mobile app (React Native)

### Phase 3
- Payment integration (Stripe)
- Multi-currency support
- Advanced analytics
- Machine learning predictions

### Phase 4
- Real-time collaboration
- Mobile progressive app
- API for third-party integrations
- Export to accounting software

## Troubleshooting Guide

### Common Issues and Solutions

**Issue: Login shows "Invalid credentials"**
```
Solution:
1. Verify email is correct
2. Check password (case-sensitive)
3. Ensure user is registered
4. Clear browser cache and try again
```

**Issue: Cannot add expense - "Not authorized"**
```
Solution:
1. Refresh page (token might be expired)
2. Logout and login again
3. Check browser console for errors
```

**Issue: Group balance sheet not updating**
```
Solution:
1. Refresh page
2. Add a new shared expense (UI might be cached)
3. Check that members are properly added
```

**Issue: Dark mode not persisting**
```
Solution:
1. Check if localStorage is enabled
2. Clear browser cache
3. Check browser DevTools for storage errors
```

## Resources

### Learning Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts Documentation](https://recharts.org/)

### Tools
- Postman: API testing
- MongoDB Compass: Database visualization
- VS Code: Code editor
- Git: Version control

## Support & Contribution

For bugs or feature requests:
1. Check existing issues
2. Create detailed bug report
3. Include reproduction steps
4. Provide error logs

---

**Last Updated:** November 18, 2025
**Version:** 1.0.0
