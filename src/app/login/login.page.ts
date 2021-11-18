import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { RestService } from '../api/rest.service';
import { MiscService } from '../api/misc.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../api/user';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Storage } from '@capacitor/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public validations_form: FormGroup;
  public validation_messages = {};
  public isSubmitted:boolean = false;
  public deviceToken : String = "";
  public platformType : String = "";
  


  constructor(private router: Router, 
    private formBuilder : FormBuilder, 
    private restService: RestService, 
    public miscService : MiscService, 
    public platform: Platform,
    private fb: Facebook,
    private fireAuth: AngularFireAuth,
    private push: Push,
    private googlePlus: GooglePlus,
    private navCtrl: NavController,
    private signInWithApple: SignInWithApple) { 

  }

  ngOnInit() {

      Storage.get({ key: 'User'}).then((response:any) => {
        if (response.value) {
            this.router.navigate(['app/tabs/home']);
        } else {
          this.router.navigate(['/']);
        }
      });
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
     
     
     pushObject.on('notification').subscribe((notification: any) => {  
       console.log('Received a notification', notification); 
       //window.location.reload();
       //this.navCtrl.navigateRoot('app/tabs/home');   
       
       let currentUrl = this.router.url;
       this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
       });
    
      });
     
     pushObject.on('registration').subscribe((registration: any) =>  {
       //alert('Device registered'+registration.registrationId)
        //console.log("Token", registration.registrationId);
       Storage.set({key : 'deviceToken', value: registration.registrationId});
     });
     
     pushObject.on('error').subscribe(error => alert('Error with Push plugin At Login'+ error));
  
    this.validations_form = this.formBuilder.group({
      phoneNumber: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    
  }

  ionViewDidEnter() {
     this.platformType = this.platform.is("android") ? "ANDROID" : "IOS";
  }

  emailSignInPressed() {
    console.log("Login Pressed");
    this.router.navigateByUrl('phone-verify');
  }
  sendOtp(form){
    // debugger;
     this.isSubmitted = true;
     if (!this.validations_form.valid) {
       return false;
     } else {
       this.miscService.presentLoading("logging in...");
       this.restService.login(form.value).subscribe((res)=>{
        this.miscService.dismissLoading();

        debugger;
         if (res.status == 1) {
           console.log(form.value.phoneNumber)
           Storage.remove({ key: 'phoneNumber'});
           Storage.set({ key: 'phoneNumber', value: JSON.stringify(form.value.phoneNumber)});
           this.router.navigateByUrl('phone-verify');
          }else {
           alert(res.message);
         }
       });
   
     }
   }

  facebookLoginPressed() {
    this.fb.logout();
    this.fb.login(['public_profile', 'email'])
    .then((response: FacebookLoginResponse) => {
      //this.onLoginSuccess(response);
      //alert(response.authResponse.accessToken);

      debugger;
      this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {      
        var data = {};
        data['name'] = profile['name'];
        data['socialId'] = profile['id'];
        data['userType'] = 3;

        this.miscService.presentLoading("Logging...");
        this.restService.socialSignup(data).subscribe((response) => {
          if (response.status == 1) {
            //let user = new User(res.data);
            Storage.set({ key: 'User', value: JSON.stringify(response.data) });
            
            Storage.get({key : 'deviceToken'}).then((deviceTokenResp:any) => {
             this.restService.saveDeviceToken(deviceTokenResp.value, this.platformType == "IOS" ? "1" : "2", response.data.id).subscribe((reso)=>{
               this.miscService.dismissLoading();
               //alert(JSON.stringify(reso));
               this.navCtrl.setDirection('root');
               this.router.navigateByUrl('app/tabs/home');
             });

           });
 
           }else {
            alert(response.message);
          }
        });
      });
    }).catch((error) => {
      console.log(error);
      alert('error:' + JSON.stringify(error));
    });

   }

  googleButtonPressed() {

    this.googlePlus.logout().then(res => console.log(res));

      this.googlePlus.login({})
    .then(response => { 
      console.log(response); 
      if (!response.displayName) {
        return;
      }
      //alert(JSON.stringify(response));
        var data = {};
        data['name'] = response.displayName;
        data['socialId'] = response.userId;
        data['userType'] = 2;

        this.miscService.presentLoading("Logging...");
        this.restService.socialSignup(data).subscribe((response) => {
          if (response.status == 1) {
            //let user = new User(res.data);
            Storage.set({ key: 'User', value: JSON.stringify(response.data) });
            
            Storage.get({key : 'deviceToken'}).then((deviceTokenResp:any) => {
             this.restService.saveDeviceToken(deviceTokenResp.value, this.platformType == "IOS" ? "1" : "2", response.data.id).subscribe((reso)=>{
               this.miscService.dismissLoading();
               //alert(JSON.stringify(reso));
               this.navCtrl.setDirection('root');
               this.router.navigateByUrl('app/tabs/home');

             });

           });
 
           }else {
            alert(response.message);
          }
        });
    })
    .catch(err => console.error(err));
  }


  appleLoginPressed() {
    this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
    .then((res: AppleSignInResponse) => {
      // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
      alert('Send token to apple for verification: ' + res.identityToken);
      console.log(res);
        var data = {};
        data['name'] = res.fullName;
        data['socialId'] = res.identityToken;
        data['userType'] = 3;
        this.miscService.presentLoading("Logging...");
        this.restService.socialSignup(data).subscribe((response) => {
          if (response.status == 1) {
            //let user = new User(res.data);
            Storage.set({ key: 'User', value: JSON.stringify(response.data) });
            
            Storage.get({key : 'deviceToken'}).then((deviceTokenResp:any) => {
             this.restService.saveDeviceToken(deviceTokenResp.value, this.platformType == "IOS" ? "1" : "2", response.data.id).subscribe((reso)=>{
               this.miscService.dismissLoading();
               //alert(JSON.stringify(reso));
               this.navCtrl.setDirection('root');
               this.router.navigateByUrl('app/tabs/home');

             });

           });
 
           }else {
            alert(response.message);
          }
        });
    })
    .catch((error: AppleSignInErrorResponse) => {
      alert(error.code + ' ' + error.localizedDescription);
      console.error(error);
    });
  }
}
