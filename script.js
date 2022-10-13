async function connect(){
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        window.ethereum.request({method: "eth_requestAccounts"});
      } else {
        console.log("No MetaMask");
      }
}

var connectEl = document.querySelector("#connect");

connectEl.addEventListener("click", async function(){
    await connect();
})