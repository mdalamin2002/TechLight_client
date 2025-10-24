# Backend Integration Guide - User Settings API

## Quick Start for Backend Developers

This guide helps you implement the missing backend endpoints for the User Settings module.

---

## 📋 Required Endpoints

### 1. Update User Preferences (Notifications)
```javascript
PATCH /api/users/:email/preferences/notifications
```

**Request Body:**
```json
{
  "orders": {
    "email": true,
    "push": true
  },
  "promotions": {
    "email": true,
    "push": false
  },
  "account": {
    "email": true,
    "push": true
  },
  "newsletter": {
    "weekly": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated",
  "preferences": { /* updated preferences */ }
}
```

**Implementation Example (Node.js/Express):**
```javascript
const updateNotificationPreferences = async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const decodedEmail = req.decoded; // from JWT middleware
    
    if (email !== decodedEmail) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const preferences = req.body;
    
    // Validate structure
    if (!preferences.orders || !preferences.promotions || 
        !preferences.account || !preferences.newsletter) {
      return res.status(400).send({ message: "Invalid preferences structure" });
    }

    await usersCollections.updateOne(
      { email },
      { $set: { "preferences.notifications": preferences, updated_at: new Date() } }
    );

    const updatedUser = await usersCollections.findOne({ email });
    
    res.status(200).send({
      success: true,
      message: "Notification preferences updated",
      preferences: updatedUser.preferences.notifications
    });
  } catch (error) {
    next(error);
  }
};
```

---

### 2. Update Privacy Preferences
```javascript
PATCH /api/users/:email/preferences/privacy
```

**Request Body:**
```json
{
  "profileVisibility": true,
  "showOrderHistory": false,
  "language": "en",
  "currency": "USD"
}
```

**Implementation:**
```javascript
const updatePrivacyPreferences = async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const decodedEmail = req.decoded;
    
    if (email !== decodedEmail) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const { profileVisibility, showOrderHistory, language, currency } = req.body;

    await usersCollections.updateOne(
      { email },
      { 
        $set: { 
          "preferences.privacy.profileVisibility": profileVisibility,
          "preferences.privacy.showOrderHistory": showOrderHistory,
          "preferences.locale.language": language,
          "preferences.locale.currency": currency,
          updated_at: new Date() 
        } 
      }
    );

    res.status(200).send({ success: true, message: "Privacy preferences updated" });
  } catch (error) {
    next(error);
  }
};
```

---

### 3. Deactivate Account
```javascript
PATCH /api/users/:email/deactivate
```

**Request Body:**
```json
{
  "reason": "Taking a break" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

**Implementation:**
```javascript
const deactivateAccount = async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const decodedEmail = req.decoded;
    
    if (email !== decodedEmail) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    await usersCollections.updateOne(
      { email },
      { 
        $set: { 
          accountStatus: "deactivated",
          deactivatedAt: new Date(),
          deactivationReason: req.body.reason || "",
          updated_at: new Date() 
        } 
      }
    );

    res.status(200).send({ 
      success: true, 
      message: "Account deactivated successfully" 
    });
  } catch (error) {
    next(error);
  }
};
```

**Reactivation (on login):**
```javascript
// In your login controller, add:
if (user.accountStatus === "deactivated") {
  await usersCollections.updateOne(
    { email },
    { 
      $set: { 
        accountStatus: "active",
        deactivatedAt: null,
        reactivatedAt: new Date() 
      } 
    }
  );
}
```

---

### 4. Data Export (GDPR Compliance)
```javascript
GET /api/users/:email/data-export
```

**Response:**
```json
{
  "success": true,
  "message": "Data export initiated. You'll receive a download link via email within 24-48 hours.",
  "exportId": "exp_123456789"
}
```

**Implementation:**
```javascript
const requestDataExport = async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const decodedEmail = req.decoded;
    
    if (email !== decodedEmail) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    // 1. Gather all user data
    const user = await usersCollections.findOne({ email });
    const orders = await ordersCollection.find({ userEmail: email }).toArray();
    const addresses = await addressesCollection.find({ userEmail: email }).toArray();
    const reviews = await reviewsCollection.find({ userEmail: email }).toArray();
    const wishlist = await wishlistCollection.find({ userEmail: email }).toArray();

    const exportData = {
      profile: user,
      orders,
      addresses,
      reviews,
      wishlist,
      exportedAt: new Date()
    };

    // 2. Create JSON file
    const exportId = `exp_${Date.now()}`;
    const fileName = `user_data_${exportId}.json`;
    
    // 3. Upload to cloud storage (Cloudinary/S3)
    const uploadResult = await uploadToStorage(
      Buffer.from(JSON.stringify(exportData, null, 2)),
      fileName
    );

    // 4. Send email with download link
    await sendEmail({
      to: email,
      subject: "Your Data Export is Ready",
      body: `Your data export is ready. Download it here: ${uploadResult.url}`
    });

    // 5. Store export record
    await dataExportsCollection.insertOne({
      exportId,
      userEmail: email,
      status: "completed",
      downloadUrl: uploadResult.url,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date()
    });

    res.status(200).send({
      success: true,
      message: "Data export initiated. You'll receive a download link via email.",
      exportId
    });
  } catch (error) {
    next(error);
  }
};
```

---

### 5. Enhanced Delete Account
Update existing `DELETE /api/users/:email` to handle cascading deletes:

```javascript
const deleteAccount = async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const decodedEmail = req.decoded;
    
    if (email !== decodedEmail) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    // 1. Mark as deleted (soft delete) instead of immediate deletion
    await usersCollections.updateOne(
      { email },
      { 
        $set: { 
          accountStatus: "deleted",
          deletedAt: new Date(),
          // Anonymize sensitive data
          name: "Deleted User",
          phone: "",
          avatar: ""
        } 
      }
    );

    // 2. Cancel active orders (optional)
    await ordersCollection.updateMany(
      { userEmail: email, status: { $in: ["pending", "processing"] } },
      { $set: { status: "cancelled_by_user_deletion" } }
    );

    // 3. Clear personal data from other collections
    await addressesCollection.deleteMany({ userEmail: email });
    await wishlistCollection.deleteMany({ userEmail: email });
    await cartCollection.deleteMany({ userEmail: email });

    // 4. Keep reviews but anonymize (for product integrity)
    await reviewsCollection.updateMany(
      { userEmail: email },
      { $set: { userName: "Deleted User", userEmail: "" } }
    );

    // 5. Schedule permanent deletion after 30 days (compliance)
    await scheduledDeletionsCollection.insertOne({
      userEmail: email,
      scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    });

    res.status(200).send({ 
      success: true, 
      message: "Account deleted successfully" 
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 🗺️ Route Setup

Add these routes to your Express app:

```javascript
// In userRoutes.js
const express = require("express");
const router = express.Router();
const { 
  updateNotificationPreferences,
  updatePrivacyPreferences,
  deactivateAccount,
  requestDataExport,
  deleteAccount
} = require("../controllers/userControllers/userSettingsController");
const { auth } = require("../middlewares/auth");

// Preferences
router.patch("/users/:email/preferences/notifications", auth, updateNotificationPreferences);
router.patch("/users/:email/preferences/privacy", auth, updatePrivacyPreferences);

// Account management
router.patch("/users/:email/deactivate", auth, deactivateAccount);
router.get("/users/:email/data-export", auth, requestDataExport);
router.delete("/users/:email", auth, deleteAccount); // Update existing

module.exports = router;
```

---

## 📊 Database Schema Updates

Add these fields to your users collection:

```javascript
{
  email: "user@example.com",
  name: "John Doe",
  // ... existing fields ...
  
  // NEW: Preferences
  preferences: {
    notifications: {
      orders: { email: true, push: true },
      promotions: { email: true, push: false },
      account: { email: true, push: true },
      newsletter: { weekly: false }
    },
    privacy: {
      profileVisibility: true,
      showOrderHistory: true
    },
    locale: {
      language: "en",
      currency: "USD"
    }
  },
  
  // NEW: Account status
  accountStatus: "active", // "active" | "deactivated" | "deleted"
  deactivatedAt: null,
  deactivationReason: "",
  reactivatedAt: null,
  deletedAt: null,
  scheduledDeletionAt: null,
  
  // Existing
  created_at: new Date(),
  updated_at: new Date()
}
```

---

## 🔐 Middleware Requirements

### Authentication Check
```javascript
// middlewares/auth.js (already exists)
// Ensure it populates req.decoded with user email from JWT
```

### Account Status Check
Add this to your existing `checkUserStatus` utility:

```javascript
// utils/check_user_status.js
const checkUserStatus = (user) => {
  if (!user) {
    return { allowed: false, message: "User not found" };
  }
  
  if (user.accountStatus === "deleted") {
    return { allowed: false, message: "Account has been deleted" };
  }
  
  // Existing checks for blocked, etc.
  // ...
  
  return { allowed: true };
};
```

---

## 🧪 Testing

### Using Postman/Thunder Client:

**1. Update Notification Preferences:**
```bash
PATCH http://localhost:5000/api/users/user@example.com/preferences/notifications
Headers: Authorization: Bearer <token>
Body: {
  "orders": { "email": true, "push": true },
  "promotions": { "email": false, "push": false },
  "account": { "email": true, "push": true },
  "newsletter": { "weekly": true }
}
```

**2. Deactivate Account:**
```bash
PATCH http://localhost:5000/api/users/user@example.com/deactivate
Headers: Authorization: Bearer <token>
Body: { "reason": "Testing deactivation" }
```

**3. Request Data Export:**
```bash
GET http://localhost:5000/api/users/user@example.com/data-export
Headers: Authorization: Bearer <token>
```

---

## 🚨 Error Handling

Ensure these errors are handled:

```javascript
// Invalid email format
400: "Invalid email format"

// Unauthorized access
401: "Unauthorized access"

// User not found
404: "User not found"

// Account already deleted
403: "Account has been deleted"

// Invalid preference structure
400: "Invalid preferences structure"

// Database errors
500: "Internal server error"
```

---

## 📧 Email Templates Needed

1. **Account Deactivation Confirmation**
2. **Account Reactivation Notification**
3. **Data Export Ready** (with download link)
4. **Account Deletion Confirmation**
5. **Scheduled Deletion Warning** (7 days before permanent deletion)

---

## ✅ Implementation Checklist

- [ ] Create `userSettingsController.js`
- [ ] Implement notification preferences endpoint
- [ ] Implement privacy preferences endpoint
- [ ] Implement account deactivation endpoint
- [ ] Implement data export endpoint
- [ ] Update delete account endpoint
- [ ] Update user schema with preferences
- [ ] Add account status field
- [ ] Update `checkUserStatus` utility
- [ ] Add routes to router
- [ ] Test all endpoints with Postman
- [ ] Create email templates
- [ ] Implement scheduled deletion cron job
- [ ] Update API documentation

---

## 🎯 Priority Order

1. **High**: Account deactivation/deletion (user-requested feature)
2. **Medium**: Notification preferences (enhances UX)
3. **Medium**: Privacy preferences (language/currency)
4. **Low**: Data export (GDPR compliance, less frequently used)

---

## 📞 Questions?

If you need clarification on any endpoint or have questions about the implementation, refer to:
- Frontend implementation: `/src/Layout/Dashboard/UserDashboard/components/Settings/components/*.jsx`
- This guide
- Contact frontend team for API contract details
