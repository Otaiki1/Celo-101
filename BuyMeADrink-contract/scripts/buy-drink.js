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
