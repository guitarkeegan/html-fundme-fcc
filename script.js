import {ethers} from "./ethers-5.6.esm.min.js";
import {abi, contractAddress} from "./constants.js";

console.log(ethers);

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

async function fund(){
    const ethAmount = "0.3"
    console.log(`Funding with ${ethAmount}`);
    if (typeof window.ethereum !== 'undefined'){
        // provider/connection to chain, signer/wallet, contract's ABI and address
        // metamask is the provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // account is the signer
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try{
            const trasactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)});
            // console.log(`transaction response\n${JSON.stringify(trasactionResponse)}`);
            await listenForTransactionMine(trasactionResponse, provider);
        } catch(e){
            console.log(e);
        }
      
    }
}

function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject)=>{
        provider.once(transactionResponse.hash, function(transactionReceipt){
            // console.log(`Transaction Receipt\n${JSON.stringify(transactionReceipt)}`);
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations `);
            resolve();
    });
    })
    // create a listener for the blockchain
}