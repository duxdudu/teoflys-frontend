// filepath: d:\Projects\teofly-project\photo-teoflys\teofly-image\lib\utils\cache-utils.ts
export const clearBrowserCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
};