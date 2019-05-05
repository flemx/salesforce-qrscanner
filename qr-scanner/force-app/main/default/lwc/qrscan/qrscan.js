import { LightningElement, track } from 'lwc';
import QRSCAN_HTML from '@salesforce/resourceUrl/qrscanner_html';
import qrcontroller from '@salesforce/apex/QrScanController.createOrder';

export default class Qrscan extends LightningElement {
    qrscan_src = QRSCAN_HTML;
    @track areDetailsVisible = false;


    constructor() {
        window.console.log('renderedCallback running');
        super();
        
        window.addEventListener('message', function(event) {
            if(event.data.isMale){
                window.console.log('QR code Message received');
                window.console.log(event.data.name);
                window.console.log('executing createOrder()');
                let myAccount = '0019E00000xTK22QAG';
                let theProducts = [];
                theProducts.push({"Quantity" : 2, "Product2Id" : "01t9E000005lm1HQAQ"});
                theProducts.push({"Quantity" : 3, "Product2Id" : "01t9E000005h4FGQAY"});
                qrcontroller({myAccountId : myAccount, myProducts : theProducts})
                    .then(function(result) {
                        window.console.log('Result returned from createOrder()');
                        window.console.log(result);
                    })
                    .catch(function(error) {
                        window.console.log(`Error: \n ${error.message}`);
                    });
            }
        }, false);
            
    }

    openQrScan() {
        this.areDetailsVisible = true;
    }

    /*
    renderedCallback(){
        this.createOrder();
    }
    */

    createOrder(){
        window.console.log('executing createOrder()');
        let myAccount = '0019E00000xTK22QAG';
        let theProducts = [];
        theProducts.push({"Quantity" : 2, "Product2Id" : "01t9E000005lm1HQAQ"});
        theProducts.push({"Quantity" : 3, "Product2Id" : "01t9E000005h4FGQAY"});
        qrcontroller({myAccountId : myAccount, myProducts : theProducts})
            .then(result => {
                window.console.log('Result returned from createOrder()');
                window.console.log(result);
            })
            .catch(error => {
                window.console.log(`Error: \n ${error.message}`);
            });
    }


}