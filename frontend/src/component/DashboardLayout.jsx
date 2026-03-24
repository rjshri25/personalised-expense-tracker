import { Outlet } from "react-router-dom"
import MenuBar from "./MenuBar"
export default function DashboardLayout() {
    return ( <>
   <div className="dashboard-layout">
      <MenuBar />
      <div className="OutletContainer">
        <Outlet />
      </div>
    </div>
     </>  
    )
}