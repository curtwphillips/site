import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import '../../css/common.css';

export default function ForgotPassword() {
  return (
    <Container>
    <Row className="justify-content-md-center">
      <Col md='7'>
        <Form className="input-form">
          <h3>Forgot Password</h3>
          <br />
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <br />

          <Button variant="primary">
            Send password reset email
          </Button>

          <br />
          <br />

          <p className="forgot-password text-right">
            <Link to="/login">Cancel</Link>
          </p>
        </Form>
      </Col>
    </Row>
  </Container>
  );
}