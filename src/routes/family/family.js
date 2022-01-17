import Card from '../../components/Card';
import family from '../../data/familyData.json';
// import FamilyTree from '../../components/FamilyTree';

export default function Family () {
  return (
    <>
      <div className="card-container">
        {family.cards.map((card, i) => <Card key={i} card={card} />)}
      </div>
      {/* <FamilyTree /> */}
    </>
  )
}