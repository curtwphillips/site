import { Container } from "react-bootstrap";
import './articles.css';

export default function MacSetupArticle() {
  return (
    <Container className="vertical-padding-40">
      <h3>Mac Setup</h3>

      <p>install docker-compose</p>
      <div className="mb1rem">
        <code>brew install docker-compose</code>
      </div>
    </Container>
  )
}