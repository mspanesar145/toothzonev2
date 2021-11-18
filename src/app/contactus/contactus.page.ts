import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../api/user';
import { Contactus } from '../api/contactus';
import { RestService } from '../api/rest.service';
import { Storage } from '@capacitor/storage';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {

  public loggedInUser = new User();
  public contactusList : Contactus[] = [];

  constructor(private router: Router,
    private restService: RestService,
    private emailComposer: EmailComposer,
    private callNumber: CallNumber,
    private iab: InAppBrowser) { }

  ngOnInit() {

    Storage.get({ key: 'User'}).then((response:any) => {
      this.loggedInUser = new User(JSON.parse(response.value));
    });

    this.restService.getContactUsList().subscribe(response => {
      var contactusListTmp = response;
      contactusListTmp.forEach(element => {

        var phones = element.phone_no.split(",");
        if (phones[0]) {
          element.phone_no1 = phones[0];
        } 
        if (phones[1]) {
          element.phone_no2 = phones[1];
        }
        this.contactusList.push(element);
      });

      
    });

  }

  homeButtonPressed() {
    this.router.navigate(['/app/tabs/home']);
  }

  emailClicked(selectedEmail) {
    debugger;
    let email = {
      to: selectedEmail,
      subject: '',
      body: '',
      isHtml: true
    }
    // Send a text message using default options
    this.emailComposer.open(email);
  }

  phoneNumberPressed(phoneNumber) {
    this.callNumber.callNumber(phoneNumber, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }

  websiteLinkClicked(website) {
    //window.open(website);
    this.iab.create("http://"+website, '_system');

  }
}
