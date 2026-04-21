# Loader System Usage Guide

This guide explains how to use the loader system implemented in the application.

## Available Loader Components

### 1. **PageLoader** - Full Page Loader
Full-screen overlay loader with backdrop blur.

```jsx
import { PageLoader } from '@/components/ui/loader';

<PageLoader message="Loading..." />
```

### 2. **InlineLoader** - Section Loader
Loader for specific sections within a page.

```jsx
import { InlineLoader } from '@/components/ui/loader';

<InlineLoader message="Loading data..." />
```

### 3. **OverlayLoader** - Overlay Loader
Semi-transparent overlay for existing content.

```jsx
import { OverlayLoader } from '@/components/ui/loader';

<div className="relative">
  {/* Your content */}
  {isLoading && <OverlayLoader message="Saving..." />}
</div>
```

### 4. **Spinner** - Basic Spinner
Simple spinner component for custom use.

```jsx
import { Spinner } from '@/components/ui/loader';

<Spinner size="small" /> // small, default, large
```

## Using the Global Loader

### Method 1: Automatic Route Transition Loader (Already Implemented)
The loader automatically shows during page navigation.

```jsx
// This is already set up in App.jsx
// No additional code needed!
```

### Method 2: Manual Control with useLoader Hook

```jsx
import { useLoader } from '@/contexts/LoaderContext';

function MyComponent() {
  const { showLoader, hideLoader } = useLoader();

  const handleSubmit = async () => {
    showLoader('Saving data...');
    try {
      await saveData();
    } finally {
      hideLoader();
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Method 3: Automatic Loading Based on State

```jsx
import { usePageLoader } from '@/hooks/usePageLoader';

function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Automatically shows/hides loader based on isLoading state
  usePageLoader(isLoading, 'Loading page data...');

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false));
  }, []);

  return <div>My Page Content</div>;
}
```

### Method 4: With React Query (Recommended for API Calls)

```jsx
import { usePageLoader } from '@/hooks/usePageLoader';
import { useQuery } from '@tanstack/react-query';

function MyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['myData'],
    queryFn: fetchMyData
  });

  // Show loader while fetching
  usePageLoader(isLoading, 'Fetching data...');

  if (isLoading) return null; // or return skeleton
  
  return <div>{/* Render data */}</div>;
}
```

## Examples by Use Case

### Example 1: Page with API Data
```jsx
import { usePageLoader } from '@/hooks/usePageLoader';
import { useEffect, useState } from 'react';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  usePageLoader(isLoading, 'Loading products...');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
```

### Example 2: Form Submission
```jsx
import { useLoader } from '@/contexts/LoaderContext';

function ContactForm() {
  const { showLoader, hideLoader } = useLoader();

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader('Sending message...');
    
    try {
      await sendMessage(formData);
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      hideLoader();
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 3: Section Loading (Using InlineLoader)
```jsx
import { InlineLoader } from '@/components/ui/loader';

function CommentsSection() {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments
  });

  if (isLoading) {
    return <InlineLoader message="Loading comments..." />;
  }

  return (
    <div>
      {comments.map(comment => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}
```

### Example 4: Button with Loading State
```jsx
import { Spinner } from '@/components/ui/loader';

function SaveButton({ onSave }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isSaving}
      className="flex items-center gap-2"
    >
      {isSaving && <Spinner size="small" />}
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  );
}
```

## Best Practices

1. **Use Global Loader for**: Page navigation, full-page operations
2. **Use InlineLoader for**: Section-specific loading (like comments, reviews)
3. **Use OverlayLoader for**: Operations on existing content (like form submissions)
4. **Use Spinner for**: Custom loading indicators (like buttons)

## API Reference

### LoaderContext

```typescript
interface LoaderContext {
  isLoading: boolean;
  loadingMessage: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}
```

### usePageLoader Hook

```typescript
usePageLoader(isLoading: boolean, message?: string): void
```

### useRouteLoader Hook

```typescript
useRouteLoader(): void
```

Automatically shows loader during route transitions.

