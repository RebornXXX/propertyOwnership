"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

const { Gateway, Wallets } = require("fabric-network");

const path = require("path");

const fs = require("fs");

app.post("/api/addnewhome/", async function (req, res) {
  try {
    // load the network configuration

    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "home",
      "shivam",
      "fabric-samples",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );

    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.

    const walletPath = path.join(process.cwd(), "wallet");

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log("Wallet path: ${walletPath}");

    // Check to see if we've already enrolled the user.

    const identity = await wallet.get("appUser1");

    if (!identity) {
      console.log(
        'An identity for the user "appUser1" does not exist in the wallet'
      );

      console.log("Run the registerUser.js application before retrying");

      return;
    }

    // Create a new gateway for connecting to our peer node.

    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "appUser1",
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.

    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.

    const contract = network.getContract("propertyOwnership");

    // submit the specified transaction

    // AddNewCar  transaction - requires 5 argument, ex: (‘addNewCar’, ‘5', 'Ford', ‘Abhay’, ‘4567’)

    await contract.submitTransaction(
      "addNewHome",
      req.body.id,
      req.body.location,
      req.body.owner,
      req.body.price
    );

    console.log("Transaction has been submitted");

    res.send("Transaction has been submitted");

    // Disconnect from the gateway.

    await gateway.disconnect();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
});

app.get("/api/queryhomebyid/:id", async function (req, res) {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "home",
      "shivam",
      "fabric-samples",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log("Wallet path: ${walletPath}");

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("appUser1");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser1",
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("propertyOwnership");

    // Evaluate the specified transaction
    // QueryPropertyById transaction - requires one argument ex: (‘queryCarById’, '5')

    const result = await contract.evaluateTransaction(
      "queryHomeById",
      req.params.id
    );
    console.log(
      "Transaction has been evaluated, result is: ${result.toString()}"
    );
    res.status(200).json({ response: result.toString() });

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

app.put("/api/changehomeownership/:id", async function (req, res) {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "home",
      "shivam",
      "fabric-samples",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log("Wallet path: ${walletPath}");

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("appUser1");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser1",
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("propertyOwnership");

    // Submit the specified transaction
    // TransferProperty transaction - requires one argument ex: (‘changeCarOwnership’, '5', ‘John’)

    await contract.submitTransaction(
      "changeHomeOwnership",
      req.params.id,
      req.body.newOwner
    );
    console.log("Transaction has been submitted");
    res.send("Transaction has been submitted");

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

app.listen(8080, "localhost");

console.log("Running on http://localhost:8080");
