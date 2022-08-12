import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  activeForm: string = 'login';
  upLinks: string[] = ['Meta','Informacion','Blog','Empleo','Ayuda','API','Privacidad','Condiciones','Cuentas destacadas','Hashtags','Ubicaciones','Instagram lite']
  downLinks: string[] = ['Español','© 2022 Instagram from Meta']

  changeForm(form: string): void{
    this.activeForm = form;
  }

  ngOnInit(): void {
    localStorage.removeItem('token');
  }

}


  