import * as AiIcons from 'react-icons/ai';
// import * as IoIcons from 'react-icons/io';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

export const SidebarData = [
    {
        title: 'Dashboard',
        path: '/admin/',
        icon: <MdIcons.MdDashboard />,
        cName: 'nav-text list-unstyled',
    },
    {
        title: 'Users',
        path: '/admin/users',
        icon: <FaIcons.FaUserAlt />,
        cName: 'nav-text list-unstyled',
    },
    {
        title: 'Products',
        path: '/admin/products',
        icon: <MdIcons.MdFastfood />,
        cName: 'nav-text list-unstyled',
    },
    {
        title: 'Orders',
        path: '/admin/orders',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text list-unstyled',
    },
    {
        title: 'Payments',
        path: '/admin/payments',
        icon: <FaIcons.FaRupeeSign />,
        cName: 'nav-text list-unstyled',
    },
    {
        title: 'Invoice',
        path: '/admin/invoice',
        icon: <FaIcons.FaFileInvoice />,
        cName: 'nav-text list-unstyled',
    },
    {
        title: 'Feedbacks',
        path: '/admin/feedbacks',
        icon: <FaIcons.FaEnvelopeOpenText />,
        cName: 'nav-text list-unstyled',
    },
    {
        title: 'Support',
        path: '/support',
        icon: <AiIcons.AiFillQuestionCircle />,
        cName: 'nav-text list-unstyled',
    },
];