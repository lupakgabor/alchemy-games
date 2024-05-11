const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const signers = await ethers.getSigners();

    return { game, signers };
  }
  it('should be a winner', async function () {
    const { game, signers } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const randomWallet = generateRandomWallet();

    // Send some eth to the founded wallet
    await signers[0].sendTransaction({
      to: randomWallet.address,
      value: ethers.utils.parseEther("1.0")
    });

    await game.connect(randomWallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});


function generateRandomWallet() {
  const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
  const address = wallet.address;
  const threshold = ethers.utils.hexZeroPad('0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf', 20);

  if (ethers.utils.hexDataSlice(address, 0, 20) < ethers.utils.hexDataSlice(threshold, 0, 20)) {
    return wallet;
  } else {
    return generateRandomWallet();
  }
}