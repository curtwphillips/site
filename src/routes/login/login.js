import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import '../../css/common.css';

const rememberMe = (e) => console.log(e.target);

export default function Login() {
  return (
    <Container>
    <Row className="justify-content-md-center">
      <Col md='7'>
        <Form className="input-form">
          <h3>Sign In</h3>
          <p>or <Link to="/register">create a new account</Link></p>
          <br />
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <br />

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
          </Form.Group>

          <br />

          <Form.Group>
            <Form.Label>Remember me</Form.Label>
            <Form.Check onChange={rememberMe} className="inline ml-10" type="checkbox" id={1}/>
          </Form.Group>

          <Button variant="primary">
            Submit
          </Button>

          <br />
          <br />

          <p className="forgot-password text-right">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </Form>
      </Col>
    </Row>
  </Container>
  );
}