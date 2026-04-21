import { useLocation } from "react-router-dom";
import SetLocationForm from "@/components/auth/SetLocationForm";

function SetLocation() {
    const location = useLocation();
    const address = location.state?.address || null;

    return (
        <>
            <div className="h-[72px]" />
            <div className="container mx-auto bg-primary-995 rounded-xl border border-primary-1006 py-10 px-10 mt-10 ">
                <SetLocationForm address={address} />
            </div>
        </>
    )
}

export default SetLocation;