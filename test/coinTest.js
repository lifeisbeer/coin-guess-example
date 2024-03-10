// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("CoinFlip contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const coin = await ethers.deployContract("CoinFlip");

    await coin.waitForDeployment();

    const selection = 1;
    const password = 123;
    const hash = await coin.getHash(selection, password);

    const p2Selection = 1;

    // Fixtures can return anything you consider useful for your tests
    return { coin, addr1, addr2, selection, password, hash, p2Selection };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Bet should be 0 initially", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { coin } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      expect(await coin.bet()).to.equal(0);
    });

    it("getHash should return correct values", async function () {
      const { hash } = await loadFixture(deployTokenFixture);
      expect(hash).to.equal("0x0aaa3ce42286152b719abbca9f317d4abc82039051363ec7758d508c8a88401a");
    });
  });

  describe("Betting", function () {
    it("Should allow player 1 to create a new bet", async function () {
      const { coin, addr1, hash } = await loadFixture(
        deployTokenFixture
      );
      
      await coin.connect(addr1).makeBet(hash, { value: 100 });

      expect(await coin.bet()).to.equal(100);
      expect(await ethers.provider.getBalance(coin.getAddress())).to.equal(100);
    });

    it("Should allow player 2 to accept a bet", async function () {
      const { coin, addr1, addr2, hash, p2Selection } = await loadFixture(
        deployTokenFixture
      );

      await coin.connect(addr1).makeBet(hash, { value: 100 });
      await coin.connect(addr2).takeBet(p2Selection, { value: 100 });

      expect(await coin.bet()).to.equal(100);
      expect(await ethers.provider.getBalance(coin.getAddress())).to.equal(200);
    });

    it("Should allow player 1 to reveal", async function () {
      const { coin, addr1, addr2, selection, password, hash, p2Selection } = await loadFixture(
        deployTokenFixture
      );

      await coin.connect(addr1).makeBet(hash, { value: 100 });
      await coin.connect(addr2).takeBet(p2Selection, { value: 100 });
      await coin.connect(addr1).reveal(selection, password);

      expect(await ethers.provider.getBalance(coin.getAddress())).to.equal(0);
      expect(await ethers.provider.getBalance(addr2.address)).to.greaterThan(await ethers.provider.getBalance(addr1.address));
     
    });
  });
});