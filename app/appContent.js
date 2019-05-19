const contractAddress = "0x1d397e7b8baef27063b5448388088d059fcd8853"; // address of the contract

// initialising the web3 variable
let web3;

// defining the ABI of the contract
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

// Finds out the current active ETH address
async function getETHAddress() {
  try {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0].toString();
    $("#address").css("color", "black");
    $("#address").html(address);
  } catch (e) {
    $("#address").css("color", "red");
    $("#address").html("Please login into Metamask");
  }
}

// Sends a request to a smart contract to buy a specified coin
async function buy(coinSymbol) {
  // Assigning the right method depending on the coin user want to buy
  const functionToBeCalled = `getAccess${coinSymbol}Coin`;

  const loaderTX = $("#loaderTX");
  const content = $("#registered");

  loaderTX.show();
  content.hide();

  // Initialising the contract connection through Web3
  // If the connection cannot be set up, notify the user
  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );

    const accounts = await web3.eth.getAccounts();
  } catch (e) {
    alert("You are not connected to the ETH blockchain!");
    loaderTX.hide();
    content.show();
    return;
  }

  // Calling the specified method on the smart contract
  try {
    contract.methods.functionToBeCalled()
    .send({ from: accounts[0], gas: "300000", gasPrice: "5000000000"})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    // When we receive a receipt of the transaction, we are sure it succeeded
    //  and we can render the updated information
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      // Updating the information about accessible content
      updateAccessibleContent();
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
    alert("Transaction didn't get through - try again!");
    loaderTX.hide();
    content.show();
  }
}

// Fetches information from the blockchain about the content that is accessible
//   by a current user.
async function updateAccessibleContent() {
  const loaderTX = $("#loaderTX");
  const content = $("#registered");

  loaderTX.show();
  content.hide();

  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );

    const accounts = await web3.eth.getAccounts();

    contract.methods.getAllAccessRights(accounts[0])
    .call({from: accounts[0]})
    .then(function(results) {
      $("#myTokens").html("");
      $("#myArticles").html("");

      accessA = results[0];
      accessB = results[1];
      accessC = results[2];

      if(accessA) {
        $("#myTokens").append("<p>ACoin</p>");
        $("#myArticles").append("<p><a href='clanek1.html'>Článek A</a></p>");
        $("#btnA").html("Zakoupeno, děkujeme!");
      }

      if(accessB) {
        $("#myTokens").append("<p>BCoin</p>");
        $("#myArticles").append("<p><a href='clanek2.html'>Článek B</a></p>");
        $("#btnB").html("Zakoupeno, děkujeme!");
      }

      if(accessC) {
        $("#myTokens").append("<p>CCoin</p>");
        $("#myArticles").append("<p><a href='clanek3.html'>Článek C</a></p>");
        $("#btnC").html("Zakoupeno, děkujeme!");
      }

      loaderTX.hide();
      content.show();
      })
  } catch (error) {
    console.log ('error',error);
    loaderTX.hide();
    content.show();
  }
}


// This gets executed after the page fully loads
$(document).ready(function () {
  initialiseBlockchainConnection();

  getETHAddress();
  updateAccessibleContent();

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
