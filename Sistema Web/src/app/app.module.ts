import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

///////Imports Angular Material
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MdePopoverModule } from '@material-extended/mde';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle/';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HomeComponent } from './home/home.component';
import { MyprofileComponent } from './myprofile/myprofile.component';

import { MatTreeModule } from '@angular/material/tree';
import { RegisterComponent } from './register/register.component';
import { CategoriesComponent, NewCategoryDialog, ConfirmDialog, NewSubCategoryDialog } from './categories/categories.component';
import { NewTramiteDialog, TramitesComponent, NewBlockDialog, ViewTramite } from './tramites/tramites.component';
import { CategusersComponent } from './categusers/categusers.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SugestionsadminComponent, ConfirmData } from './sugestionsadmin/sugestionsadmin.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AuthServiceService } from './Services/auth-service.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MyprofileComponent,
    RegisterComponent,
    CategoriesComponent,
    NewCategoryDialog,
    NewSubCategoryDialog,
    NewBlockDialog,
    ConfirmDialog,
    ViewTramite,
    TramitesComponent,
    NewTramiteDialog,
    CategusersComponent,
    ConfirmData,
    SugestionsadminComponent,
    SugerenciasComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,

    //material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule,
    FormsModule,
    MatTreeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    MdePopoverModule,
    AngularFireStorageModule,
    // Registering EJ2 Rich Text Editor Module
    RichTextEditorModule
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,

  ],
  providers: [AngularFireAuth, AngularFirestore, AngularFireDatabase ],
  entryComponents: [NewCategoryDialog, ConfirmDialog, NewTramiteDialog, ConfirmData, NewSubCategoryDialog, NewBlockDialog, ViewTramite],
  bootstrap: [AppComponent]
})
export class AppModule { }
