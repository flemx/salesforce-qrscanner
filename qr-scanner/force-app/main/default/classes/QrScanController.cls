/**
 *   Apex class to handle qrscan lightning web component 
 *   5 May 2019
 *   @author Damien Fleminks 
 */

public class  QrScanController {

   

    @AuraEnabled
    public static String createOrder(String myAccountId, List<MyProducts> myProducts){
        System.debug('myAccountId is: ' + myAccountId);
        //System.debug('myProducts is: ' + myProducts[0].Product2Id);

        

        //Id myAccountId = '0019E00000xTK22QAG';
        //List<MyProducts> myProducts = new List<MyProducts>();
        List<OrderItem> newOrderItems = new List<OrderItem>();
        

        //myProducts.add(new MyProducts(Quantity = 2, Product2Id = '01t9E000005lm1HQAQ'));
        //myProducts.add(new MyProducts(Quantity = 1, Product2Id = '01t9E000005h4FGQAY'));
        

        for(MyProducts item: MyProducts){
            System.debug('Product2Id : '+ item.Product2Id);
        }

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
    
}
