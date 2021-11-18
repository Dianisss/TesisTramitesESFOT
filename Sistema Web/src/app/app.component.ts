import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './Services/auth-service.service';
import { ViewobserverService } from './Services/viewobserver.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  User;
  usrImg;
  isLogged = false;
  pending = 0;
  pendingUsr = 0;
  title = 'ESFOT';
  loginSub;
  logsub;
  vistos = [];
  public isMobile: boolean = false;

  constructor(private router: Router, private authService: AuthServiceService, private observer: ViewobserverService){}

  ngOnInit(){
    this.router.navigateByUrl('home');
    this.getCurrentUser();

    //observer to get view size
    this.observer.getMode().subscribe(result =>{
      this.isMobile = result.matches;
    })

    let obs = this.authService.listSuggest().subscribe(result =>{
      this.pending = 0;
      for(let s in result)
      {
        if(result[s]['state'] == 'Pendiente')
        {
          this.pending+= 1;
        }
      }
    })

  }

  //cambia la navegacion a login/register con parametros
  navigateWithParams(param){
    if(param == 'register')
    {
      this.router.navigate(['/register']);
    }
    else
    {
      this.router.navigate(['/login']);//this.router.navigate(['/login'], { queryParams: { params: param } });
    }

  }

  getCurrentUser(){
    this.logsub = this.authService.isAuth().subscribe( user => {
      if(user.emailVerified || user.email == "esfotadmin@gmail.com"){
        this.loginSub = this.authService.getUserData(user.uid).subscribe(result =>{
          this.User = result;
          if(this.User.vistos != undefined)
          {
            this.vistos = this.User.vistos
          }
          else
          {
            this.vistos = [];
          }
          this.usrImg = result.usrUrl;
          this.isLogged = true;
          this.authService.updateUserRoles(result.role);
          let subAuth2 = this.authService.getUserData(user.uid).subscribe(result =>{

            if(result.enabled)
              {
                if(result.role == 'admin')
                {
                  this.router.navigateByUrl('profile')
                }
                else
                {
                  this.router.navigateByUrl('profile');
                }

                let obsUsr = this.authService.listSuggest().subscribe(result =>{
                  this.pendingUsr = 0;
                  for(let s in result)
                  {
                    if(result[s]['unread'])
                    {
                      this.pendingUsr+= 1;
                    }
                    console.log('se ejecuta')
                  }
                  this.authService.listAlerts().subscribe(result =>{
                    for(let s in result)
                    {
                      if(this.vistos.indexOf(result[s].id) !== -1)
                      {
                        console.log('esta')
                      }
                      else
                      {
                        console.log('no esta')
                        this.pendingUsr+= 1;
                      }
                      console.log(this.pendingUsr)
                    }
                    this.pendingUsr-= 1;
                    obsUsr.unsubscribe();
                  })
                });//end nots

              }

            subAuth2.unsubscribe();
            this.loginSub.unsubscribe();
          });

        })

      }
      else
      {
        console.log('not logged');
      }
    })
  }

  logoutVerify(){
    this.loginSub.unsubscribe();
    this.isLogged = false;
    this.User = {};
    this.pendingUsr = 0;
  }

  logOutUser(){
    //this.logsub.unsubscribe();
    this.loginSub.unsubscribe();
    this.isLogged = false;
    this.User = {};
    this.pendingUsr = 0;
    this.authService.logoutUser();
    sessionStorage.removeItem('tokenK');
    sessionStorage.removeItem('displayName');
    sessionStorage.removeItem('userName');
    this.navigateWithParams('login');
    console.log('logged out')
  }

}
