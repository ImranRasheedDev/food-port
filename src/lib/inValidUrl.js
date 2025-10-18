export const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
        const parsed = new URL(url, window.location.origin);
        const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:';
        const isRootRelative = url.startsWith('/');
        return isHttp || isRootRelative;
    } catch {
        return url.startsWith('/');
    }
};  