import './Nav.css';
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import BitcoinPrice from './BitcoinPrice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const loggedIn = false;

export default function AppNav() {
  const links = {
    left: [
      {
        icon: faHome,
        text: 'Home',
        to: '/',
      },
      {
        icon: faUsers,
        text: 'Family',
        to: '/family',
      },
      {
        icon: faStickyNote,
        text: 'Todos',
        to: '/todos',
      },
    ],
    right: [
      {
        className: 'ms-auto',
        text: 'Login',
        to: '/login',
        icon: faSignInAlt,
        hidden: () => loggedIn
      },
      {
        className: 'ms-auto',
        text: 'Logout',
        to: '/logout',
        icon: faSignOutAlt,
        hidden: () => !loggedIn
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
              links.left.map(({ className, hidden, icon, text, to }, i) => (
                (!hidden || !hidden()) &&
                <Link key={i} className="nav-link" to={to}>{text + '  '}
                  {icon && <FontAwesomeIcon className="inline" icon={icon}/>}
                </Link>
              ))
            }
          </Nav>

          <Nav className="ms-auto vertical-center">
          <BitcoinPrice style={{ 'marginLeft': '30px', color: 'green' }} className="nav-link" />
            {
              links.right.map(({ className, hidden, icon, text, to }, i) => (
                (!hidden || !hidden()) &&
                <Link key={i} className="nav-link" to={to}>{text + '  '}
                  {icon && <FontAwesomeIcon className="inline" icon={icon}/>}
                </Link>
              ))
            }
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
};
