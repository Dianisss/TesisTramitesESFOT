import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

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
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  hide = true;
  userUrl = '';
  User;
  usrRole;
  currentUpload;

  options = new FormGroup({
    namesControl: new FormControl('', [
      Validators.required
    ]),
    lastnamesControl: new FormControl('', [
      Validators.required
    ]),
    roleControl: new FormControl(''),
    emailControl: new FormControl(''),
    passwControl: new FormControl(''),
    imageSelectorControl: new FormControl(''),
  })

  constructor(private storage: AngularFireStorage, private AppC: AppComponent, private userService: AuthServiceService, private snack: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.User = this.AppC.User
    this.options.get('namesControl').setValue(this.User.name);
    this.options.get('lastnamesControl').setValue(this.User.lastname);
    this.options.get('emailControl').setValue(this.User.mail);
    this.options.get('roleControl').setValue(this.User.role);
    this.userUrl = this.User.usrUrl;
    this.usrRole = this.AppC.User.role;
  }

  detectFiles(event){
    let file = event.target.files[0];
    this.currentUpload = new Upload(file);
    this.storage.upload('/UsersProfileImg/'+this.User.uid+'.png',this.currentUpload.file).then(response =>{
      let url = this.storage.ref('/UsersProfileImg/'+this.User.uid+'.png').getDownloadURL();
      url.subscribe(result =>{
        console.log(result);
        this.userUrl = result;
      })
    });

  }

  updateUser(){
    let val1 = this.options.get('namesControl').value.match(/\d+/g);
    let val2 = this.options.get('lastnamesControl').value.match(/\d+/g);
    if(val1 != null || val2 != null)
    {
      this.snack.open('No se permiten numeros en el nombre', '', {duration: 2000})
      return;
    }
    else
    {
      let name = this.options.get('namesControl').value;
      let lastname = this.options.get('lastnamesControl').value;
      if(!name.replace(/\s/g, '').length )
      {

        this.snack.open('Nombre no puede estar en blanco', '', {duration: 2000})
        return;
      }
      else if(!lastname.replace(/\s/g, '').length )
      {
        this.snack.open('Nombre no puede estar en blanco', '', {duration: 2000})
        return
      }
      else
      {
        this.userService.updateUser(this.User.uid, this.options.get('namesControl').value, this.options.get('lastnamesControl').value, this.userUrl).then(any => this.snack.open('Cambios guardados!', '', {duration: 2000}));
      }

    }

  }

  //cambia la navegacion a login/register con parametros
  navigateWithParams(){
    this.router.navigate(['/home']);
  }

  logOutUser()
  {
    this.AppC.logOutUser();
  }

}
