import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SubmitQueryPage } from '../submit-query/submit-query.page';
import { Router } from '@angular/router';
import { User } from '../api/user';
import { Promotion } from '../api/promotion';
import { RestService } from '../api/rest.service';
import { Quotation } from '../api/quotation';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@capacitor/storage';
import { Browser } from '@capacitor/browser';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public loggedInUser = new User();
  public promotions: Promotion[] = [];
  public quotation = new Quotation;
  public appointments: any[] = [];
  public usernotifications: any[] = [];
  public birthDays: any[] = [];
  public providers: any[] = [];
  public funds: any[] = [];
  public fundPartments: any[] = [];

  constructor(public navCtrl: NavController,
    private route: Router,
    private restService: RestService,
    private iab: InAppBrowser,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    Storage.get({ key: 'User'}).then((response:any) => {
      if (response.value) {
        this.loggedInUser = new User(JSON.parse(response.value));
      } else {
        this.loggedInUser.id = 1;
      }
      
      this.restService.getUserProfiles(this.loggedInUser.id).subscribe(response => {

        this.appointments = response['appointments'];
        this.birthDays = response['birthdays'];
        this.usernotifications = response['usernotifications'];

        this.appointments.forEach(element => {

          var dobStr = element.appointment_date.toString();
          var d = parseInt(dobStr.split("/")[0]);//dobTmp.getDate();
          var m = parseInt(dobStr.split("/")[1]) < 10 ? "0"+parseInt(dobStr.split("/")[1]) : parseInt(dobStr.split("/")[1]);//dobTmp.getDate();
          var y = dobStr.split("/")[2];//dobTmp.getDate();
          element['iondate'] = y+"-"+m+"-"+d;
        });

        this.usernotifications.forEach(element => {
          element['iondate'] = element.created_on.split(" ")[0];
        });

      });
    });

    this.restService.allPromotions().subscribe((response) => {
      this.promotions = response;
    });

    this.restService.getQuotations().subscribe((response) => {
        this.quotation = response[0];
    });

    this.getProviderFundImages();

  }

  ionViewWillEnter() {
    Storage.get({ key: 'User' }).then((response:any) => {
      this.loggedInUser = new User(JSON.parse(response.value));
    });
  }

  submitQueryClicked() {
    this.route.navigate(['app/tabs/submit-query']);
  }
  
  contactUsClicked() {
    this.route.navigate(['app/tabs/contactus']);
  }

  getProviderFundImages() {
    this.restService.getProvidersAndFunds().subscribe((response) => {

        debugger;
        var brokenProviders: any[] = [];
        var brokenFunds: any[] = [];
        var brokenFundPartners: any[] = [];

        var indx = 0;
        var fundIndx = 0;
        var fundPartnerIndx = 0;

        response.forEach(element => {

            if (element.type == 1) {
              if (indx == 0 || indx%4 != 0) {
                brokenProviders.push(element);
              }
              indx++;
              if (indx%4 == 0) {
                this.providers.push(brokenProviders);
                brokenProviders = [];
              }
            } 
            
            if (element.type == 2) {
              if (fundPartnerIndx == 0 || fundPartnerIndx%4 != 0) {
                brokenFundPartners.push(element);
              }
              fundPartnerIndx++;
              if (fundPartnerIndx%4 == 0) {
                this.fundPartments.push(brokenFundPartners);
                brokenFundPartners = [];
              }
            }

            if (element.type == 3) {
              if (fundIndx == 0 || fundIndx%4 != 0) {
                brokenFunds.push(element);
              }
              fundIndx++;
              if (fundIndx%4 == 0) {
                this.funds.push(brokenFunds);
                brokenFunds = [];
              }
            }
        });
    });
  }

  async presentBookingActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Location',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Tooth Zone Aberfoyle Park, SA - 5159',
        handler: () => {
          console.log('Share clicked');
          Browser.open({ url: 'https://apac.dentalhub.online/soe/new/TOOTH%20ZONE%20ABERFOYLE%20PARK?pid=AUTZA01' });
        }
      }, {
        text: 'Tooth Zone Blackwood',
        handler: () => {
          console.log('Play clicked');
          Browser.open({ url: 'https://apac.dentalhub.online/soe/new/Tooth%20Zone%20Blackwood?pid=AUUDP02' });
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
