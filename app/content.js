var contractAddress = "0x1d397e7b8baef27063b5448388088d059fcd8853"; // address of the crowdfunding contract
var ethWei = 1000000000000000000; // 1 ETH = 10^18 wei

// initialising the web3 variable
var web3;


// defining the ABI of the contract
const contractABI = `[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"BCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"transferAccessACoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"transferAccessCCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"transferAccessBCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"checkAccessACoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"checkAccessCCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"names","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getAccessBCoin","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"getAccessACoin","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"checkAccessBCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"CCoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getAllAccessRights","outputs":[{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getAccessCCoin","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ACoin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"adresa","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"Registration","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"coin","type":"string"}],"name":"AccesPurchased","type":"event"}]`;


async function init() {

  const alwaysUseInfura = false;

  web3 = window.web3;

  if (typeof web3 == 'undefined') {
    console.log('web3 undefined');
  }

  if (typeof web3 !== 'undefined' && alwaysUseInfura == false) {
    console.log('Web3 Detected! ' + web3.currentProvider.constructor.name);
    window.web3 = new Web3(web3.currentProvider);
  } else {

    infuraAPI = 'Infurakey';

    console.log('No Web3 Detected... using HTTP Provider');
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/" + infuraAPI));
  }

  console.log("web3.currentProvider.constructor.name = " + web3.currentProvider.constructor.name);

    const accounts = await web3.eth.getAccounts()
}


async function getAddress() {
      const accounts = await web3.eth.getAccounts();

      try{
        var address = accounts[0].toString();
            $("#address").css("color", "black");
            $("#address").html(address);
      } catch (e) {
        $("#address").css("color", "red");
        $("#address").html("Please login into Metamask");
      }
    }

    async function buyA() {

        var loaderTX = $("#loaderTX");
        var content = $("#registered");

        loaderTX.show();
        content.hide();

        var contract = await new web3.eth.Contract(
        JSON.parse(contractABI),
        contractAddress
        );

        const accounts = await web3.eth.getAccounts();

        try {
        contract.methods.getAccessACoin()
        .send({ from: accounts[0], gas: "300000", gasPrice: "5000000000"})
        .on('transactionHash', function(hash){
          console.log ('hash', hash);
        })
        .on('receipt', function(receipt){
          console.log ('receipt', receipt);

            updateInfo(); // the main path

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

    async function buyB() {

        var loaderTX = $("#loaderTX");
        var content = $("#registered");

        loaderTX.show();
        content.hide();

        var contract = await new web3.eth.Contract(
        JSON.parse(contractABI),
        contractAddress
        );

        const accounts = await web3.eth.getAccounts();

        try {
        contract.methods.getAccessBCoin()
        .send({ from: accounts[0], gas: "300000", gasPrice: "5000000000"})
        .on('transactionHash', function(hash){
          console.log ('hash', hash);
        })
        .on('receipt', function(receipt){
          console.log ('receipt', receipt);

            updateInfo(); // the main path

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

    async function buyC() {

        var loaderTX = $("#loaderTX");
        var content = $("#registered");

        loaderTX.show();
        content.hide();

        var contract = await new web3.eth.Contract(
        JSON.parse(contractABI),
        contractAddress
        );

        const accounts = await web3.eth.getAccounts();

        try {
        contract.methods.getAccessCCoin()
        .send({ from: accounts[0], gas: "300000", gasPrice: "5000000000"})
        .on('transactionHash', function(hash){
          console.log ('hash', hash);
        })
        .on('receipt', function(receipt){
          console.log ('receipt', receipt);

            updateInfo(); // the main path

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

  async function updateInfo() {

    var loaderTX = $("#loaderTX");
        var content = $("#registered");

        loaderTX.show();
        content.hide();

      var contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
      );

      const accounts = await web3.eth.getAccounts();

      try {
      contract.methods.getAllAccessRights(accounts[0])
      .call({ from: accounts[0]})
      .then(function(results){

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
    }
  }



$(document).ready(function () {
  init();

  getAddress();
  updateInfo();


    $("#buyA").click(function () {
      buyA();
  });

   $("#buyB").click(function () {
      buyB();
  });

   $("#buyC").click(function () {
      buyC();
  });
});
