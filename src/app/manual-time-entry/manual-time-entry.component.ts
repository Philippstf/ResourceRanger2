import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-manual-time-entry',
  templateUrl: './manual-time-entry.component.html',
  styleUrls: ['./manual-time-entry.component.scss'],
})
export class ManualTimeEntryComponent {
  @Input() entryData = { date: '', start: '', end: '', pause: '' };

  constructor(
    private modalController: ModalController,
    private alertController: AlertController) { }

    async confirmEntry() {
      const currentDate = new Date();
      const selectedDate = new Date(this.entryData.date.split('.').reverse().join('-'));
    
      if (selectedDate > currentDate) {
        // Zeige eine Fehlermeldung an, weil das Datum in der Zukunft liegt
        const alert = await this.alertController.create({
          header: 'Fehler',
          message: 'Das Datum befindet sich in der Zukunft!',
          buttons: ['OK']
        });
        await alert.present();
      } else { // Berechne die Arbeitszeit in Minuten
        const startTime = moment(this.entryData.start, 'HH:mm');
        const endTime = moment(this.entryData.end, 'HH:mm');
        const duration = moment.duration(endTime.diff(startTime));
        const workTimeInMinutes = duration.asMinutes() - Number(this.entryData.pause);
      
        // Überprüfe die gesetzlichen Arbeitszeiten
        const legalWorkTime = this.validateLegalWorkTime(workTimeInMinutes);
        const legalBreakTime = this.validateLegalBreakTime(workTimeInMinutes, Number(this.entryData.pause));
      
        if (!legalBreakTime) {
          // Zeige eine Warnung für die Pausenzeit an
          const breakTimeAlert = await this.alertController.create({
            header: 'Fehler',
            message: 'Die gesetzliche Pausenzeit wurde unterschritten',
            buttons: ['OK']
          });

          await breakTimeAlert.present();
        
        } else if (!legalWorkTime) {
          // Zeige eine Warnung für die Arbeitszeit an
          const workTimeAlert = await this.alertController.create({
            header: 'Fehler',
            message: 'Die gesetzliche Arbeitszeit von 10 Stunden wurde überschritten',
            buttons: ['OK']
          });
          await workTimeAlert.present();
        } else {
          // Alles ist in Ordnung, schließe das Modal und gib die Daten zurück
          this.modalController.dismiss(this.entryData);
        }
      }}
    

    validateLegalBreakTime(workTimeInMinutes: number, breakTimeInMinutes: number): boolean {
      if (workTimeInMinutes > (9 * 60) && breakTimeInMinutes < 45) {
        return false; // Weniger als 45 Minuten Pause für mehr als 9 Stunden Arbeit
      } else if (workTimeInMinutes > (6 * 60) && breakTimeInMinutes < 30) {
        return false; // Weniger als 30 Minuten Pause für 6-9 Stunden Arbeit
      }
      return true; // Die Pausenzeit erfüllt die gesetzlichen Anforderungen
    }

    validateLegalWorkTime(workTimeInMinutes: number): boolean {
  if (workTimeInMinutes > 600) { // Mehr als 10 Stunden reine Arbeitszeit
    return false; // Die Arbeitszeit ist illegal
  }
  return true; // Die Arbeitszeit ist legal
}

    
  }
