import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthServiceService } from '../Services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { validateEventsArray } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

export class Upload{
  $key: string;
  file: File;
  name: string;
  url: string;
  progess: number;
  createdAt: Date = new Date();

  constructor(file:File){
    this.file = file;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  selected = 0;
  user;
  showNotAllowed = false;
  showCardUpload = false;
  userUrl = '';
  currentUpload;


  options = new FormGroup({
    namesControl: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]*$')
    ]),
    lastnamesControl: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]*$')
    ]),
    roleControl: new FormControl('', [
      Validators.required
    ]),
    emailControl: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    passwControl: new FormControl('', [
      Validators.required
    ]),
  })
  form: any;


  constructor(private authService: AuthServiceService, private snack: MatSnackBar, private AppComp: AppComponent, private dataRoute: ActivatedRoute, private route: Router, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.options.get('roleControl').setValue('profesor');
    this.options.get('roleControl').updateValueAndValidity;
    this.selected = 1;
    let sub = this.dataRoute
    .queryParams
    .subscribe(params => {
      if(params.params == 'login'){
        this.selected = 1;
      }
      else
      {
        this.selected = 0;
      }
    });
  }


  createUser(){
    let names = this.options.get('namesControl').value;
    let lastnames = this.options.get('lastnamesControl').value;
    let mail = this.options.get('emailControl').value;
    let pass = this.options.get('passwControl').value;
    let roles = this.options.get('roleControl').value;

    let val1 = this.options.get('namesControl').value.match(/\d+/g);
    let val2 = this.options.get('lastnamesControl').value.match(/\d+/g);

    if(val1 != null || val2 != null)
    {
      this.snack.open('Por favor revisar los campos...', '', {duration: 2000})
      this.options.get('namesControl').clearAsyncValidators;
      this.options.get('lastnamesControl').clearAsyncValidators;
      return
    }
    else
    {
      console.log(names,lastnames,roles, mail, pass);

      if(pass.length <= 5){this.snack.open('Clave debe tener minimo 6 caracteres!', '', {duration: 2000})}
      this.snack.open('Creando usuario espere....', 'x', {duration: 3000});


      let sub = this.authService.createMailUser(mail, pass, names, lastnames, roles).then(result =>{
        console.log(result)
        this.options.get('namesControl').setValue('');
        this.options.get('lastnamesControl').setValue('');
        this.options.get('emailControl').setValue('');
        this.options.get('passwControl').setValue('');
        this.options.get('roleControl').setValue('');
        if(result== 'ok'){
          this.delay(100).then(any =>{
            this.snack.open('Usuario creado con exito... En espera de aprobación.', 'x', {duration: 5000});
          })

        }
      })
    }

  }


  changeSelection(selection){
    this.delay(60).then(any =>{
      if(this.options.get('roleControl').value == 'profesor')
      {
        this.showCardUpload= true;
      }
      else
      {
        this.showCardUpload= false;
      }
    })
  }

  loginUser(){
    let mail = this.options.get('emailControl').value;
    let pass = this.options.get('passwControl').value;

    this.authService.loginMailUser(mail, pass).then( (res) => {
      console.log(res);
      if(res.user.emailVerified || res.user.email == "esfotadmin@gmail.com")
      {
        let subAuth = this.authService.isAuth().subscribe( user => {
          console.log(user)
          if(user){
            let subAuth2 = this.authService.getUserData(user.uid).subscribe(result =>{
            if(result.enabled)
              {
                this.user = result;
                this.snack.open('Bienvenido '+result.name, '', {duration: 3000});
                this.AppComp.User = result;
                this.AppComp.isLogged = true;
                this.showNotAllowed = false;
                subAuth.unsubscribe();
                subAuth2.unsubscribe();
                window.location.reload();
              }
              else
              {
                this.snack.open('Su usuario se encuentra en espera de aprobacion', '', {duration: 2000});
                this.showNotAllowed = true;
                this.authService.logoutUser();
                this.AppComp.isLogged = false;
              }

            })

          }

        })
      }
      else
      {
        res.user.sendEmailVerification();
        this.snack.open('Debe verificar su usuario para poder continuar, se envio un correo con las indicaciones.', '', {duration: 2000});
        this.showNotAllowed = true;
        this.authService.logoutUser();
        this.AppComp.logoutVerify();
        this.AppComp.isLogged = false;
      }

    }).catch(err => {
      console.log(err.code);
      if(err.code == 'auth/user-not-found')
      {
        this.snack.open('El usuario no esta registrado o no existe!', '', {duration: 2000})
      }
      if(err.code == 'auth/wrong-password')
      {
        this.snack.open('El usuario o la clave es incorrecta', '', {duration: 2000})
      }
      if(err.code == 'auth/too-many-requests')
      {
        this.snack.open('Muchos intentos fallidos espere un minuto', '', {duration: 2000})
      }

    })
  }



  detectFiles(event){
    let file = event.target.files[0];
    this.currentUpload = new Upload(file);
    this.storage.upload('ProfCarnets/'+this.options.get('emailControl').value+'.png',this.currentUpload.file).then(response =>{
      let url = this.storage.ref('ProfCarnets/'+this.options.get('emailControl').value+'.png').getDownloadURL();
      url.subscribe(result =>{
        console.log(result);
        this.userUrl = result;
      })
    });

  }




  resetPassword(){
    let mail = this.options.get('emailControl').value;
    if (mail != '')
    {
      this.authService.resetPassword(mail)
    }
    else
    {
      this.snack.open('Debe ingresar su correo', '', {duration: 2500});
    }
  }



  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

}
