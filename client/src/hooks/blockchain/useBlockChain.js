import { useState, useEffect } from "react";
import { ethers } from "ethers";
import staysphereABI from "../contracts/StayspherePayments.json";

const CONTRACT_ADDRESS = "DEPLOYED_CONTRACT_ADDRESS";

const useBlockchain = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) setWalletAddress(accounts[0]);
      }
    };
    checkWallet();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWalletAddress(accounts[0]);
  };

  const payHost = async (hostAddress, amount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        staysphereABI,
        signer
      );
      const tx = await contract.payHost(hostAddress, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Payment successful!");
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return { walletAddress, connectWallet, payHost };
};

export default useBlockchain;
