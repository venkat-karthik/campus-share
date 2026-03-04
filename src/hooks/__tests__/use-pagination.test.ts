import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../use-pagination';

describe('usePagination', () => {
  const mockData = Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  it('should initialize with correct values', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 10 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.paginatedData).toHaveLength(10);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 10 }));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedData[0].id).toBe(10);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(3);
    });

    act(() => {
      result.current.previousPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should go to specific page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(4);
    });

    expect(result.current.currentPage).toBe(4);
    expect(result.current.paginatedData[0].id).toBe(30);
  });

  it('should reset to first page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(3);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should not go beyond last page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(10);
    });

    expect(result.current.currentPage).toBe(5);
  });

  it('should not go below first page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(-1);
    });

    expect(result.current.currentPage).toBe(1);
  });
});
