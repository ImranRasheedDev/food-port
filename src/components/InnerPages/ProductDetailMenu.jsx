import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductDetailMenu({ menuItems }) {
    return (
        <div className="bg-white flex justify-center gap-x-20 py-2">
            <div className="relative bg-primary-995 w-[260px] h-10 rounded-full">
                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-primary-1013 w-4 h-4" />
                <input type="text" placeholder="Search in menu" className="w-full h-full rounded-full pl-10 text-primary-1013 shadow-[inset_0_0_0_1px_#F7F7F7]" />
            </div>
            <ul className="flex gap-x-10 ">
                {
                    menuItems.map((item, index) => (
                        <li key={index}>
                            <Link className="px-4 relative product-detail-menu-link text-primary-950 font-medium" to={item.to}>{item.name} ({item.count})</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}