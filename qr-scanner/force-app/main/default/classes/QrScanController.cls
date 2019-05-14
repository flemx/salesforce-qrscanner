/**
 *   Apex class to handle qrscan lightning web component 
 *   5 May 2019
 *   @author Damien Fleminks 
 */

public class  QrScanController {


@AuraEnabled
    public static String createOrder(String qrOrder){

        QR_order__c myQRorder = [select Id, Account__c, ProfileStatus__c, Risk_of_Churn__c from QR_order__c where Id = :qrOrder];
        List<OrderItem> newOrderItems = new List<OrderItem>();
        List<MyProducts> myProducts = new List<MyProducts>();
        String myAccountId = myQRorder.Account__c;

        try{

            for(QR_product__c prod: [select Id, Quantity__c, Product__c from QR_product__c where QR_order__c = :qrOrder]){
                MyProducts myProd = new MyProducts();
                myProd.Quantity = prod.Quantity__c;
                myProd.Product2Id = prod.Product__c;
                myProducts.add(myProd);
            }

            Pricebook2 myPricebook = [
            select Id from Pricebook2 
            where IsStandard = true limit 1];
            //System.debug('Pricebook2Id contract is: ' + myContract.Pricebook2Id);
			System.debug('Pricebook id is: ' + myPricebook.Id);
            
            Order myOrder = new Order();
            myOrder.AccountId = myAccountId;
            myOrder.EffectiveDate = Date.Today();
            //myOrder.ContractId = myContract.Id;
            myOrder.Status = 'Draft';
            myOrder.Pricebook2Id = myPricebook.Id;
            insert myOrder;
            
			Account cusAcnt = [select Id,PersonContactId from Account where Id = :myQRorder.Account__c];            
            Contact myContact = [select Id, Cust360_ChurnRisk__c, Cust360_Metric2__c from Contact where Id = :cusAcnt.PersonContactId];
			myContact.Cust360_ChurnRisk__c = myQRorder.Risk_of_Churn__c;
            myContact.Cust360_Metric2__c = myQRorder.ProfileStatus__c;
            update myContact;
            
            for(MyProducts myItem: myProducts){
                //Get PricebookEntry
                PricebookEntry listPrice = [
                select UnitPrice from PricebookEntry 
                where Product2Id = :myItem.Product2Id
                and Pricebook2Id = :myPricebook.Id limit 1];
                // Create OrderItem and add to newOrderItems
                OrderItem newItem = new OrderItem();
                newItem.Quantity = myItem.Quantity;
                newItem.Product2Id =  myItem.Product2Id;
                newItem.OrderId = myOrder.Id;
                newItem.PricebookEntryId = listPrice.Id;
                newItem.UnitPrice = listPrice.UnitPrice;
                newOrderItems.add(newItem);  
            }
            insert newOrderItems;
            return 'success';
        }
        catch(Exception e){
            System.debug(e.getMessage());
            return 'failed';
        }

        
    }
   

/*

    @AuraEnabled
    public static String createOrder(String myAccountId, List<MyProducts> myProducts){
        System.debug('myAccountId is: ' + myAccountId);
        List<OrderItem> newOrderItems = new List<OrderItem>();

        try{
            Contract myContract = [
            select Id,Pricebook2Id from Contract 
            where AccountId = :myAccountId limit 1];
            System.debug('Pricebook2Id contract is: ' + myContract.Pricebook2Id);

            Order myOrder = new Order();
            myOrder.AccountId = myAccountId;
            myOrder.EffectiveDate = Date.Today();
            myOrder.ContractId = myContract.Id;
            myOrder.Status = 'Draft';
            insert myOrder;

            for(MyProducts myItem: myProducts){
                //Get PricebookEntry
                PricebookEntry listPrice = [
                select UnitPrice from PricebookEntry 
                where Product2Id = :myItem.Product2Id
                and Pricebook2Id = :myContract.Pricebook2Id limit 1];
                // Create OrderItem and add to newOrderItems
                OrderItem newItem = new OrderItem();
                newItem.Quantity = myItem.Quantity;
                newItem.Product2Id =  myItem.Product2Id;
                newItem.OrderId = myOrder.Id;
                newItem.PricebookEntryId = listPrice.Id;
                newItem.UnitPrice = listPrice.UnitPrice;
                newOrderItems.add(newItem);  
            }
            insert newOrderItems;
            return 'success';
        }
        catch(Exception e){
            System.debug(e.getMessage());
            return 'failed';
        }

        
    }
    */
    
}