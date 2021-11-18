import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../api/user';
import { RestService } from '../api/rest.service';
import { AddprofilePage } from '../addprofile/addprofile.page';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public loggedInUser = new User();
  public childUsers: User[] = [];
  public mainUser = new User();
  private allUsers: User[] =[];

  constructor(public navCtrl: NavController,
    private router: Router,
    private restService: RestService) {
     
    }

  ngOnInit() {

   

  }

  ionViewWillEnter() {
    Storage.get({ key: 'User' }).then((response:any) => {
      if (response.value) {
        this.loggedInUser = new User(JSON.parse(response.value));
      } else {
        this.loggedInUser.id = 20;
      }

      this.allUsers = [];

      this.restService.getUserProfiles(this.loggedInUser.id).subscribe((response) => {
        this.mainUser = response['patientdetail'];

        this.childUsers = response['childpatient'].map((user: User) => new User(user));

        this.mainUser['expanded'] = true;
        this.allUsers.push(this.mainUser);
        this.childUsers.forEach(element => {
          element['expanded'] = false;
          this.allUsers.push(element);
        });
      });
    });
  }

  expandItem(patient): void {
    if (patient.expanded) {
      patient.expanded = false;
    } else {
      this.allUsers.map(listItem => {
        if (patient == listItem) {
          listItem['expanded'] = !listItem['expanded'];
        } else {
          listItem['expanded'] = false;
        }
        return listItem;
      });
    }
  }

  editButtonPressed(patient) {

    var dobStr = patient.date_of_birth.toString();
    var d = parseInt(dobStr.split("/")[0]);//dobTmp.getDate();
    var m = parseInt(dobStr.split("/")[1]);//dobTmp.getDate();
    var y = dobStr.split("/")[2];//dobTmp.getDate();
    patient.date_of_birth = new Date(m+"/"+d+"/"+y);
    Storage.remove({key : "patient"});
    Storage.set({key : "patient", value: JSON.stringify(patient)});
    this.navCtrl.navigateForward("/app/tabs/addprofile");
  }

  homeButtonPressed() {
    this.router.navigate(['/app/tabs/home']);
  }


  addPatientButtonPressed() {
    Storage.remove({key : "patient"});
    this.navCtrl.navigateForward("/app/tabs/addprofile");
  }
}
