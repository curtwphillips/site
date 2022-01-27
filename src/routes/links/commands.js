import { Container } from "react-bootstrap";
import './articles.css';

export default function CommandsArticle() {
  return (
    <Container className="vertical-padding-40">
      <h3>Commands</h3>
      <p>make file executable</p>
      <div className="mb1rem">
        <code>chmod 755 [file path]</code>
      </div>
      <p>Protect a pem key</p>
      <div className="mb1rem">
        <code>chmod 400 [key file path]</code>
      </div>
    </Container>
  )
}