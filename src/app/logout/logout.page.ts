import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { AlertController } from '@ionic/angular';

const { Modals } = Plugins;


@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private router: Router,
    public alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.presentAlertConfirm();

  } 

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Logout!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.router.navigate(['app/tabs/home'])
          }
        }, {
          text: 'Okay',
          handler: () => {
            Storage.remove({ key: 'User'});
            this.router.navigate(['/']);
          }
        }
      ]
    });

    await alert.present();
  }


  async showConfirm() {

    let confirmRet = await Modals.confirm({
      title: 'Logout',
      message: 'Are you sure?'
    });
    console.log(JSON.stringify(confirmRet));
    if(confirmRet.value == true) {
      Storage.remove({ key: 'User'});
     this.router.navigate(['/']);
    }else {
      this.router.navigate(['app/tabs/home'])

    }
  }

}
