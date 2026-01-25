import UpdateLocation from "@/components/auth/UpdateLocation";
import UpdateProfile from "@/components/auth/UpdateProfile";
import ChangePassword from "@/components/auth/ChangePassword";
import LayoutWrapper from "@/components/layoutWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function AccountSettings() {
    return (
        <>
            <div className="h-[72px] " />
            <LayoutWrapper className=" bg-primary-995 rounded-xl border border-primary-1006 py-10 mb-8 mt-10">
                <Tabs defaultValue="profile">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="change-password">Change Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <UpdateProfile />
                    </TabsContent>
                    <TabsContent value="change-password">
                        <ChangePassword />
                    </TabsContent>
                </Tabs>
            </LayoutWrapper>
            <LayoutWrapper className=" bg-primary-995 rounded-xl border border-primary-1006 py-10 ">
                <UpdateLocation />
            </LayoutWrapper>
        </>
    )
}

export default AccountSettings;
