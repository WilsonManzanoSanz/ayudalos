import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {PostsService} from '../shared/posts.service';
import {PetitionsService} from '../shared/petitions.service';
import {SidenavService} from '../../ui/shared/sidenav.service';
import {AuthService, User} from '../../core/auth.service';
import {Router} from '@angular/router';
import { NgForm} from '@angular/forms';
import {  finalize } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  
   public postForm: NgForm;
   private photo: any;
   public uploadingPhoto: Boolean;
   public uploadingPromise = null;
   public categories:any;
   public image:any = null;
  
   @Input() type: any;
   @Input() user: any;
   @Input() post: any = {};
   @Output()
  uploaded = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    public sidenavService: SidenavService,
    private router: Router,
    public postsService: PostsService,
    public petitionsService: PetitionsService
    ) {
  }

  ngOnInit() {
    this.petitionsService.getCategories().subscribe(
      response => this.categories = response.items,
      error => console.error(error)
    );
  }

  addPhoto() {
    document.getElementById('fileToUpload').click();
    const fileInput = document.getElementById('fileToUpload');
    fileInput.addEventListener('change', (e: any) => this.saveFile(e.target.files[0]));
  }

  saveFile(file: any) {
    this.photo = file;
    this.image = document.getElementById('preview-image');
     let reader  = new FileReader();
     reader.onload =  () => {
       this.image.style.display = 'block';
       this.image.src = reader.result;
     }
     if (file) {
       reader.readAsDataURL(file);
     } else {
       this.image.src = "";
     }
    /*this.uploadingPhoto = true;
    this.uploadingPromise = new Promise((resolve, reject) => {
      this.postsService.uploadPostPhoto(this.photo, this.user.uid).snapshotChanges().pipe(
            finalize(() => {
              this.postsService.fileRef.getDownloadURL().subscribe((responseURL) => {
                this.post.photoURL = responseURL;
                this.uploadingPhoto = false;
                resolve(responseURL);
              });
            })
      ).subscribe();
    });*/
  }

  checkPost(form: NgForm) {
    if (form.valid) {
      this.postForm = form;
      let newPost = {...this.post, ...{userUid: this.user.uid} };
      /*if (this.uploadingPromise == null) {
        newPost =  {...this.post, ... {userUid: this.user.uid}};
        this.newPost(newPost);
      } else {
        this.uploadingPromise.then((response) => {
          newPost =  {...this.post, ...{userUid: this.user.uid} };
          
        }).catch((error) => console.error(error));
      }*/
      if(this.photo){
        this.uploadingPhoto = true;
        this.postsService.uploadPostPhoto(this.photo, this.user.uid).snapshotChanges().pipe(
            finalize(() => {
              this.postsService.fileRef.getDownloadURL().subscribe((responseURL) => {
                newPost.photoURL = responseURL;
                this.uploadingPhoto = false;
                this.addNewPost(newPost);
              });
            })
        ).subscribe();
    } else {
      this.addNewPost(newPost);
      }
    }
  }

  addNewPost(newPost) {
    this.postForm.reset();
    this.postsService.newPost({...newPost, ...this.type}).subscribe(response => {
      console.log('new post has been posted', response);
      const newDonation = response.response;
      const {posts, typeUser, ...user} = this.user;
      newDonation.user = user;
      newDonation.commentPosts = [];
      this.uploadComplete(newDonation);
      this.cleanForm();
      this.postsService.closeNav();
    }, error => console.log(error));
  }

  uploadComplete(newPost) {
    this.uploaded.emit(newPost);
  }
  
  public closeNav(){
    if(this.post.photoURL){
      this.postsService.deletePhoto(this.post.photoURL);
      this.photo = null;
      this.post.photoURL = '';
    }
    this.postsService.closeNav();
  }

  public cleanForm() {
    this.photo = null;
    this.uploadingPromise = null;
    this.post.photoURL = '';
  }

}
