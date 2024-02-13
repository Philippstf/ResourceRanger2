import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManualTimeEntryComponent } from '../manual-time-entry/manual-time-entry.component';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

interface ManualEntryData {
  date: string;
  start: string;
  end: string;
  pause: number;
}

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



  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
    
    ) {}

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
  
    const session = {
      Datum: currentDate,
      Startzeit: startTime,
      Endzeit: endTime,
      Arbeitszeit: workTime
    };
  
    // Vorhandene Arbeitssitzungen aus dem localStorage laden
    let workSessions = JSON.parse(localStorage.getItem('timetracker') || '[]');
    
    // Neue Arbeitssitzung hinzufügen
    workSessions.push(session);
  
    // Aktualisierte Arbeitssitzungen im localStorage speichern
    localStorage.setItem('timetracker', JSON.stringify(workSessions));
  }

  showTimes() {
    this.router.navigateByUrl('/time-tracker');
  }

  async presentManualTimeEntryModal() {
    const modal = await this.modalController.create({
      component: ManualTimeEntryComponent,
    });
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.addManualTimeEntry(data);
    }
  }
  
  addManualTimeEntry(entryData: ManualEntryData) {
    // Berechne Arbeitszeit abzüglich der Pause
    let workTime = this.calculateWorkTime(entryData.start, entryData.end, entryData.pause);
    let newSession = {
      Datum: entryData.date,
      Startzeit: entryData.start,
      Endzeit: entryData.end,
      Arbeitszeit: workTime,
      Pause: entryData.pause
    };
    // Hinzufügen zur Liste und Speichern im localStorage
    this.workSessions.push(newSession);
    localStorage.setItem('timetracker', JSON.stringify(this.workSessions));
  }

  calculateWorkTime(start: string, end: string, pause: number): string {
    // Annahme: start und end sind im Format HH:mm
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
  
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);
  
    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);
  
    // Berechne die Differenz in Minuten
    let difference = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    difference -= pause; // Ziehe die Pause ab
  
    // Konvertiere die Minuten zurück in Stunden und Minuten
    const hours = Math.floor(difference / 60);
    const minutes = Math.floor(difference % 60);
  
    return `${this.pad(hours)}:${this.pad(minutes)}`;
  }
  
  
}
