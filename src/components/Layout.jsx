import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HeaderAfterLogin from "./HeaderAfterLogin";

function Layout() {
  const user = window.lodash.isEmpty(window.user) ? false : true;
  return (
    <div>
      {user ? <HeaderAfterLogin /> : <Header />}
      {/* <HeaderAfterLogin /> */}
      {/* <Header /> */}
      <main>
        <Outlet /> {/* This is where the child page will be rendered */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
