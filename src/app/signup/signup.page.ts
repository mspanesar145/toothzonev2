import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { RestService } from '../api/rest.service';
import { MiscService } from '../api/misc.service';
import { User } from '../api/user';
//import { $ } from 'protractor';
import * as $ from "jquery";
import { Storage } from '@capacitor/storage';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public validations_form: FormGroup;
  public validation_messages = {};
  public isSubmitted:boolean = false;
  public deviceToken : String = "";
  public platformType : String = "";
  public signupUser = new User();

  constructor(private navControl: NavController, 
    private router: Router, 
    private formBuilder : FormBuilder, 
    private restService: RestService, 
    public miscService : MiscService,
    public platform: Platform) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      date_of_birth: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      state: new FormControl('', Validators.compose([
        Validators.required
      ])),
      phone_number: new FormControl('', Validators.compose([
        Validators.required
      ])),
      post_code: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])),
      agree_term_conditions: new FormControl('false', Validators.compose([
        Validators.requiredTrue
      ])),
    });
  } 

  get errorControl() {
    return this.validations_form.controls;
  }
  
  datechange() {
    console.log("Signu Pressed");
    $(".dob-placeholder").html('');
  }
  registerUser(form){
    console.log(form.value)
    debugger;
     this.isSubmitted = true;
     if (!this.validations_form.valid) {
       return false;
     } else {
       this.miscService.presentLoading("logging in...");
       this.restService.signup(form.value).subscribe((res)=>{
        this.miscService.dismissLoading();

         if (res.status == 1) {
            this.signupUser  = new User(res.data);
            Storage.remove({ key: 'User' });
            Storage.set({ key: 'User', value: JSON.stringify(res.data)});

            var sendOtpData = {'phoneNumber' : form.value.phone_number};

            this.restService.login(sendOtpData).subscribe((optResponse) => {
                if (optResponse.status == 1) {
                  Storage.remove({ key: 'phoneNumber' });
                  Storage.set({ key: 'phoneNumber', value: JSON.stringify(form.value.phone_number)});
                  this.router.navigateByUrl('phone-verify');
                } else {
                  alert(optResponse.message);
                }
            });
          }else {
            alert(res.message);
         }
       });
   
     }
   }

}
