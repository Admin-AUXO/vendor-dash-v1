import { useMemo } from 'react';
import { workOrders } from '../../../data';

/**
 * Custom hook for creating work order lookup map (internal ID -> display ID)
 */
export function useWorkOrderLookup() {
  return useMemo(() => {
    const lookup = new Map<string, string>();
    workOrders.forEach((wo) => {
      lookup.set(wo.id, wo.workOrderId);
    });
    return lookup;
  }, []);
}

