import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofileComponent } from './myprofile.component';
import { AuthServiceService } from '../Services/auth-service.service';

describe('MyprofileComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyprofileComponent ]
    })
    .compileComponents();
  });

  it('Debería crear el componente', () => {

    const fixture=TestBed.createComponent(MyprofileComponent);
    const component= fixture.componentInstance;
    expect(component).toBeTruthy();

  });

  it('Debería verificarque los campos del nombre, apellido y correo electrónico no esten vacios', () => {

    const fixture=TestBed.createComponent(AuthServiceService);
    const component= fixture.componentInstance;
    const datos= {userUid: "1", name:"Diana" , lastname:"Narvaez" , usrUrl:"narvaezdiana4@gmail.com" }
    const verificacion = component.updateUser(datos.userUid, datos.name, datos.lastname, datos.usrUrl);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['id']).toBeDefined();
    expect(verificacion ['name']).toBeFalsy();
    expect(verificacion ['lastname']).toBeFalsy();
    expect(verificacion ['usrUrl']).toBeDefined();

  });




});
