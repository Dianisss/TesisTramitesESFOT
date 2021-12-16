import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { AuthServiceService } from '../Services/auth-service.service';



describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports:[

      ],


      declarations: [ RegisterComponent ]
    })
    .compileComponents();
  });

  it('Debería crear el componente', () => {

    const fixture=TestBed.createComponent(RegisterComponent);
    const component2= fixture.componentInstance;
    expect(component2).toBeTruthy();

  });

  it('Debería verificarque los campos nombre, apellido, correo electrónico y contraseña no esten vacios', () => {

    const fixture=TestBed.createComponent(AuthServiceService);
    const component2= fixture.componentInstance;
    const cp= {mail: "narvaezdiana4@gmail.com", pass: '123456789', name :"Diana", lastname: "Narváez", role: "alumno"}
    const verificacion = component2.createMailUser(cp.mail, cp.pass, cp.name, cp.lastname, cp.role);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['mail']).toBeFalsy();
    expect(verificacion ['pass']).toBeFalsy();
    expect(verificacion ['name']).toBeFalsy();
    expect(verificacion ['lastname']).toBeFalsy();
    expect(verificacion ['rol']).toBeDefined();

  });



});
