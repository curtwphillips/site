import { Container } from "react-bootstrap";
import '../../css/common.css';
import Family from '../../components/Family';
import familyData from '../../data/familyData.json';
import { useParams } from 'react-router-dom'

export default function FamilyDetail() {
  const { name } = useParams()
  const { profiles } = familyData;

  const index = profiles.findIndex((profile) => profile.name.toLowerCase() === name);
  const profile = profiles[index];

  // set up previous
  if (index === 0) {
    profile.previous = `/family/${profiles[profiles.length - 1].name.toLowerCase()}`;
  } else {
    profile.previous = `/family/${profiles[index - 1].name.toLowerCase()}`;
  }

  // set up next
  if (index === profiles.length - 1) {
    profile.next = `/family/${profiles[0].name.toLowerCase()}`;
  } else {
    profile.next = `/family/${profiles[index + 1].name.toLowerCase()}`;
  }

  return (
    <Container className="vertical-padding-40 center">
      <Family profile={profile}/>
    </Container>
  )
}