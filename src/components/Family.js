import Container from '../components/Container';
import { Link } from "react-router-dom";
import './Family.css';

export default function Family({profile}) {
  const {
    description,
    image,
    name,
    relation,
    previous,
    next,
  } = profile;

  return (
    <Container>
      <div className="family-container">
        <h4>{name}</h4>
        <h6>my {relation}</h6>
        <br />
        <p>{description}</p>
        <br />
        <div className="image-container">
          <img alt="" src={image} />
        </div>
        <br />
      </div>
      <div className="link">
        <Link to={previous}>Prev</Link>
        <Link to={next}>Next</Link>
      </div>
    </Container>
  )
}