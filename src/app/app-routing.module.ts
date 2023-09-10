import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './loginpage/loginpage.component';
import { AdminpageComponent } from './adminpage/adminpage.component';

const routes: Routes = [
  { path: '', redirectTo: 'loginpage', pathMatch: 'full' },
  { path: 'loginpage', component: LoginComponent },
  { path: 'adminpage', component: AdminpageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
