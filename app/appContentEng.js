// Address of the contract on the Ethereum blockchain
const contractAddress = "0x1d397e7b8baef27063b5448388088d059fcd8853";

const ethWei = Math.pow(10, 18); // 1 ETH = 10^18 wei

// Identifying the loader and content to show and hide them properly
const loaderTX = $("#loaderTX");
const mainContent = $("#mainContent");

// Object describing the price of each token (article) in Ether
const pricesOfTokensInETH = {
  A: 0.001,
  B: 0.002,
  C: 0.003
}

// Initialising the web3 variable
let web3;

// Defining the ABI (Application Binary Interface) of the contract
const contractABI = `[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"BCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"transferAccessACoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"transferAccessCCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"transferAccessBCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"checkAccessACoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"checkAccessCCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"names","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getAccessBCoin","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"getAccessACoin","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"checkAccessBCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"CCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getAllAccessRights","outputs":[{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getAccessCCoin","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ACoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"adresa","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"Registration","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"coin","type":"string"}],"name":"AccesPurchased","type":"event"}]`;

// Function responsible for initialising connection with Ethereum blockchain
// If it fails to initialise web3 component, other functions will not work properly
async function initialiseBlockchainConnection() {
  web3 = window.web3;

  if (typeof web3 !== 'undefined') {
    console.log('Web3 Detected! ' + web3.currentProvider.constructor.name);
    window.web3 = new Web3(web3.currentProvider);
  } else {
    infuraAPIKey = 'Infurakey';

    console.log('No Web3 Detected... using HTTP Provider');
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/" + infuraAPIKey));
  }

  if (typeof web3 == 'undefined') {
    console.log('web3 undefined');
  }
}

// Finds out the current active ETH address  of the user
// If user is not connected (f.e. in Metamask), remind him of that
async function getETHAddress() {
  try {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0].toString();
    $("#address").css("color", "black");
    $("#address").html(address);
    $("#noMetamask").hide();
  } catch (e) {
    $("#address").css("color", "red");
    $("#address").html("Please login to Metamask!");
    $("#noMetamask").show();
  }
}

// Tries to connect with a given contract and with a local ETH account
// When unsuccessful, return null values, which will be handled afterwards
async function connectWithContractAndAccounts(contractABI, contractAddress) {
  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );
    const accounts = await web3.eth.getAccounts();

    return [contract, accounts]
  } catch (e) {
    return [undefined, undefined]
  }
}

// Sending a request to a smart contract to buy a specified coin
async function buy(coinSymbol) {
  // Asking the user to confirm his donation.
  if (!confirm(`Do you really want to buy token ${coinSymbol}?`)) {
    return
  }

  // Initialising the contract and account connection through Web3
  // If the connection cannot be set up, notify the user and stop the function
  // BEWARE: the function we are calling is asynchronous, therefore the keyword "await"
  let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
  if (contract === undefined) {
    alert("You are not connected to Ethereum blockchain!");
    return;
  }

  // Assigning the right method depending on the coin user want to buy
  const functionToBeCalled = `getAccess${coinSymbol}Coin`;

  // Finding out what value must be sent to purchase the token
  const coinPriceInWei = pricesOfTokensInETH[coinSymbol] * ethWei;

  // Calling the specified method on the smart contract
  try {
    contract.methods.functionToBeCalled()
    // Sending the transaction
    .send({from: accounts[0], value: coinPriceInWei, gas: "300000", gasPrice: "5000000000"})
    // Receiving the transaction hash (immediately after sending)
    // Showing the loading message and hiding the content
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
      loaderTX.show();
      mainContent.hide();
    })
    // When we receive a receipt of the transaction, we are sure it succeeded
    //  and we can render the updated information
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      alert("Thanks for the purchase of token " + coinSymbol + "!")
      // Updating the information about accessible content
      updateAccessibleContent();
    })
    // Handling the error - asking user if he is on the right account
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
    alert("Transaction didn't get through - try again!");
    loaderTX.hide();
    mainContent.show();
  }
}

// Fetches information from the blockchain about the content that is accessible
//   by a current user.
async function updateAccessibleContent() {
  // Initialising the contract and account connection through Web3
  // If the connection cannot be set up stop the function
  // (The user is not notified with alert, because this function is called even without his action)
  let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
  if (contract === undefined) {
    loaderTX.hide();
    mainContent.show();
    return;
  }

  // Calling a contract method for the accesses of the current user
  try {
    contract.methods.getAllAccessRights(accounts[0])
    .call({from: accounts[0]})
    .then(function(results) {
      // We have received information from blockchain, now we can parse them
      $("#myTokens").html("");
      $("#myArticles").html("");

      accessA = results[0];
      accessB = results[1];
      accessC = results[2];

      // If user has access to a specified article, show the link to it
      if (accessA) {
        $("#myTokens").append("<p>ACoin</p>");
        $("#myArticles").append("<p><a href='clanek1.html'>Article A</a></p>");
        $("#btnA").html("Already bought, thanks!");
      }

      if (accessB) {
        $("#myTokens").append("<p>BCoin</p>");
        $("#myArticles").append("<p><a href='clanek2.html'>Article B</a></p>");
        $("#btnB").html("Already bought, thanks!");
      }

      if (accessC) {
        $("#myTokens").append("<p>CCoin</p>");
        $("#myArticles").append("<p><a href='clanek3.html'>Article C</a></p>");
        $("#btnC").html("Already bought, thanks!");
      }

      loaderTX.hide();
      mainContent.show();
      })
  } catch (error) {
    console.log ('error',error);
    loaderTX.hide();
    mainContent.show();
  }
}

// This gets executed after the page fully loads
$(document).ready(function () {
  // Setting the blockchain connetion
  initialiseBlockchainConnection();

  // Identifying the user and showing his current accesses
  getETHAddress();
  updateAccessibleContent();

  // Event listeners for they buy() function, allowing for purchasing the access
  $("#buyA").click(function () {
    buy("A");
  });

  $("#buyB").click(function () {
    buy("B");
  });

  $("#buyC").click(function () {
    buy("C");
  });
});
