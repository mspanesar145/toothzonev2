import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { User } from './api/user';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform, 
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private push: Push,
    private navCtrl: NavController) {}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

   // to check if we have permission
    this.push.hasPermission()
    .then((res: any) => {

      if (res.isEnabled) {
        console.log('We have permission to send push notifications');
      } else {
        console.log('We do not have permission to send push notifications');
      }

    });

    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    this.push.createChannel({
      id: "testchannel1",
      description: "My first test channel",
      // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 3,
      //badge is used to if badge appears on the app icon see https://developer.android.com/reference/android/app/NotificationChannel.html#setShowBadge(boolean).
      //false = no badge on app icon.
      //true = badge on app icon
      badge: false
    }).then(() => console.log('Channel created'));
    
    // Delete a channel (Android O and above)
    this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));
    
    // Return a list of currently configured channels
    this.push.listChannels().then((channels) => console.log('List of channels', channels))
    
    // to initialize push notifications
    
    const options: PushOptions = {
        android: {},
        ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
        },
        windows: {},
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        }
    }
    
    const pushObject: PushObject = this.push.init(options);
    
    
    pushObject.on('notification').subscribe((notification: any) =>  { 
      console.log('Received a notification', notification);

      //this.navCtrl.navigateRoot('app/tabs/home');            
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
       this.router.navigate([currentUrl]);
      });
   
      //window.location.reload();
    });
    
    pushObject.on('registration').subscribe((registration: any) =>  {
      //alert('Device registered'+registration.registrationId);
      Storage.set({key : 'deviceToken', value: registration.registrationId});
    });
    
    //pushObject.on('error').subscribe(error => alert('Error with Push plugin'+ error));

        //this.router.navigate(['/']);
        Storage.get({ key: 'User'}).then((response:any) => {
          if (response.value) {
              this.router.navigate(['app/tabs/home']);
          } else {
            this.router.navigate(['/']);
          }
        });
    });
  }

}

