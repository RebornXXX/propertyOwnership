package fabricjavaclient;

import java.nio.file.Path;
import java.nio.file.Paths; 
import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;


public class ClientApp {
	
	static {
		System.setProperty("org.hyperledger.fabric.sdk.service_discovery.as_localhost", 	  "true");
	}

	public static void main(String[] args) throws Exception {
		// Load a file system based wallet for managing identities.
		Path walletPath = Paths.get("wallet");
		Wallet wallet = Wallets.newFileSystemWallet(walletPath);
		// load a CCP
		Path networkConfigPath = Paths.get("Redirect-Files", "connection-org1.yaml");
 
		Gateway.Builder builder = Gateway.createBuilder();
		builder.identity(wallet, "appUser").networkConfig(networkConfigPath).discovery(true);
 
		// create a gateway connection
		try (Gateway gateway = builder.connect()) {
 
			// get the network and contract
			Network network = gateway.getNetwork("mychannel");
			Contract contract = network.getContract("propertyOwnership");
 
			byte[] result;
			//contract.submitTransaction("addNewHome", "4", "Mannat", "Shhrukh-Khan", "504830000");
			result = contract.evaluateTransaction("queryHomeById", "4");
			System.out.println(new String(result));
 
			contract.submitTransaction("changeHomeOwnership", "4", "Farhan");
			result = contract.evaluateTransaction("queryHomeById", "4");
			System.out.println(new String(result));
		}
	}


}
