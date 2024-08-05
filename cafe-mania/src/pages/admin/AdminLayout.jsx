import React, { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { AdminContext } from "../../context/AdminContext";
import Swal from "sweetalert2";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useContext(AdminContext);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        logout();
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been logged out successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/admin/login');
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  return (
    <>
      <div className="container-fluid">
        <div className="row vh-100 ">
          <div className={`position-sticky col-md-2 ${sidebarOpen ? 'd-block' : 'd-none'}`}>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </div>
          <div className={`col-md-${sidebarOpen ? '10' : '12'}`}>
            <div className="d-flex sticky-top justify-content-between align-items-center p-3 text-white" style={{"backgroundColor": '#795548'}}>
              <button className="btn btn-outline-light" onClick={toggleSidebar}>
                {sidebarOpen ? <AiOutlineClose/> : <AiOutlineMenu/>}
              </button>
              <h4 className="text-center flex-grow-1">Admin Dashboard</h4>
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </div>

            {/* main content */}
            <div className="flex-grow-1 overflow-hidden">
              <div className="h-100 mt-3 p-4 shadow-sm bg-light">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
