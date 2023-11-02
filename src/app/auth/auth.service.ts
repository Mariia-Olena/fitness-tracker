import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private IsAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.IsAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.IsAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {})
      .catch((error) => console.log(error));
  }

  login(authData: AuthData): void {
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {})
      .catch((error) => console.log(error));
  }

  logout(): void {
    this.auth.signOut();
  }

  isAuth(): boolean {
    return this.IsAuthenticated;
  }
}
