import {Component, Input, numberAttribute, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../../../services/auth-services/token-storage.service";
import {UsersService} from "../../../../services/users.service";
import {initFlowbite} from "flowbite";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  permissions:string[]=[]
  user:any=[];
  image1:any;
  constructor(
    private tokenStorageService:TokenStorageService,
    private usersService:UsersService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cookieService: CookieService,

  ) { }



  uploadImage(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

     if (!file) {
        console.error('No file selected.');
        return;
      }
    this.usersService.uploadImage(this.user.sub, file).subscribe(
      (data: any) => {
      },
      error => {
this.toastr.error('La taille de l\'image doit être < 1mb.');
}
    );
  }





  hello: any;
  @Input({transform: numberAttribute})  maximized:number=1;

  widthChangeClickHandler(){
    this.maximized=(this.maximized+1)%2;
  }
  getImage(){

    this.user = this.tokenStorageService.getUser()
    this.usersService.getImage(this.user.sub).subscribe(
      (data: any) => {
        this.createImageFromBlob(data);
      },
      (error) => {
      },
      ()=>{
      }
    )

  }
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.image1 = reader.result as string;

    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

changeImage(event: any) {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0]; // Access the first selected file

  if (!file) {
    return;
  }

  this.usersService.changeImage(this.user.sub, file).subscribe(
    (data: any) => {
this.toastr.success('Image modifiée avec succès.');  },
    error => {
this.toastr.error('Veuillez vérifier la taille et le format de l\'image.');}
  );

}

  ngOnInit(): void {
    initFlowbite();
    this.permissions = (this.tokenStorageService.getUser()?.permissions || []).sort();
    this.getImage()


  }

  logout(){
    this.tokenStorageService.signOut()
  }

  handleImageChange(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0]; // Access the first selected file

    if (!file) {
      return;
    }

    const reader = new FileReader();
    if (!this.image1) {
      reader.onload = (e: any) => {
        this.uploadImage(event);
        this.image1 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    else {
      reader.onload = (e: any) => {
        this.changeImage(event);
        this.image1 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }


}
