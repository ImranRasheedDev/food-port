# ⚡ Loader System - Quick Reference Card

## 🎯 Most Common Patterns

### Pattern 1: API Call Loading (React Query)
```jsx
import { usePageLoader } from '@/hooks/usePageLoader';

const { data, isLoading } = useQuery(['key'], fetchFn);
usePageLoader(isLoading, 'Loading...');
```

### Pattern 2: Form Submission
```jsx
import { useLoader } from '@/contexts/LoaderContext';

const { showLoader, hideLoader } = useLoader();
showLoader('Saving...');
try { await save(); } finally { hideLoader(); }
```

### Pattern 3: Section Loading
```jsx
import { InlineLoader } from '@/components/ui/loader';

if (isLoading) return <InlineLoader message="Loading..." />;
```

### Pattern 4: Button Loading
```jsx
import { Spinner } from '@/components/ui/loader';

<button disabled={loading}>
  {loading && <Spinner size="small" />}
  {loading ? 'Saving...' : 'Save'}
</button>
```

---

## 📋 Import Cheat Sheet

```jsx
// For global loader control
import { useLoader } from '@/contexts/LoaderContext';

// For automatic loading based on state
import { usePageLoader } from '@/hooks/usePageLoader';

// For UI components
import { 
  PageLoader,      // Full screen
  InlineLoader,    // Sections
  OverlayLoader,   // Overlay
  Spinner          // Basic spinner
} from '@/components/ui/loader';
```

---

## 🔥 Copy-Paste Templates

### Template: Data Fetching Page
```jsx
import { usePageLoader } from '@/hooks/usePageLoader';
import { useQuery } from '@tanstack/react-query';

function MyPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myData'],
    queryFn: fetchData
  });

  usePageLoader(isLoading, 'Loading data...');

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return <div>{/* Render data */}</div>;
}
```

### Template: Form with Submit Loading
```jsx
import { useLoader } from '@/contexts/LoaderContext';
import { useState } from 'react';

function MyForm() {
  const { showLoader, hideLoader } = useLoader();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader('Submitting...');
    try {
      await submitForm(formData);
      toast.success('Success!');
    } catch (error) {
      toast.error('Failed!');
    } finally {
      hideLoader();
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### Template: Section with Loading
```jsx
import { InlineLoader } from '@/components/ui/loader';
import { useQuery } from '@tanstack/react-query';

function CommentsSection() {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments
  });

  if (isLoading) {
    return <InlineLoader message="Loading comments..." />;
  }

  return (
    <div className="space-y-4">
      {comments?.map(comment => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}
```

### Template: Mutation with Loading
```jsx
import { usePageLoader } from '@/hooks/usePageLoader';
import { useMutation } from '@tanstack/react-query';

function MyComponent() {
  const mutation = useMutation({
    mutationFn: updateData,
    onSuccess: () => toast.success('Updated!'),
  });

  usePageLoader(mutation.isPending, 'Updating...');

  const handleUpdate = () => {
    mutation.mutate(newData);
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

---

## ⚠️ Common Mistakes to Avoid

❌ **Don't forget finally block**
```jsx
// BAD
showLoader();
await doSomething();
hideLoader();  // Won't run if error occurs!

// GOOD
showLoader();
try {
  await doSomething();
} finally {
  hideLoader();  // Always runs ✅
}
```

❌ **Don't nest loaders unnecessarily**
```jsx
// BAD
showLoader();
// ... other code that also calls showLoader()

// GOOD - The context manages one global loader
```

❌ **Don't forget to import**
```jsx
// BAD
const { showLoader } = useLoader(); // ❌ Not imported

// GOOD
import { useLoader } from '@/contexts/LoaderContext';
const { showLoader } = useLoader(); // ✅
```

---

## 🎨 Loader Types Visual Guide

```
┌─────────────────────────────────────┐
│     <PageLoader />                  │  Full screen overlay
│                                     │  + Backdrop blur
│         ⭕ Loading...               │  + Centered
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Content Section                    │
│  ┌───────────────────────────────┐  │
│  │    ⭕ Loading comments...     │  │  <InlineLoader />
│  └───────────────────────────────┘  │  For sections
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Existing content                   │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐ │
│  │     ⭕ Saving...             │ │  <OverlayLoader />
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘ │  Overlay on content
└─────────────────────────────────────┘

┌──────────────┐
│ ⭕ Save     │  <Spinner size="small" />
└──────────────┘  In buttons
```

---

## 💯 Pro Tips

1. **Descriptive Messages**: Use "Logging in..." not just "Loading..."
2. **Quick Actions**: For fast operations (< 500ms), consider skipping loader
3. **Skeleton Screens**: For lists/grids, consider skeleton loaders instead
4. **User Feedback**: Combine loaders with toast notifications
5. **Error Handling**: Always handle errors and hide loader in finally block

---

## 📚 More Examples

See comprehensive examples in:
- `src/docs/LOADER_USAGE.md` - Full documentation
- `src/pages/auth/Login.jsx` - Real example
- `src/pages/auth/Signup.jsx` - Real example
- `LOADER_IMPLEMENTATION.md` - Implementation guide

---

**Need help? Check the full documentation in `src/docs/LOADER_USAGE.md`**

