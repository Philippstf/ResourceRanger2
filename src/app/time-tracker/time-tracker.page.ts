import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-time-tracker',
  templateUrl: 'time-tracker.page.html',
  styleUrls: ['time-tracker.page.scss'],
})
export class TimeTrackerPage implements OnInit {

  workSessions: any[] = [];

  constructor(
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadWorkSessions();
  }

  loadWorkSessions() {
    const sessions = localStorage.getItem('timetracker');
    this.workSessions = sessions ? JSON.parse(sessions) : [];
  }

  async openContextMenu(event: MouseEvent, session: any, index: number) {
    event.preventDefault();
  
    const alert = await this.alertController.create({
      header: 'Aktion wählen',
      buttons: [
        {
          text: 'Editieren',
          handler: () => {
            this.editEntry(session, index);
          }
        },
        {
          text: 'Löschen',
          role: 'destructive',
          handler: () => {
            this.deleteEntry(index);
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }
  
  editEntry(session: any, index: number) {
    // Logik zum Bearbeiten: Lade die Daten in ein Formular zum Bearbeiten
  }
  
  deleteEntry(index: number) {
    // Entferne das Element aus dem Array und speichere es wieder im localStorage
    this.workSessions.splice(index, 1);
    localStorage.setItem('timetracker', JSON.stringify(this.workSessions));
  }
}



