import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './components/Navbar.jsx';
import Home from './components/Home.jsx'
import Create from './components/Create.jsx'
import MyListedItems from './components/MyListedItem.jsx'
import MyPurchases from './components/MyPurchases.jsx'
import MarketplaceAbi from './contracts/MarketPlace.json'
import 'bootstrap/dist/css/bootstrap.min.css';

import NFTAbi from './contracts/Nft.json'

import { useState } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'

import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract("0x5E9C9FdD56Fa076B88830e10aF48C132134a125c", MarketplaceAbi.abi, signer);
    setMarketplace(marketplace);
    const nft = new ethers.Contract("0x3Dbb0D1cf56926E5157FED3b7eed6A3Fb746Fb99", NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
