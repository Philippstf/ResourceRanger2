import { Component, OnInit, HostListener } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

interface WorkSession extends DocumentData {
  docId?: string;
  date: any;
  startTime: any;
  endTime: any;
  userId: string;
  breakTime: number;
  workingTime: string;
}

@Component({
  selector: 'app-time-tracker',
  templateUrl: 'time-tracker.page.html',
  styleUrls: ['time-tracker.page.scss'],
})
export class TimeTrackerPage implements OnInit {
  workSessions: WorkSession[] = [];
  userId: string | null = null;

  constructor(
    private alertController: AlertController,
    private afs: AngularFirestore,
    private authService: AuthService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe(uid => {
      if (uid) {
        this.userId = uid;
        this.loadWorkSessions(uid);
      } else {
        console.error('User is not logged in');
      }
    });
  }

  loadWorkSessions(userId: string) {
    this.afs.collection<WorkSession>('work_sessions', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'docId' })
      .subscribe(sessions => {
        this.workSessions = sessions.map(session => ({
          ...session,
          date: session.date?.toDate().toLocaleDateString('de-DE'),
          startTime: session.startTime?.toDate().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
          endTime: session.endTime?.toDate().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        }));
      });
  }

  async openContextMenu(session: WorkSession) {
    const alert = await this.alertController.create({
      header: 'Eintrag löschen',
      message: 'Möchtest du diesen Eintrag wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            this.deleteEntry(session);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteEntry(session: WorkSession) {
    if (session.docId) {
      this.afs.collection('work_sessions').doc(session.docId).delete().then(() => {
        console.log('Document successfully deleted!');
        this.workSessions = this.workSessions.filter(item => item.docId !== session.docId);
      }).catch(error => {
        console.error('Error removing document: ', error);
      });
    }
  }

  downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "UserId,Datum,Startzeit,Endzeit,Arbeitszeit\n";

    this.workSessions.forEach(session => {
      const row = [
        session.userId,
        session.date,
        session.startTime,
        session.endTime,
        session.workingTime
      ].join(',');
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "arbeitssitzungen.csv");
    document.body.appendChild(link);
    link.click();
  }

  @HostListener('contextmenu', ['$event'])
  async onContextMenu(event: MouseEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const sessionId = target.getAttribute('data-session-id');
    const session = this.workSessions.find(session => session.docId === sessionId);
    if (session) {
      this.openContextMenu(session);
    }
  }

  openContextMenuOnClick(session: WorkSession) {
    if (!this.platform.is('desktop')) {
      this.openContextMenu(session);
    }
  }
}
