import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Usuario, UserResponse } from '../../interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Dashboard, DashboardItem, Profile } from '../../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  storagePath = environment.storagePath;
  baseUrl = environment.baseUrl;
  private _following: Usuario[] = [];
  private _followers: Usuario[] = [];
  private _profile!: Profile;

  constructor(private http: HttpClient) { }

  get following(){
    return [...this._following]
  }

  get followers(){
    return [...this._followers]
  }

  get profile(){
    return {...this._profile}
  }

  follow(userToFollow: Usuario){
    this._following.push(userToFollow);
    return this.http.post(`${this.baseUrl}/user/follow/${userToFollow.id}`,{});
  }

  unfollow(idToUnFollow: number){
    this._following = this._following.filter(user => user.id !== idToUnFollow);
    return this.http.post(`${this.baseUrl}/user/unfollow/${idToUnFollow}`,{});
  }

  getAvatar(avatar_path: string | null){
    return avatar_path ? `${this.storagePath}/users/${avatar_path}` : 'assets/angular/assets/images/no-image.jpg';
  }

  getFollowers(){
    return this.http.get<UserResponse>(`${this.baseUrl}/user/followers`).pipe(
      tap(resp =>{
        this._followers = resp.followers!;
      })
    );
  }

  getFollowing(){
    return this.http.get<UserResponse>(`${this.baseUrl}/user/following`).pipe(
      tap(resp =>{
        this._following = resp.following!;
      })
    );
  }

  getProfile(username: string){

    const url = `${this.baseUrl}/user/getOne/${username}`

    return this.http.get<Profile>(url).pipe(
      tap(resp => {
        this._profile = resp;
      })
    )

  }

  searchUsers(query: string){
    return this.http.get<Usuario[]>(`${this.baseUrl}/user/search/${query.trim()}`);
  }

}
