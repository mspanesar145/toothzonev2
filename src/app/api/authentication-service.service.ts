import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { switchMap, map, tap } from 'rxjs/operators';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  baseUrl:string = "http://lyonsdemoz.website/toothzone/api/";
  xkey: string = "82haf8kklm3fotpr23-f4gh2-vq587-32kytms";
  phoneNumber: string = "";

    // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: USER_KEY });    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  public login(data) : Observable<any> {
    let api: string = "home/user_login/format/json";
    debugger;
    let phnum = "";
    if (data.phoneNumber == "8264641723" || data.phoneNumber == "9876299850" || data.phoneNumber == "9914470139" || data.phoneNumber == "8437375294") {
      phnum = "91"+data.phoneNumber;
    } else {
      phnum = "61"+data.phoneNumber;
    }

    var formData: any = new FormData();
    formData.append("phone_number", phnum);
    formData.append("X-API-KEY", this.xkey);
    formData.append("submit","");
    //alert(this.baseUrl + api);
    //alert(JSON.stringify(data));

    return  this.http .post(this.baseUrl + api, formData).pipe(map((response: any)  => {
        return (response);
    }));
  }
  

  public verifyCode(data,phoneNumber) : Observable<any> {
    let api: string = "home/user_login_verify/format/json";
    let verifyCode: string = data.verifyCode1+""+data.verifyCode2+""+data.verifyCode3+""+data.verifyCode4+""+data.verifyCode5+""+data.verifyCode6;
    console.log("verifyCode :"+verifyCode);
    var formData: any = new FormData();
    
    let phnum = "";
    if (phoneNumber == "8264641723" || phoneNumber == "9876299850" || phoneNumber == "9914470139" || phoneNumber == "8437375294") {
      phnum = "91"+phoneNumber;
    } else {
      phnum = "61"+phoneNumber;
    }
    console.log("phone number : "+phnum);
    formData.append("phone_number", phnum);
    formData.append("X-API-KEY", this.xkey);
    formData.append("verify_code",verifyCode);
    formData.append("submit","");
    //alert(this.baseUrl + api);
    //alert(JSON.stringify(data));
    return this.http.post(this.baseUrl + api, formData).pipe(
      map((data: any) => data),
      switchMap(data => {
       return (data);
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: USER_KEY});
  }
}
