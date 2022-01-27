import { Container } from "react-bootstrap";
import FamilyCard from '../../components/FamilyCard';
import family from '../../data/familyData.json';
// import FamilyTree from '../../components/FamilyTree';

export default function Family () {
  return (
    <Container className="vertical-padding-40 center">
      <div className="family-card-container">
        {family.cards.map((card, i) => <FamilyCard key={i} card={card} />)}
      </div>
      {/* <FamilyTree /> */}
    </Container>
  )
}