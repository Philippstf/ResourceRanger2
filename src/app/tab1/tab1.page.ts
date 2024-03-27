import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { FirebaseError } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  fullName: string = '';
  // Setzen Sie hier die URL Ihres Standardbildes
  profileImageUrl: string = 'https://firebasestorage.googleapis.com/v0/b/resourceranger-d5d23.appspot.com/o/Images%2FDummypicture.jpg?alt=media'; 
  uploadPercent: Observable<number | undefined> = new Observable();

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController,
    private alertController: AlertController,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        this.firestore.collection('users').doc(userId).valueChanges().subscribe((userData: any) => {
          this.fullName = userData?.fullName || '';
          // Verwenden Sie die URL des Standardbildes, falls kein benutzerdefiniertes Bild vorhanden ist
          this.profileImageUrl = userData?.profileImageUrl || this.profileImageUrl;
        });
      }
    });
  }

  async editProfilePicture() {
    const blob = await this.openImagePicker();
    if (blob) {
      this.authService.getCurrentUserId().subscribe(userId => {
        if (userId) {
          const filePath = `profileImages/${userId}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, blob);

          this.uploadPercent = uploadTask.percentageChanges();
          uploadTask.snapshotChanges().pipe(
            finalize(async () => {
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              this.firestore.collection('users').doc(userId).update({ profileImageUrl: downloadURL });
              this.profileImageUrl = downloadURL;
            })
          ).subscribe();
        }
      });
    }
  }

  async openImagePicker() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error beim Öffnen des Image Pickers:', error);
      return null;
    }
  }

  editProfile() {
    this.navCtrl.navigateForward('/edit-profile');
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Account sicher löschen?',
      message: 'Möchtest du deinen Account wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Löschen',
          handler: () => {
            this.authService.deleteAccount().then(() => {
              this.navCtrl.navigateForward('/login');
            }).catch((error: FirebaseError) => {
              console.error('Deletion failed', error.code, error.message);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  logOut() {
    this.authService.logout().then(() => {
      this.navCtrl.navigateForward('/login');
    }).catch((error: FirebaseError) => {
      console.error('Logout failed', error.code, error.message);
    });
  }
}
