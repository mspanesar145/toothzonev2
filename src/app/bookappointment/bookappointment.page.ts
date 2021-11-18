import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { User } from '../api/user';

@Component({
  selector: 'app-bookappointment',
  templateUrl: './bookappointment.page.html',
  styleUrls: ['./bookappointment.page.scss'],
})
export class BookappointmentPage implements OnInit {

  public loggedInUser = new User();

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    Storage.get({ key: 'User' }).then((response:any) => {
      this.loggedInUser = new User(JSON.parse(response.value));
    });
  }

  
}
