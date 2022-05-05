import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const loadMarketplaceItems =  async () => {
   
    const data = await marketplace.fetchMarketItems();

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await marketplace.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      const totalPrice = await marketplace.getTotalPrice(i.tokenId);
      let item = {
        totalPrice,
        itemId: i.tokenId,
        seller: i.seller,
        name: meta.data.name,
        description: meta.data.description,
        image: meta.data.image
      }
      return item;
    }))
    setLoading(false);
    setItems(items);
  }

  const buyMarketItem = async (item) => {

    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait();
    loadMarketplaceItems();
  }

  useEffect(() => {
    loadMarketplaceItems();
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" width="200" height="200"  src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home;