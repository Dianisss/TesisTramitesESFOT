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
import { AuthServiceService } from '../Services/auth-service.service';




describe('LoginComponent', () => {

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

  it('Debería crear el componente', () => {

    const fixture=TestBed.createComponent(LoginComponent);
    const component2= fixture.componentInstance;
    expect(component2).toBeTruthy();

  });

  it('Debería verificarque los campos del correo electrónico y contraseña no esten vacios', () => {

    const fixture=TestBed.createComponent(AuthServiceService);
    const component2= fixture.componentInstance;
    const cp= {mail: "narvaezdiana4@gmail.com", pass: '123456789'} || {};
    const verificacion = component2.loginMailUser(cp.mail, cp.pass);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['mail']).toBeFalsy();
    expect(verificacion ['pass']).toBeFalsy();

  });


});


