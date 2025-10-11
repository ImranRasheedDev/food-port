import { Search } from "lucide-react";

export default function ProductDetailMenu({ menuItems }) {
    const handleMenuClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="bg-white lg:flex gap-x-20 lg:py-2 py-6 container mx-auto lg:px-0 px-6">
            <div className="relative bg-primary-995 lg:w-[260px] w-full h-10 rounded-full mb-4 lg:mb-0">
                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-primary-1013 w-4 h-4" />
                <input type="text" placeholder="Search in menu" className="w-full h-full rounded-full pl-10 text-primary-1013 shadow-[inset_0_0_0_1px_#F7F7F7]" />
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