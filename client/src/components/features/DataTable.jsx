import React from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  pagination, 
  onPageChange, 
  onSearch,
  onFilter,
  searchPlaceholder = 'Search...',
  actions 
}) => {
  if (loading) {
    return (
      <div className="w-full bg-midnight-800 rounded-2xl border border-white/10 p-8 space-y-4 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {onSearch && (
          <div className="w-full sm:w-72">
            <Input
              icon={Search}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="bg-midnight-800"
            />
          </div>
        )}
        <div className="flex gap-2">
          {onFilter && (
            <Button variant="secondary" onClick={onFilter}>
              <Filter size={18} className="mr-2" />
              Filter
            </Button>
          )}
          {actions}
        </div>
      </div>

      {/* Table */}
      <div className="bg-midnight-800 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {columns.map((col, index) => (
                  <th 
                    key={index}
                    className="p-4 text-sm font-semibold text-gray-300 whitespace-nowrap"
                    style={{ width: col.width }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="p-4 text-sm text-gray-400 align-middle">
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-12 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <span className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={pagination.currentPage === 1}
                onClick={() => onPageChange(pagination.currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => onPageChange(pagination.currentPage + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
