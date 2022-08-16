import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ImageService } from '../../services/image.service';
import { DashboardItem } from '../../../interfaces/image.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {

  imageModal: DashboardItem | null = null;

  animateHeart(e: any){
    const heartDiv: ElementRef = e.target?.parentNode?.children[1];

    this.renderer.addClass(heartDiv,'animate');

    setTimeout(() => {
      this.renderer.removeClass(heartDiv,'animate')
    }, 1000);

  }

  commentMapping = {
    '=1' : 'Ver el comentario',
    'other': 'Ver los # comentarios'
  }
  
  commentForm: FormGroup = this.fb.group({
    'content': ['',Validators.required]
  })

  get dashboard(){
    return this.is.dashboard
  }

  get myLikes(){
    return this.is.myLikes;
  }

  constructor(private uS: UserService,private is: ImageService,private fb: FormBuilder,private renderer: Renderer2) { }

  comment(imageId: number){

    if(this.commentForm.invalid){
      return;
    }

    this.is.comment(imageId,this.commentForm.value.content).subscribe();
    this.commentForm.reset();

  }

  avatar(path: string){
    return this.uS.getAvatar(path)
  }

  imagePath(path: string){
    return this.is.getImage(path);
  }

  like(imageId: number){

    this.is.like(imageId);    

  }

  dislike(imageId: number){

    this.is.dislike(imageId);

  }

  checkLike(imageId: number): boolean{
    const index = this.myLikes.findIndex(image => {
      return image.image_id == imageId
    })

    return index != -1 ? true : false;
  }

  ngOnInit(): void {
    this.is.getDashboard().subscribe();
  }

}