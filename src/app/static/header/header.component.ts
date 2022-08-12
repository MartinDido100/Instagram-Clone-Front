import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../home/services/user.service';
import { ImageService } from '../../home/services/image.service';
import { Usuario } from '../../interfaces/user.interface';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeLink: string = 'home';
  userSearched = '';
  openMenu: boolean = false;
  usersSearched: Usuario[] = [];
  messagesSvgPath = 'M12.003 2.001a9.705 9.705 0 110 19.4 10.876 10.876 0 01-2.895-.384.798.798 0 00-.533.04l-1.984.876a.801.801 0 01-1.123-.708l-.054-1.78a.806.806 0 00-.27-.569 9.49 9.49 0 01-3.14-7.175 9.65 9.65 0 0110-9.7z'
  debouncer: Subject<string> = new Subject();

  @Output() onUpload = new EventEmitter<string>();

  searchUser(){
    this.debouncer.next(this.userSearched);
  }

  showUpload(){
    this.onUpload.emit('open');
  }

  get user(){
    return this.aS.user;
  }

  showMenu(){
    this.activeLink = `${this.activeLink}disabled`

    this.openMenu = true;
  }

  closeMenu(){
    this.activeLink = this.activeLink.replace('disabled','')
    this.openMenu = false;
  }

  getFillHome(){
    return this.activeLink === 'home' ? '' : 'none'
  }

  getViewBoxHome(){
    return this.activeLink === 'like' ? '0 0 48 48' : '0 0 24 24'
  }
  
  getSvgClass(link: string,svg: string){
    return this.activeLink === link ? `selected-${svg}` : `unselected-${svg}`
  }

  changeActiveLink(link: string){
    this.activeLink = link;
  }

  avatar(path: string | null){
    return this.uS.getAvatar(path);
  }

  logout(){
    this.aS.logout();
    this.iS.clearArrays();
  }

  closeSearch(){
    this.usersSearched = [];
    this.userSearched = '';
  }

  constructor(private aS: AuthService,private uS: UserService,private iS: ImageService) { }

  ngOnInit(): void {
    this.debouncer.pipe(
      debounceTime(300)
    ).subscribe(valor =>{
      if(valor){
        this.uS.searchUsers(valor).subscribe(users =>{
          this.usersSearched = users;
        } )
      }else{
        this.usersSearched = [];
      }
    })
  }

}