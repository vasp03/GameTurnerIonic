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
  public currentSongTitle: string = "null";
  public importedPlayerList: string = "";
  public tabMenu: string = "songList";

  constructor(
    private http: HttpClient,
  ) {
    this.audioPlayer.loop = true;
    setInterval(() => {
      this.updateTimer();
    }, 500);
    this.updatePageBasedOnThePlayer();
  }

  ngOnInit() {
  }

  changeTabMenu(newTab:string){
    this.tabMenu = newTab;
  }

  downloadPlayerList() {
    const arrayAsString = JSON.stringify(this.playerList);
    copy(arrayAsString);
  }

  readPlayerList(newPlayers:string) {
    // console.debug(newPlayers);
    this.playerList = JSON.parse(newPlayers);
  }

  tradeMoney(player1Name:string, player2Name:string, tradeAmount:number){
    var player1 = this.playerList.find(player => player.name == player1Name);
    var player2 = this.playerList.find(player => player.name == player2Name);

    if (player1 && player2) {
      player1.money-=tradeAmount;
      player2.money+=tradeAmount;
    }
  }

  removeMoney(playerName:string, tradeAmount:number){
    var player = this.playerList.find(player => player.name == playerName);

    if (player) {
      player.money-=tradeAmount;
    }
  }

  addMoney(playerName:string, tradeAmount:number){
    var player = this.playerList.find(player => player.name == playerName);

    if (player) {
      player.money+=tradeAmount;
    }
  }

  addPlayer(name: string, songNr: number, color: string, money:number) {
    if (
      name != "" &&
      songNr != 0 &&
      !this.playerList.find(player => player.name == name) &&
      !this.playerList.find(player => player.songNr == songNr) &&
      color.includes("#") &&
      color.length == 7
    ) {
      this.playerList.push({ name: name, songNr: songNr, selected: false, color: color, money: money})
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
    // console.debug("nextPlayer");
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
    // console.debug("prevPlayer");
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
    // console.debug("updatePageBasedOnThePlayer");
    if (this.playerList.length >= 1) {
      const usersSong = this.songList.find(song => song.number === this.playerList[0].songNr);
      if (usersSong) {
        // console.debug(`Playing song: ${usersSong.file}`);
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
