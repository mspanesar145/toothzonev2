import { Injectable, ɵPlayer } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DentalService } from './dental-service';
import { Promotion } from './promotion';
import { Quotation } from './quotation';
import { Contactus } from './contactus';



@Injectable({
  providedIn: 'root'
})
export class RestService {


  baseUrl:string = "http://lyonsdemoz.website/toothzone/api/";
  xkey: string = "82haf8kklm3fotpr23-f4gh2-vq587-32kytms";
  phoneNumber: string = "";


  constructor(private  httpClient : HttpClient) { }

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

    return  this.httpClient .post(this.baseUrl + api, formData).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));

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

    return  this.httpClient .post(this.baseUrl + api, formData).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));

        return (response);
    }));
  }

  public signup(data) : Observable<any> {
    let api: string = "home/user_registration/format/json";

    let phnum = "";
    if (data.phone_number == "8264641723" || data.phone_number == "9876299850" || data.phone_number == "9914470139" || data.phone_number == "8437375294") {
      phnum = "91"+data.phone_number;
    } else {
      phnum = "61"+data.phone_number;
    }

    var dobTmp = new Date(data.date_of_birth)
      var d = dobTmp.getDate();
      var m = dobTmp.getMonth() + 1; //Month from 0 to 11
      var y = dobTmp.getFullYear();
    var dob =  '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
  
  
    var formData: any = new FormData();
    formData.append("name", data.name);
    formData.append("phone_number", phnum.replace(" ",""));
    formData.append("gender", data.gender);
    formData.append("date_of_birth", dob);
    formData.append("address", data.address);
    formData.append("state", data.state);
    formData.append("post_code", data.post_code);
    formData.append("agree_term_conditions", data.agree_term_conditions);
    formData.append("X-API-KEY", this.xkey);
    formData.append("submit","");
    //alert(this.baseUrl + api);
    //alert(JSON.stringify(data));

    return  this.httpClient .post(this.baseUrl + api, formData).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
        return (response);
    }));
  }

  public socialSignup(data) : Observable<any> {
    let api: string = "home/user_registration_social/format/json";
  
    var formData: any = new FormData();
    formData.append("name", data.name);
    formData.append("phone_number", "");
    formData.append("gender", "");
    formData.append("date_of_birth", "");
    formData.append("address", "");
    formData.append("state", "");
    formData.append("post_code", "");
    formData.append("agree_term_conditions", 1);
    formData.append("user_token", data.socialId); //2 for google and 3 facebook
    formData.append("user_type", data.userType); //2 for google and 3 facebook
    formData.append("X-API-KEY", this.xkey);
    formData.append("submit","");
    //alert(this.baseUrl + api);
    //alert(JSON.stringify(data));

    return  this.httpClient .post(this.baseUrl + api, formData).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
        return (response);
    }));
  }

  public registerPatient(data, parentId, patientId) : Observable<any> {

    debugger;
    let api: string = "home/user_registrationchild/format/json";
    if (patientId) {
      api = "home/updatepatient/format/json";
    }

    let phnum = "";
    if (data.phone_number == "8264641723" || data.phone_number == "9876299850" || data.phone_number == "9914470139" || data.phone_number == "8437375294") {
      phnum = "91"+data.phone_number;
    } else {
      phnum = "61"+data.phone_number;
    }

    var dobTmp = new Date(data.date_of_birth)
      var d = dobTmp.getDate();
      var m = dobTmp.getMonth() + 1; //Month from 0 to 11
      var y = dobTmp.getFullYear();
      var dob =  '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
  
  debugger;
    var formData: any = new FormData();
    formData.append("name", data.name);
    formData.append("phone_number", phnum.replace(/\s/g,""));
    formData.append("gender", data.gender);
    formData.append("date_of_birth", dob);
    formData.append("address", data.address);
    formData.append("state", data.state);
    formData.append("post_code", data.post_code);
    formData.append("parent_id",parentId);
    if (patientId) {
      formData.append("patient_id",patientId);
    }

    formData.append("agree_term_conditions", 1);
    formData.append("X-API-KEY", this.xkey);
    formData.append("submit","");
    //alert(this.baseUrl + api);
    //alert(JSON.stringify(data));

    return  this.httpClient .post(this.baseUrl + api, formData).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
        return (response);
    }));
  }

  public submitQuery(data) : Observable<any> {
    let api: string = "home/save_user_query/format/json";

    var formData: any = new FormData();
    formData.append("user_id", data.user_id);
    formData.append("user_query", data.query);
    formData.append("X-API-KEY", this.xkey);
    formData.append("submit","");
    //alert(this.baseUrl + api);
    //alert(JSON.stringify(data));

    return  this.httpClient .post(this.baseUrl + api, formData).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));

        return (response);
    }));
  }

  public allDentalServices() : Observable<DentalService[]> {
    let api: string = "home/get_services/format/json?X-API-KEY="+this.xkey+"&submit=";

    return  this.httpClient .get(this.baseUrl + api).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
      let dentalServices = response.data;
      console.log(response.data)
        return  dentalServices.map((dentalService: DentalService) => new DentalService(dentalService));
    }));
  }

  public allPromotions() : Observable<Promotion[]> {
    let api: string = "home/get_promotions/format/json?X-API-KEY="+this.xkey+"&submit=";

    return  this.httpClient .get(this.baseUrl + api).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
      let promotions = response.data;
      console.log(response.data)
        return  promotions.map((promotion: Promotion) => new Promotion(promotion));
    }));
  }


  public getQuotations() : Observable<Quotation> {

  
    let api: string = "home/get_quotation/format/json?X-API-KEY="+this.xkey+"&submit=";

    return  this.httpClient .get(this.baseUrl + api).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
      let promotions = response.data;
      console.log(response.data)
        return  promotions.map((promotion: Promotion) => new Promotion(promotion));
    }));

  }


  public getUserProfiles(patientId) : Observable<User> {

  
    let api: string = "home/get_userprofile/format/json?X-API-KEY="+this.xkey+"&patient_id="+patientId+"submit=";

    return  this.httpClient .get(this.baseUrl + api).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
      let profiles = response.data;
      return profiles;
    }));

  }

  public getContactUsList() : Observable<[Contactus]> {

    let api: string = "home/get_contact_us/format/json?X-API-KEY="+this.xkey+"&submit=";

    return  this.httpClient .get(this.baseUrl + api).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
      let contactUsList = response.data;
      console.log(response.data)
        return  contactUsList.map((contactus: Contactus) => new Contactus(contactus));
    }));

  }

  public saveDeviceToken(deviceToken:String, platformType : String, userid:Number) : any {

    let api: string = "home/adduserdevicetoken/format/json";
    var formData: any = new FormData();
    formData.append("user_id",userid);
    formData.append("device_id",platformType);
    formData.append("user_device_token",deviceToken);
    formData.append("X-API-KEY", this.xkey);
    formData.append("submit", "");

    return  this.httpClient.post(this.baseUrl + api, formData).pipe(map((response: any)  => {
        //alert(JSON.stringify(response));
        return response;
    }));
  }

  public getProvidersAndFunds() : Observable<any> {

    let api: string = "home/provider_funds_images/format/json?X-API-KEY="+this.xkey+"&submit=";

    return  this.httpClient .get(this.baseUrl + api).pipe(map((response: any)  => {
      //alert(JSON.stringify(response));
      console.log(response.data)
        return  response.data;
    }));
  }
}
