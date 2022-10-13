import {ethers} from "./ethers-5.6.esm.min.js";
import {abi} from "./constants";

const connectEl = document.querySelector("#connect");
const fundButtonEl = document.querySelector("#fund-button");

connectEl.onclick = connect;
fundButtonEl.onclick = fund;

async function connect(){
    try {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            await window.ethereum.request({method: "eth_requestAccounts"});
            console.log("Connect wallet!");
            connectEl.textContent = "Wallet Connected";
            connectEl.disabled = true;
          } else {
            console.log("No MetaMask");
            connectEl.textContent = "Please install MetaMask";
          }
    } catch (e){
        console.log(e);
    }

}

async function fund(amountToFund){
    console.log(`Funding with ${amountToFund}`);
    if (typeof window.ethereum !== 'undefined'){
        // provider/connection to chain, signer/wallet, contract's ABI and address
        // metamask is the provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // account is the signer
        const signer = provider.getSigner();
        // const contract = 
    }
}