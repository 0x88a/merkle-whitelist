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
