import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-tab4-admin-timemanagement',
  templateUrl: './tab4-admin-timemanagement.page.html',
  styleUrls: ['./tab4-admin-timemanagement.page.scss'],
})
export class Tab4AdminTimemanagementPage implements OnInit {
  users$!: Observable<any[]>; 
  userId: string | null = null; // Typ des Felds userId deklarieren

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService // AuthService injizieren
  ) {}

  ngOnInit() {
    this.users$ = this.firestore.collection('users').valueChanges();
    this.users$.subscribe(users => {
      console.log('Loaded users:', users);
    });
  }

  navigateToUserTimes(userId: string | null) {
    if (userId) {
      this.router.navigate(['/user-times', userId]);
    } else {
      console.error('User ID is null or undefined');
    }
  }
}
