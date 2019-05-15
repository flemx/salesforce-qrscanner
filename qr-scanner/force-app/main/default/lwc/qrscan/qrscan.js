import { LightningElement, track } from 'lwc';
import QRSCAN_HTML from '@salesforce/resourceUrl/qrscanner_html';
import QRSCAN_HEADER from '@salesforce/resourceUrl/QRScanner_app_header';
import QRSCAN_CONTENT1 from '@salesforce/resourceUrl/QRScanner_app_content_before';
import QRSCAN_CONTENT2 from '@salesforce/resourceUrl/QRScanner_app_content_after';
import QRSCAN_CAMERA from '@salesforce/resourceUrl/QRScanner_app_camera';
import QRSCAN_LOADING from '@salesforce/resourceUrl/QRScanner_app_loading';
import qrcontroller from '@salesforce/apex/QrScanController.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Qrscan extends LightningElement {
    qrscan_src = QRSCAN_HTML;
    qrscan_head = QRSCAN_HEADER;
    qrscan_cont_before = QRSCAN_CONTENT1;
    qrscan_cont_after = QRSCAN_CONTENT2; 
    qrscan_cam = QRSCAN_CAMERA;
    qrscan_load = QRSCAN_LOADING;
    @track showloading = false;
    @track contentBefore = true;
    @track areDetailsVisible = false;
    @track confirmSuccess = false;


    constructor() {
        super()
        window.console.log('renderedCallback running');
        window.addEventListener('message', event => {
            window.console.log(event.data);
            if(event.data.isTrue){
                this.showloading = true;
                window.console.log('QR code Message received');
                window.console.log(event.data.myOrder);
                window.console.log('executing createOrder()');
                if(!this.confirmSuccess){
                    qrcontroller({qrOrder : event.data.myOrder})
                    .then(result => {
                        window.console.log('Result returned from createOrder()');
                        window.console.log(result);
                        if(result === 'success'){
                            this.contentBefore = false;
                            this.showloading = false;
                            this.areDetailsVisible = false;
                            const evt = new ShowToastEvent({
                                title: 'QR Code scanner',
                                message: 'Succesfully added transaction',
                                variant: 'success',
                            });
                            this.dispatchEvent(evt);
                            //this.confirmSuccess = true;
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