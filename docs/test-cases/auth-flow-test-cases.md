# Authentication Flow Test Cases

This document contains comprehensive manual test cases for the Tennis Tracking App authentication flows.

## Test Environment Setup

### Prerequisites
- Supabase project configured with email confirmation enabled
- Access to test email account for verification
- Clean browser session (incognito/private mode recommended)
- Application running on `http://localhost:5173` (or configured port)

### Test Data
```
Valid Test User:
- Email: testuser@example.com
- Password: Test123456
- Full Name: Test User

Invalid Test Cases:
- Invalid Email: invalid-email
- Short Password: 12345 (less than 6 characters)
- Existing Email: (use previously registered email)
```

---

## 1. SIGNUP FLOW TEST CASES

### TC-SIGNUP-001: Successful User Registration
**Priority:** High  
**Precondition:** User is not logged in

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/signup` | SignUp page displays with logo, form fields (Full Name, Email, Password), and "Sign Up" button |
| 2 | Enter valid full name: "Test User" | Input accepted |
| 3 | Enter valid email: "testuser@example.com" | Input accepted |
| 4 | Enter valid password: "Test123456" (min 6 chars) | Input accepted, password masked |
| 5 | Click "Sign Up" button | Button shows "Creating Account..." loading state |
| 6 | Wait for response | Success screen displays with green checkmark icon |
| 7 | Verify success message | Message shows "Check Your Email" with instruction to verify email at testuser@example.com |
| 8 | Check email inbox | Confirmation email received from Supabase |
| 9 | Click "Go to Login" button | Redirected to `/login` page |

**Expected Outcome:** ✅ User account created, confirmation email sent, user redirected to login

---

### TC-SIGNUP-002: Signup with Invalid Email Format
**Priority:** Medium  
**Precondition:** User is on signup page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter full name: "Test User" | Input accepted |
| 2 | Enter invalid email: "invalid-email" | Input accepted (browser validation pending) |
| 3 | Enter password: "Test123456" | Input accepted |
| 4 | Click "Sign Up" button | Browser shows validation error: "Please include an '@' in the email address" |

**Expected Outcome:** ✅ Form validation prevents submission with invalid email

---

### TC-SIGNUP-003: Signup with Short Password
**Priority:** Medium  
**Precondition:** User is on signup page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter full name: "Test User" | Input accepted |
| 2 | Enter valid email: "testuser@example.com" | Input accepted |
| 3 | Enter short password: "12345" (5 chars) | Input accepted but shows hint "Minimum 6 characters" |
| 4 | Click "Sign Up" button | Browser validation error: "Please lengthen this text to 6 characters or more" |

**Expected Outcome:** ✅ Form validation prevents submission with password < 6 characters

---

### TC-SIGNUP-004: Signup with Existing Email
**Priority:** High  
**Precondition:** Email already registered in system

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter full name: "Test User" | Input accepted |
| 2 | Enter existing email: "existing@example.com" | Input accepted |
| 3 | Enter password: "Test123456" | Input accepted |
| 4 | Click "Sign Up" button | Loading state shown |
| 5 | Wait for response | Success screen may still show (Supabase behavior) OR error message displays |

**Expected Outcome:** ⚠️ Depends on Supabase configuration - may show success or error

---

### TC-SIGNUP-005: Signup with Empty Fields
**Priority:** Low  
**Precondition:** User is on signup page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave all fields empty | Fields are empty |
| 2 | Click "Sign Up" button | Browser validation: "Please fill out this field" on Full Name |

**Expected Outcome:** ✅ Required field validation prevents submission

---

### TC-SIGNUP-006: Redirect When Already Logged In
**Priority:** Medium  
**Precondition:** User is already logged in with approved team

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/signup` | Automatically redirected to `/` (Dashboard) |

**Expected Outcome:** ✅ Logged-in users cannot access signup page

---

## 2. LOGIN FLOW TEST CASES

### TC-LOGIN-001: Successful Login with Approved Team
**Priority:** High  
**Precondition:** User registered, email verified, has approved team membership

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page displays with logo, email/password fields |
| 2 | Enter email: "testuser@example.com" | Input accepted |
| 3 | Enter password: "Test123456" | Input accepted, password masked |
| 4 | Click "Sign In" button | Button shows "Signing In..." loading state |
| 5 | Wait for authentication | Loading spinner may appear briefly |
| 6 | Check navigation | Redirected to `/` (Dashboard) |
| 7 | Verify user state | User profile loaded, team membership active |

**Expected Outcome:** ✅ User logged in and redirected to dashboard

---

### TC-LOGIN-002: Login with Unverified Email
**Priority:** High  
**Precondition:** User registered but email not verified

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page displays |
| 2 | Enter email: "unverified@example.com" | Input accepted |
| 3 | Enter password: "Test123456" | Input accepted |
| 4 | Click "Sign In" button | Loading state shown |
| 5 | Wait for response | Red error message displays: "Please verify your email address before logging in." |

**Expected Outcome:** ✅ Login blocked until email verified

---

### TC-LOGIN-003: Login with Invalid Credentials
**Priority:** High  
**Precondition:** User is on login page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter email: "testuser@example.com" | Input accepted |
| 2 | Enter wrong password: "WrongPassword" | Input accepted |
| 3 | Click "Sign In" button | Loading state shown |
| 4 | Wait for response | Red error message displays: "Invalid login credentials" |

**Expected Outcome:** ✅ Login fails with appropriate error message

---

### TC-LOGIN-004: Login Without Team Membership
**Priority:** High  
**Precondition:** User registered, email verified, but no team membership

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page displays |
| 2 | Enter valid credentials | Input accepted |
| 3 | Click "Sign In" button | Loading state shown |
| 4 | Wait for authentication | User authenticated successfully |
| 5 | Check navigation | Redirected to `/choose-team` page |
| 6 | Verify page content | Shows "Choose Your Team" with Create/Join options |

**Expected Outcome:** ✅ User redirected to team selection page

---

### TC-LOGIN-005: Login with Pending Team Membership
**Priority:** Medium  
**Precondition:** User has team membership with status='pending'

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login with valid credentials | Authentication successful |
| 2 | Check navigation | Redirected to `/choose-team` (not dashboard) |
| 3 | Verify behavior | User cannot access protected routes until approved |

**Expected Outcome:** ✅ Pending membership treated same as no membership

---

### TC-LOGIN-006: Login with Empty Fields
**Priority:** Low  
**Precondition:** User is on login page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave email and password empty | Fields are empty |
| 2 | Click "Sign In" button | Browser validation: "Please fill out this field" on email |

**Expected Outcome:** ✅ Required field validation prevents submission

---

### TC-LOGIN-007: Redirect When Already Logged In
**Priority:** Medium  
**Precondition:** User is already logged in with approved team

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Automatically redirected to `/` (Dashboard) |

**Expected Outcome:** ✅ Logged-in users cannot access login page

---

## 3. TEAM SELECTION FLOW TEST CASES

### TC-TEAM-001: Create New Team
**Priority:** High  
**Precondition:** User logged in, no team membership

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/choose-team` page | Shows "Choose Your Team" with two options |
| 2 | Click "Create New Team" card | Navigates to create team form |
| 3 | Enter team name: "Test Tennis Academy" | Input accepted |
| 4 | Click "Create Team" button | Loading state: "Creating Team..." |
| 5 | Wait for response | Team created successfully |
| 6 | Check navigation | Redirected to `/` (Dashboard) |
| 7 | Verify team membership | User is admin with approved status |

**Expected Outcome:** ✅ Team created, user auto-approved as admin

---

### TC-TEAM-002: Join Existing Team
**Priority:** High  
**Precondition:** User logged in, no team membership, teams exist in system

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/choose-team` page | Shows two options |
| 2 | Click "Join Existing Team" card | Shows list of available teams |
| 3 | Select a team from the list | Team card highlighted with checkmark |
| 4 | Click "Request to Join" button | Loading state: "Sending Request..." |
| 5 | Wait for response | Request sent successfully |
| 6 | Check navigation | Redirected to `/waiting-for-approval` page |
| 7 | Verify page content | Shows waiting message with team name |

**Expected Outcome:** ✅ Join request created with pending status

---

### TC-TEAM-003: Attempt to Create Second Team
**Priority:** Medium  
**Precondition:** User already has team membership

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Manually navigate to `/choose-team` | Automatically redirected to `/` (Dashboard) |

**Expected Outcome:** ✅ Users with approved team cannot access team selection

---

### TC-TEAM-004: Create Team with Empty Name
**Priority:** Low  
**Precondition:** User on create team form

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave team name field empty | Field is empty |
| 2 | Click "Create Team" button | Browser validation: "Please fill out this field" |

**Expected Outcome:** ✅ Required field validation prevents submission

---

### TC-TEAM-005: Join Team - No Teams Available
**Priority:** Low  
**Precondition:** No teams exist in system

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Join Existing Team" | Shows loading state |
| 2 | Wait for teams to load | Message displays: "No teams available. Create your own team instead!" |

**Expected Outcome:** ✅ Appropriate message when no teams exist

---

## 4. PROTECTED ROUTES TEST CASES

### TC-PROTECTED-001: Access Dashboard Without Login
**Priority:** High  
**Precondition:** User is not logged in

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/` | Loading spinner appears briefly |
| 2 | Wait for auth check | Redirected to `/login` |

**Expected Outcome:** ✅ Unauthenticated users redirected to login

---

### TC-PROTECTED-002: Access Dashboard Without Team
**Priority:** High  
**Precondition:** User logged in but no approved team

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/` | Loading spinner appears |
| 2 | Wait for auth check | Redirected to `/choose-team` |

**Expected Outcome:** ✅ Users without team redirected to team selection

---

### TC-PROTECTED-003: Loading Timeout Handling
**Priority:** Medium  
**Precondition:** Simulate slow network or auth service delay

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to protected route | Loading spinner appears |
| 2 | Wait 15+ seconds | Timeout screen displays with warning icon |
| 3 | Verify message | "Loading Taking Too Long" message shown |
| 4 | Click "Retry" button | Page reloads and attempts auth check again |

**Expected Outcome:** ✅ Timeout protection prevents infinite loading

---

## 5. LOGOUT FLOW TEST CASES

### TC-LOGOUT-001: Successful Logout
**Priority:** High  
**Precondition:** User is logged in

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click logout button in navigation | Logout initiated |
| 2 | Wait for response | User logged out successfully |
| 3 | Check navigation | Redirected to `/login` |
| 4 | Verify state | User and profile cleared from context |
| 5 | Attempt to access `/` | Redirected to `/login` |

**Expected Outcome:** ✅ User logged out and session cleared

---

## 6. EMAIL VERIFICATION FLOW TEST CASES

### TC-EMAIL-001: Click Verification Link
**Priority:** High  
**Precondition:** User signed up, verification email received

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open verification email | Email contains confirmation link |
| 2 | Click verification link | Opens Supabase confirmation page |
| 3 | Wait for confirmation | Success message or redirect shown |
| 4 | Navigate to app `/login` | Login page displays |
| 5 | Login with credentials | Login successful (no email verification error) |

**Expected Outcome:** ✅ Email verified, user can login

---

### TC-EMAIL-002: Expired Verification Link
**Priority:** Low  
**Precondition:** Verification link expired (if applicable)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click expired verification link | Error message or expired page shown |
| 2 | Attempt to login | Login fails with "Please verify your email" error |

**Expected Outcome:** ⚠️ User cannot login with expired verification

---

## Test Execution Summary Template

```
Test Execution Date: _____________
Tester Name: _____________
Environment: _____________
Build/Version: _____________

Total Test Cases: 25
Passed: ___
Failed: ___
Blocked: ___
Not Executed: ___

Critical Issues Found:
1. 
2. 

Notes:
```

---

## Known Issues & Limitations

1. **Supabase Email Confirmation**: Requires actual email service, cannot be fully tested in local development without proper SMTP configuration
2. **Rate Limiting**: Supabase may rate-limit signup/login attempts during testing
3. **Session Persistence**: Browser session storage may affect test results - use incognito mode
4. **Timeout Values**: AuthProvider has 10s timeout, ProtectedRoute has 15s timeout

---

## Test Data Cleanup

After testing, clean up test data:
1. Delete test users from Supabase Auth dashboard
2. Delete test profiles from `profiles` table
3. Delete test teams from `teams` table
4. Delete test team memberships from `team_members` table
