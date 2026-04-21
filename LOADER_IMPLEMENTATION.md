# 🔄 Global Loader System - Implementation Guide

## ✅ What's Been Implemented

A comprehensive, flexible loader system has been added to the application with:

- **Global Page Loader** - Full-screen loading indicator
- **Automatic Route Transition Loader** - Shows automatically when navigating between pages
- **Manual Loader Control** - Programmatically show/hide loaders
- **Multiple Loader Components** - Different loader styles for different use cases
- **React Query Integration** - Works seamlessly with API calls

---

## 📁 Files Created

### Core Components
- `src/components/ui/loader.jsx` - Loader UI components
- `src/contexts/LoaderContext.jsx` - Global loader state management
- `src/hooks/usePageLoader.js` - Custom hooks for loader control
- `src/components/RouteLoader.jsx` - Automatic route transition loader

### Documentation
- `src/docs/LOADER_USAGE.md` - Comprehensive usage guide with examples

### Updated Files
- `src/App.jsx` - Added LoaderProvider and GlobalLoader
- `src/pages/auth/Login.jsx` - Added loader during login
- `src/pages/auth/Signup.jsx` - Added loader during signup

---

## 🚀 Quick Start

### 1. Automatic Loading (Already Active!)

The loader **automatically shows** during page navigation. No code needed!

```jsx
// When user navigates from /home to /about
// Loader shows automatically ✅
```

### 2. Show Loader During API Calls

```jsx
import { usePageLoader } from '@/hooks/usePageLoader';
import { useQuery } from '@tanstack/react-query';

function MyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  });

  // Show loader while fetching
  usePageLoader(isLoading, 'Loading data...');

  return <div>{/* Your content */}</div>;
}
```

### 3. Manual Loader Control

```jsx
import { useLoader } from '@/contexts/LoaderContext';

function MyComponent() {
  const { showLoader, hideLoader } = useLoader();

  const handleAction = async () => {
    showLoader('Processing...');
    try {
      await doSomething();
    } finally {
      hideLoader();
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

### 4. Section/Inline Loading

```jsx
import { InlineLoader } from '@/components/ui/loader';

function CommentsSection() {
  const { data, isLoading } = useComments();

  if (isLoading) {
    return <InlineLoader message="Loading comments..." />;
  }

  return <div>{/* Comments */}</div>;
}
```

### 5. Button with Loading State

```jsx
import { Spinner } from '@/components/ui/loader';

function SaveButton() {
  const [saving, setSaving] = useState(false);

  return (
    <button disabled={saving} onClick={handleSave}>
      {saving && <Spinner size="small" />}
      {saving ? 'Saving...' : 'Save'}
    </button>
  );
}
```

---

## 🎨 Available Components

### `<PageLoader />`
Full-screen loading overlay with backdrop blur
```jsx
<PageLoader message="Loading..." />
```

### `<InlineLoader />`
Loading indicator for sections
```jsx
<InlineLoader message="Loading comments..." className="py-8" />
```

### `<OverlayLoader />`
Semi-transparent overlay for existing content
```jsx
<div className="relative">
  {content}
  {isLoading && <OverlayLoader />}
</div>
```

### `<Spinner />`
Basic spinner for custom use
```jsx
<Spinner size="small" />   // small
<Spinner size="default" />  // default
<Spinner size="large" />    // large
```

---

## 🎯 Common Use Cases

### ✅ Form Submission
```jsx
const { showLoader, hideLoader } = useLoader();

const handleSubmit = async (data) => {
  showLoader('Submitting form...');
  try {
    await submitForm(data);
    toast.success('Form submitted!');
  } catch (error) {
    toast.error('Submission failed');
  } finally {
    hideLoader();
  }
};
```

### ✅ Page with Data Fetching
```jsx
const { data, isLoading } = useQuery(['products'], fetchProducts);
usePageLoader(isLoading, 'Loading products...');
```

### ✅ Button Loading State
```jsx
const [isSubmitting, setIsSubmitting] = useState(false);

<button disabled={isSubmitting}>
  {isSubmitting && <Spinner size="small" />}
  {isSubmitting ? 'Saving...' : 'Save'}
</button>
```

---

## 🔧 API Reference

### `useLoader()` Hook
```typescript
const { 
  isLoading,        // boolean
  loadingMessage,   // string
  showLoader,       // (message?: string) => void
  hideLoader        // () => void
} = useLoader();
```

### `usePageLoader()` Hook
```typescript
usePageLoader(
  isLoading: boolean,     // Whether to show loader
  message?: string        // Optional message
): void
```

### `useRouteLoader()` Hook
```typescript
useRouteLoader(): void  // Auto-shows loader on route changes
```

---

## 💡 Best Practices

1. **Use Global Loader for**: Full-page operations, navigation, critical loading states
2. **Use InlineLoader for**: Section-specific loading (comments, reviews, lists)
3. **Use Spinner for**: Buttons, small UI elements
4. **Always hide loader**: Use `finally` blocks to ensure loader is hidden
5. **Provide context**: Use descriptive messages ("Logging in...", "Saving changes...")

---

## 🎨 Customization

The loader uses Tailwind CSS and can be customized in `src/components/ui/loader.jsx`:

```jsx
// Change colors
className="border-primary-50"  // Change to any color

// Change size
<Spinner size="large" className="w-16 h-16" />

// Add custom styling
<PageLoader message="..." className="bg-black/90" />
```

---

## 🐛 Troubleshooting

**Loader not showing?**
- Ensure `LoaderProvider` wraps your app (already done in App.jsx)
- Check if `showLoader()` is called and `hideLoader()` is in finally block

**Loader stuck on screen?**
- Always call `hideLoader()` in `finally` block
- Check for errors that prevent `hideLoader()` from running

**Multiple loaders showing?**
- Global loader is managed by context (only one instance)
- Multiple `showLoader()` calls will update the message

---

## 📝 Examples in Codebase

Check these files for working examples:
- `src/pages/auth/Login.jsx` - Login with loader
- `src/pages/auth/Signup.jsx` - Signup with loader
- `src/docs/LOADER_USAGE.md` - Comprehensive examples

---

## 🎉 Summary

You now have a **complete, production-ready loader system** that:
- ✅ Shows automatically during page navigation
- ✅ Works with React Query out of the box
- ✅ Can be controlled manually when needed
- ✅ Provides multiple loader styles for different use cases
- ✅ Is fully typed and documented

**Happy coding! 🚀**

