import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Dashboard, DashboardItem, myLikesResp } from 'src/app/interfaces/image.interface';
import { tap } from 'rxjs';
import { myLikes } from '../../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  storagePath = environment.storagePath
  apiUrl: string = environment.baseUrl;
  private _dashboard: DashboardItem[] = [];
  private _myLikes: myLikes[] = [];

  constructor(private http: HttpClient) { }

  getImage(path: string){
    return path ? `${this.storagePath}/images/${path}` : '';
  }

  get dashboard(){
    return [...this._dashboard]
  }

  get myLikes(){
    return [...this._myLikes]
  }

  getLikes(imageId: number){
    return this.http.get(`${this.apiUrl}/image/likes/${imageId}`)
  }

  getMyLikes(){
    return this.http.get<myLikesResp>(`${this.apiUrl}/mylikes`).pipe(
      tap(resp => {
        this._myLikes = resp.myLikes;
      })
    )
  }

  like(imageId: number,profile:boolean = false){

    const indexLike = this._myLikes.findIndex(image => {
      return image.image_id == imageId
    })

    if(indexLike != -1){
      return false;
    }

    this._myLikes.push({
      image_id: imageId
    })

    if(!profile){
      const index = this._dashboard.findIndex(image => image.id == imageId)

      this._dashboard[index].likes++;
    }

    this.http.post(`${this.apiUrl}/like/${imageId}`,{}).subscribe()

    return true;
  }

  dislike(imageId: number,profile:boolean = false){

    const indexLike = this._myLikes.findIndex(image => {
      return image.image_id == imageId
    })

    if(indexLike == -1){
      return false;
    }

    this._myLikes.splice(indexLike,1);

    if(!profile){
      const index = this._dashboard.findIndex(image => image.id == imageId)
      this._dashboard[index].likes--;
    }

    this.http.post(`${this.apiUrl}/dislike/${imageId}`,{}).subscribe()
    return true;
    
  }

  getDashboard(){
    return this.http.get<Dashboard>(`${this.apiUrl}/image/dashboard`).pipe(
      tap(resp =>{
        this._dashboard = resp.data;
      })
    )
  }

  comment(imageId: number,content: string,profile: boolean = false){
    const url = `${this.apiUrl}/comment/${imageId}`;
    
    const body = {content}

    if(!profile){
      const index = this._dashboard.findIndex(image => image.id == imageId)

      this._dashboard[index].comment_number++;
    }

    return this.http.post(url,body)
  }

  clearArrays(){
    this._dashboard = [];
    this._myLikes = [];
  }

  uploadImage(data: FormData){
    return this.http.post<DashboardItem>(`${this.apiUrl}/image/upload`,data).pipe(
      tap((resp: DashboardItem) => {
        this._dashboard.unshift(resp);
      })
    )
  }

}
