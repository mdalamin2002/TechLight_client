import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ table }) => {
    if (!table) return null; // optional safety

    return (
        <div className='flex flex-wrap items-center justify-between gap-4 mt-6'>
            <div className='flex items-center gap-2'>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className='px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1'>
                    <ChevronLeft size={16} /> Prev
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className='px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1'>
                    Next <ChevronRight size={16} />
                </button>
            </div>

            <span className='text-gray-700 text-sm'>
                Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong>
            </span>

            <div className='flex items-center gap-2 text-sm text-gray-700'>
                Go to page:
                <input
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        table.setPageIndex(page);
                    }}
                    className="w-16 p-1 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            <select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className='p-2 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400'>
                {[10, 20, 30, 40, 50].map(size => (
                    <option key={size} value={size}>Show {size}</option>
                ))}
            </select>
        </div>
    );
};

export default Pagination;
