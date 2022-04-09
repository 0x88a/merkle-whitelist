import axios from "axios";
import { ethers } from "ethers";
import ContractAbi from "./Contract.json";

const MerkleWhitelist = () => {
	return (
		<button
			onClick={async () => {
				try {
					const { ethereum } = window;
					const accounts = await ethereum.request({
						method: "eth_requestAccounts",
					});
					const provider = await new ethers.providers.Web3Provider(ethereum);
					const signer = await provider.getSigner();

					const connectedContract = await new ethers.Contract(
						"0xc9f8336A01DCd029C8c7eB9BBce47A33B30e5CD8", // Your contract address
						ContractAbi.abi,
						signer
					);
					await axios
						.get(`http://localhost:3000/${accounts[0]}`)
						.then(async (res) => {
							await connectedContract.merkleWhitelist(res.data.proof);
						});
				} catch (err) {
					console.log(err);
				}
			}}
		>
			Mint
		</button>
	);
};

export default MerkleWhitelist;
