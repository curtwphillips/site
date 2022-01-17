import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import '../../css/common.css';

export default function Register() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md='7'>
          <Form className="input-form">
            <h3>Sign Up</h3>
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

            <Button variant="primary">
              Sign Up
            </Button>

            <br />
            <br />
            <br />

            <p className="forgot-password text-right">
              Already registered <Link to="/login">sign in?</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}