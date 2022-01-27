import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import reportWebVitals from './reportWebVitals';
import Nav from './components/Nav';
import Home from './routes/home/home';
import About from './routes/about';
import Budget from './routes/budget/budget';
import Notes from './routes/notes/notes';
import Family from './routes/family/family';
import FamilyDetail from './routes/family/familyDetail';
import Links from './routes/links/links';
import Todos from './routes/todos/todos';
import Login from './routes/login/login';
import Register from './routes/login/register';
import ForgotPassword from './routes/login/forgotPassword';
import { Provider } from 'react-redux';
import store from './store';
import EC2Article from './routes/links/ec2';
import SSLArticle from './routes/links/ssl';
import CertBotArticle from './routes/links/cert-bot';
import CommandsArticle from './routes/links/commands';
import MacSetupArticle from './routes/links/mac-setup';

axios.defaults.baseURL = process.env.REACT_APP_API_BASEURL
console.log('axios api port:', process.env.REACT_APP_API_BASEURL)

const mainRoutes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/family',
    element: <Family />,
  },
  {
    path: '/family/:name',
    element: <FamilyDetail />,
  },
  {
    path: '/links',
    element: <Links />,
  },
  {
    path: '/links/cert-bot',
    element: <CertBotArticle />,
  },
  {
    path: '/links/ec2',
    element: <EC2Article />,
  },
  {
    path: '/links/commands',
    element: <CommandsArticle />,
  },
  {
    path: '/links/mac-setup',
    element: <MacSetupArticle />,
  },
  {
    path: '/links/ssl',
    element: <SSLArticle />,
  },
  {
    path: '/budget',
    element: <Budget />,
  },
  {
    path: '/notes',
    element: <Notes />,
  },
  {
    path: '/todos',
    element: <Todos />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
];

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Nav />
        <Routes>
          {
            mainRoutes.map(({path, element}, i) => <Route key={i} path={path} element={element} />)
          }
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
