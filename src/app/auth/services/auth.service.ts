import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, updatedUser, Usuario } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.baseUrl;
  private usuario!: Usuario;

  constructor(private http: HttpClient) { }

  get user(){
    return {...this.usuario};
  }

  validateField(field: string, form: FormGroup):boolean | undefined{
    return form.get(field)?.invalid && form.get(field)?.touched;
  }

  register(name: string,surname: string,email: string,username:string,password: string){

    const body = {
      name,
      surname,
      email,
      username,
      password
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/register`,body).pipe(
      tap(resp => {
        if(resp.ok){
          localStorage.setItem('token',resp.token);
        }
      }),
      map(resp => resp.ok)
    )

  }

  login(username: string,password: string){

    const url = `${this.baseUrl}/login`;

    const body = {
      username,
      password
    }

    return this.http.post<AuthResponse>(url,body).pipe(
      tap(resp => {
        if(resp.ok){
          localStorage.setItem('token',resp.token)
        }
      }),
      map(resp => resp.ok)
    )
  }

  cargarUsuario(user: Usuario){
    this.usuario = user;
  }

  verify(){
    const url = `${this.baseUrl}/verify`
    return this.http.get<AuthResponse>(url).pipe(
      map(resp => {
        localStorage.setItem('token',resp.token)
        this.cargarUsuario(resp.user!)
        return resp.ok
      }),
      catchError(()=> of(false))
    )
  }

  logout(){
    const url = `${this.baseUrl}/logout`;
    return this.http.post(url,{});
  }

  updateProfile(data: FormData){
    return this.http.post<updatedUser>(`${this.baseUrl}/user/update`, data).pipe(
      tap(resp => {
        this.cargarUsuario(resp.user!)
      })
    );
  }

}