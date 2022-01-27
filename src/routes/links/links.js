import { Card, CardGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const data = [
  {
    header: 'Bitcoin',
    links: [
      {
        link: 'https://jochen-hoenicke.de/queue/#4,2h',
        title: 'Mem Pool',
      },
      {
        link: 'https://blockstream.info/',
        title: 'Block Explorer',
      },
      {
        link: 'pro.coinbase.com',
        title: 'Exchange',
      },
      {
        link: 'coinmarketcap.com',
        title: 'Market Cap',
      },
      {
        link: 'blockchain.com/charts/hash-rate',
        title: 'Hash Rate',
      },
      {
        link: 'lookintobitcoin.com/charts/pi-cycle-top-indicator',
        title: 'Pi Cycle Tops',
      },
      {
        link: 'irs.gov/publications/p570#en_US_2020_publink1000221188',
        title: 'IRS Residency Rules',
      },
      {
        link: 'nakamotoinstitute.org/mempool/everyones-a-scammer',
        title: "Everyone's a Scammer Article",
      },
      {
        link: 'stats.buybitcoinworldwide.com/stock-to-flow',
        title: "Stock to Flow",
      },
    ],
  },
  {
    header: 'My Writings',
    links: [
      {
        link: 'cert-bot',
        title: 'Cert Bot',
        useLink: true,
      },
      {
        link: 'commands',
        title: 'Commands',
        useLink: true,
      },
      {
        link: 'ec2',
        title: 'EC2',
        useLink: true,
      },
      {
        link: 'mac-setup',
        title: 'Mac Setup',
        useLink: true,
      },
      {
        link: 'ssl',
        title: 'SSL',
        useLink: true,
      },
    ],
  },
];

export default function Links() {
  return (
    <Container className="vertical-padding-40 center">
    <h3>Links</h3>
    <CardGroup>
    {
      data.map(({links, header}, i) => {
        return (<Card key={i} className="">
          <Card.Header>{header}</Card.Header>
          {
            links.map(({title, link, useLink}, j) => {
              return (
                (useLink && <Link className="vertical-padding-5" key={`${i}-${j}`} to={title}>{link}</Link>) || 
                (
                  <div className="vertical-padding-5" key={`${i}-${j}`}>
                    <a target="_blank" rel="noreferrer" href={link}>{title}</a>
                  </div>
                )
              )
            })
          }
        </Card>
        )
      })
    }
    </CardGroup>
    </Container>
  )
}