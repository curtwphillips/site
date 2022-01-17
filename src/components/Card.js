import './Card.css';
import { Link } from "react-router-dom";

export default function Card({ card }) {
  const {
    background,
    image,
    link,
    name,
    type
  } = card;

  return (
    <div className="card" style={{ backgroundColor: background }}>
      <Link to={link}>
      <div>
        <h3>Name: { name }</h3>
        <p>type: { type }</p>
      </div>
      <div className="image-container">
        <img alt="" src={image} />
      </div>
      </Link>
    </div>
  )
}