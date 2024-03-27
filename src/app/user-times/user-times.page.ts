import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface WorkSession {
  date: any;
  startTime: any;
  endTime: any;
  breakTime: number;
  workingTime: string;
  docId: string;
}

@Component({
  selector: 'app-user-times',
  templateUrl: './user-times.page.html',
  styleUrls: ['./user-times.page.scss'],
})
export class UserTimesPage implements OnInit {
  userId: string | null = null;
  workSessions$: Observable<WorkSession[]> | undefined;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.loadWorkSessions(this.userId);
    } else {
      console.error('User ID not found');
    }
  }

  loadWorkSessions(userId: string) {
    this.workSessions$ = this.firestore
      .collection<WorkSession>('work_sessions', ref =>
        ref.where('userId', '==', userId)
      )
      .valueChanges()
      .pipe(
        map(sessions => {
          return sessions.map(session => ({
            ...session,
            date: this.formatDate(session.date),
            startTime: this.formatTime(session.startTime),
            endTime: this.formatTime(session.endTime)
          }));
        })
      );
  }

  formatDate(timestamp: any): string {
    const date = timestamp.toDate();
    return date.toLocaleDateString('de-DE');
  }

  formatTime(timestamp: any): string {
    const time = timestamp.toDate();
    return time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  downloadCSV() {
    if (this.workSessions$) {
      this.workSessions$.subscribe(sessions => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Datum,Startzeit,Endzeit,Pause,Arbeitszeit\n";

        sessions.forEach(session => {
          const row = [
            session.date,
            session.startTime,
            session.endTime,
            session.breakTime || '0',
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
      });
    } else {
      console.error('No work sessions available');
    }
  }

  openContextMenu(session: WorkSession) {
    console.log('Context menu opened for session:', session);
  }

  openContextMenuOnClick(session: WorkSession) {
    console.log('Context menu opened on click for session:', session);
  }
}
