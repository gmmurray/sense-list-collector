import { DependencyList, useEffect } from 'react';

const usePageTitle = (title: string) =>
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.title = title;
    }
  }, [title]);

export default usePageTitle;
