import React, { useState } from 'react';
import '../App.css'; 
import { useNavigate } from 'react-router-dom';
import {
  Connection,
  clusterApiUrl,
  Keypair,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

const TokenCreate = () => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    try {
      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        throw new Error("Solana wallet not found");
      }
      
      await provider.connect();
      const payer = provider.publicKey;

      const mintAuthority = Keypair.generate();

      // Create the token mint
      const tokenMint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        null,
        9 // Decimals for the token
      );

      console.log("Token Mint Address:", tokenMint.toBase58());

      // Get the token account of the payer
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        tokenMint,
        payer
      );

      // Mint some tokens to the payer's token account
      await mintTo(
        connection,
        payer,
        tokenMint,
        tokenAccount.address,
        mintAuthority,
        200000 // Initial amount to mint (200k tokens)
      );

      alert(`Token successfully created! Address: ${tokenMint.toBase58()}`);
      navigate('/');
    } catch (e) {
      console.error("An error occurred while creating the token", e);
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <button className="nav-button" onClick={connectWallet}>[connect wallet]</button>
      </nav>
      <div className="token-create-container">
        <h3 className="start-new-coin" onClick={() => navigate('/')}>[go back]</h3>
        <p className="info-text">MemeCoin creation fee: 0.01 ORE</p>
        <p className="info-text">Max supply: 1 million tokens. Initial mint: 200k tokens.</p>
        <p className="info-text">If funding target of 24 ORE is met, a liquidity pool will be created on Raydium.</p>
        <div className="input-container">
          <input
            type="text"
            placeholder="Token Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Ticker Symbol"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-field"
          />
          <button className="create-button" onClick={handleCreate}>Create MemeToken</button>
        </div>
      </div>
    </div>
  );
};

export default TokenCreate;

