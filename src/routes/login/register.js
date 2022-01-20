import axios from 'axios';
import { useState } from "react";
import { Link } from "react-router-dom";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import '../../css/common.css';
import AlertBox from '../../components/AlertBox';
import { getAxiosError, setStateKeyVal } from '../../utilities';

export default function Register() {
  const [state, updateState] = useState({
    email: 'curtwphillips@gmail.com',
    password: 'test',
    error: '',
  });

  async function register() {
    console.log('registering user');
    console.log('state:', state)
    try {
      const result = await axios.post('register', { email: state.email, password: state.password });
      console.log('result.data:', result.data);
    } catch (err) {
      const error = getAxiosError(err);
      console.log(error);
      setStateKeyVal(state, 'error', error, updateState);
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md='7'>
          <Form className="input-form">
            <h3>Sign Up</h3>

            <p className="forgot-password text-right">
              Already registered <Link to="/login">sign in?</Link>
            </p>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" defaultValue={state.email || 'curtwphillips@gmail.com'}/>
            </Form.Group>

            <br />

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" defaultValue={state.password || 'test'}/>
            </Form.Group>

            <br />

            <Button variant="primary" onClick={register}>
              Sign Up
            </Button>

            <br />
            <br />

            <AlertBox
              show={state.error ? true : false}
              variant="danger"
              message={(state.error && state.error.text) || state.error}
              onClick={() => setStateKeyVal(state, 'error', null, updateState)}
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}