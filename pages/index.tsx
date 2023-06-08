import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
 
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
 
import styles from "../styles/Home.module.css";
import Kittycoin from "../contract/kittycoin.json";
import { Card } from "@mui/material";
import Image from "next/image";
 
const Home: NextPage = () => {
 const [provider, setProvider] = useState<any>(null);
 const [signer, setSigner] = useState<any>(null);
 const [balance, setBalance] = useState<string>("0");
 const [account, setAccount] = useState<string | null>(null);
 const [kittycoin, setKittycoin] = useState<any>(null);
 const [balanceKCN, setBalanceKCN] = useState<string>("0");
 
 const kittycoinAddress = "0xe862e1A6Dd754BB6dB8737849E0c84FAdb87D839";
 
 useEffect(() => {
 if (window.ethereum) {
 console.log("MetaMask is installed!");
 const provider = new ethers.providers.Web3Provider(window.ethereum);
 setProvider(provider);
 const signer = provider.getSigner();
 setSigner(signer);
 } else {
 console.log("Please install MetaMask!");
 }
 }, []);
 
 useEffect(() => {
 if (signer) {
 signer.getAddress().then((address: string) => setAccount(address));
 }
 }, [signer]);
 
 useEffect(() => {
 if (provider && account) {
 provider.getBalance(account).then((balance: ethers.BigNumberish) => {
 setBalance(ethers.utils.formatEther(balance));
 });
 }
 }, [provider, account]);
 
 useEffect(() => {
 if (provider && account) {
 const contract = new ethers.Contract(kittycoinAddress, Kittycoin, provider);
 setKittycoin(contract);
 
 contract.balanceOf(account).then((balance: ethers.BigNumber) => {
 setBalanceKCN(ethers.utils.formatEther(balance));
 });
 }
 }, [provider, account]);

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const toAddress = form.elements.namedItem("to") as HTMLInputElement;
    const amountToSend = form.elements.namedItem("amount") as HTMLInputElement;
    
    if (kittycoin && signer) {
      const kittycoinWithSigner = kittycoin.connect(signer);
      const amount = ethers.utils.parseEther(amountToSend.value);
      try {
        const tx = await kittycoinWithSigner.transfer(toAddress.value, amount);
        await tx.wait();
        alert("Transfer successful!");
      } catch (error) {
        console.error(error);
        alert("Transfer failed!");
      }
    }
  };

  const handleBuyKittycoin = async () => {
    if (kittycoin && signer) {
      const kittycoinWithSigner = kittycoin.connect(signer);
      const amount = ethers.utils.parseEther("1"); // Montant fixe d'ETH à échanger contre des Kittycoin
      const ownerAddress = await kittycoinWithSigner.owner();
  
      try {
        const tx = await kittycoinWithSigner.transfer(ownerAddress, amount);
        await tx.wait();
        alert("Purchase successful!");
  
        const updatedBalanceKCN = ethers.utils.formatEther(
          await kittycoinWithSigner.balanceOf(account)
        );
        const updatedBalanceETH = ethers.utils.formatEther(
          await provider.getBalance(account)
        );
        setBalanceKCN(updatedBalanceKCN);
        setBalance(updatedBalanceETH);
      } catch (error) {
        console.error(error);
        alert("Purchase failed!");
      }
    }
  };  
 
 return (
    <div>
      <Head>
        <title>Kitty Coin</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
  
      <main className={styles.main}>
        <Image className={styles.image} src="https://www.svgrepo.com/show/443128/brand-hello-kitty.svg" alt="Hello Kitty" width={500} height={300} />
        <Card className={styles.card}>
          <p>
          Kitty Coin is an emerging meme coin that has gained popularity in the crypto space. Embracing the power of internet memes, Kitty Coin brings a playful and humorous twist to the world of cryptocurrencies.
          </p>
          <p>
          As a meme coin, Kitty Coin is primary utility lies in its ability to engage and entertain the community. It serves as a creative outlet for meme enthusiasts, providing a platform to share jokes, memes, and humorous content related to the cryptocurrency ecosystem.
          </p>
          <p>
          Beyond its entertainment value, Kitty Coin also fosters a sense of community and camaraderie among its holders. Being part of the Kitty Coin community allows individuals to connect with like-minded meme enthusiasts, share experiences, and participate in various community-driven initiatives.
          </p>
          <p>
          While meme coins like Kitty Coin may not have traditional use cases or solve specific problems, their value lies in their ability to bring joy, laughter, and a sense of belonging to the crypto community. They serve as a lighthearted and fun expression of the evolving digital landscape.
          </p>
          <p>
          It is important to note that meme coins, including Kitty Coin, are highly speculative and can be subject to significant price volatility. Therefore, it is essential to approach them with caution and conduct thorough research before engaging with them.
          </p>
        </Card>
        <button className={styles.button} onClick={handleBuyKittycoin}>
          Buy Kittycoin
          <Image className={styles.icon} src="https://www.svgrepo.com/show/443128/brand-hello-kitty.svg" alt="Hello Kitty icon" width={24} height={24} />
        </button>
        <Card className={styles.card}>
          <h2>Kitty Coin</h2>
          <ConnectButton /> 
          <p>Address: {account}</p>
          <p>Balance Ethers: {balance} ETH</p>
          <p>Balance Kittycoin: {balanceKCN} KCN</p>
        </Card>
        <Card className={styles.card}>
          <h2>Send Kitty Coin !</h2>
          <form onSubmit={onSubmit}>
            <label htmlFor="to">Recipient</label>
            <input name="to" type="text" />
            
            <label htmlFor="amount">Amount</label>
            <input name="amount" type="number" />
            
            <button className={styles.button} type="submit">Send</button>
          </form>
        </Card>
      </main>
    </div>
  );
};
 
export default Home;