import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-turner',
  templateUrl: './game-turner.page.html',
  styleUrls: ['./game-turner.page.scss'],
})

export class GameTurnerPage implements OnInit {
  public songList: Array<{ name: string; number: number; file: string; }> = [
    { name: "Hi-Hat;", number: 1, file: 'hihat.mp3' },
    { name: "Dark Mystic;", number: 2, file: 'scifi-darkMystic.mp3' },
    { name: "Desert Action;", number: 3, file: 'scifi-desertAction.mp3' },
    { name: "Mystic;", number: 4, file: 'scifi-mystic.mp3' },
    { name: "Stealth;", number: 5, file: 'scifi-stealth.mp3' },
    { name: "Tingles;", number: 6, file: 'scifi-tingles.mp3' },
    { name: "Underwater;", number: 7, file: 'scifi-underwater.mp3' },
    { name: "Upbeat;", number: 8, file: 'scifi-upbeat.mp3' },
    { name: "Uplifting;", number: 9, file: 'scifi-uplifting.mp3' }
  ];

  public playingBool: boolean = false;
  private volume: number = 1;
  public visibleVolume: number = Math.trunc(this.volume * 100);
  private directoryPath: string = "assets/songs/";
  private audioPlayer = new Audio();
  public songTimer: string = "0:00";
  public playerList: Array<{ name: string; songNr: number; selected: boolean; color: string; }> = [
    // { name: "a", songNr: 1, selected: true, color: "#ffff00" },
    // { name: "aa", songNr: 2, selected: false, color: "#ffffff" },
    // { name: "aaa", songNr: 3, selected: false, color: "#ff00ff" },
    // { name: "aaaa", songNr: 4, selected: false, color: "#00ffff" },
    // { name: "aaaaa", songNr: 5, selected: false, color: "#00ff00" },
    // { name: "aaaaaa", songNr: 6, selected: false, color: "#0000ff" },
    // { name: "aaaaaaa", songNr: 7, selected: false, color: "#000000" }
  ];
  public newPlayerName: string = "";
  public newPlayerNr: number = 0;
  public newPlayerColor: string = "#ffffff";
  public currentSongTitle: string = "null";
  private firstTime: boolean = true;

  constructor(private http: HttpClient) {
    this.audioPlayer.loop = true;
    setInterval(() => {
      this.updateTimer();
    }, 500);
    this.updatePageBasedOnThePlayer();
  }

  ngOnInit() {
  }

  addPlayer(name: string, songNr: number, color: string) {
    if (
      name != "" &&
      songNr != 0 &&
      !this.playerList.find(player => player.name == name) &&
      !this.playerList.find(player => player.songNr == songNr) &&
      color.includes("#") &&
      color.length == 7
    ) {
      this.playerList.push({ name: name, songNr: songNr, selected: false, color: color })
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
    console.debug("nextPlayer");
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
    console.debug("prevPlayer");
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
    console.debug("updatePageBasedOnThePlayer");
    if (this.playerList.length >= 1) {
      const usersSong = this.songList.find(song => song.number === this.playerList[0].songNr);
      if (usersSong) {
        console.debug(`Playing song: ${usersSong.file}`);
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
