import React from 'react';

const Pagination = ({ 
    currentPage, 
    hasNextPage, 
    hasPrevPage, 
    onPageChange, 
    showPagination,
    currentDataCount = 0,
    itemsPerPage = 12,
    totalCount = null
}) => {
    if (!showPagination) return null;

    // Calculate total pages first
    const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : null;
    
    // Fix calculation to prevent impossible scenarios
    const startItem = totalCount ? Math.min((currentPage - 1) * itemsPerPage + 1, totalCount) : (currentPage - 1) * itemsPerPage + 1;
    const endItem = totalCount ? Math.min(currentPage * itemsPerPage, totalCount) : Math.min(currentPage * itemsPerPage, startItem + currentDataCount - 1);
    
    // Ensure currentPage doesn't exceed totalPages
    const safeCurrentPage = totalPages ? Math.min(currentPage, totalPages) : currentPage;

    return (
        <div className="mt-8">
            {/* Results Count with Total Info */}
            <div className="text-center mb-4">
                <div className="text-sm text-gray-600">
                    {totalCount ? (
                        <span>Showing {startItem}-{endItem} of {totalCount} restaurants</span>
                    ) : (
                        <span>Showing {startItem}-{endItem} results</span>
                    )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {totalPages ? (
                        <span>Page {safeCurrentPage} of {totalPages}</span>
                    ) : hasNextPage ? (
                        <span>Page {safeCurrentPage} - More results available</span>
                    ) : (
                        <span>End of results reached</span>
                    )}
                </div>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                        hasPrevPage
                            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                >
                    ← Previous
                </button>

                {/* Professional E-commerce Style Pagination */}
                {totalPages ? (
                    <>
                        {/* Generate page numbers dynamically */}
                        {(() => {
                            const pages = [];
                            const maxVisible = 7; // Show up to 7 page numbers
                            
                            if (totalPages <= maxVisible) {
                                // Show all pages if total is small
                                for (let i = 1; i <= totalPages; i++) {
                                    pages.push(i);
                                }
                            } else {
                                // Always show first page
                                pages.push(1);
                                
                                // Use safeCurrentPage to prevent errors
                                if (safeCurrentPage <= 3) {
                                    // Near the beginning: 1 2 3 4 5 ... last
                                    for (let i = 2; i <= Math.min(5, totalPages); i++) {
                                        pages.push(i);
                                    }
                                    if (totalPages > 5) {
                                        pages.push('...');
                                        pages.push(totalPages);
                                    }
                                } else if (safeCurrentPage >= totalPages - 2) {
                                    // Near the end: 1 ... (last-4) (last-3) (last-2) (last-1) last
                                    pages.push('...');
                                    for (let i = Math.max(totalPages - 4, 2); i <= totalPages; i++) {
                                        pages.push(i);
                                    }
                                } else {
                                    // In the middle: 1 ... (current-1) current (current+1) ... last
                                    pages.push('...');
                                    for (let i = safeCurrentPage - 1; i <= safeCurrentPage + 1; i++) {
                                        pages.push(i);
                                    }
                                    pages.push('...');
                                    pages.push(totalPages);
                                }
                            }
                            
                            return pages.map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            safeCurrentPage === page
                                                ? 'bg-primary-50 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ));
                        })()}
                    </>
                ) : (
                    /* Fallback when no total pages */
                    <span className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-50 text-white">
                        Page {currentPage}
                    </span>
                )}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                        hasNextPage
                            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                >
                    Next →
                </button>
            </div>
            
            {/* Navigation Info */}
            <div className="text-center mt-2">
                <span className="text-xs text-gray-500">
                    {hasPrevPage && (
                        <button 
                            onClick={() => onPageChange(1)}
                            className="text-blue-600 hover:text-blue-800 underline mr-2"
                        >
                            Go to First Page
                        </button>
                    )}
                    {hasNextPage && totalPages && (
                        <span className="text-gray-400">
                            Click Next to see more restaurants
                        </span>
                    )}
                    {totalPages && (
                        <div className="text-xs text-gray-400 mt-1">
                            Total: {totalCount} restaurants available
                        </div>
                    )}
                </span>
            </div>
        </div>
    );
};

export default Pagination;