import {
  BrowserRouter,
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import Navigation from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Create from './components/Create.jsx';
import MyListedItems from './components/MyListedItem.jsx';
import MyPurchases from './components/MyPurchases.jsx';
import MarketplaceAbi from './contracts/MarketPlace.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chains from "components/Chains";

import NFTAbi from './contracts/Nft.json';

import { useState } from 'react';
import { ethers } from "ethers";
import { Spinner } from 'react-bootstrap';

import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  

  const chainHandler = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
   })
  }

  // MetaMask Login/Connect
  const web3Handler = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
   })
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      chainHandler();
      
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract("0xAD9ad8C0F2d0aE25dd93b58Cb50F015409cfa7Dc", MarketplaceAbi.abi, signer);
    setMarketplace(marketplace);
    setLoading(false);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation Chains={Chains} web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route  path="/ethereum-boilerplate/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/ethereum-boilerplate/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/ethereum-boilerplate/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/ethereum-boilerplate/my-purchases" element={
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