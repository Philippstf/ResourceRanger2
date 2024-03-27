import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';


// Define routes for navigation
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'createaccount',
    loadChildren: () => import('./createaccount/createaccount.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'time-tracker',
    loadChildren: () => import('./time-tracker/time-tracker.module').then( m => m.TimeTrackerPageModule)
  },
  {
    path: 'user-times/:userId',
    loadChildren: () => import('./user-times/user-times.module').then( m => m.UserTimesPageModule)
  },




];

// Configure router module with routes and preloading strategy
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

