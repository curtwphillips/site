import axios from 'axios';
import './Nav.css';
import { Link, useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import BitcoinPrice from './BitcoinPrice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../store/reducers/userSlice';

export default function AppNav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log('user:', user);

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
        hidden: () => !user.token,
        iconAttributes: {
          icon: faStickyNote,
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
        linkAttributes: {
          to: '/login',
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
            // remove token from axios
            axios.defaults.headers.common['authorization'] = '';

            // notify backend
            axios.post('logout', { token: user.token });

            dispatch(userLogout());
            console.log('dispatched user logout user:', user)
            // go home
            navigate('/', { replace: true });
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
