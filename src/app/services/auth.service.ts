import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private userRole = new BehaviorSubject<string>('');

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  

  getCurrentUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(map(user => user ? user.uid : null));
  }

  getRole(uid: string): Observable<string> {
    return this.afs.collection('users').doc(uid).valueChanges().pipe(
      map((user: any) => user.role as string) // Cast user.role to string
    );
  }

  forgotPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  sendPasswordResetEmail(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  isLoggedIn() {
    return this.afAuth.authState;
  }

  logout() {
    return this.afAuth.signOut();
  }

  async deleteAccount() {
    const user = await this.afAuth.currentUser;
    if (user) {
      return user.delete();
    } else {
      throw new Error('No user is currently signed in.');
    }
  }

  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

}
