import { useMemo } from 'react';
import { Item, Person, UserTotal } from '../types';

export const useSummaryCalculations = (
  items: Item[],
  users: Person[],
  receiptSummary: {
    subtotal: number;
    tax: number;
    tip: number;
  }
) => {
  return useMemo(() => {
    const userTotals: UserTotal[] = users.map(user => {
      const userItems = items.filter(item => item.assignedUsers?.includes(user.id));
      const subtotal = userItems.reduce((sum: number, item: Item) => {
        // If item is shared between multiple users, split the cost
        const sharedWithCount = item.assignedUsers?.length || 1;
        return sum + ((item.price * (item.count || 1)) / sharedWithCount);
      }, 0);

      const tip = (subtotal / receiptSummary.subtotal) * receiptSummary.tip;
      const tax = receiptSummary.tax > 0 
        ? (subtotal / receiptSummary.subtotal) * receiptSummary.tax 
        : 0;
      
      const total = subtotal + tip + tax;

      return {
        user,
        subtotal,
        tip,
        tax,
        total
      };
    });

    return userTotals;
  }, [items, users, receiptSummary]);
}; 