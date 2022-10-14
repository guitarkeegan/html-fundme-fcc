import {ethers} from "./ethers-5.6.esm.min.js";
import {abi, contractAddress} from "./constants.js";

console.log(ethers);

const connectEl = document.querySelector("#connect");
const fundButtonEl = document.querySelector("#fund-button");
const balanceButtonEl = document.querySelector("#getBalance");
const withdrawEL = document.querySelector("#withdraw");

connectEl.onclick = connect;
fundButtonEl.onclick = fund;
balanceButtonEl.onclick = getBalance;
withdrawEL.onclick = withdraw;

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
    const ethAmount = document.querySelector("#ethAmount").value;
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

async function getBalance(){
    console.log(`Getting balance...`);
    if (typeof window.ethereum !== 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            const balance = await provider.getBalance(contractAddress);
            document.querySelector("#balanceDisplay").textContent = `Balance: ${ethers.utils.formatEther(balance)} ETH`;
            console.log(balance);
        } catch (e){
            console.error(e);
        }
    }
}

async function withdraw(){
    console.log(`Withdrawing funds...`);
    if (typeof window.ethereum !== undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try{
            const trasactionResponse = await contract.withdraw();
            await listenForTransactionMine(trasactionResponse, provider);
            document.querySelector("#balanceDisplay").textContent = "Withdraw successful!!";
            console.log("Funds withdrawn!");
        } catch (e){
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