pragma solidity ^0.5.1;

contract Crowdfunding {
  // Defining our custom data structure describing a project
  struct Project {
    uint projectId; // Unique identificator of the project
    address projectOwner;
    string projectName;
    uint projectWeiGoal;
    uint projectEndTime;
    uint projectReceivedInETH;
    bool projectFinished;
  }

  // Array of all project structs
  Project[] public projects;

  // Mapping which stores how much which user funded to what project
  mapping(uint => mapping(address => uint)) public contributions;

  // Events to be emitted when something happens
  event NewProject(uint projectId, address projectOwner, string projectName,
                   uint projectWeiGoal, uint projectEndTime);
  event Withdrawal(uint projectId, uint withdrawalAmount, address projectOwner);

  // Create a new Project struct and push it into projects array
  function createProject(string memory _projectName, uint _projectWeiGoal, uint _projectDuration) public {
    // Finding out the index of the project which will be newly created
    // NOTE: it is also possible to get this number from the push command,
    //   because it returns the new length of the array, but for sake of
    //   comprehension this is done as two commands. Because extra operations
    //   cost gas, it a real contract it is advisable to use this approach.
    //   We are also want to use this projectId in the project instantiation,
    //   therefore it would not be possible here.
    uint projectId = projects.length;

    projects.push(Project(projectId, msg.sender, _projectName, _projectWeiGoal,
                          now + _projectDuration, 0, false));

    // Emitting event with the information about newly created project
    emit NewProject(projectId, msg.sender, _projectName, _projectWeiGoal, now + _projectDuration);
  }

  // Funding a project - payable function (amount of ETH must be send with it)
  function fundProject(uint _projectId) public payable {
    require(now < projects[_projectId].projectEndTime); // The project has not expired yet
    require(projects[_projectId].projectFinished == false); // Project has not been completely funded yet
    projects[_projectId].projectReceivedInETH += msg.value; // Add value to project funds
    contributions[_projectId][msg.sender] += msg.value; // Add value to the specific user
    // When more than enough is collected, finish the crowdfunding
    if (projects[_projectId].projectReceivedInETH > projects[_projectId].projectWeiGoal) {
      projects[_projectId].projectFinished = true;
    }
  }

  // Function for the projectOwner to withdraw money out of his project,
  //   after this project has successfully finished.
  function withdrawFunds(uint _projectId) public {
    require(msg.sender == projects[_projectId].projectOwner); // Only owner of the project can call it
    require(projects[_projectId].projectFinished == true); // The project has reached the goal
    uint amountToBeWithdrawn = projects[_projectId].projectReceivedInETH; // Storing the crowdfunded value before setting it to zero
    projects[_projectId].projectReceivedInETH = 0; // Setting the value to zero before sending the funds
    msg.sender.transfer(amountToBeWithdrawn); // Transferring the funds to the project's owner
    // Inform the world that the money are ready to serve the purpose
    emit Withdrawal(_projectId, amountToBeWithdrawn, msg.sender);
  }

  // Function for supporters to get their money back after the campaign times
  //   out without raising enough money.
  function getRefund(uint _projectId) public {
    require(now > projects[_projectId].projectEndTime); // Time has already passed
    require(projects[_projectId].projectFinished == false); // Project did not receive enough money
    require(contributions[_projectId][msg.sender] > 0); // Msg.sender must have contributed
    uint amountToBeRefunded =  contributions[_projectId][msg.sender]; // Getting the amount before setting it to zero
    contributions[_projectId][msg.sender] = 0; // Set contributions to zero before sending money back
    msg.sender.transfer(amountToBeRefunded); // Refunding the money to the supporter
  }

  // Getter used to find out the number of projects
  // This is getting used in web3 to iterate through all projects
  function getNumberOfProjects() public view returns (uint) {
    return projects.length;
  }
}
