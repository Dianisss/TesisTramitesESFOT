import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthGuard } from './guards/oauth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { RegisterComponent } from './register/register.component';
import { CategoriesComponent } from './categories/categories.component';
import { TramitesComponent } from './tramites/tramites.component';
import { CategusersComponent } from './categusers/categusers.component';
import { SugestionsadminComponent } from './sugestionsadmin/sugestionsadmin.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { NotificationsComponent } from './notifications/notifications.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'categories', component: CategoriesComponent},
  { path: 'home', component: HomeComponent},
  { path: 'profile', component: MyprofileComponent},
  { path: 'tramites', component: TramitesComponent},
  { path: 'categorias', component: CategusersComponent},
  { path: 'recomendacion-admin', component: SugestionsadminComponent},
  { path: 'sugerencias', component: SugerenciasComponent},
  { path: 'notifications', component: NotificationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
