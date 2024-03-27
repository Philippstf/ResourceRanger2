import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthError } from 'firebase/auth';

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.page.html',
  styleUrls: ['./createaccount.page.scss'],
})
export class CreateAccountPage {
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
          if (res.user && res.user.uid) { // Überprüfen, ob res.user und res.user.uid vorhanden sind
            console.log('Erfolgreich registriert!', res);
            this.saveUserData(res.user.uid, this.email); // Übergebe UID und E-Mail an saveUserData
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
  

  saveUserData(userId: string, email: string) {
    // Setze standardmäßig die Benutzerrolle auf "user"
    this.firestore.collection('users').doc(userId).set({
      role: 'user', // Setze die Benutzerrolle auf "user"
      email: email, // Füge die E-Mail-Adresse hinzu
      uid: userId // UID speichern
    })
    .then(() => console.log('Benutzerdaten erfolgreich in Firestore gespeichert'))
    .catch(error => console.error('Fehler beim Speichern der Benutzerdaten:', error));
  }

  navigateToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
