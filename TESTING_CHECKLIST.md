# Testing Checklist - Feature Verification

Use this checklist to verify all features are working correctly.

## Setup & Prerequisites
- [ ] MongoDB is running (mongod command or MongoDB Atlas connected)
- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend dev server is running (`npm run dev` in frontend folder)
- [ ] Browser opened to `http://localhost:5173`

## Authentication Features

### Registration
- [ ] Navigate to http://localhost:5173
- [ ] Click "Register here" link
- [ ] Fill in form with valid data:
  - [ ] Name: "Test User"
  - [ ] Email: "test@example.com"
  - [ ] Password: "password123"
  - [ ] Confirm Password: "password123"
- [ ] Click "Register" button
- [ ] Should redirect to dashboard
- [ ] Name appears in navbar

### Login/Logout
- [ ] Click user menu (top right)
- [ ] Click "Logout"
- [ ] Should redirect to login page
- [ ] Click "Login here" 
- [ ] Enter registered email and password
- [ ] Click "Login"
- [ ] Should redirect to dashboard

### Profile Display
- [ ] User name visible in navbar
- [ ] User email visible in dropdown menu
- [ ] Avatar placeholder visible (if added)

## Dashboard Features

### Dashboard Display
- [ ] Total Income card shows correctly
- [ ] Total Expenses card shows correctly
- [ ] Balance card shows (Income - Expenses)
- [ ] Balance color is green if positive, red if negative

### Charts & Visualization
- [ ] Category-wise pie chart displays (if expenses exist)
- [ ] Pie chart shows all categories with amounts
- [ ] Pie chart colors are distinct

### Insights Section
- [ ] "Your balance this month" insight displays
- [ ] Average daily expense calculated correctly
- [ ] Savings rate percentage calculated correctly

### Recent Transactions
- [ ] Recent expenses section populated (if expenses exist)
- [ ] Recent income section populated (if income exists)
- [ ] Red color for expenses, green for income
- [ ] Amount formatting correct (₹ symbol)

## Expense Management

### Add Expense
- [ ] Go to Expenses page
- [ ] Click "Add Expense" button
- [ ] Form appears with fields:
  - [ ] Amount input
  - [ ] Category dropdown
  - [ ] Date picker
  - [ ] Tags input
  - [ ] Note textarea
- [ ] Fill in sample data
  - [ ] Amount: 500
  - [ ] Category: Food
  - [ ] Date: (today)
  - [ ] Note: "Lunch"
  - [ ] Tags: "food, lunch"
- [ ] Click "Add Expense"
- [ ] Expense appears in list
- [ ] Total updated correctly
- [ ] Form clears after submission

### View Expenses
- [ ] Expenses list displays all added expenses
- [ ] Each expense shows:
  - [ ] Category name
  - [ ] Note/description
  - [ ] Date
  - [ ] Amount in red
- [ ] Expenses sorted by date (newest first)

### Filter Expenses
- [ ] Category filter dropdown works
- [ ] Select "Food" category
- [ ] Only food expenses display
- [ ] Select "All" categories
- [ ] All expenses display

### Filter by Date Range
- [ ] Enter start date
- [ ] Enter end date
- [ ] Only expenses in range display
- [ ] Clear dates shows all expenses

### Edit Expense
- [ ] Click "Edit" button on expense
- [ ] Form populates with expense data
- [ ] Modify amount/category/note
- [ ] Click "Update Expense"
- [ ] List updates with changes
- [ ] Form clears

### Delete Expense
- [ ] Click "Delete" button on expense
- [ ] Confirm dialog appears
- [ ] Click "Cancel" - item not deleted
- [ ] Click "Delete" again - confirm
- [ ] Expense removed from list
- [ ] Total updated correctly

### Export to CSV
- [ ] Click "Export CSV" button
- [ ] File `expenses.csv` downloads
- [ ] Open in Excel/Sheets
- [ ] Verify all expenses in CSV
- [ ] Columns: Date, Category, Amount, Note, Tags

## Income Management

### Add Income
- [ ] Go to Income page
- [ ] Click "Add Income" button
- [ ] Form appears with fields:
  - [ ] Amount input
  - [ ] Source dropdown
  - [ ] Date picker
  - [ ] Tags input
  - [ ] Note textarea
- [ ] Fill sample data
  - [ ] Amount: 50000
  - [ ] Source: Salary
  - [ ] Note: "Monthly salary"
- [ ] Click "Add Income"
- [ ] Income appears in list
- [ ] Total updated correctly
- [ ] Form clears

### View Income
- [ ] Income list displays all added income
- [ ] Each income shows:
  - [ ] Source name
  - [ ] Note
  - [ ] Date
  - [ ] Amount in green

### Filter Income
- [ ] Source filter works (Salary, Freelance, etc.)
- [ ] Date filters work
- [ ] Only matching income displays

### Edit Income
- [ ] Click "Edit" button
- [ ] Form populates
- [ ] Modify data
- [ ] Click "Update Income"
- [ ] List updates

### Delete Income
- [ ] Click "Delete" button
- [ ] Confirm to delete
- [ ] Income removed from list
- [ ] Total updated

### Export to CSV
- [ ] Click "Export CSV"
- [ ] File `income.csv` downloads
- [ ] Verify contents in spreadsheet

## Group Management (Splitwise Feature)

### Create Group
- [ ] Go to Groups page
- [ ] Click "Create Group" button
- [ ] Form appears with:
  - [ ] Group Name field
  - [ ] Description field
- [ ] Enter "Test Group" as name
- [ ] Enter description
- [ ] Click "Create Group"
- [ ] Group card appears on page

### View Groups
- [ ] Group cards display:
  - [ ] Group name
  - [ ] Description
  - [ ] Member count
  - [ ] Member names (first 3)
  - [ ] "+X" if more members
- [ ] "View" button on each card
- [ ] "Delete" button on each card

### Group Details
- [ ] Click "View" on group card
- [ ] Group details page opens
- [ ] Shows:
  - [ ] Group name and description
  - [ ] Members section with list
  - [ ] Balance sheet section
  - [ ] Shared expenses section

### Add Group Members
- [ ] In Group Details, find Members section
- [ ] Click "Add" button (if creator)
- [ ] Input field for User ID appears
- [ ] Enter another user's ID (need to create 2nd user first)
- [ ] Click "Add Member"
- [ ] Member appears in list
- [ ] Remove button available (for creator)

### Remove Group Members
- [ ] Only creator can remove members
- [ ] Click "Remove" button on member (if creator)
- [ ] Confirm removal
- [ ] Member removed from list

### Add Shared Expense
- [ ] In Group Details, click "Add Expense"
- [ ] Form appears with:
  - [ ] Amount field
  - [ ] Description field
  - [ ] Split Type (equal/manual)
- [ ] Enter amount: 3000
- [ ] Description: "Dinner"
- [ ] Split Type: "Equal"
- [ ] Click "Add Shared Expense"
- [ ] Expense appears in list

### View Shared Expenses
- [ ] Shared expenses list displays:
  - [ ] Description
  - [ ] Amount
  - [ ] Paid by user
  - [ ] Date
  - [ ] Split details (who owes what)

### Balance Sheet Calculation
- [ ] Add multiple shared expenses
- [ ] Balance sheet updates
- [ ] Shows:
  - [ ] Each member's total paid
  - [ ] Each member's total owed
  - [ ] Net balance (positive/negative)
- [ ] Settlement suggestions appear
  - [ ] "X owes Y ₹amount" format
  - [ ] Correct amounts calculated

### Delete Shared Expense
- [ ] Only payer can delete
- [ ] Click "Delete" on shared expense
- [ ] Confirm deletion
- [ ] Expense removed
- [ ] Balance sheet recalculates

### Delete Group
- [ ] Click "Delete" on group
- [ ] Confirm deletion
- [ ] All group data deleted
- [ ] Group no longer in list

## Dark Mode Feature

### Toggle Dark Mode
- [ ] Click moon icon (🌙) in navbar
- [ ] Interface switches to dark colors:
  - [ ] Background becomes dark gray/black
  - [ ] Text becomes light
  - [ ] Cards have dark background
- [ ] All pages work in dark mode
- [ ] Charts visible in dark mode

### Persistence
- [ ] Toggle dark mode
- [ ] Refresh page
- [ ] Dark mode setting persists
- [ ] Toggle back to light mode
- [ ] Refresh
- [ ] Light mode persists

## Auto-Categorization Feature

### Test Keyword Matching
- [ ] Add expense with note: "Zomato order" and category "Other"
- [ ] Add expense with note: "Uber ride" and category "Other"
- [ ] Add expense with note: "Movie ticket" and category "Other"
- [ ] Check if categories auto-updated to:
  - [ ] "Food" for Zomato
  - [ ] "Travel" for Uber
  - [ ] "Entertainment" for Movie

### Manual Category Override
- [ ] Add expense with specific category selection
- [ ] Verify manual selection respected
- [ ] Auto-categorization only works when category set to "Other"

## Responsive Design

### Desktop View (1920px+)
- [ ] All elements visible
- [ ] Grid layouts display correctly
- [ ] Navigation horizontal
- [ ] Charts visible

### Tablet View (768-1024px)
- [ ] Layout adapts (2-column grid)
- [ ] Navigation still visible
- [ ] Forms still usable
- [ ] Cards stack appropriately

### Mobile View (< 768px)
- [ ] Layout adapts (1-column)
- [ ] Mobile menu icon visible
- [ ] Can navigate between pages
- [ ] Forms fully functional
- [ ] Cards stack single column
- [ ] Charts still visible

## Error Handling

### Invalid Input
- [ ] Try submitting form without required fields
- [ ] Error message displays
- [ ] Form not submitted

### API Errors
- [ ] Stop backend server
- [ ] Try adding expense
- [ ] Error message displays
- [ ] No infinite loading
- [ ] Can still interact with page

### Token Expiration
- [ ] Clear localStorage token manually
- [ ] Try to access protected route
- [ ] Redirected to login page
- [ ] Can login again

### Not Authorized
- [ ] User A creates expense
- [ ] In developer console, try to call delete with different user token
- [ ] Should get 403 error
- [ ] Expense not deleted

## Data Validation

### Frontend Validation
- [ ] Email format validation:
  - [ ] "invalid" - error
  - [ ] "test@example.com" - accepted
- [ ] Password requirements:
  - [ ] "12345" (< 6 chars) - error
  - [ ] "password123" (6+ chars) - accepted
- [ ] Amount validation:
  - [ ] Negative amounts rejected
  - [ ] Decimals accepted (e.g., 100.50)

### Backend Validation
- [ ] Try sending malformed API requests
- [ ] Appropriate error responses
- [ ] No server crashes

## Performance

### Page Load Time
- [ ] Dashboard loads in < 3 seconds
- [ ] Expenses page loads quickly even with 100+ items
- [ ] No lag when switching pages

### Chart Rendering
- [ ] Pie chart renders smoothly
- [ ] No janky animations
- [ ] Responsive to window resize

### List Rendering
- [ ] Long lists render without lag
- [ ] Scrolling smooth
- [ ] No memory leaks (check DevTools)

## Accessibility

### Keyboard Navigation
- [ ] Can tab through form fields
- [ ] Can submit forms with Enter key
- [ ] Can access buttons with keyboard

### Screen Reader (Optional)
- [ ] Page structure logical
- [ ] Form labels associated with inputs
- [ ] Error messages announced

## Security

### Password Security
- [ ] Password not visible in network requests
- [ ] Token not exposed in HTML
- [ ] No sensitive data in localStorage (except token)

### Authorization
- [ ] Cannot access others' expenses (API test)
- [ ] Cannot modify others' expenses
- [ ] Cannot delete groups user didn't create

### CORS
- [ ] Requests from different origin handled correctly
- [ ] No CORS errors in console

## Documentation

### README.md
- [ ] Accessible and clear
- [ ] Installation steps work
- [ ] API endpoints documented
- [ ] Features listed

### QUICKSTART.md
- [ ] Step-by-step setup works
- [ ] Testing workflow clear
- [ ] Troubleshooting helpful

## Final Checks

- [ ] No console errors
- [ ] No broken links
- [ ] All buttons clickable
- [ ] All forms submittable
- [ ] All pages accessible
- [ ] Dark mode works everywhere
- [ ] Mobile view works
- [ ] Data persists after refresh
- [ ] Can logout and login
- [ ] Multiple users can be created
- [ ] Each user sees only own data
- [ ] Groups work with multiple users
- [ ] All CSV exports valid

## Test User Accounts to Create

For comprehensive testing, create these accounts:

**User 1:**
- Name: John Doe
- Email: john@example.com
- Password: password123

**User 2:**
- Name: Jane Smith
- Email: jane@example.com
- Password: password123

**User 3:**
- Name: Bob Wilson
- Email: bob@example.com
- Password: password123

Then create a group with John as creator and add Jane & Bob as members to test shared expenses fully.

---

## Notes Section

Use this space to track any issues found:

```
Issue #1: 
Description: 
Status: Fixed / Pending

Issue #2:
Description:
Status: Fixed / Pending
```

---

**Checklist Status**: Ready for Testing ✅

**Last Updated**: November 18, 2025

**Version**: 1.0.0 Complete
