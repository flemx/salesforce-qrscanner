import { LightningElement, track } from 'lwc';
import QRSCAN_HTML from '@salesforce/resourceUrl/qrscanner_html';
import qrcontroller from '@salesforce/apex/QrScanController.createOrder';

export default class Qrscan extends LightningElement {
    qrscan_src = QRSCAN_HTML;
    @track areDetailsVisible = false;
    @track confirmSuccess = false;


    constructor() {
        super()
        window.console.log('renderedCallback running');
        window.addEventListener('message', event => {
            window.console.log(event.data);
            if(event.data.isTrue){
                window.console.log('QR code Message received');
                window.console.log(event.data.myOrder);
                window.console.log('executing createOrder()');
                if(!this.confirmSuccess){
                    qrcontroller({qrOrder : event.data.myOrder})
                    .then(result => {
                        window.console.log('Result returned from createOrder()');
                        window.console.log(result);
                        if(result === 'success'){
                            this.areDetailsVisible = false;
                            this.confirmSuccess = true;
                        }
                    })
                    .catch(error => {
                        window.console.log(`Error: \n ${error.message}`);
                    });
                }
            }
        }, false);
    }

    openQrScan() {
        this.areDetailsVisible = true;
    }

}
