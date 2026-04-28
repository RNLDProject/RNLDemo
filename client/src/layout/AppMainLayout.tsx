import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "../Context/SideBarContext";
import { HeaderProvider } from "../Context/HeaderContext";

const LayoutContent = () => {
  return (
    <>
      <div>
        <AppSidebar />
      </div>
      <div>
        <AppHeader />
      </div>
      <div className="p-20 -ml-14 sm:ml-52">
        <Outlet />
      </div>
    </>
  );
};

const AppMainLayout = () => {
  return (
    <>
      <HeaderProvider>
        <SidebarProvider>
          <LayoutContent />
        </SidebarProvider>
      </HeaderProvider>
    </>
  );
};

export default AppMainLayout;
