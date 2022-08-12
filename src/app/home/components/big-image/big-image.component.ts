import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { DashboardItem } from '../../../interfaces/image.interface';
import { ImageService } from '../../services/image.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-big-image',
  templateUrl: './big-image.component.html',
  styleUrls: ['./big-image.component.scss']
})
export class BigImageComponent implements OnInit {

  @Output() onUsernameClick = new EventEmitter<MouseEvent>();

  public handleUsernameClick(event: MouseEvent){
    this.onUsernameClick.emit(event);
  }

  commentForm: FormGroup = this.fb.group({
    'content': ['',Validators.required]
  })

  comment(imageId: number){
    if(this.commentForm.invalid){
      return;
    }

    this.iS.comment(imageId,this.commentForm.value.content,true).subscribe();
    this.image.comments.push({
      id: this.image.comments.length + 1,
      user_id: this.user.id,
      content: this.commentForm.value.content,
      user: this.user
    })
    this.commentForm.reset();
  }

  @Input() image!: DashboardItem;

  constructor(private uS: UserService,private iS: ImageService,private aS: AuthService,private renderer: Renderer2,private fb: FormBuilder) { }

  get user(){
    return this.aS.user;
  }

  get myLikes(){
    return this.iS.myLikes;
  }

  ngOnInit(): void {
  }

  animateHeart(e: any){
    const heartDiv: ElementRef = e.target?.parentNode?.children[1];

    this.renderer.addClass(heartDiv,'animate');

    setTimeout(() => {
      this.renderer.removeClass(heartDiv,'animate')
    }, 1000);

  }

  like(){
    const liked = this.iS.like(this.image.id,true);
    if(liked){
      this.image.likes++;
    }
  }

  dislike(){
    const disliked = this.iS.dislike(this.image.id,true);
    if(disliked){
      this.image.likes--;
    }
  }

  checkLike(): boolean{
    const index = this.myLikes.findIndex(image => {
      return image.image_id == this.image.id
    })

    return index != -1 ? true : false;
  }

  getAvatar(path: string){
    return this.uS.getAvatar(path);
  }

  getImage(path: string){
    return this.iS.getImage(path);
  }

}
