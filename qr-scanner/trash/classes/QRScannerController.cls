/**
 *  Apex class to handle the QRScanner app 
 */
global with sharing class QRScannerController {
	
    global String accountId { get; set; }
    global static Account account { get; set; }
    
    @RemoteAction
    global static Account getAccount(String accountId) {
        account = [SELECT Id, Name, Phone, Type, NumberOfEmployees 
                   FROM Account WHERE Id = :accountId];
        return account;
    }
    
   @RemoteAction
    global static void insertAccount(Account account){
        insert account;
    }
	
    
    
}