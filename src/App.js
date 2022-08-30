import "./App.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as sx from "./styles/globalStyles";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState("Maybe it's your lucky day");
  //console.table(blockchain);
  //console.log(data);

  const mintNFT = (_mintAmount) => {
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _mintAmount)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(
          (0.000001 * _mintAmount).toString(),
          "ether"
        ),
      })
      .once("error", (err) => {
        setClaimingNft(false);
        if (err.code !== 4001) {
          setFeedback("Something went wrong");
        } else {
          setFeedback("Maybe it's your lucky day");
        }
        console.log(err);
      })
      .then((receipt) => {
        console.log(receipt);
        setClaimingNft(false);
        setFeedback("Successfully minted!");
        dispatch(fetchData(blockchain.account));
      });
  };

  //need to run everytime blockchain account is updated
  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain.smartContract, dispatch]);

  return (
    <sx.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <sx.Container flex={1} ai={"center"} jc={"center"}>
          <sx.TextTitle>My Mint Page</sx.TextTitle>
          <sx.SpacerSmall />
          <sx.StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            Connect
          </sx.StyledButton>
        </sx.Container>
      ) : (
        <sx.Container flex={1} ai={"center"} jc={"center"}>
          <sx.TextTitle>Collection: {data.name}</sx.TextTitle>
          <sx.SpacerXSmall />
          <sx.TextDescription style={{ textAlign: "center" }}>
            {feedback}
          </sx.TextDescription>
          <sx.SpacerSmall />
          <sx.StyledButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFT(1);
            }}
          >
            {claimingNft ? "Minting" : "Mint 1 NFT"}
          </sx.StyledButton>
          <sx.SpacerSmall />
          <sx.StyledButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFT(3);
            }}
          >
            {claimingNft ? "Minting" : "Mint 3 NFT"}
          </sx.StyledButton>
        </sx.Container>
      )}
    </sx.Screen>
  );
}

export default App;
