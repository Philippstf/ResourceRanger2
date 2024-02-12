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
  startTime: Date | null = null; // Deklariere startTime
  endTime: Date | null = null; // Deklariere endTime
  workSessions: any[] = [];

  constructor() {}

  ngOnInit() {}

  toggleCheckIn() {
  if (this.isCheckingIn) {
    // Auschecken
    this.endTime = new Date();
    clearInterval(this.interval);
    this.saveTime();
    this.timer = 0;
    this.updateTimerDisplay();
  } else {
    // Einchecken
    this.startTime = new Date();
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

  saveTime() {
    const currentDate = new Date().toLocaleDateString('de-DE');
    const startTime = this.startTime?.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const endTime = this.endTime?.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const workTime = this.timerDisplay;
  
    // Neue Arbeitssitzung hinzufügen
    this.workSessions.push({
      Datum: currentDate,
      Startzeit: startTime,
      Endzeit: endTime,
      Arbeitszeit: workTime
    });
  
    // Arbeitssitzungen als JSON speichern
    this.exportToJsonFile(this.workSessions);
  }
  
  exportToJsonFile(jsonData: any) {
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    // Erstelle einen Link zum Herunterladen der JSON-Datei
    const link = document.createElement('a');
    link.href = url;
    link.download = 'timetracker.json';
    link.click();
  
    // URL freigeben
    URL.revokeObjectURL(url);
  }
}
