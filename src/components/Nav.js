import axios from 'axios';
import './css/Nav.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import BitcoinPrice from './BitcoinPrice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faClipboard,
  faFileInvoiceDollar,
  faHome,
  faNewspaper,
  faSignInAlt,
  faSignOutAlt,
  faStickyNote,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../store/reducers/userSlice';
import { userLogin } from '../store/reducers/userSlice';

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  if (!user || !user.token) {
    let userStorage = localStorage.getItem('user');

    if (userStorage) {
      console.log('userStorage:', userStorage);
      userStorage = JSON.parse(userStorage);
      const bearerToken = `Bearer ${userStorage.token}`
      axios.defaults.headers.common['authorization'] = bearerToken;
      dispatch(userLogin(userStorage))
    }
  }

  const noAuthPaths = [
    '/',
    '/family',
    '/links',
  ];

  const links = {
    left: [
      {
        iconAttributes: {
          icon: faHome,
        },
        linkAttributes: {
          to: '/',
        },
        text: 'Home',
      },
      {
        iconAttributes: {
          icon: faUsers,
        },
        linkAttributes: {
          to: '/family',
        },
        text: 'Family',
      },
      {
        iconAttributes: {
          icon: faNewspaper,
        },
        linkAttributes: {
          to: '/links',
        },
        text: 'Links',
      },
      {
        hidden: () => !user.token,
        iconAttributes: {
          icon: faFileInvoiceDollar,
        },
        linkAttributes: {
          to: '/budget',
        },
        text: 'Budget',
      },
      {
        hidden: () => !user.token,
        iconAttributes: {
          icon: faStickyNote,
        },
        linkAttributes: {
          to: '/notes',
        },
        text: 'Notes',
      },
      {
        hidden: () => !user.token,
        iconAttributes: {
          icon: faClipboard,
        },
        linkAttributes: {
          to: '/todos',
        },
        text: 'Todos',
      },
    ],
    right: [
      {
        hidden: () => user.token,
        iconAttributes: {
          icon: faSignInAlt,
        },
        itemAttributes: {
          onClick: async () => {
            const currentPath = location.pathname;
            console.log('currentPath:', currentPath);
            if (currentPath === '/login') {
              return;
            }
            navigate(`/login?redirect=${currentPath.slice(1)}`, { replace: true });
          },
        },
        text: 'Login',
      },
      {
        hidden: () => !user.token,
        iconAttributes: {
          icon: faSignOutAlt,
        },
        itemAttributes: {
          onClick: async () => {
            dispatch(userLogout());
            // go home if on auth path
            const currentPath = location.pathname;
            console.log('currentPath:', currentPath);
            if (!noAuthPaths.includes(currentPath)) {
              navigate('/login', { replace: true });
            }
          },
        },
        text: 'Logout',
      },
    ],
  };

  return (
    <Navbar className="side-padding-10" collapseOnSelect expand="sm" sticky="top" bg="dark" variant="dark">
        <Link className="navbar-brand" to="/">Curtis Phillips</Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="vertical-center">
            {
              links.left.map(({ hidden, itemAttributes, linkAttributes, iconAttributes, text }, i) => (
                (!hidden || !hidden()) && (
                (linkAttributes && <Link key={i} className="nav-link" { ...linkAttributes }>{text + '  '}
                  {iconAttributes && <FontAwesomeIcon className="inline" { ...iconAttributes }/>}
                </Link>) || (
                  itemAttributes && <div key={i} { ...itemAttributes }>{text + '  '}
                  {iconAttributes && <FontAwesomeIcon className="inline" { ...iconAttributes }/>}
                  </div>
                ))
              ))
            }
          </Nav>

          <Nav className="ms-auto vertical-center">
          <BitcoinPrice style={{ 'marginLeft': '30px', color: 'green' }} className="nav-link" />
            {
              links.right.map(({ hidden, itemAttributes, linkAttributes, iconAttributes, text }, i) => (
                (!hidden || !hidden()) && (
                (linkAttributes && <Link key={i} className="nav-link" { ...linkAttributes }>{text + '  '}
                  {iconAttributes && <FontAwesomeIcon { ...iconAttributes }/>}
                </Link>) || (
                  itemAttributes && <div className="nav-link" key={i} { ...itemAttributes }>{text + '  '}
                  {iconAttributes && <FontAwesomeIcon { ...iconAttributes }/>}
                  </div>
                ))
              ))
            }
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
};
