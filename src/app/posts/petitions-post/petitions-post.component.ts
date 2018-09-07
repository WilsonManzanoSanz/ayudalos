import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {PetitionsService} from '../shared/petitions.service';
import {SidenavService} from '../../ui/shared/sidenav.service';
import {AuthService, User} from '../../core/auth.service';
import {Router} from '@angular/router';
import { NgForm} from '@angular/forms';
import {  finalize } from 'rxjs/operators';

@Component({
  selector: 'app-petitions-post',
  templateUrl: './petitions-post.component.html',
  styleUrls: ['./petitions-post.component.css']
})
export class PetitionsPostComponent implements OnInit {
  
   public petitionForm: NgForm;
   private photo: any;
   public uploadingPhoto: Boolean;
   public uploadingPromise = null;

   @Input() type: any;
   @Input() user: any;
   @Input() petition: any = {};
   @Output()
  uploaded = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    public sidenavService: SidenavService,
    private router: Router,
    public petitionsService: PetitionsService,
    ) {
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
      this.petitionsService.uploadPetitionPhoto(this.photo, this.user.uid).snapshotChanges().pipe(
            finalize(() => {
              this.petitionsService.fileRef.getDownloadURL().subscribe((responseURL) => {
                this.petition.photoURL = responseURL;
                this.uploadingPhoto = false;
                resolve(responseURL);
              });
            })
      ).subscribe();
    });
  }

  checkPetition(form: NgForm) {
    if (form.valid) {
      this.petitionForm = form;
      let newPetition;
      if (this.uploadingPromise == null) {
        newPetition =  {...this.petition, ... {userUid: this.user.uid}};
        this.newPetition(newPetition);
      } else {
        this.uploadingPromise.then((response) => {
          newPetition =  {...this.petition, ...{userUid: this.user.uid} };
          this.newPetition(newPetition);
        }).catch((error) => console.error(error));
      }
    }
  }

  newPetition(newPetition) {
    this.petitionForm.reset();
    this.petitionsService.newPetition({...newPetition, ...this.type}).subscribe(response => {
      console.log('new petition has been posted', response);
      const newDonation = response.response;
      const {petitions, typeUser, ...user} = this.user;
      newDonation.user = user;
      newDonation.commentPosts = [];
      this.uploadComplete(newDonation);
      this.cleanForm();
      this.petitionsService.closeNav();
    }, error => console.log(error));
  }

  uploadComplete(newPetition) {
    this.uploaded.emit(newPetition);
  }

  public closeNav(){
    if(this.petition.photoURL){
      this.petitionsService.deletePhoto(this.petition.photoURL);
      this.photo = null;
      this.petition.photoURL = '';
    }
    this.petitionsService.closeNav();
  }

  public cleanForm() {
    this.photo = null;
    this.uploadingPromise = null;
    this.petition.photoURL = '';
  }

}
