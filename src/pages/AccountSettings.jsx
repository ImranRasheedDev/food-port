import UpdateLocation from "@/components/auth/UpdateLocation";
import UpdateProfile from "@/components/auth/UpdateProfile";
import LayoutWrapper from "@/components/layoutWrapper";

function AccountSettings() {
    return (
        <>
            <div className="h-[72px] " />
            <LayoutWrapper className=" bg-primary-995 rounded-xl border border-primary-1006 py-10  mb-8 mt-10">
                <UpdateProfile />
            </LayoutWrapper>
            <LayoutWrapper className=" bg-primary-995 rounded-xl border border-primary-1006 py-10 ">
                <UpdateLocation />
            </LayoutWrapper>
        </>
    )
}

export default AccountSettings;