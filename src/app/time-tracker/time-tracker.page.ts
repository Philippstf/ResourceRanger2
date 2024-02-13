import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-tracker',
  templateUrl: 'time-tracker.page.html',
  styleUrls: ['time-tracker.page.scss'],
})
export class TimeTrackerPage implements OnInit {

  workSessions: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadWorkSessions();
  }

  loadWorkSessions() {
    const sessions = localStorage.getItem('timetracker');
    this.workSessions = sessions ? JSON.parse(sessions) : [];
  }
}

