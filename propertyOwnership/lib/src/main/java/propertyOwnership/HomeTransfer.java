package propertyOwnership;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import com.owlike.genson.Genson;
 
 
@Contract(
        name = "PropertyOwnership",
        info = @Info(
                title = "PropertyOwnership contract",
                description = "A Sample Property transfer chaincode example",
                version = "0.0.1-SNAPSHOT"))
 
 
@Default
public final class HomeTransfer implements ContractInterface {
 
	private final Genson genson = new Genson();
	private enum PropertyOwnershipErrors {
	        Property_NOT_FOUND,
	        Property_ALREADY_EXISTS
	    }
	
	
	/**
     * Add some initial properties to the ledger
     *
     * @param ctx the transaction context
     */
    @Transaction()
    public void initLedger(final Context ctx) {
    	
        ChaincodeStub stub= ctx.getStub();
        
        Home Home = new Home("1", "HSR","Shivam","1200");
        
        String HomeState = genson.serialize(Home);
        
        stub.putStringState("1", HomeState);
    }
    
    
    /**
     * Add new Home on the ledger.
     *
     * @param ctx the transaction context
     * @param id the key for the new Home
     * @param model the model of the new Home
     * @param ownername the owner of the new Home
     * @param value the value of the new Home
     * @return the created Home
     */
	
    @Transaction()
    public Home addNewHome(final Context ctx, final String id, final String location,
            final String ownername, final String value) {
        
    	ChaincodeStub stub = ctx.getStub();
 
        String HomeState = stub.getStringState(id);
        
        if (!HomeState.isEmpty()) {
            String errorMessage = String.format("Property %s already exists", id);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, PropertyOwnershipErrors.Property_NOT_FOUND.toString());
        }
        
        Home Home = new Home(id, location, ownername,value);
        
        HomeState = genson.serialize(Home);
        
        stub.putStringState(id, HomeState); 
        
        return Home;
    }
 
 
    	/**
	     * Retrieves a Property based upon Property Id from the ledger.
	     *
	     * @param ctx the transaction context
	     * @param id the key
	     * @return the Property found on the ledger if there was one
	     */
    	@Transaction()
	    public Home queryHomeById(final Context ctx, final String id) {
	        ChaincodeStub stub = ctx.getStub();
	        String HomeState = stub.getStringState(id);
 
	        if (HomeState.isEmpty()) {
	            String errorMessage = String.format("Property %s does not exist", id);
	            System.out.println(errorMessage);
	            throw new ChaincodeException(errorMessage, PropertyOwnershipErrors.Property_NOT_FOUND.toString());
	        }
	        
	        Home Home = genson.deserialize(HomeState, Home.class);
	        return Home;
	    }
    	
        /**
   	     * Changes the owner of a Home on the ledger.
   	     *
   	     * @param ctx the transaction context
   	     * @param id the key
   	     * @param newOwner the new owner
   	     * @return the updated Property
   	     */
   	    @Transaction()
   	    public Home changeHomeOwnership(final Context ctx, final String id, final String newHomeOwner) {
   	        ChaincodeStub stub = ctx.getStub();
 
   	        String HomeState = stub.getStringState(id);
 
   	        if (HomeState.isEmpty()) {
   	            String errorMessage = String.format("Property %s does not exist", id);
   	            System.out.println(errorMessage);
   	            throw new ChaincodeException(errorMessage, PropertyOwnershipErrors.Property_NOT_FOUND.toString());
   	        }
 
   	        Home Home = genson.deserialize(HomeState, Home.class);
 
   	        Home newHome = new Home(Home.getId(), Home.getLocation(), newHomeOwner, Home.getValue());
   	        
   	        String newHomeState = genson.serialize(newHome);
   	        
   	        stub.putStringState(id, newHomeState);
 
   	        return newHome;
   	    } 
}
