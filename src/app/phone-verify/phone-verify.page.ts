import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestService } from '../api/rest.service';
import { MiscService } from '../api/misc.service';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { User } from '../api/user';
import { Storage } from '@capacitor/storage';
import * as $ from "jquery";
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

@Component({
  selector: 'app-phone-verify',
  templateUrl: './phone-verify.page.html',
  styleUrls: ['./phone-verify.page.scss'],
})

export class PhoneVerifyPage implements OnInit {

  platformType: String = "0";

  constructor(private navControl: NavController, 
    private router: Router, 
    private formBuilder : FormBuilder, 
    private restService: RestService, 
    public miscService : MiscService,
    public platform: Platform,
    private smsRetriever: SmsRetriever) { 

      this.smsRetriever.getAppHash()
  .then((res: any) => console.log(res))
  .catch((error: any) => console.error(error));


    }
  public validations_form: FormGroup;
  public validation_messages = {};
  public isSubmitted:boolean = false;


  ngOnInit() {
    debugger;
    this.platformType = this.platform.is("android") ? "ANDROID" : "IOS";

    this.validations_form = this.formBuilder.group({
      verifyCode1: new FormControl('', Validators.compose([
        Validators.required
      ])),
      verifyCode2: new FormControl('', Validators.compose([
        Validators.required
      ])),
      verifyCode3: new FormControl('', Validators.compose([
        Validators.required
      ])),
      verifyCode4: new FormControl('', Validators.compose([
        Validators.required
      ])),
      verifyCode5: new FormControl('', Validators.compose([
        Validators.required
      ])),
      verifyCode6: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.smsRetriever.startWatching()
  .then((res: any) => { 
    console.log(res); 
      var message = res.Message;
      var otpCode = message.substring(message.length-6, message.length);
      $("#verifyCode1").value = otpCode.substring(0,1);
      $("#verifyCode2").value = otpCode.substring(1,2);
      $("#verifyCode3").value = otpCode.substring(2,3);
      $("#verifyCode4").value = otpCode.substring(3,4);
      $("#verifyCode5").value = otpCode.substring(4,5);
      $("#verifyCode6").value = otpCode.substring(5,6);
  
  })
  .catch((error: any) => console.error(error));

  }


  verifyCode(form){
    // debugger;
     this.isSubmitted = true;
     if (!this.validations_form.valid) {
       return false;
     } else {
       debugger;

       this.miscService.presentLoading("verifying code...");
       Storage.get({ key: 'phoneNumber'}).then((response:any) => {
        console.log(response);
        this.restService.verifyCode(form.value,response.value).subscribe((res)=>{
          this.miscService.dismissLoading();
          debugger;
           if (res.status == 1) {
             //let user = new User(res.data);
             Storage.set({ key: 'User', value: JSON.stringify(res.data[0]) });
             
             Storage.get({key : 'deviceToken'}).then((response:any) => {
              this.restService.saveDeviceToken(response.value, this.platformType == "IOS" ? "1" : "2", res.data[0].id).subscribe((reso)=>{
                this.miscService.dismissLoading();
                //alert(JSON.stringify(reso));
                this.navControl.setDirection('root');
                this.router.navigateByUrl('app/tabs/home');
        
              });

            });
  
            }else {
             alert(res.message);
           }
         });
      });
      
   
     }
   }

   otpController(event,next,prev, index){
    if(index == 6) {
      console.log("submit")
    }
    if(event.target.value.length < 1 && prev){
      prev.setFocus()
    }
    else if(next && event.target.value.length>0){
      next.setFocus();
    }
    else {
     return 0;
    } 
 }

}
