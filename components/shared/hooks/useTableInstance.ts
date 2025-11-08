import { useState, useCallback } from 'react';

/**
 * Custom hook for managing table instance state
 */
export function useTableInstance() {
  const [tableInstance, setTableInstance] = useState<any>(null);

  const handleTableReady = useCallback((table: any) => {
    setTableInstance(table);
  }, []);

  return { tableInstance, handleTableReady };
}

