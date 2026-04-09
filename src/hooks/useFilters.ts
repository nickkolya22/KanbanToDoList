import { useState } from 'react';
import type { FilterStatus } from '../types';

export function useFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  return { searchQuery, setSearchQuery, filterStatus, setFilterStatus };
}
