## Introduction

A common concept called Buy Me A Drink is used by different types of professionals to make landing pages where visitors can donate money as a thank you for their work. But you need to have a bank account and a credit card to use it. People might not have this , The blockchain solves this and with the Celo blockchain , this can be a pretty seamless process.

In this tutorial, we'll go through the process of building a smart contract that handles the "Buy Me a Drink" process on the Celo blockchain. The contract will allow users to send funds for purchasing drinks to the professionals , and at the same time allow the professionals to withdraw this funds,  all powered by smart contracts. Don't worry if you're new to blockchain technology or programming – all the steps will be explained throughly as we build .

### The blockchain: What is it?

The blockchain is a decentralized, immutable ledger that makes it easier to track assets and record transactions in a corporate network. An asset might be physical (a house, car, money, or piece of land) or intangible (patents, copyrights, branding, and intellectual property). On a blockchain network, practically anything of value may be recorded and traded, lowering risk and increasing efficiency for all parties.

### Solidity : What is it ?

When it is mentioned that smart contracts can be written on Ethereum, it is without thought that we automatically assume that there should be a programming language backing this writing operation . The programming language backing these smart contracts is Solidity.

Solidity is an object-oriented programming language that was created by the Ethereum platform's core developers. Within the Ethereum Virtual Platform and various other Blockchain systems, such as the Celo blockchain, it is utilized to create and put into action smart contracts.

The programming language Solidity is statically typed and intended for creating smart contracts that execute on the Ethereum Virtual Machine. With the help of this language, programmers may create applications that use smart contracts to provide self-enforcing business logic. 

### The Celo blockchain: what is it?

A robust new digital economy is being led by the blockchain ecosystem Celo, which is carbon-neutral, mobile-first, and EVM compatible. A technology called Celo blockchain was created to enable quick cryptocurrency transactions for mobile users all around the world. The platform contains a native coin called CELO and its own blockchain.

### Smart Contracts

Smart contracts are self-executing contracts with predefined rules encoded on the blockchain. They automatically execute transactions when specific conditions are met.

We can now move on to creating a "Buy me a drink" system utilizing Solidity smart contract as you are already familiar with the fundamentals of the blockchain, Solidity, and Celo.

## Prerequisites

Before we begin, let's make sure you have everything you need:

- A computer with an internet connection.
- A modern web browser like Google Chrome or Mozilla Firefox.
- The Celo Wallet Extension
- NodeJs/ Node Package Manager(NPM)
The following is not required, but extremely useful:
- Familiarity with a command line
- Familiarity with JavaScript


## Building the "Buy me a Drink " System

Open your terminal and create a new directory
`
mkdir BuyMeADrink-system
cd BuyMeADrink-system
`
Inside this directory, we want to initialize a hardhat project 

- First we install hardhat
`npm install --save-dev hardhat`

![Result of npm install!](./images/npmInstall.png)


- Then we create a sample project 
`npx hardhat`

![Result of npx hardhat!](./images/npxHardhat.png)


You should then see a welcome message and options on what you can do. Select `Create a JavaScript project:`

Agree to all the defaults (project root, adding a .gitignore, and installing all sample project dependencies):

Hardhat will then generate a hardhat.config.js file for us along with a couple of folders with sample code we can work with, including contracts, scripts, and test.

To check if everything works properly, run:
 `npx hardhat test`

We now have our hardhat development environment successfully configured.

You can then open the folder with vscode and you will have a set of files/folders:

- `contracts` - folder where your smart contracts are

- - in this project we'll only create one, to organize our BuyMeADrink logic

- `scripts` - folder where your hardhat javscript scripts live

- - we will write deploy logic
- - example `buy-drink` script
- - and a `withdraw` script to cash out our tips

- `hardhat.config.js`
- - configuration file with settings for solidity version and deployment

You'll notice that there are a number of files already auto-generated via the Hardhat sample project tool. We will be replacing all of them, starting with the Lock.sol contract.

1. Rename the contract file to BuyMeADrink.sol
2. Replace the contract code with the following:

```=solidity 
//SPDX-License-Identifier: Unlicense

// contracts/BuyMeADrink.sol
pragma solidity ^0.8.0;


contract BuyMeADrink {
    // Event to emit when a Note is created.
    event NewNote(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    
    // Note struct.
    struct Note {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner;

    // List of all Notes received from coffee purchases.
    Note[] notes;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored notes
     */
    function getNotes() public view returns (Note[] memory) {
        return notes;
    }

    /**
     * @dev buy a drink for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the drinks purchaser
     * @param _message a nice message from the purchaser, might include name of drink
     */
    function buyDrink(string memory _name, string memory _message) public payable {
        // Must accept more than 0 ETH for a drink .
        require(msg.value > 0, "can't buy drink for free!");

        // Add the memo to storage!
        notes.push(Note(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a NewNote event with details about the Note.
        emit NewNote(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawFunds() public {
        //ensure only owner can call function
        require(msg.sender == owner);
        require(owner.send(address(this).balance));
    }
}
```

Now, let's break down the code:

- The event `NewNote` is defined to emit an event when a Note is created. It includes the address of the sender, the timestamp, name, and message of the note.

- The `Note` struct defines the structure of each note, containing the address of the sender, timestamp, name, and message.

- The `owner` variable stores the address of the contract deployer. It is marked as payable so that funds can be withdrawn to this address later.

- The `notes` array holds all the notes received from coffee purchases.

- The constructor function is executed when the contract is deployed. It initializes the owner variable with the address of the deployer.

- The `getNotes` function is a public view function that returns an array of all the stored notes.

- The `buyDrink` function allows users to buy a coffee for the contract owner by sending ETH as a tip and leaving a memo. It requires the sent value to be greater than 0 ETH. The function adds the note to the notes array and emits a NewNote event with the note details.

- The `withdrawFunds` function allows the owner to withdraw the entire balance stored in the contract. It ensures that only the owner can call this function and transfers the contract's balance to the owner's address.

This contract enables users to buy a drink for the contract owner, leaving a memo along with their purchase. The owner can later withdraw the accumulated tips.

Armed with this smart contract code, we can now write a script to test our logic!

## Create a buy-drink.js script to test your contract

Under the scripts folder, there should be a sample script already populated deploy.js. Let's rename that file to buy-drink.js and paste in the following code:

```

const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the notes stored on-chain from coffee purchases.
async function printNotes(notes) {
  for (const note of notes) {
    const timestamp = note.timestamp;
    const buyer = note.name;
    const buyerAddress = note.from;
    const message = note.message;
    console.log(
      `At ${timestamp}, ${buyer} (${buyerAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, buyer, buyer2, buyer3] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const BuyMeADrink = await hre.ethers.getContractFactory("BuyMeADrink");
  const buyMeADrink = await BuyMeADrink.deploy();

  // Deploy the contract.
  await buyMeADrink.deployed();
  console.log("BuyMeADrink deployed to:", buyMeADrink.address);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, buyer.address, buyMeADrink.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeADrink
    .connect(buyer)
    .buyDrink("Trisha", "You're the best!, get a coffee", tip);
  await buyMeADrink
    .connect(buyer2)
    .buyDrink("Samuel", "Amazing teacher, get a whiskey", tip);
  await buyMeADrink
    .connect(buyer3)
    .buyDrink("Kuyet", "I love my Proof of Knowledge, get a cocaCola", tip);

  // Check balances after the drink purchase.
  console.log("== bought drink ==");
  await printBalances(addresses);

  // Withdraw.
  await buyMeADrink.connect(owner).withdrawFunds();

  // Check balances after withdrawal.
  console.log("== withdrawFunds ==");
  await printBalances(addresses);

  // Check out the notes.
  console.log("== notes ==");
  const notes = await buyMeADrink.getNotes();
  printNotes(notes);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

Feel free to take a few moments to read through the script code. There are some utility functions defined at the top for convenience to do things like getting wallet balances and printing them out.

The main logic of the script is inside the `main() function. The commented code shows the flow of the script:

- Get the example accounts we'll be working with.
- We get the contract to deploy.
- Deploy the contract.
- Check balances before the drinks purchase.
- Buy the owner a few drinks.
- Check balances after the drinks purchase.
- Withdraw.
- Check balances after withdrawal.
- Check out the notes.

This script tests out all the functions we implemented in our smart contract! That's awesome.

You may also notice that we are making interesting calls like:

- hre.waffle.provider.getBalance
- hre.ethers.getContractFactory
- hre.ethers.utils.parseEther
- etc.

These lines of code are where we take advantage of the Hardhat (hre) development environment along with the Ethers and Waffle SDK plug-ins to access functionality that allows us to read blockchain wallet account balances, deploy contracts, and format Ether cryptocurrency values.

We won't go too in-depth about that code in this tutorial, but you can learn more about them by looking up the Hardhat and Ethers.js documentation.

Enough talking. Now for the fun, let's run the script:

```
npx hardhat run scripts/buy-drink.js
```

You should see the output in your terminal like this 

![Result of running script!](./images/runScript.png)

- At the start of the script (right after contract deploy), note that the 0 address has 9999.99877086625 ETH. This is because it started with 10k ETH as one of the pre-populated hardhat addresses, but it had to spend a tiny amount to deploy to the local blockchain.

- In the second step == bought drink ==, Address 1 purchases one coffee. Two other wallets that are not shown ALSO purchase coffees. In total, 3 coffees were purchased for a total tip amount of 3.0 ETH. You can see that Address 2 (which represents the contract address), is holding on to 3.0 ETH.

- After the withdrawFunds() function is called in == withdrawTips ==, the contract goes back down to 0 ETH, and the original deployer, aka Address 0, has now earned some money and is sitting on 10002.998724967892122376 ETH.

## Deploy your BuyMeADrink.sol smart contract locally using hardhat

Let's make a new file scripts/deploy.js that will be incredibly simple, only for deploying our contract to any network we choose later , for this tutorial we would be deploying  locally

This is how the deploy.js file should look:

```

// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const BuyMeADrink = await hre.ethers.getContractFactory("BuyMeADrink");
  const buyMeADrink = await BuyMeADrink.deploy();

  await buyMeADrink.deployed();

  console.log("BuyMeADrink deployed to:", buyMeADrink.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

Now with this deploy.js script coded and saved, if you run the following command:

``` npx hardhat run scripts/deploy.js ```

You'll see one single line printed out:

![Result of deploy script!](./images/deployScript.png)

We could configure the hardhat config files to allow us deploy to the CELO testnet , but for the sake of this tutorial we will implement another method

## Contract deployment on the blockchain

The contract code must then be deployed on the blockchain in order for us to interact with it. From Remix, we will deploy it to the Celo blockchain.
We're deploying it on the Celo blockchain for what reason?

- Secured celo blockchain
- It can be scaled
- You can communicate with different blockchains thanks to its interoperability.
- Utilization is simple.
  
### Using Remix

Remix IDE is a no-setup smart contract development tool with a GUI. Remix will get you rolling in double time and is used by both pros and novices. Remix functions well in conjunction with other tools and enables a quick deployment to the chain of your choice. The visual debugger in Remix is well-known.

### Create and compile programs

To launch Remix IDE on your browser, click [here](https://remix.ethereum.org). Right-click the contracts folder and choose "New File" from the menu. Name the file BuyMeADrink.sol and save it. Paste the contract code from above  into the contract file. For the code to be saved, press CTRL + S.

### Add Celo Extension

In order to deploy the contract code to the blockchain, we will need to install the Celo extension on Remix.

- Install the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en) from the Google Chrome Store. 

- Create a wallet
  
- Get Celo token for the alfajores testnet from [here](https://celo.org/developers/faucet)
  
- Install the Celo remix plugin and deploy your contract.In Remix, click on the extensions section and search for celo, click on activate and it will be added to remix. Now click on it from the left menu to open it.
  
### Deploying code to Celo blockchain

Make sure your wallet is connected after opening the extension by clicking the connect button in the top right corner. Make sure the contract has been properly assembled before clicking the Deploy button to upload it to the Celo blockchain. The newly generated address will appear next to the button once it has finished deploying.

A user interface where you may communicate with the contract you just launched will also be created by Remix.
You can interact with your contract using the interface .

## Whats next ?

Once you've successfully completed the steps outlined above and verified that your contract is operating as intended. The next stage is to create a user-interactive frontend. Your code can be linked to the Celo blockchain via the Celo Extension Wallet. Put yourself to the test by expanding the app's features and documenting your process to assist other developers.

## Conclusion

This article shows you how to create smart contracts using Solidity and how to use Remix ide to deploy them to the Celo blockchain. We went over the fundamentals of Solidity smart contracts, used hardhat to deploy and test it . Follow the tutorials and build on it so you can expand your knowledge.