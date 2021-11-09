import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
    passwControl2: new FormControl('', [
      Validators.required
    ]),
  })
  constructor(private authService: AuthServiceService, private snack: MatSnackBar, private AppComp: AppComponent, private dataRoute: ActivatedRoute, private route: Router, private storage: AngularFireStorage) { }

  ngOnInit(): void {
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
  createUser(){
    let names = this.options.get('namesControl').value;
    let lastnames = this.options.get('lastnamesControl').value;
    let mail = this.options.get('emailControl').value;
    let pass = this.options.get('passwControl').value;
    let pass2 = this.options.get('passwControl2').value;
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
      if(pass === pass2)
      {
        let sub = this.authService.createMailUser(mail, pass, names, lastnames, roles).then(result =>{
          console.log(result)
          this.options.get('namesControl').setValue('');
          this.options.get('lastnamesControl').setValue('');
          this.options.get('emailControl').setValue('');
          this.options.get('passwControl').setValue('');
          this.options.get('roleControl').setValue('');
          if(result== 'ok'){
            this.delay(100).then(any =>{
              this.snack.open('Usuario creado con exito...', 'x', {duration: 5000});
            })
            
          }
          
        })
        this.snack.open('Creando usuario espere....', 'x', {duration: 3000});
      }
      else
      {
        this.snack.open('Claves son diferentes!', '', {duration: 2000})
      }
      


      
    }
    
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

}
