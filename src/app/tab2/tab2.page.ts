import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  isCheckingIn: boolean = false;
  timer: number = 0; // Timer als Anzahl der Sekunden
  timerDisplay: string = '00:00:00'; // Timer als formatierter String
  interval: any;

  constructor() {}

  ngOnInit() {}

  toggleCheckIn() {
    if (this.isCheckingIn) {
      // Auschecken
      clearInterval(this.interval);
      this.timer = 0; // Timer zurücksetzen
      this.updateTimerDisplay();
    } else {
      // Einchecken
      this.interval = setInterval(() => {
        this.timer++;
        this.updateTimerDisplay();
      }, 1000);
    }
    this.isCheckingIn = !this.isCheckingIn;
  }

  updateTimerDisplay() {
    const hours = Math.floor(this.timer / 3600);
    const minutes = Math.floor((this.timer % 3600) / 60);
    const seconds = Math.floor(this.timer % 60);

    this.timerDisplay = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number) {
    return value.toString().padStart(2, '0');
  }
}
