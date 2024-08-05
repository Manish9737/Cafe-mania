import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from '../Data/SidebarData';
import '../Assets/CSS/sidebar.css';
import { IconContext } from 'react-icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className='w-100 ' id='sidebar'>
      <IconContext.Provider value={{ color: 'undefined' }}>
        <nav className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items" onClick={toggleSidebar}>
            <li className="navbar-toggle list-unstyled text-center text-dark fs-4 p-4" style={{ fontFamily: "Pacifico, cursive"}}>
              Cafe-Mania
            </li>
            {SidebarData.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span className='ms-3'>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
};

export default Sidebar;
