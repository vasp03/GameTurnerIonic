import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as copy from 'copy-to-clipboard';

@Component({
  selector: 'app-game-turner',
  templateUrl: './game-turner.page.html',
  styleUrls: ['./game-turner.page.scss']
})

export class GameTurnerPage implements OnInit {
  public songList: Array<{ name: string; number: number; file: string; }> = [
    { name: "CAS 2", number: 1, file: 'CAS 2.mp3' },
    { name: "Chill Ambient", number: 2, file: 'Chill Ambient.mp3' },
    { name: "Cinematic Cello", number: 3, file: 'Cinematic Cello.mp3' },
    { name: "Cosmic Glow", number: 4, file: 'Cosmic Glow.mp3' },
    { name: "Dark matter", number: 5, file: 'Dark matter.mp3' },
    { name: "Drone Main", number: 6, file: 'Drone Main.mp3' },
    { name: "Drone Space", number: 7, file: 'Drone Space.mp3' },
    { name: "Ethereal Dream", number: 8, file: 'Ethereal Dream.mp3' },
    { name: "Lofi", number: 9, file: 'Lofi.mp3' },
    { name: "Soft Daydream", number: 10, file: 'Soft Daydream.mp3' },
    { name: "Space Chillout", number: 11, file: 'Space Chillout.mp3' },
    { name: "Space Drone", number: 12, file: 'Space Drone.mp3' },
    { name: "The Universe", number: 13, file: 'The Universe.mp3' },
  ];

  public playingBool: boolean = false;
  private volume: number = 1;
  public visibleVolume: number = Math.trunc(this.volume * 100);
  private directoryPath: string = "assets/songs/";
  private audioPlayer = new Audio();
  public songTimer: string = "0:00";
  public playerList: Array<{ name: string; songNr: number; selected: boolean; color: string; money: number }> = [];
  public newPlayerName: string = "";
  public newPlayerNr: number = 0;
  public newPlayerColor: string = "#ffffff";
  public currentSongTitle: string = "No Song Selected";
  public importedPlayerList: string = "";
  public tabMenu: string = "songList";
  public player1Selector: string = "";
  public player2Selector: string = "";
  public moneyTransfer: number = 0;
  public playerSelector: string = "";
  public moneyAddRemover: number = 0;
  public numberInputStep: string = "1";
  public startCash: number = 0;
  private screenSaverTimer: number = 0;
  public screenSaverTimeDelay: number = 20; //Half Seconds, 20 = 10 secs. 
  public screenSaverTime: boolean = false;

  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    this.audioPlayer.loop = true;

    try {
      this.retrievFromCookie();
    } catch (error) {
      // console.log(error);
    }

    try {
      this.getVolumeFromCookie();
    } catch (error) {
      // console.log(error);
    }

    try {
      this.getVolumeFromCookie();
    } catch (error) {
      // console.log(error);
    }

    let prevX = 0;
    let prevY = 0;
    let currX = 0;
    let currY = 0;

    setInterval(() => {
      this.updateTimer();
      this.saveToCookie();
      this.saveVolumeToCookie();

      if (currX !== prevX || currY !== prevY) {
        this.screenSaverTimer = 0;
        prevX = currX;
        prevY = currY;
      }

      if(this.screenSaverTimer >= this.screenSaverTimeDelay && this.tabMenu!="Settings"){
        this.screenSaverTime = true;
      }else{
        this.screenSaverTime = false;
        this.screenSaverTimer++;
      }
    }, 500);

    window.addEventListener('mousemove', function(e) {
      currX = e.clientX;
      currY = e.clientY;
    });
  }

  resetCookies(){
    var arrayString = JSON.stringify([1, "1", "songList", 0]);
    document.cookie = "gamerTurnerCookieVolume=" + arrayString + "; SameSite=Strict";
    var arrayString = JSON.stringify([]);
    document.cookie = "gamerTurnerCookie=" + arrayString + "; SameSite=Strict";
    window.location.reload();
  }

  async saveToCookie() {
    var arrayString = JSON.stringify(this.playerList);
    document.cookie = "gamerTurnerCookie=" + arrayString + "; SameSite=Strict";
  }

  async retrievFromCookie() {
    var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)gamerTurnerCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    this.playerList = JSON.parse(cookieValue);
  }

  async saveVolumeToCookie() {
    var arrayString = JSON.stringify([this.volume, this.numberInputStep, this.tabMenu, this.startCash, this.screenSaverTimeDelay]);
    document.cookie = "gamerTurnerCookieVolume=" + arrayString + "; SameSite=Strict";
  }

  async getVolumeFromCookie() {
    var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)gamerTurnerCookieVolume\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var parsed = JSON.parse(cookieValue);
    this.volume = parsed[0];
    this.numberInputStep = parsed[1];
    this.tabMenu = parsed[2];
    this.startCash = parsed[3];
    this.screenSaverTimeDelay = parsed[4];
    this.updateVolume();
  }

  changeTabMenu(newTab: string) {
    this.tabMenu = newTab;
  }

  downloadPlayerList() {
    const arrayAsString = JSON.stringify(this.playerList);
    copy(arrayAsString);
  }

  readPlayerList(newPlayers: string) {
    this.playerList = JSON.parse(newPlayers);
  }

  tradeMoney() {
    var player1 = this.playerList.find(player => player.name == this.player1Selector);
    var player2 = this.playerList.find(player => player.name == this.player2Selector);

    if (player1 && player2 && player1.money >= this.moneyTransfer && this.moneyTransfer >= 1) {
      player1.money -= Math.trunc(this.moneyTransfer);
      player2.money += Math.trunc(this.moneyTransfer);
    }
  }

  removeMoney() {
    var player = this.playerList.find(player => player.name == this.playerSelector);

    if (player && player.money >= this.moneyAddRemover && this.moneyAddRemover >= 1) {
      player.money -= Math.trunc(this.moneyAddRemover);
    }
  }

  addMoney() {
    var player = this.playerList.find(player => player.name == this.playerSelector);

    if (player && this.moneyAddRemover >= 1) {
      player.money += Math.trunc(this.moneyAddRemover);
    }
  }

  addPlayer(name: string, songNr: number, color: string, money: number) {
    if (
      name != "" &&
      songNr != 0 &&
      !this.playerList.find(player => player.name == name) &&
      !this.playerList.find(player => player.songNr == songNr) &&
      color.includes("#") &&
      color.length == 7
    ) {
      this.playerList.push({ name: name, songNr: songNr, selected: false, color: color, money: money })
    }
    this.updatePageBasedOnThePlayer(false);
  }

  removePlayer(name: string) {
    var remPlayer = this.playerList.find(player => player.name == name);
    if (remPlayer) {
      let index = this.playerList.indexOf(remPlayer);
      this.playerList.splice(index, 1);
    }
  }

  nextPlayer() {
    if (this.playerList.length > 1) {
      const lastNr = this.playerList.length - 1;
      const firstElement = this.playerList[0];
      this.playerList.shift(); // remove the first element from the array
      this.playerList.push(firstElement); // add the first element to the end of the array
      this.playerList[0].selected = true;
      this.playerList[lastNr].selected = false;
      this.updatePageBasedOnThePlayer();
    }
  }

  prevPlayer() {
    if (this.playerList.length > 1) {
      const lastNr = this.playerList.length - 1;
      const lastElement = this.playerList[lastNr];
      this.playerList.pop(); // remove the last element from the array
      this.playerList.unshift(lastElement); // add the last element to the beginning of the array
      this.playerList[0].selected = true;
      this.playerList[1].selected = false;
      this.updatePageBasedOnThePlayer();
    }
  }

  updatePageBasedOnThePlayer(autoPlay: boolean = true) {
    if (this.playerList.length >= 1) {
      const usersSong = this.songList.find(song => song.number === this.playerList[0].songNr);
      if (usersSong) {
        if (autoPlay) this.playSong(usersSong);
      } else {
        console.log("No matching song found");
      }
      document.documentElement.style.setProperty('--highLightColor', this.playerList[0].color);
      this.playerList[0].selected = true;
    }
  }

  lowerVolume() {
    if (this.volume >= 0.1) {
      this.volume -= 0.1;
    }
    this.visibleVolume = Math.round(this.volume * 100);
    this.audioPlayer.volume = this.volume;
  }

  raiseVolume() {
    if (this.volume <= 0.9) {
      this.volume += 0.1;
    }
    this.visibleVolume = Math.round(this.volume * 100);
    this.audioPlayer.volume = this.volume;
  }

  updateVolume() {
    this.visibleVolume = Math.round(this.volume * 100);
    this.audioPlayer.volume = this.volume;
  }

  playPauseSong() {
    if (this.audioPlayer.readyState) {
      if (!this.audioPlayer.paused) {
        this.audioPlayer.pause();
        this.playingBool = false;
      } else {
        this.audioPlayer.play();
        this.playingBool = true;
      }
    }
  }

  playSong(song: { file: any; }) {
    this.http.get(this.directoryPath + song.file, { responseType: 'blob' }).subscribe((blob: Blob) => {
      this.audioPlayer.src = URL.createObjectURL(blob);
      this.audioPlayer.play();
      this.playingBool = true;
      this.currentSongTitle = song.file.split(".")[0];
    });
  }

  updateTimer() {
    if (this.audioPlayer.readyState) {
      var minutes: any = Math.floor(this.audioPlayer.currentTime / 60);
      var seconds: any = Math.floor(this.audioPlayer.currentTime % 60);
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      this.songTimer = minutes + ":" + seconds;
    } else {
      this.songTimer = "0:00";
    }

  }
}
