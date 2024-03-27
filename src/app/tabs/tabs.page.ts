import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Überprüfe die Benutzerrolle, um festzustellen, ob der Benutzer ein Admin ist
    this.authService.getCurrentUserId().subscribe(uid => {
      if (uid) {
        this.authService.getRole(uid).subscribe(role => {
          this.isAdmin = role === 'admin';
        });
      }
    });
  }

}
