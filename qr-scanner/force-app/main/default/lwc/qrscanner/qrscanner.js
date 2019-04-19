import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import qrscan_js from '@salesforce/resourceUrl/QRscanner_js';
import qrscan_css from '@salesforce/resourceUrl/QRScanner_css';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Qrscanner extends LightningElement {

    @track error;
    @track successMessage = '';
 
    renderedCallback() { // invoke the method when component rendered or loaded
        Promise.all([
            loadStyle(this, qrscan_css), // qrscanner CSS File
            loadScript(this, qrscan_js),  // qrscanner js lib file
        ])
        .then(() => { 
            this.error = undefined;
            // Call back function if scripts loaded successfully
            window.console.log('Successfully Loaded scripts');
            qrscango();
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });

        function qrscango(){
            window.console.log('Loaded qrscango');
            let selectedDeviceId;
            const codeReader = new ZXing.BrowserQRCodeReader()
            window.console.log('ZXing code reader initialized')
            codeReader.getVideoInputDevices()
                .then((videoInputDevices) => {
                    const sourceSelect = this.template.getElementById('sourceSelect')
                    selectedDeviceId = videoInputDevices[0].deviceId
                    if (videoInputDevices.length >= 1) {
                        videoInputDevices.forEach((element) => {
                            const sourceOption = document.createElement('option')
                            sourceOption.text = element.label
                            sourceOption.value = element.deviceId
                            sourceSelect.appendChild(sourceOption)
                        })
                        sourceSelect.onchange = () => {
                            selectedDeviceId = sourceSelect.value;
                        };
                        const sourceSelectPanel = this.template.getElementById('sourceSelectPanel')
                        sourceSelectPanel.style.display = 'block'
                    }
                    this.template.getElementById('startButton').addEventListener('click', () => {
                        codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
                            window.console.log(result)
                            this.template.getElementById('result').textContent = result.text
                        }).catch((err) => {
                            window.console.error(err)
                            this.template.getElementById('result').textContent = err
                        })
                        window.console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
                    })
                    this.template.getElementById('resetButton').addEventListener('click', () => {
                        codeReader.reset()
                        window.console.log('Reset.')
                    })
                })
                .catch((err) => {
                    window.console.error(err)
                })
        }

        
        
    }


    


}