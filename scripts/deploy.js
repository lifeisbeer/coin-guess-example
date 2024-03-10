async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const coin = await ethers.deployContract("CoinFlip");
    await coin.waitForDeployment();
  
    console.log("Contract address:", await coin.getAddress());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });