
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function AlertBox({ error, message, onClick, show }) {
  return (
    <Alert show={show} variant="danger">
      <Alert.Heading>There was a problem</Alert.Heading>
      <p>
        { message || '' }
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button className="ml-10" onClick={onClick} variant="outline-primary">
          Close
        </Button>
      </div>
    </Alert>
  );
}