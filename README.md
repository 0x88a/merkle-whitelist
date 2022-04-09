# merkle-whitelist
Merkle trees can be used on the Ethereum blockchain to check if addresses are whitelist without having to store an entire mapping of whitelists on the blockchain (which can be very costly)

## Frontend:
On the frontend, all we need from the user is their address so we can retrieve the parent trees from the backend
```javascript
// Initalise wallet & contract
const { ethereum } = window;
const accounts = await ethereum.request({
  method: "eth_requestAccounts",
});
const provider = await new ethers.providers.Web3Provider(ethereum);
const signer = await provider.getSigner();
const connectedContract = await new ethers.Contract("0xc9f8336A01DCd029C8c7eB9BBce47A33B30e5CD8", ContractAbi.abi, signer);

// Request to our backend]
await axios.get(`http://localhost:3000/${accounts[0]}`).then(async (res) => {
    await connectedContract.merkleWhitelist(res.data.proof);
});
```

## Backend:
On our backend, we need to store a copy of the whitelist which will be used against the merkleRoot on the contract
```javascript
router.get("/:address", async (req, res) => {
  const whitelist = [
		"0x1Dac794d333ce41461540a0BCF8195029EFE6557",
		"0x8d12a197cb00d4456a1fe03395095ce2a5cc6819",
		"0x8d12a197cb00d4123a1fe03395095ce2a5cc6819",
	];
	const leafNodes = whitelist.map((address) => keccak256(req.params.address));
	const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
	let proof = tree.getHexProof(keccak256(req.params.address));
	res.json({ proof });
});
```

## Smart Contract
On our smart contract, we only store the merkle root which we can use to check proof sent by the client. In our case, that the request is from a whitelisted address
```solidity
bytes32 internal merkleRoot = 0x9140c36cb53e08f356aefe3319b0272b73c58c5670c3e8173d94666675449a7d;

function merkleWhitelist(bytes32[] memory proof) external {
  bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
  require(MerkleProof.processProof(proof, leaf) == merkleRoot, "Merkle Proof verification failed");
  // Tada... do something
}
  ```
