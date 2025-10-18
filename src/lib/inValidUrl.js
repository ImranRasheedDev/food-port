export const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    // Check for empty or whitespace-only strings
    if (url.trim() === '') return false;
    
    try {
        const parsed = new URL(url, window.location.origin);
        const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:';
        const isRootRelative = url.startsWith('/');
        
        return isHttp || isRootRelative;
    } catch {
        // Fallback: check if it's a relative path that starts with /
        return url.startsWith('/');
    }
};  