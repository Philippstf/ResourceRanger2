import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManualTimeEntryComponent } from '../manual-time-entry/manual-time-entry.component';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';



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
  userId: string | null = null;


  constructor(
     private afs: AngularFirestore,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService
    
    ) {}

    ngOnInit() {
      this.authService.getCurrentUserId().subscribe(uid => {
        this.userId = uid;
      });
    }

    async toggleCheckIn() {
      if (this.isCheckingIn) {
        // Auschecken
        const breakTime = await this.promptForBreakTime();
        this.endTime = new Date();
        clearInterval(this.interval);
        this.saveTime(breakTime); // breakTime als Argument übergeben
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

    async promptForBreakTime(): Promise<number> {
      return new Promise(async resolve => {
        const alert = await this.alertController.create({
          header: 'Pausenzeit',
          inputs: [
            {
              name: 'breakTime',
              type: 'number',
              placeholder: 'Pausenzeit in Minuten'
            }
          ],
          buttons: [
            {
              text: 'Bestätigen',
              handler: (data) => resolve(data.breakTime)
            }
          ]
        });
    
        await alert.present();
      });
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

  saveTime(breakTime: number) {
    if (!this.userId) {
      console.error('No UID found for current user');
      return;
    }
    
    if (!this.startTime || !this.endTime) {
      console.error('Start or end time is null');
      return;
    }
  
    const session = {
      userId: this.userId,
      date: firebase.firestore.Timestamp.fromDate(this.startTime!),
      startTime: firebase.firestore.Timestamp.fromDate(this.startTime!),
      endTime: firebase.firestore.Timestamp.fromDate(this.endTime!),
      breakTime: breakTime,
      workingTime: this.timerDisplay
    };
  
    this.afs.collection('work_sessions').add(session).then(docRef => {
      console.log('Session saved in Firestore with ID: ', docRef.id);
    }).catch(error => {
      console.error('Error saving session: ', error);
    });
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
  
   convertGermanDateToISO(germanDate : string) : string {
    const parts = germanDate.split('.');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  addManualTimeEntry(entryData: ManualEntryData) {
    // Überprüfe, ob die userId gesetzt ist
    if (!this.userId) {
      console.error('No UID found for current user');
      return;
    }
    
    const isoDate = this.convertGermanDateToISO(entryData.date);

    let workTime = this.calculateWorkTime(entryData.start, entryData.end, entryData.pause);
    let startDate = new Date(isoDate + 'T' + entryData.start + ':00');
    let endDate = new Date(isoDate + 'T' + entryData.end + ':00');
    
    // Überprüfe, ob die Datum-Objekte gültig sind
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('One of the date objects is invalid.');
      return;
    }
    
    // Erstelle ein neues Session-Objekt für Firestore
    let newSession = {
      userId: this.userId,
      date: firebase.firestore.Timestamp.fromDate(startDate),
      startTime: firebase.firestore.Timestamp.fromDate(startDate),
      endTime: firebase.firestore.Timestamp.fromDate(endDate),
      breakTime: entryData.pause,
      workingTime: workTime
    };
    
    // Speichere die neue Session in Firestore
    this.afs.collection('work_sessions').add(newSession).then(docRef => {
      console.log('Manual session saved in Firestore with ID: ', docRef.id);
    }).catch(error => {
      console.error('Error saving manual session: ', error);
    });
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
