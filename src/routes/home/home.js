import './home.css';

export default function Home() {
  return (
    <div className="parallax">
      <div className="spacer">
        {/* <p className="banner-text">Hey, <br /> I'm Curtis</p> */}
        </div>
      <div className="app-bar" style={{"backgroundColor": "white", color: "black"}}>
        <div className="lined">
          <h2><span>My journey</span></h2>
        </div>

        <div className="article-section">
          <h4>Prosper, Texas</h4>
          <br />
          <h6>A new home</h6>
          <br />
          <p>In 2021, we went home for the a long holiday with our parents. We spent Halloween, Thanksgiving, and Christmas in Texas</p>
          <br />
          <p>During our time back we found the community at Legacy Gardens and dreamed about what kind of home we could build there</p>
          <br />
          <p>We bought a lot and contracted with Drees to build our new home.</p>
          <br />
          <br />
          <div className="article-section-image">
            <div className="side-by-side-2">
              <img alt="" src="/img/2021-arboritum-dallas.png" />
              <img alt="" src="/img/elmsdale-home.png" />
            </div>
          </div>
          <br />
          <hr />
          <br />
          <br />
        </div>

        <div className="article-section">
          <h4>Palmas del Mar, Puerto Rico</h4>
          <br />
          <h6>The island life</h6>
          <br />
          <p>In 2019 my family and I went to visit Puerto Rico.</p>
          <br />
          <p>We made a trip to every corner of the island and fell in love with the community of Palmas del Mar.</p>
          <br />
          <p>Palmas is an upscale community on the east side of the island with beautiful beaches and views.
            Shortly after, we purchased a condo in Harbour Lakes and prepared for our new life.
          </p>
          <br />
          <p>During our time in Palmas we went on many adventures. We climbed El Yunque, the tallest mountain in Puerto Rico. We spent our days at the many beaches exploring. I learned to sail and got my scuba diving certification.</p>
          <br />
          <div className="article-section-image">
            <div className="side-by-side-2">
              <img alt="" src="/img/pr-learn-to-sail.png" />
              <img alt="" src="/img/pr-isaac-noah-lunch.png" />
            </div>
          </div>
          <br />
          <hr />
          <br />
          <br />
        </div>
        
        <div className="article-section">
          <h4>Celina, Texas</h4>
          <br />
          <h6>Heading north</h6>
          <br />
          <p>In 2017 my family was ready for a new home. We found out about a new community, Light Farms, where we could build a new home in Celina.</p>
          <br />
          <p>We were excited to have our first new home. Construction was complete in October of 2017 and we moved into our new home.</p>
          <br />
          <p>We enjoyed grilling outdoors and swimming in the backyard. We played tennis together in the neighborhood courts. We watched movies and gamed in the media room.
          </p>
          <br />
          <p>We also got out for some hikes, kayaking and fishing.</p>
          <br />
          
          {/* <div className="article-section-image">
            <div className="side-by-side">
              <img alt="" src="/img/celina-backyard-swimming.png" />
            </div>
            <div className="side-by-side">
              <img alt="" src="/img/celina-mimi-fish.png" />
            </div>
          </div> */}

          <div className="article-section-image">
            <div className="side-by-side-2">
              <img alt="" src="/img/celina-mimi-fish.png" />
              <img alt="" src="/img/celina-backyard-swimming.png" />
            </div>
          </div>

          <br />
          <hr />
          <br />
          <br />
        </div>

        <div className="article-section">
          <h4>The early years</h4>
          <br />
          <h6>History</h6>
          <br />
          <p>Yet to be written...</p>
          <br />
          {/* <div className="article-section-image">
            <div className="side-by-side-2">
              <img alt="" src="/img/pr-learn-to-sail.png" />
              <img alt="" src="/img/pr-isaac-noah-lunch.png" />
            </div>
          </div> */}
          <br />
          <hr />
          <br />
          <br />
        </div>
      </div>
    </div>
  )
}