const NftToken = artifacts.require("NftToken");

module.exports = function (deployer) {
  deployer.deploy(
    NftToken,
    "NFT_dude",
    "NFTT",
    "https://gateway.pinata.cloud/ipfs/QmUSxLDNB1zxSXanqc4Mf5c3SpLtD9NPCLsN3C53U9JiXS/"
  );
};
