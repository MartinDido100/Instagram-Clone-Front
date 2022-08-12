import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('passInput') passInput!: ElementRef;

  emailPath: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  phonePath: string = "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$";
  cargando: boolean = false; 

  registerForm: FormGroup = this.fb.group({
    'email': ['',[Validators.required,Validators.pattern(`(${this.emailPath})|(${this.phonePath})`)]],
    'name': ['',[Validators.required]],
    'username': ['',Validators.required],
    'password': ['',[Validators.required,Validators.minLength(6)]]
  });

  showPassText: string = 'Mostrar';

  changePassView(){
    if(this.passInput.nativeElement.type === 'password'){
      this.showPassText = 'Ocultar';
      this.renderer.setAttribute(this.passInput.nativeElement,'type','text');
    }else{
      this.showPassText = 'Mostrar';
      this.renderer.setAttribute(this.passInput.nativeElement,'type','password');
    }
  }

  checkButtonClass(){
    return this.registerForm.invalid;
  }

  constructor(private fb: FormBuilder,private renderer: Renderer2,private aS: AuthService,private router: Router) { }

  changeClass(field: string){
    return this.registerForm.value[field].length >= 1;
  }

  ngOnInit(): void {

  }

  validateField(field: string) {
    return this.aS.validateField(field, this.registerForm);
  }

  register(){

    if(this.registerForm.invalid){
      return;
    }

    const { email,name,username,password } = this.registerForm.value;

    const nameSurname = name.split(' ');
    const names = nameSurname[0]; 
    const surname = nameSurname.length > 1 ? nameSurname[1] : '';

    this.cargando = true;

    this.aS.register(names,surname,email,username,password).subscribe((valido: boolean) => {
      if(valido){
        this.router.navigateByUrl('/');
      }
    },() => {
      this.cargando = false;
      this.registerForm.reset({
        email: '',
        name: '',
        username: '',
        password: ''
      })
    })

  }

}
