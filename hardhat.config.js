require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    rinkeby: {
      url : `https://eth-rinkeby.alchemyapi.io/v2/RKsjGN8pQAmkmh9NzM1CsNYrI2SpjFPu`,
      accounts : [`0x${Private_Key}`]
    }
  }
};
