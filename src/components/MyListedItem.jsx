import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap';

export default function MyListedItem({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const loadPurchasedItems = async () => {
    const results = await marketplace.connect(account).fetchMyNft();
    console.log(results);
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
     
      // get uri url from nft contract
      const tokenUri = await marketplace.tokenURI(i.tokenId);
      console.log(tokenUri);
      const meta= await axios.get(tokenUri);
     
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.tokenId);
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.tokenId,
        name: meta.data.name,
        description: meta.data.description,
        image: meta.data.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" width="200" height="200"  src={item.image} />
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
          </main>
        )}
    </div>
  );
}