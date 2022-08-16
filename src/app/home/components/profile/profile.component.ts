import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { UserService } from '../../services/user.service';
import { Profile, DashboardItem } from '../../../interfaces/image.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from 'src/app/interfaces/user.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  username: string = '';
  loading: boolean = true;
  imageModal: DashboardItem | null = null;
  edit: boolean = false;
  avatarPrevio: any;
  updating: boolean = false;

  updateForm: FormGroup = this.fB.group({
    name: [null,Validators.required],
    surname: ['',Validators.required],
    email: ['',Validators.required],
    username: ['',Validators.required],
    file: [null],
    fileSource: [null]
  })

  get profile(): Profile{
    return this.uS.profile;
  }

  get following(): Usuario[]{
    return this.uS.following;
  }

  get user(){
    return this.aS.user;
  }

  constructor(private router: Router,private fB:FormBuilder,private sanitizer: DomSanitizer,private iS: ImageService,private uS: UserService,private activatedRoute: ActivatedRoute,private aS: AuthService) { }

  public onFileSelected(event: any) {

    const imagen = event.target.files[0];
    if (['image/png','image/jpg','image/jpeg'].includes(imagen.type) && event.target.files.length > 0) {
      this.updateForm.patchValue({
        fileSource: imagen
      });
      this.blobFile(imagen).then((res: any) => {
        this.avatarPrevio = res.base;

      })
    }
  }

  openEdit(){
    this.edit = true;
    this.updateForm.setValue({
      name: this.profile.name,
      surname: this.profile.surname,
      email: this.profile.email,
      username: this.username,
      file: null,
      fileSource: null
    })
  }

  blobFile = async ($event: any) => new Promise((resolve, reject): any => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  });

  follow(){
    const userToFollow: Usuario = {
      id: this.profile.id,
      username: this.username,
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

  updateProfile(){
    if(this.updateForm.invalid){
      return;
    }

    const formData = new FormData();
    formData.append('name', this.updateForm.value.name);
    formData.append('surname', this.updateForm.value.surname);
    formData.append('email', this.updateForm.value.email);
    formData.append('username', this.updateForm.value.username);

    if(this.updateForm.value.fileSource){
      formData.append('avatar_path', this.updateForm.value.fileSource);
    }

    this.updating = true;

    this.uS.updateProfile(formData).subscribe();

    this.aS.updateProfile(formData).subscribe(_=>{
      this.updating = false;
      this.edit = false;
      if(this.username != this.updateForm.value.username){
        this.router.navigateByUrl(`/${this.updateForm.value.username}`);
      }
    });

    this.iS.getDashboard().subscribe();

  }

}
