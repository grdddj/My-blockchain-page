const contractAddress = "0xfd8977d388b09cc33b5f89e5f9ddfce1d0889910"; // address of the crowdfunding contract
const ethWei = Math.pow(10, 18); // 1 ETH = 10^18 wei

// initialising the web3 variable
let web3;

// numbers used to store the number of projects
let numAct = 0; // active projects
let numSuc = 0; // sucessfully ended projects
let numUnsuc = 0; // unsuccessfully ended projects

// defining the ABI of the contract
const contractABI = `[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"projects","outputs":[{"name":"owner","type":"address"},{"name":"name","type":"string"},{"name":"weiGoal","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"received","type":"uint256"},{"name":"finished","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"withdrawFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfProjects","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"fundProject","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"getRefund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"contribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_weiAmount","type":"uint256"},{"name":"_duration","type":"uint256"}],"name":"createProject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"goal","type":"uint256"},{"indexed":false,"name":"endTime","type":"uint256"}],"name":"NewProject","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"}]`;


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

// Sends a request to the blockchain to create a new project
async function createProject() {
  const name = $("#name").val();
  const goal = $("#goal").val()*ethWei;
  const duration = $("#duration").val()*3600;

  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );

    const accounts = await web3.eth.getAccounts();

    contract.methods.createProject(name, goal, duration)
    .send({from: accounts[0], gas: "300000", gasPrice: "5000000000"})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      // Refreshing the page with updated information
      refresh();
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
  }
}

// Sends some Ether to the specified project
async function fundProject() {
  const id = $('#projectSelect').val();
  const amount = $("#amount").val()*ethWei;

  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );

    const accounts = await web3.eth.getAccounts();
    alert("You are donating " + $("#amount").val() + " ETH to Project " + id);

    contract.methods.fundProject(id)
    .send({from: accounts[0], gas: "300000", value: amount, gasPrice: "5000000000"})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      refresh();
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
  }
}

async function withdrawFunds() {
  const id = $('#finishedSucProjectSelect').val();

  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );

    const accounts = await web3.eth.getAccounts();

    contract.methods.withdrawFunds(id)
    .send({ from: accounts[0], gas: "300000"})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
  }
}

 async function getRefund() {
  const id = $('#finishedUnsucProjectSelect').val();

  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );

    const accounts = await web3.eth.getAccounts();

    contract.methods.getRefund(id)
    .send({ from: accounts[0], gas: "300000", gasPrice: "5000000000"})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
  }
}

async function refresh() {
  const contract = await new web3.eth.Contract(
    JSON.parse(contractABI),
    contractAddress
  );

  const accounts = await web3.eth.getAccounts();

  $('#projectSelect').empty();
  $('#finishedSucProjectSelect').empty();
  $('#finishedUnsucProjectSelect').empty();

  $("#finishedUnsucProjects").html(` <tr>
                                   <th>Number</th>
                                   <th>Name</th>
                                   <th>Goal [ETH]</th>
                                   <th>Received [ETH]</th>
                                   <th>Expiration time [hours ago]</th>
                                   <th>Owner</th>
                                     </tr>`);

  $("#finishedSucProjects").html(`    <tr>
                                        <th>Number</th>
                                        <th>Name</th>
                                        <th>Goal [ETH]</th>
                                        <th>Owner</th>
                                    </tr>`);
  $("#activeProjects").html(`  <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Goal [ETH]</th>
                        <th>Left [ETH]</th>
                        <th>Expiration time [hours]</th>
                        <th>Owner</th>
                          </tr>`);

  try {
    contract.methods.getNumberOfProjects()
    .call({from: accounts[0]})
    .then(function(number) {
    for (let x = 0; x < number; x++) {
      getProject(x);
    }
    // setting the amounts to zero
    numAct = 0;
    numSuc = 0;
    numUnsuc = 0;
    });
  } catch (error) {
    console.log ('error',error);
  }
}

async function getProject(x) {
  try {
    const contract = await new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress
    );

    const accounts = await web3.eth.getAccounts();

    contract.methods.projects(x)
    .call({ from: accounts[0]})
    .then(function(result) {

      const owner = result[0];
      const name = result[1];
      const goal = result[2];
      const end = result[3];
      const received = result[4];
      const finished = result[5];

      // the funding has already finished
      if (finished == true) {
        numSuc++;
        const projectOption = "<option value='" + x + "' > Project " + x + "</ option>";
        $('#finishedSucProjectSelect').append(projectOption);
        $("#finishedSucProjects").append("<tr><td>" + x + "</td><td>" +  name + "</td><td>" + goal/ethWei + "</td><td>" + owner + "</td></tr>");
      } else { // the funding has not finished yet (or has expired)
        const now = Date.now()/1000;

        // it has expired
        if(end < now) {
          numUnsuc++;
          const projectOption = "<option value='" + x + "' > Project " + x + "</ option>";
          $('#finishedUnsucProjectSelect').append(projectOption);
          $("#finishedUnsucProjects").append("<tr><td>" + x + "</td><td>" +  name + "</td><td>" + goal/ethWei + "</td><td>" + received/ethWei + "</td><td>" + ((now - end)/3600).toFixed(2) + "</td><td>" + owner + "</td></tr>");
        // it is still in progress
        } else {
          numAct++;
          const projectOption = "<option value='" + x + "' > Project " + x + "</ option>";
          $('#projectSelect').append(projectOption);
          $("#activeProjects").append("<tr><td>" + x + "</td><td>" +  name + "</td><td>" + goal/ethWei + "</td><td>" + (goal-received)/ethWei + "</td><td>" + ((end - now)/3600).toFixed(2) + "</td><td>" + owner + "</td></tr>");
        }
      }

    // print out the amount of each projects
    $("#amountActive").html(numAct);
    $("#amountUnsuc").html(numUnsuc);
    $("#amountSuc").html(numSuc);

    });
  } catch (error) {
    console.log ('error',error);
  }
}

function showHideSuc() {
  if (document.getElementById("showSuc").innerHTML == "Hide!") {
    $("#finishedSuc").hide();
    $("#showSuc").html("Show!");
  } else {
    $("#finishedSuc").show();
    $("#showSuc").html("Hide!");
  }
}

function showHideUnsuc() {
  if (document.getElementById("showUnsuc").innerHTML == "Hide!") {
    $("#finishedUnsuc").hide();
    $("#showUnsuc").html("Show!");
  } else {
    $("#finishedUnsuc").show();
    $("#showUnsuc").html("Hide!");
  }
}

$(document).ready(function () {
  initialiseBlockchainConnection();

  getETHAddress();

  refresh();

  $("#create").click(function() {
    createProject();
  });

  $("#donate").click(function() {
    fundProject();
  });

  $("#withdraw").click(function() {
    withdrawFunds();
  });

  $("#refund").click(function() {
    getRefund();
  });

  $("#showSucFinished").click(function() {
    showHideSuc();
  });

  $("#showUnsucFinished").click(function() {
    showHideUnsuc();
  });
});
