import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { UserService } from '../../services/user.service';
import { Profile, DashboardItem } from '../../../interfaces/image.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  username: string = '';
  loading: boolean = true;
  imageModal: DashboardItem | null = null;

  get profile(): Profile{
    return this.uS.profile;
  }

  get following(): Usuario[]{
    return this.uS.following;
  }

  get user(){
    return this.aS.user;
  }

  constructor(private iS: ImageService,private uS: UserService,private activatedRoute: ActivatedRoute,private aS: AuthService) { }

  follow(){
    const userToFollow: Usuario = {
      id: this.profile.id,
      username: this.user.username,
      avatar_path: this.user.avatar_path,
      email: this.user.email,
      name: this.user.name,
      surname: this.user.surname
    }

    this.uS.follow(userToFollow).subscribe();
    this.iS.getDashboard().subscribe();
  }
  
  unfollow(){
    this.uS.unfollow(this.profile.id).subscribe();
    this.iS.getDashboard().subscribe();
  }

  checkFollow(){
    const userFound = this.following.find(user => user.id === this.profile.id);
    return userFound ? true : false;
  }

  getProfile(){
    this.activatedRoute.params.pipe(
      tap( ({username}) => {
        this.username = username;
        this.loading = true;
      }),
      switchMap(({username}) => this.uS.getProfile(username))
    ).subscribe(_ =>{
      this.loading = false;
    })
  }



  ngOnInit(): void {
    this.getProfile();
    this.imageModal = null;
  }

  getAvatar(path: string){
    return this.uS.getAvatar(path);
  }

  getImage(path: string){
    return this.iS.getImage(path);
  }

}
