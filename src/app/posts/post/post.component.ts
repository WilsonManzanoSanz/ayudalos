import {Component, OnInit, Input} from '@angular/core';
import {PostsService} from '../shared/posts.service';
import {SidenavService} from '../../ui/shared/sidenav.service';
import {AuthService, User} from '../../core/auth.service';
import {Router} from '@angular/router';
import { NgForm} from '@angular/forms';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

   public user: User = null;
   public post: any = {};
   public postForm: NgForm;
   private photo: any;
   public uploadedPhotoURL: string;
   public uploadingPhoto: Boolean;
   public uploadingPromise = null;
   @Input() type: any;

  constructor(
    private authService: AuthService,
    public sidenavService: SidenavService,
    private router: Router,
    public postsService: PostsService,
    ) {
      this.user = this.authService.getCurrentlyUser();
  }

  ngOnInit() {
  }

  addPhoto() {
    document.getElementById('fileToUpload').click();
    const fileInput = document.getElementById('fileToUpload');
    fileInput.addEventListener('change', (e: any) => this.saveFile(e.target.files[0]));
  }

  saveFile(file: any) {
    this.photo = file;
    this.uploadingPhoto = true;
    this.uploadingPromise = new Promise((resolve, reject) => {
      this.postsService.uploadPostPhoto(this.photo, this.user.uid).snapshotChanges().pipe(
            finalize(() => {
              this.postsService.fileRef.getDownloadURL().subscribe((responseURL) => {
                this.uploadedPhotoURL = responseURL;
                this.uploadingPhoto = false;
                resolve(responseURL);
              });
            })
      ).subscribe();
    });
  }

  checkPost(form: NgForm) {
    if (form.valid) {
      this.postForm = form;
      let newPost;
      if (this.uploadingPromise == null) {
        newPost =  {... form.value, ...this.user};
        this.newPost(newPost);
      } else {
        this.uploadingPromise.then((response) => {
          newPost =  {... form.value, ...this.user, photos: this.uploadedPhotoURL};
          this.newPost(newPost);
      });
      }
    }
  }

  newPost(newPost) {
    this.postForm.reset();
    this.postsService.newPost({...newPost, ...this.type}).then(response => {
      console.log('new post has been posted');
      this.cleanForm();
      this.postsService.closeNav();
    }).catch(error => {
      console.log(error);
    });
  }

  public cleanForm() {
    this.photo = null;
    this.uploadingPromise = null;
    this.uploadedPhotoURL = '';
  }

}
