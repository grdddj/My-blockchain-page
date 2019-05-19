const contractAddress = "0xfd8977d388b09cc33b5f89e5f9ddfce1d0889910"; // address of the crowdfunding contract
const ethWei = Math.pow(10, 18); // 1 ETH = 10^18 wei

const gasPriceForTransactions = "5000000000"; // The gas price in Wei

// initialising the web3 variable
let web3;

// Integers used to store the number of projects (for the use of easy overview)
let numberOfActiveProjects = 0;
let numberOfSuccessfullyEndedProjects = 0;
let numberOfUnsuccessfullyEndedProjects = 0;

// Defining the ABI of the contract
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

// Finds out the current active ETH address  of the user
// If user is not connected (f.e. in Metamask), remind him of that
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

// Sends a request to the blockchain to create a new project
async function createProject(name, goalInETH, durationInHours) {
  // Transforming the parameters to the "contract-friendly" format
  const goalInWei = goalInETH * ethWei;
  const durationInSeconds = durationInHours * 3600;

  // Asking the user to confirm his donation.
  if (!confirm(`Opravdu chcete založit projekt jménem ${name}, s cílem ${goalInETH} ETH a dobou trvání ${durationInHours} hodin?`)) {
    return
  }

  // Initialising the contract and account connection through Web3
  // If the connection cannot be set up, notify the user and stop the function
  // BEWARE: the function we are calling is asynchronous, therefore the keyword "await"
  let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
  if (contract === undefined) {
    alert("Nejste připojení k ethereovému blockchainu!");
    return;
  }

  // Calling the method on the blockchain responsible for creating th project
  try {
    contract.methods.createProject(name, goalInWei, durationInSeconds)
    .send({from: accounts[0], gas: "300000", gasPrice: gasPriceForTransactions})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      alert("Transakce byla úspěšná - projekt vytvořen.");
      // Refreshing the page with updated information
      refreshTheDataInTable();
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
    alert("Transakce se nepovedla a projekt nebyl vytvořen - zkuste to prosím znovu!");
  }
}

// Sends some Ether to the specified project
async function fundProject(id, amountETH) {
  // Calculating the amount of Wei (that is sent to the blockchain)
  const amountWei = amountETH * ethWei;

  // Asking the user to confirm his donation.
  if (!confirm(`Opravdu chcete přispět ${amountETH} ETH projektu číslo ${id}?`)) {
    return
  }

  // Initialising the contract and account connection through Web3
  // If the connection cannot be set up, notify the user and stop the function
  // BEWARE: the function we are calling is asynchronous, therefore the keyword "await"
  let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
  if (contract === undefined) {
    alert("Nejste připojení k ethereovému blockchainu!");
    return;
  }

  // Contacting the contract method responsible for the project funding
  try {
    contract.methods.fundProject(id)
    .send({from: accounts[0], gas: "300000", value: amountWei, gasPrice: gasPriceForTransactions})
    // Signal that transaction was sent to ETH network
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    // After we receive a receipt (which means transaction went through), update the tables
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      alert("Transakce byla úspěšná - projekt podpořen.");
      refreshTheDataInTable();
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
    alert("Transakce se nepovedla a projekt nebyl podpořen - zkuste to prosím znovu!");
  }
}

async function withdrawFunds(id) {
  // Asking the user to confirm his donation.
  if (!confirm(`Opravdu chcete vybrat prostředky z projektu číslo ${id}?`)) {
    return
  }

  // Initialising the contract and account connection through Web3
  // If the connection cannot be set up, notify the user and stop the function
  // BEWARE: the function we are calling is asynchronous, therefore the keyword "await"
  let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
  if (contract === undefined) {
    alert("Nejste připojení k ethereovému blockchainu!");
    return;
  }

  // Calling the contract method responsible for the withdrawing of the funds
  // NOTE: Anybody can call this function, but contract itself will resolve,
  //   if the calling address is the owner of the project, and therefore can
  //   withdraw the funds (also applying logic if the funds are even withdrawable)
  try {
    contract.methods.withdrawFunds(id)
    .send({from: accounts[0], gas: "300000"})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      alert("Transakce byla úspěšná - prostředky vybrány.");
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
    alert("Transakce se nepovedla a prostředky nebyly vybrány - zkuste to prosím znovu!");
  }
}

 async function getRefund(id) {
   // Asking the user to confirm his donation.
   if (!confirm(`Opravdu chcete vybrat nevyužité prostředky z projektu číslo ${id}?`)) {
     return
   }

   // Initialising the contract and account connection through Web3
   // If the connection cannot be set up, notify the user and stop the function
   // BEWARE: the function we are calling is asynchronous, therefore the keyword "await"
   let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
   if (contract === undefined) {
     alert("Nejste připojení k ethereovému blockchainu!");
     return;
   }

  // Calling the contract method responsible getting refund for all supporters
  //    after the project has timed out unsuccessfully.
  // NOTE: Anybody can call this function, but contract itself will resolve,
  //   if the calling address has some funds to be refunded in that project
  try {
    contract.methods.getRefund(id)
    .send({from: accounts[0], gas: "300000", gasPrice: gasPriceForTransactions})
    .on('transactionHash', function(hash) {
      console.log ('hash', hash);
    })
    .on('receipt', function(receipt) {
      console.log ('receipt', receipt);
      alert("Transakce byla úspěšná - prostředky vybrány.");
    })
    .on('error', function(error) {
      $("#error").html('error - Is MetaMask set to the correct address ' + accounts[0]);
    })
  } catch (error) {
    console.log ('error',error);
    alert("Transakce se nepovedla a prostředky nebyly vybrány - zkuste to prosím znovu!");
  }
}

// Contacts the blockchain and re-renders the data shown in tables, to be
//   updated with current information
async function refreshTheDataInTable() {
  // Initialising the contract and account connection through Web3
  // If the connection cannot be set up, notify the user and stop the function
  // BEWARE: the function we are calling is asynchronous, therefore the keyword "await"
  let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
  if (contract === undefined) {
    return;
  }

  // Emptying the Selections of the project
  $('#projectSelect').empty();
  $('#finishedSucProjectSelect').empty();
  $('#finishedUnsucProjectSelect').empty();

  // Emptying the tables with projects
  $("#finishedUnsucProjects").html(` <tr>
                                   <th>Číslo</th>
                                   <th>Jméno</th>
                                   <th>Cíl [ETH]</th>
                                   <th>Obdrženo [ETH]</th>
                                   <th>Čas vypršení [hod v minulosti]</th>
                                   <th>Vlastník</th>
                                     </tr>`);

  $("#finishedSucProjects").html(`    <tr>
                                        <th>Číslo</th>
                                        <th>Jméno</th>
                                        <th>Cíl [ETH]</th>
                                        <th>Vlastník</th>
                                    </tr>`);
  $("#activeProjects").html(`  <tr>
                        <th>Číslo</th>
                        <th>Jméno</th>
                        <th>Cíl [ETH]</th>
                        <th>Zbývá [ETH]</th>
                        <th>Čas do konce [hod]</th>
                        <th>Vlastník</th>
                          </tr>`);

  // Calling the blockchain for the number of projects (which are numbered from 0 upwards)
  // Then getting details of each project (rendering that into table)
  try {
    contract.methods.getNumberOfProjects()
    .call({from: accounts[0]})
    .then(function(number) {
    for (let x = 0; x < number; x++) {
      // For each project number, contact the blockchain for further information
      getProject(x);
    }
    // Reseting the project amounts to zero, to prepare for next call
    numberOfActiveProjects = 0;
    numberOfSuccessfullyEndedProjects = 0;
    numberOfUnsuccessfullyEndedProjects = 0;
    });
  } catch (error) {
    console.log ('error',error);
  }
}

async function getProject(x) {
  // Initialising the contract and account connection through Web3
  // If the connection cannot be set up, notify the user and stop the function
  // BEWARE: the function we are calling is asynchronous, therefore the keyword "await"
  let [contract, accounts] = await connectWithContractAndAccounts(contractABI, contractAddress);
  if (contract === undefined) {
    return;
  }

  // Calling the contract for the information about a specific project, parsing
  //   the information, evaluating it and filling it into right table.
  try {
    contract.methods.projects(x)
    .call({from: accounts[0]})
    .then(function(result) {

      const owner = result[0];
      const name = result[1];
      const goal = result[2];
      const end = result[3];
      const received = result[4];
      const finished = result[5];

      // the funding has already finished
      if (finished == true) {
        numberOfSuccessfullyEndedProjects++;
        const projectOption = "<option value='" + x + "' > Project " + x + "</ option>";
        $('#finishedSucProjectSelect').append(projectOption);
        $("#finishedSucProjects").append("<tr><td>" + x + "</td><td>" +  name + "</td><td>" + goal/ethWei + "</td><td>" + owner + "</td></tr>");
      } else {
        // the funding has not finished yet (or has expired)
        const now = Date.now()/1000;

        // it has expired
        if (end < now) {
          numberOfUnsuccessfullyEndedProjects++;
          const projectOption = "<option value='" + x + "' > Project " + x + "</ option>";
          $('#finishedUnsucProjectSelect').append(projectOption);
          $("#finishedUnsucProjects").append("<tr><td>" + x + "</td><td>" +  name + "</td><td>" + goal/ethWei + "</td><td>" + received/ethWei + "</td><td>" + ((now - end)/3600).toFixed(2) + "</td><td>" + owner + "</td></tr>");
        // it is still in progress
        } else {
          numberOfActiveProjects++;
          const projectOption = "<option value='" + x + "' > Project " + x + "</ option>";
          $('#projectSelect').append(projectOption);
          $("#activeProjects").append("<tr><td>" + x + "</td><td>" +  name + "</td><td>" + goal/ethWei + "</td><td>" + (goal-received)/ethWei + "</td><td>" + ((end - now)/3600).toFixed(2) + "</td><td>" + owner + "</td></tr>");
        }
      }

    // Print out the amount of each projects
    $("#amountActive").html(numberOfActiveProjects);
    $("#amountUnsuc").html(numberOfUnsuccessfullyEndedProjects);
    $("#amountSuc").html(numberOfSuccessfullyEndedProjects);

    });
  } catch (error) {
    console.log ('error',error);
  }
}

// Toggling the table view of successfully-finished projects
function toggleSuccessfulProjects() {
  if (document.getElementById("showSuc").innerHTML == "Skrýt!") {
    $("#finishedSuc").hide();
    $("#showSuc").html("Rozbalit!");
  } else {
    $("#finishedSuc").show();
    $("#showSuc").html("Skrýt!");
  }
}

// Toggling the table view of unsuccessfully-finished projects
function toggleUnsuccessfulProjects() {
  if (document.getElementById("showUnsuc").innerHTML == "Skrýt!") {
    $("#finishedUnsuc").hide();
    $("#showUnsuc").html("Rozbalit!");
  } else {
    $("#finishedUnsuc").show();
    $("#showUnsuc").html("Skrýt!");
  }
}

// This gets executed after the page fully loads
$(document).ready(function () {
  // Initialising the connection with ETH blockchain
  initialiseBlockchainConnection();

  // Identifying the current user and showing his data
  getETHAddress();
  refreshTheDataInTable();

  // Event listeners for the buttons
  $("#create").click(function() {
    const name = $("#name").val();
    const goalInEth = Number($("#goal").val());
    const durationInHours = Number($("#duration").val());

    createProject(name, goalInEth, durationInHours);
  });

  $("#donate").click(function() {
    const id = Number($('#projectSelect').val());
    const amountETH = Number($("#amount").val());

    fundProject(id, amountETH);
  });

  $("#withdraw").click(function() {
    const id = $('#finishedSucProjectSelect').val();

    withdrawFunds(id);
  });

  $("#refund").click(function() {
    const id = $('#finishedUnsucProjectSelect').val();

    getRefund(id);
  });

  $("#showSucFinished").click(function() {
    toggleSuccessfulProjects();
  });

  $("#showUnsucFinished").click(function() {
    toggleUnsuccessfulProjects();
  });
});
