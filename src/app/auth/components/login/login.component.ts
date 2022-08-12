import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('passInput') passInput!: ElementRef;

  showPassText: string = 'Mostrar';
  cargando: boolean = false;
  error: boolean = false;

  loginForm: FormGroup = this.fb.group({
    'username': ['',Validators.required],
    'password': ['',[Validators.minLength(6),Validators.required]]
  })

  checkButtonClass(){
    return this.loginForm.invalid
  }

  constructor(private fb: FormBuilder,private renderer: Renderer2,private aS: AuthService,private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('token');
  }

  changeClass(field: string){
    return this.loginForm.value[field].length >= 1;
  }

  login(){

    if(this.loginForm.invalid){
      return;
    }

    const { username,password } = this.loginForm.value;
    this.cargando = true;
    this.aS.login(username,password).subscribe(valid =>{
      if(valid){
        this.router.navigateByUrl('/');
      }
    },() => {
      this.error = true;
      this.cargando = false;
      this.loginForm.reset({
        username: '',
        password: ''
      });
    })

  }

  changePassView(){
    if(this.passInput.nativeElement.type === 'password'){
      this.showPassText = 'Ocultar';
      this.renderer.setAttribute(this.passInput.nativeElement,'type','text');
    }else{
      this.showPassText = 'Mostrar';
      this.renderer.setAttribute(this.passInput.nativeElement,'type','password');
    }
  }

}

