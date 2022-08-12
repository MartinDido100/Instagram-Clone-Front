import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { ImageService } from '../../services/image.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  openUpload: string = 'close';

  constructor(private aS: AuthService,private uS: UserService,private is: ImageService) { }

  ngOnInit(): void {
    this.uS.getFollowing().subscribe();
    this.is.getDashboard().subscribe();
    this.is.getMyLikes().subscribe();
  }

  onUpload(event: string){
    this.openUpload = event;
  }

  onCloseUpload(event: string){
    this.openUpload = event;
  }

  logout(){
    this.aS.logout().subscribe();
    localStorage.removeItem('token');
  }

}
