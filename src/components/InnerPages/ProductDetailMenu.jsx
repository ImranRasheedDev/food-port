import { Search } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import LayoutWrapper from "../layoutWrapper";

export default function ProductDetailMenu({ menuItems, onSearchChange }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSection, setActiveSection] = useState(menuItems[0]?.id || "");
    const tabContainerRef = useRef(null);
    const isManualClick = useRef(false);

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

    // Set up Intersection Observer to track active section
    useEffect(() => {
        // Set initial active section if not already set
        if (!activeSection && menuItems.length > 0) {
            setActiveSection(menuItems[0].id);
        }

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            // Don't update if we just manually clicked a tab
            if (isManualClick.current) return;
            
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all menu sections
        menuItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        // Cleanup
        return () => {
            menuItems.forEach((item) => {
                const element = document.getElementById(item.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [menuItems, activeSection]);

    const handleMenuClick = (sectionId) => {
        isManualClick.current = true;
        setActiveSection(sectionId);
        
        // Scroll the active tab into view first (for mobile)
        if (window.innerWidth < 1024 && tabContainerRef.current) {
            setTimeout(() => {
                const activeButton = tabContainerRef.current.querySelector('.product-detail-menu-link');
                if (activeButton) {
                    activeButton.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }, 50);
        }
        
        const element = document.getElementById(sectionId);
        if (element) {
            // For mobile devices, use different scroll behavior
            if (window.innerWidth < 1024) {
                // On mobile, use a proper offset to account for fixed header and tab bar
                setTimeout(() => {
                    const header = document.querySelector('header') || document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const menuBarHeight = 140; // Account for menu bar height
                    
                    const elementPosition = element.offsetTop;
                    const offsetPosition = elementPosition - headerHeight - menuBarHeight;
                    
                    window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                // Desktop behavior
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Reset the manual click flag after scrolling completes
        setTimeout(() => {
            isManualClick.current = false;
        }, 2000);
    };

    // Auto-scroll active tab into view on mobile - only when scrolling naturally (not manual click)
    useEffect(() => {
        if (activeSection && window.innerWidth < 1024 && tabContainerRef.current && !isManualClick.current) {
            // Only auto-scroll tabs when user is scrolling through the page naturally
            // Disabled to prevent conflicts with manual clicking
            return;
        }
    }, [activeSection]);

  return (
    <LayoutWrapper>
      <div className="bg-white border-b border-gray-100">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center gap-x-20 py-2 px-0">
          <div className="relative bg-primary-995 w-[260px] h-10 rounded-full">
            <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-primary-1013 w-4 h-4" />
            <input
              type="text"
              placeholder="Search in menu"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-full rounded-full pl-10 pr-4 text-primary-1013 shadow-[inset_0_0_0_1px_#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <ul className="flex gap-x-10">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`px-4 relative text-base text-primary-950 font-medium cursor-pointer transition-all duration-200 hover:text-primary-600 ${
                    activeSection === item.id ? "product-detail-menu-link" : ""
                  }`}
                >
                  {item.name} ({item.count})
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Search Bar */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="relative bg-primary-995 w-full h-12 rounded-full">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-primary-1013 w-5 h-5" />
              <input
                type="text"
                placeholder="Search in menu"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-full rounded-full pl-12 pr-4 text-primary-1013 shadow-[inset_0_0_0_1px_#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
              />
            </div>
          </div>

          {/* Horizontal Scrollable Tabs */}
          <div className="px-4 py-3">
            <div ref={tabContainerRef} className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-x-6 min-w-max pb-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuClick(item.id)}
                    className={`relative flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-lg ${
                      activeSection === item.id
                        ? "text-primary-600 bg-primary-50 product-detail-menu-link"
                        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name} ({item.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
