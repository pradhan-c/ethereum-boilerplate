require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


const Alchemy_API_Key = "https://eth-rinkeby.alchemyapi.io/v2/bztw3gURvaNVRGo5xsWKgBvIj0_67aAz"

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  /*networks:{
    rinkeby: {
      url : `https://eth-rinkeby.alchemyapi.io/v2/bztw3gURvaNVRGo5xsWKgBvIj0_67aAz`,
      accounts : [`0x${Private_Key}`]
    }
  }*/
};
