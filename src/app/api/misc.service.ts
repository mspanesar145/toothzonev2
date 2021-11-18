import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

let loading:any= null;
const { Toast } = Plugins;
const loadingController : LoadingController = new LoadingController();

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor() { }
  showToastMessage(message:string) {
    Toast.show({
      text: message,
    });
  }

  async presentLoading(message:string) {
    loading = await loadingController.create({
    /* cssClass: 'loader-message', */
     message: message,
    /* duration: 2000 */
   });
    loading.present();
 }
 dismissLoading(){
  loading.dismiss();

 }
 dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

     // byteString = dataURI
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}
}
