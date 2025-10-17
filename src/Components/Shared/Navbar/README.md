# Navbar Component Structure

This directory contains the modular Navbar component and its subcomponents.

## Overview
The Navbar has been refactored from a single 600+ line file into smaller, maintainable subcomponents for better code organization and reusability.

## Component Structure

### Main Component
- **Navbar.jsx** (247 lines) - Main orchestrator component that composes all subcomponents

### Subcomponents

#### 1. SearchBar.jsx
**Purpose:** Search functionality with voice input support

**Features:**
- Text search with Enter key and button submission
- Voice input using Web Speech API
- 🎙️ "Listening..." indicator during voice recording
- Animated listening state feedback
- Auto-navigation to `/search?q=query` on submission
- Clear button to reset search
- Responsive design (desktop & mobile variants)

**Props:**
- `searchQuery` (string) - Current search query value
- `setSearchQuery` (function) - State setter for search query
- `className` (string, optional) - Additional CSS classes
- `isMobile` (boolean, default: false) - Mobile variant styling
- `autoFocus` (boolean, default: false) - Auto-focus on mount

---

#### 2. UserMenu.jsx
**Purpose:** User profile dropdown menu

**Features:**
- Cache-busted avatar image (fixes caching issues after profile updates)
- Hover-triggered dropdown menu
- Profile and Dashboard navigation links
- Logout functionality
- Fallback to "Sign In" button for unauthenticated users

**Props:**
- `user` (object) - Current user object
- `logOutUser` (function) - Logout handler

**Cache-Busting Implementation:**
```javascript
const avatarUrl = user.photoURL + '?t=' + Date.now()
```

---

#### 3. MobileMenu.jsx
**Purpose:** Mobile categories drawer/sidebar

**Features:**
- Slide-in drawer animation from left
- Expandable/collapsible category sections
- Backdrop overlay with blur effect
- Auto-close on route navigation
- Only visible on screens < XL

**Props:**
- `isOpen` (boolean) - Drawer open/close state
- `onClose` (function) - Close handler
- `categories` (array) - Categories data structure

---

#### 4. CategoryNav.jsx
**Purpose:** Desktop categories navigation bar

**Features:**
- Horizontal category menu (XL+ screens only)
- Hover-triggered dropdown submenus
- Smooth animations for dropdowns
- Active route highlighting

**Props:**
- `categories` (array) - Categories data structure

---

#### 5. MobileBottomNav.jsx
**Purpose:** Mobile bottom navigation bar

**Features:**
- Fixed bottom navigation for mobile devices
- Quick access to Offers, Wishlist, and Profile
- Active route highlighting
- Only visible on screens < MD

**Props:**
- `onWishlistClick` (function) - Wishlist click handler

---

## Benefits of Refactoring

✅ **Maintainability:** Each component has a single, clear responsibility
✅ **Reusability:** Subcomponents can be used independently or in other contexts
✅ **Testability:** Smaller components are easier to unit test
✅ **Readability:** Reduced complexity makes code easier to understand
✅ **Performance:** Smaller component trees can optimize re-renders
✅ **Scalability:** Easy to add new features or modify existing ones

## New UX Improvements

### 1. Cache-Busted Avatar
Avatar images now include a timestamp query parameter to force browser refresh after profile updates:
```javascript
user.photoURL + '?t=' + Date.now()
```

### 2. Voice Input Listening Indicator
Visual feedback during voice recording:
- Microphone button animates with pulse effect
- "🎙️ Listening..." text appears below search bar
- Smooth fade in/out animations

### 3. Search Navigation
Search now automatically navigates to results:
- Press **Enter** in search field → Navigate to `/search?q=query`
- Voice input completion → Auto-navigate to results
- Clean URL encoding for special characters

## Categories Data Structure

```javascript
const categories = [
  {
    title: "Category Name",
    items: ["Item 1", "Item 2", "Item 3"]
  },
  // ... more categories
];
```

## Usage Example

```jsx
import Navbar from "@/Components/Shared/Navbar/Navbar";

function App() {
  return <Navbar />;
}
```

## Dependencies

- React Router (`react-router-dom`)
- Framer Motion (`framer-motion`)
- Lucide React (`lucide-react`)
- Custom UI components (`@/Components/ui/*`)
- Custom hooks (`useAuth`, `useCart`, `useWishlist`)

## Browser Compatibility

- Voice input requires Web Speech API support
- Fallback message shown for unsupported browsers
- All other features work universally

## Future Enhancements

- [ ] Add keyboard navigation for accessibility
- [ ] Implement search suggestions/autocomplete
- [ ] Add search history
- [ ] Multi-language voice input support
- [ ] Search filters UI
