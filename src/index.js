import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import reportWebVitals from './reportWebVitals';
import Nav from './components/Nav';
import Home from './routes/home/home';
import About from './routes/about';
import Family from './routes/family/family';
import FamilyDetail from './routes/family/familyDetail';
import Todos from './routes/todos/todos';
import Login from './routes/login/login';
import Register from './routes/login/register';
import ForgotPassword from './routes/login/forgotPassword';

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/family" element={<Family />} />
      <Route path="/family/:name" element={<FamilyDetail />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  </BrowserRouter>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
