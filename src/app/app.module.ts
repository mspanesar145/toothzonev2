import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {RestService} from './api/rest.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { Facebook } from '@ionic-native/facebook/ngx';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Push } from '@ionic-native/push/ngx';
import { StorageService } from './api/storage.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    EmailComposer,
    CallNumber,
    Push,
    SmsRetriever,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RestService,
  ReactiveFormsModule,
HttpClientModule,
InAppBrowser,
SignInWithApple],
    
  bootstrap: [AppComponent],
})
export class AppModule {}
