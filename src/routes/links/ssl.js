import { Container } from "react-bootstrap";

export default function SSLArticle() {
  return (
    <Container className="vertical-padding-40">
      <h3>How to create an ssl certificate</h3>
      <p>code below</p>
      <code>$ openssl genrsa 2048 {'>'} certs/privatekey.pem</code>
      <p>next type this</p>
      <code>$ openssl req -new -key certs/privatekey.pem -out certs/csr.pem</code>
      <p>next type this</p>
      <code>$ openssl x509 -req -days 1090 -in certs/csr.pem -signkey certs/privatekey.pem -out certs/public.crt</code>
    </Container>
  )
}