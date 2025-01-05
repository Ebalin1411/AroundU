import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreService } from './service/store.service';
import { AreaNames, CategoryNames, Store } from './models/storemodel';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  CategoriesNameArr: CategoryNames[] = [];
  StoresInfoArr: Store[] = [];
  CategoryOptions: string[] = [];
  SubCategoryOptions: string[] = [];
  AreaInfoArr: AreaNames[] = [];
  AreaNameOptions: string[] = [];
  SelectedAreaDetail: any;
  StoreInfoFormGroup: FormGroup;
  CategoryName: string = '';
  SubCategoryName: string = '';
  SelectedCity: string = '';
  SelectedState: string = '';
  SelectedPin: string = '';
  form: any;
  isSubmitting: any;
  fileToUpload: File | null = null;
  imageFileName: string = '';
  router: any;
  constructor(
    private StrService: StoreService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.StoreInfoFormGroup = this.fb.group({
      Id: [''],
      Name: new FormControl('', [Validators.required]),
      OwnerName: new FormControl(''),
      ContactNumberOne: new FormControl(''),
      ContactNumberTwo: new FormControl(''),
      CategoryName: new FormControl(''),
      SubCategoryName: new FormControl(''),
      Tags: new FormControl('', [Validators.required]),
      Address: new FormControl('', [Validators.required]),
      StreetName: new FormControl(''),
      AreaName: new FormControl(),
      City: new FormControl(''),
      State: new FormControl(''),
      Pin: new FormControl(''),
      LandMark: new FormControl(),
      GeoLocation: new FormControl('', [Validators.required]),
      OpenTime: new FormControl('09:00', [Validators.required]),
      CloseTime: new FormControl('10:00', [Validators.required]),
      StoreImage: '',
    });
  }
  ngOnInit(): void {
    this.getCategoriesName();
    this.getAreaDetails();
    this.onAreaSelect();
  }

  onCategorySelect(): void {
    this.CategoryName = this.StoreInfoFormGroup.get('CategoryName')?.value;
    console.log('Selected Value:', this.CategoryName);
  }
  onSubCategorySelect(): void {
    this.SubCategoryName =
      this.StoreInfoFormGroup.get('SubCategoryName')?.value;
    console.log('Selected Value:', this.SubCategoryName);
  }
  onAreaSelect(): void {
    const AreaName = this.StoreInfoFormGroup.get('AreaName')?.value;
    this.SelectedAreaDetail = this.AreaInfoArr.find(
      (area) => area.AreaName === AreaName
    );
    const selectedDetails = this.SelectedAreaDetail;
    this.SelectedCity = selectedDetails?.city || '';
    this.SelectedState = selectedDetails?.State || '';
    this.SelectedPin = selectedDetails?.pin || '';
  }

  getStoreInfo() {
    this.StrService.GetStores().subscribe((response) => {
      this.StoresInfoArr = response;
      this.AreaNameOptions;
    });
  }
  getCategoriesName() {
    this.StrService.getCategoriesName().subscribe((resp) => {
      this.CategoriesNameArr = resp;
      this.CategoryOptions = Array.from(
        new Set(resp.map((item) => item.CategoryName))
      );
      this.SubCategoryOptions = Array.from(
        new Set(resp.map((item) => item.SubCategoryName))
      );
    });
  }
  getAreaDetails() {
    this.StrService.getAllAreaDetails().subscribe((respData) => {
      this.AreaInfoArr = respData;
      this.AreaNameOptions = Array.from(
        new Set(respData.map((item) => item.AreaName))
      );
    });
  }
  getStoreLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.StoreInfoFormGroup.get('GeoLocation')?.setValue(
        position.coords.latitude + ',' + position.coords.longitude
      );
    });
  }
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileToUpload = input.files[0];
      this.imageFileName = input.files[0].name;
    } else {
      this.fileToUpload = null;
      this.imageFileName = '';
    }
  }

  OnSubmit() {
    if (this.StoreInfoFormGroup.valid) {
      const formStoredStoreValue = this.StoreInfoFormGroup.value;
      const formatedStartTime = `${formStoredStoreValue.OpenTime} AM`;
      const formatedEndTime = `${formStoredStoreValue.CloseTime} PM`;
      const payload = {
        Id: formStoredStoreValue.Id,
        Name: formStoredStoreValue.Name,
        OwnerName: formStoredStoreValue.OwnerName,
        ContactNumberOne: formStoredStoreValue.ContactNumberOne,
        ContactNumberTwo: formStoredStoreValue.ContactNumberTwo,
        CategoryName: this.CategoryName,
        SubCategoryName: this.SubCategoryName,
        Tags: formStoredStoreValue.Tags,
        Address: formStoredStoreValue.Address,
        StreetName: formStoredStoreValue.StreetName,
        AreaName: formStoredStoreValue.AreaName,
        City: formStoredStoreValue.City,
        State: formStoredStoreValue.State,
        Pin: formStoredStoreValue.Pin,
        LandMark: formStoredStoreValue.LandMark,
        GeoLocation: formStoredStoreValue.GeoLocation,
        OpenTime: formatedStartTime,
        CloseTime: formatedEndTime,
        StoreImage: this.imageFileName,
      };

      this.StrService.CreateStoreInfo(payload).subscribe(
        (response) => {
          console.log('inside Create Store Info', response);
          alert('Store information added successfully');
          window.location.reload();
        },
        (errors) => {
          console.error('Error saving  Store data:', errors);
        }
      );
    } else {
      console.error('Please Fill the Survey  Form...');
    }
  }
  title = 'AroundU';
}
