import { async,ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment.prod';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';




describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports:[

        FormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([]),
        AngularFireStorageModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],

      declarations: [
        LoginComponent,

      ],

      providers:[
        AngularFireAuth,
        AngularFirestore
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear el componente', () => {
    expect(component).toBeTruthy();
  });


it ('Deberia validar que los campos de usuario y contraseña no este vacio', () =>{

  component.form.controls = 'narvaezdiana4@gmail.com'
  component.currentUpload = '123456789'

  expect(component.form.controls).not.toBeNull();
  expect(component.currentUpload).not.toBeNull();

});


});


