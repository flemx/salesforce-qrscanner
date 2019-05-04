import { LightningElement } from 'lwc';
import QRSCAN_HTML from '@salesforce/resourceUrl/qrscanner_html';


export default class Qrscan extends LightningElement {
    qrscan_src = QRSCAN_HTML;

    constructor() {
        window.console.log('Constructer running');
        super();
        window.addEventListener('message', function(event) {
            if(event.data.isMale){
                window.console.log('QR code Message received');
                window.console.log(event.data.name);
            }

        }, false);

    }



}