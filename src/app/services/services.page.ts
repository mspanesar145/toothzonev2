import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../api/user';
import { RestService } from '../api/rest.service';
import { MiscService } from '../api/misc.service';
import { DentalService } from '../api/dental-service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  public loggedInUser = new User();
  public dentalServices: DentalService[] = [];
  public dentalServiceMap: [DentalService[]] = [[]];

  constructor(private router: Router,
    private restService: RestService,
    private miscService: MiscService) { }

  ngOnInit() {

    Storage.get({ key: 'User' }).then((response:any) => {
      this.loggedInUser = new User(JSON.parse(response.value));
    });

    this.restService.allDentalServices().subscribe((response) => {
        this.dentalServices = response;
        
        var index = 0;
        var demtistServiceArr: DentalService[] = [];
        this.dentalServices.forEach(element => {

            if (index > 0 && index % 3 == 0) {
              this.dentalServiceMap.push(demtistServiceArr);
              demtistServiceArr = [];
            }

            demtistServiceArr.push(element);

            if (index == this.dentalServices.length - 1) {
              this.dentalServiceMap.push(demtistServiceArr);
              demtistServiceArr = [];
            }
            index ++;

        });
    });
  }

  ionViewWillEnter() {
    Storage.get({ key: 'User' }).then((response:any) => {
      this.loggedInUser = new User(JSON.parse(response.value));
    });
  }


  homeButtonPressed() {
    this.router.navigate(['/app/tabs/home']);
  }

  bookAppointmentPressed() {
    window.open('https://www.toothzone.com.au/locations/', '_system', 'location=yes'); 
  }

}
