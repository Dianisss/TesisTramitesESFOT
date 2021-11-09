import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  userName;
  usrImg;
  usrRole;
  usrUID;
  cause = '';
  view = 'form';
  options = new FormGroup({
    titleControl: new FormControl('', [
      Validators.required
    ]),
    descControl: new FormControl('', [
      Validators.required
    ]),
    reasonControl: new FormControl('', [
      Validators.required
    ]),
  })

  constructor(private snack: MatSnackBar, private auth: AuthServiceService, private router: Router, private AppC: AppComponent) { }

  ngOnInit(): void {
    this.usrImg = this.AppC.usrImg;
    this.userName = this.AppC.User.name;
    this.usrRole = this.AppC.User.role;
  }

  logOutUser()
  {
    this.AppC.logOutUser();
  }

  selectCause(id){
    let btn1 = (document.getElementById('event') as HTMLButtonElement);
    let btn3 = (document.getElementById('Novedad') as HTMLButtonElement);

    if(id == 'event')
    {
      btn1.style.background = 'red';
      btn3.style.background = 'transparent';
      this.cause = 'Evento'
    }
    if(id == 'Novedad')
    {
      btn1.style.background = 'transparent';
      btn3.style.background = 'red';
      this.cause = 'Novedad'
    }
  }

  enviar()
  {
    if(this.cause == '')
    {
      this.snack.open('Debe seleccionar una causa', '', {duration: 2500})
    }
    else
    {
      this.auth.createAlert(this.options.get('descControl').value, this.cause);
      // this.auth.createAlert(this.options.get('titleControl').value, this.options.get('descControl').value, this.cause, this.AppC.User.uid);
      this.snack.open('Enviado!', '', {duration: 2500});
      this.options.get('titleControl').setValue('');
      this.options.get('descControl').setValue('');
      this.cause = '';
      let btn1 = (document.getElementById('queja') as HTMLButtonElement);
      let btn3 = (document.getElementById('Novedad') as HTMLButtonElement);
      btn1.style.background = 'transparent'
      btn3.style.background = 'transparent'
    }

  }

}
