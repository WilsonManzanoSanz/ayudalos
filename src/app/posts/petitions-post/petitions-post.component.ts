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
   public categories: any[] = [];
   public moneyRequired: Boolean = false;
   public image:any = null;

   @Input() type: any;
   @Input() user: any;
   @Input() petition: any = {category : null};
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
      this.petitionsService.uploadPetitionPhoto(this.photo, this.user.uid).snapshotChanges().pipe(
            finalize(() => {
              this.petitionsService.fileRef.getDownloadURL().subscribe((responseURL) => {
                this.petition.photoURL = responseURL;
                this.uploadingPhoto = false;
                resolve(responseURL);
              });
            })
      ).subscribe();
    });*/
  }

  checkPetition(form: NgForm) {
    console.log('try',form);
    if (form.valid) {
      this.petitionForm = form;
      this.petition.categoryDonationId = this.petition.category.id;
      //let newPetition = {...this.petition, ... {userUid: this.user.uid}, raised: Math.floor(Math.random() * this.petition.goal)};
      let newPetition = {...this.petition, ... {userUid: this.user.uid}, raised: 0};
      /*if (this.uploadingPromise == null) {
        this.newPetition(newPetition);
      } else {
        this.uploadingPromise.then((response) => {
          this.newPetition(newPetition);
        }).catch((error) => console.error(error));
      }*/
      if(this.photo){
        this.petitionsService.uploadPetitionPhoto(this.photo, this.user.uid).snapshotChanges().pipe(
              finalize(() => {
                this.petitionsService.fileRef.getDownloadURL().subscribe((responseURL) => {
                  newPetition.photoURL = responseURL;
                  this.uploadingPhoto = false;
                  this.newPetition(newPetition);
                });
              })
        ).subscribe();
      } else {
        this.newPetition(newPetition);
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
      newDonation.commentPetitions = [];
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
  
  onChange(value){
    //console.log(value);
    this.petition.categoryDonationId = this.petition.category.id;
    this.moneyRequired = false;
    if(value.moneyRequired){
      this.moneyRequired = true;
    }
  }

}
