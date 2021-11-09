import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categorias = []
  constructor(private auth: AuthServiceService, private router: Router, private App: AppComponent, private snack: MatSnackBar) { }

  ngOnInit(): void {
    let sub = this.auth.listCats().subscribe(result =>{
      this.categorias = [];
      this.categorias.push(result[0]);
      this.categorias.push(result[1]);
      this.categorias.push(result[2]);
      this.categorias.push(result[3]);
    })
    

    this.showSlides(this.slideIndex);
  }

  //cambia la navegacion a login/register con parametros
  navigateWithParams(param){
    
    this.router.navigate(['/category'], { queryParams: { params: param } });
         
  }

  checkUser(){
    console.log(this.App.isLogged);
    if(this.App.isLogged)
    {
      this.router.navigate(['/categorias']);
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

  slideIndex = 1;

  // Next/previous controls
  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    var dots = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
    if (n > slides.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex-1].style.display = "block";
    console.log(dots)
    dots[this.slideIndex-1].className += " active";
  }

  // Thumbnail image controls
  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

}
