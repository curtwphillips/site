import './css/FamilyCard.css';
import { Link } from "react-router-dom";

export default function FamilyCard({ card }) {
  const {
    background,
    image,
    link,
    name,
    type
  } = card;

  return (
    <div className="family-card" style={{ backgroundColor: background }}>
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