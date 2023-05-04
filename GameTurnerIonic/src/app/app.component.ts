import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
// import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private firebaseConfig = {
    apiKey: "AIzaSyCclYA4mfWJ9OcQwr_6EVqPXLCu9oiyXpk",
    authDomain: "gameturner-100.firebaseapp.com",
    projectId: "gameturner-100",
    storageBucket: "gameturner-100.appspot.com",
    messagingSenderId: "1066140054276",
    appId: "1:1066140054276:web:85d9523c88b91ef9225651"
  };

  constructor() {
    initializeApp(this.firebaseConfig);
    // this.start();
  }
  
  // async start() {
  //   await this.storage.create();
  // }
}
