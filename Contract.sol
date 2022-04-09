// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Contract {
	bytes32 internal merkleRoot = 0x9140c36cb53e08f356aefe3319b0272b73c58c5670c3e8173d94666675449a7d;

	function merkleWhitelist(bytes32[] memory proof) external {
		bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
		require(MerkleProof.processProof(proof, leaf) == merkleRoot, "Merkle Proof verification failed");
		// Tada... do something
	}
}
