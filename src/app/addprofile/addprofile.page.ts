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
  selector: 'app-addprofile',
  templateUrl: './addprofile.page.html',
  styleUrls: ['./addprofile.page.scss'],
})
export class AddprofilePage implements OnInit {

  public validations_form: FormGroup;
  public validation_messages = {};
  public isSubmitted:boolean = false;
  public deviceToken : String = "";
  public platformType : String = "";
  public patient = new User();
  public loggedInUser = new User();
  public screenTitle: String = "";

  constructor(private navControl: NavController,
    private router: Router, private formBuilder : FormBuilder, private restService: RestService, public miscService : MiscService,public platform: Platform) { }

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
    });
    Storage.get({ key: 'User'}).then((response:any) => {
      if (response.value) {
        this.loggedInUser = new User(JSON.parse(response.value));
      } else {
        this.loggedInUser.id = 20;
      }
    });

    
  } 
  
  ionViewWillEnter() {
    
    //setTimeout(function() {
      Storage.get({ key: 'patient'}).then((response:any) => {

        if (response.value) {
          this.screenTitle = "EDIT PROFILE";
          this.patient = new User(JSON.parse(response.value));
          $("#fullname").val(this.patient.name+"");
          $("#phone").val(this.patient.phone_number+"");
          $("#gender").val(this.patient.gender == 0 ? "Male" : "Female");
          $("#address").val(this.patient.address+"");
          $("#state").val(this.patient.state+"");
          $("#postCode").val(this.patient.post_code+"");
  
          debugger;
          //Format should be dd/mm/yy for date
            let dobTmp = new Date(this.patient.date_of_birth);
            if (dobTmp.getDate()) {

              var dobStr = this.patient.date_of_birth.toString();

              var d = dobTmp.getDate();
              //var m = parseInt(dobStr.split("/")[1]);//dobTmp.getDate();
              //var y = dobStr.split("/")[2];//dobTmp.getDate();
              var m = dobTmp.getMonth() + 1; //Month from 0 to 11
              var y = dobTmp.getFullYear();
              var dob =  '' +(m<=9 ? '0' + m : m)  + ' ' +  (d <= 9 ? '0' + d : d) + ',' + y;
              $("#dob").val(dob+"");
            } else {
              $("#dob").val("");
            }
  
        } else {
  
          this.screenTitle = "ADD PROFILE";
          $("#fullname").val("");
          $("#phone").val("");
          $("#gender").val("Male");
          $("#address").val("");
          $("#state").val("");
          $("#postCode").val("");
          $("#dob").val("");

        }
  
      });
      
    //}, 1000);
  }


  registerPatient(form){

    debugger;
    console.log(form.value)
     this.isSubmitted = true;
     if (!this.validations_form.valid) {
       alert("Fields cannot be empty");
       return false;
     } else {
        this.miscService.presentLoading("Adding...");

        Storage.get({ key: 'patient'}).then((response:any) => {
            if (response.value) {
              var pat = JSON.parse(response.value);
              this.restService.registerPatient(form.value, pat.parent_id, pat.id).subscribe((res)=>{
                this.miscService.dismissLoading();
      
                if (res.status == 1) {
                    if (!pat.parent_id) {
                        Storage.get({ key: 'User'}).then((response:any) => {
                          if (response.value) {
                            this.loggedInUser = new User(JSON.parse(response.value));

                            this.loggedInUser.name = res.data.name;

                            Storage.set({ key: 'User', value: JSON.stringify(this.loggedInUser) });

                          } else {
                            this.loggedInUser.id = 20;
                          }
                        });
                  
                    }
                    this.router.navigate(['app/tabs/profile']);
                } else {
                    alert(res.message);
                }
              });
            } else {
              this.restService.registerPatient(form.value, this.loggedInUser.id, null).subscribe((res)=>{
                this.miscService.dismissLoading();
      
                if (res.status == 1) {
                    this.router.navigate(['app/tabs/profile']);
                } else {
                    alert(res.message);
                }
              });
            }
       });
     }
   }

  get errorControl() {
    return this.validations_form.controls;
  }

  backButtonPressed() {
    this.navControl.navigateBack("/app/tabs/profile");
  }

  homeButtonPressed() {
    this.router.navigate(['/app/tabs/home']);
  }

}
