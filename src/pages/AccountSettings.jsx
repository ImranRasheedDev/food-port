import UpdateLocation from "@/components/auth/UpdateLocation";
import UpdateProfile from "@/components/auth/UpdateProfile";

function AccountSettings() {
    return (
        <>
            <div className="h-[72px] " />
            <div className="container mx-auto bg-primary-995 rounded-xl border border-primary-1006 py-10 px-10 mb-8 mt-10">
                <UpdateProfile />
            </div>
            <div className="container mx-auto bg-primary-995 rounded-xl border border-primary-1006 py-10 px-10">
                <UpdateLocation />
            </div>
        </>
    )
}

export default AccountSettings;