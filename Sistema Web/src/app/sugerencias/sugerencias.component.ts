import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent implements OnInit {
  userName;
  usrImg;
  usrRole;
  usrUID;
  cause = '';
  view = 'form';
  nots = 0;
  vistos = [];
  // filterSearch;
  filteredPending;filteredMarked;filteredPendingNots;
  pending = [];
  pendingNots = [];
  marked = [];
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
    //this.usrRole = this.AppC.User.role;
    this.nots = this.AppC.pendingUsr;
    if(this.AppC.User.vistos != undefined)
    {
      this.vistos = this.AppC.User.vistos
    }
    else
    {
      this.vistos = [];
    }

    let sub = this.auth.listSuggest().subscribe(result =>{
      this.pending = [];
      this.pendingNots = [];
      this.marked = [];
      for(let s in result)
      {
        if(result[s]['uid'] == this.AppC.User.uid)
        {
          if(result[s]['unread'])
          {
            this.pending.push(result[s]);
          }
          else
          {
            this.marked.push(result[s]);
          }
        }
      }
      let sub2 = this.auth.listAlerts().subscribe(result =>{
        for(let s in result)
        {
          if(this.vistos.indexOf(result[s].id) !== -1)
          {
            this.marked.push({desc: result[s]['desc'], reason: 'Notificacion', state: 'null', id: result[s]['id'], type: result[s]['reason']});
          }
          else
          {
            this.pendingNots.push({desc: result[s]['desc'], reason: 'Notificacion', state: 'null', id: result[s]['id'], type: result[s]['reason']});
          }
        }
      })
    })
    this.delay(200).then(() =>{this.filteredMarked = this.marked;this.filteredPending = this.pending, this.filteredPendingNots = this.pendingNots})
    console.log(this.pendingNots)
  }

  logOutUser()
  {
    this.AppC.logOutUser();
  }

  selectCause(id){
    let btn1 = (document.getElementById('queja') as HTMLButtonElement);
    let btn2 = (document.getElementById('Sujerencia') as HTMLButtonElement);
    let btn3 = (document.getElementById('Novedad') as HTMLButtonElement);

    if(id == 'queja')
    {
      btn1.style.background = 'red';
      btn2.style.background = 'transparent';
      btn3.style.background = 'transparent';
      this.cause = 'Queja'
    }
    if(id == 'Sujerencia')
    {
      btn1.style.background = 'transparent';
      btn2.style.background = 'red';
      btn3.style.background = 'transparent';
      this.cause = 'Sugerencia'
    }
    if(id == 'Novedad')
    {
      btn1.style.background = 'transparent';
      btn2.style.background = 'transparent';
      btn3.style.background = 'red';
      this.cause = 'Novedad'
    }
  }

  markRead(id)
  {
    for(let s in this.pending)
    {
      if(this.pending[s].id == id)
      {
        this.marked.push(this.pending[s]);
        this.pending.splice(parseInt(s),1);
      }
    }
    this.searchData('');
    this.auth.markReadSuggets(id);
    this.nots-= 1;
    this.AppC.pendingUsr -= 1;
  }

  markReadAlert(id)
  {
    for(let s in this.pending)
    {
      if(this.pending[s].id == id)
      {
        this.marked.push(this.pending[s]);
        this.pending.splice(parseInt(s),1);
      }
    }
    this.searchData('');
    this.vistos.push(id);
    this.auth.markReadAlert(this.vistos, this.AppC.User.uid);
    this.nots-= 1;
    this.AppC.pendingUsr -= 1;
  }

  enviar()
  {
    if(this.cause == '')
    {
      this.snack.open('Debe seleccionar una cuasa', '', {duration: 2500})
    }
    else
    {
      this.auth.createSuggest(this.options.get('titleControl').value, this.options.get('descControl').value, this.cause, this.AppC.User.uid);
      this.snack.open('Enviado!', '', {duration: 2500});
      this.options.get('titleControl').setValue('');
      this.options.get('descControl').setValue('');
      this.cause = '';
      let btn1 = (document.getElementById('queja') as HTMLButtonElement);
      let btn2 = (document.getElementById('Sujerencia') as HTMLButtonElement);
      let btn3 = (document.getElementById('Novedad') as HTMLButtonElement);
      btn1.style.background = 'transparent'
      btn2.style.background = 'transparent'
      btn3.style.background = 'transparent'
    }

  }

  searchData(searchValue: any) {
    this.filteredPending = this.pending.filter((item: any) => {
      return (item.desc.toLowerCase().includes(searchValue.toLowerCase()) || item.reason.toLowerCase().includes(searchValue.toLowerCase()) || item.state.toLowerCase().includes(searchValue.toLowerCase()));
    });
    this.filteredMarked = this.marked.filter((item: any) => {
      return (item.desc.toLowerCase().includes(searchValue.toLowerCase()) || item.reason.toLowerCase().includes(searchValue.toLowerCase()) || item.state.toLowerCase().includes(searchValue.toLowerCase()));
    });
    console.log(this.filteredMarked)
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

}
