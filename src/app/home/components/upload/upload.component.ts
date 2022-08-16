import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Output() onCloseUpload = new EventEmitter<string>();
  imagenPrevia: any
  uploading: boolean = false;

  uploadForm: FormGroup = this.fb.group({
    file: ['',[Validators.required]],
    fileSource: ['',[Validators.required]],
    title: ['',[Validators.required]],
  });

  constructor(private sanitizer: DomSanitizer,private fb: FormBuilder,private iS: ImageService) { }

  closeUpload(){
    this.onCloseUpload.emit('close');
  }

  public onFileSelected(event: any) {

    const imagen = event.target.files[0];
    if (['image/png','image/jpg','image/jpeg'].includes(imagen.type) && event.target.files.length > 0) {
      this.uploadForm.patchValue({
        fileSource: imagen
      });
      this.blobFile(imagen).then((res: any) => {
        this.imagenPrevia = res.base;

      })
    }
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

  uploadImage(){

    if(this.uploadForm.invalid){
      return;
    }

    const formData = new FormData();

    formData.append('image_path', this.uploadForm.get('fileSource')!.value);
    formData.append('titulo', this.uploadForm.get('title')!.value);

    this.uploading = true;
    this.iS.uploadImage(formData).subscribe(_ => {
      this.uploading = false;
      this.closeUpload();
    })

  }

  ngOnInit(): void {
  }

}
