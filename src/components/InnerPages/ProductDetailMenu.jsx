import { Search } from "lucide-react";
import { useState, useCallback } from "react";

export default function ProductDetailMenu({ menuItems, onSearchChange }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleMenuClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Debounced search handler
    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    }, []);

    const debouncedSearch = useCallback(
        debounce((value) => {
            onSearchChange?.(value);
        }, 300),
        [onSearchChange]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <div className="bg-white lg:flex gap-x-20 lg:py-2 py-6 container mx-auto lg:px-0 px-6">
            <div className="relative bg-primary-995 lg:w-[260px] w-full h-10 rounded-full mb-4 lg:mb-0">
                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-primary-1013 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search in menu" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full h-full rounded-full pl-10 pr-4 text-primary-1013 shadow-[inset_0_0_0_1px_#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary-500" 
                />
            </div>
            <ul className="flex max-sm:flex-wrap lg:gap-x-10 gap-x-0">
                {
                    menuItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleMenuClick(item.id)}
                                className={`lg:px-4 px-2 relative lg:text-base text-sm text-primary-950 font-medium cursor-pointer ${index === 0 ? 'product-detail-menu-link' : ''}`}
                            >
                                {item.name} ({item.count})
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}