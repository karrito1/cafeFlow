import { useEffect } from 'react';

export default function useScrollLock() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const modal = document.querySelector('.fixed.inset-0.z-50');
      document.body.style.overflow = modal ? 'hidden' : '';
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      document.body.style.overflow = '';
    };
  }, []);
}
