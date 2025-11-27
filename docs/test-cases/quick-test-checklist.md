# Quick Test Checklist - Authentication Flows

Use this checklist for rapid testing of authentication flows.

## 🚀 Quick Smoke Test (5 minutes)

### Prerequisites
- [ ] App running at `http://localhost:5173`
- [ ] Incognito browser window open
- [ ] Test email ready

### Critical Path Test
```
1. SIGNUP
   [ ] Navigate to /signup
   [ ] Fill: Name, Email, Password (6+ chars)
   [ ] Submit → See "Check Your Email" message
   
2. EMAIL VERIFICATION
   [ ] Check email inbox
   [ ] Click verification link
   [ ] See confirmation success
   
3. LOGIN
   [ ] Navigate to /login
   [ ] Enter email + password
   [ ] Submit → Redirect to /choose-team
   
4. CREATE TEAM
   [ ] Click "Create New Team"
   [ ] Enter team name
   [ ] Submit → Redirect to Dashboard
   
5. VERIFY ACCESS
   [ ] Dashboard loads successfully
   [ ] User profile visible
   [ ] Team name displayed
```

**Expected Time**: 3-5 minutes  
**Result**: ✅ PASS / ❌ FAIL

---

## 📋 Detailed Test Checklist

### Signup Flow Tests
- [ ] TC-SIGNUP-001: Valid signup
- [ ] TC-SIGNUP-002: Invalid email format
- [ ] TC-SIGNUP-003: Short password
- [ ] TC-SIGNUP-004: Existing email
- [ ] TC-SIGNUP-005: Empty fields
- [ ] TC-SIGNUP-006: Redirect when logged in

### Login Flow Tests
- [ ] TC-LOGIN-001: Successful login with team
- [ ] TC-LOGIN-002: Unverified email
- [ ] TC-LOGIN-003: Invalid credentials
- [ ] TC-LOGIN-004: Login without team
- [ ] TC-LOGIN-005: Pending team membership
- [ ] TC-LOGIN-006: Empty fields
- [ ] TC-LOGIN-007: Redirect when logged in

### Team Selection Tests
- [ ] TC-TEAM-001: Create new team
- [ ] TC-TEAM-002: Join existing team
- [ ] TC-TEAM-003: Prevent second team
- [ ] TC-TEAM-004: Empty team name
- [ ] TC-TEAM-005: No teams available

### Protected Routes Tests
- [ ] TC-PROTECTED-001: Access without login
- [ ] TC-PROTECTED-002: Access without team
- [ ] TC-PROTECTED-003: Loading timeout

### Logout Tests
- [ ] TC-LOGOUT-001: Successful logout

### Email Verification Tests
- [ ] TC-EMAIL-001: Click verification link
- [ ] TC-EMAIL-002: Expired link (if applicable)

---

## 🎯 Priority Test Sets

### P0 - Critical (Must Pass)
```
✅ TC-SIGNUP-001: Successful signup
✅ TC-EMAIL-001: Email verification
✅ TC-LOGIN-001: Successful login
✅ TC-TEAM-001: Create team
✅ TC-PROTECTED-001: Protected route access
```

### P1 - High Priority
```
✅ TC-LOGIN-002: Unverified email blocked
✅ TC-LOGIN-003: Invalid credentials
✅ TC-LOGIN-004: Login without team
✅ TC-TEAM-002: Join existing team
✅ TC-LOGOUT-001: Logout
```

### P2 - Medium Priority
```
✅ TC-SIGNUP-002: Email validation
✅ TC-SIGNUP-003: Password validation
✅ TC-LOGIN-005: Pending membership
✅ TC-TEAM-003: Prevent multiple teams
✅ TC-PROTECTED-002: Team requirement
```

### P3 - Low Priority
```
✅ TC-SIGNUP-005: Empty fields
✅ TC-LOGIN-006: Empty fields
✅ TC-TEAM-004: Empty team name
✅ TC-TEAM-005: No teams available
```

---

## 🐛 Common Issues Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| No verification email | Check spam, wait 2 min, check Supabase logs |
| Infinite loading | Wait 15s for timeout, check console, refresh |
| Can't login | Verify email first, check credentials |
| Redirect loop | Clear cache, logout/login, check team status |
| Protected route blocked | Check login status, verify team approved |

---

## 📊 Test Results Summary

**Test Date**: ___________  
**Tester**: ___________  
**Build**: ___________

| Category | Total | Pass | Fail | Blocked |
|----------|-------|------|------|---------|
| Signup | 6 | ___ | ___ | ___ |
| Login | 7 | ___ | ___ | ___ |
| Team Selection | 5 | ___ | ___ | ___ |
| Protected Routes | 3 | ___ | ___ | ___ |
| Logout | 1 | ___ | ___ | ___ |
| Email Verification | 2 | ___ | ___ | ___ |
| **TOTAL** | **24** | ___ | ___ | ___ |

**Pass Rate**: ____%  
**Critical Issues**: ___________

---

## 🔧 Quick Setup Commands

```bash
# Start app
npm run dev

# Open in browser
http://localhost:5173

# Check Supabase connection
# Open DevTools → Console → Look for errors
```

---

## 📝 Quick Bug Report Template

```
BUG-XXX: [Brief Title]
Test: TC-XXX-XXX
Severity: Critical/High/Medium/Low

Steps:
1. 
2. 
3. 

Expected: 
Actual: 

Screenshot: [Attach]
```

---

**For detailed test cases**: See [auth-flow-test-cases.md](./auth-flow-test-cases.md)  
**For execution guide**: See [test-execution-guide.md](./test-execution-guide.md)
