import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthError } from 'firebase/auth';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.page.html',
  styleUrls: ['./createaccount.page.scss'],
})
export class CreateAccountPage {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private firestore: AngularFirestore
  ) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  signUp() {
    if (this.isValidEmail(this.email)) {
      this.authService.signUp(this.email, this.password)
        .then((res) => {
          if (res.user && res.user.uid) {
            console.log('Erfolgreich registriert!', res);
            const userData: UserData = {
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email
            };
            this.saveUserData(res.user.uid, userData);
            this.navCtrl.navigateForward('/login');
          } else {
            console.error('Benutzerdaten nicht verfügbar:', res);
          }
        })
        .catch((error: AuthError) => {
          console.error('Fehler bei der Registrierung:', error);
        });
    } else {
      console.error('Ungültige E-Mail-Adresse');
    }
  }

  saveUserData(userId: string, userData: UserData) {
    this.firestore.collection('users').doc(userId).set({
      role: 'user',
      uid: userId,
      profileImageUrl: '', // Standard-Profilbild
      ...userData
    })
    .then(() => console.log('Benutzerdaten erfolgreich in Firestore gespeichert'))
    .catch(error => console.error('Fehler beim Speichern der Benutzerdaten:', error));
  }

  navigateToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
