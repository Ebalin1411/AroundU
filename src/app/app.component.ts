import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreService } from './service/store.service';
import { Store } from './models/storemodel';
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
  StoresInfoArr: Store[] = [];
  StoreInfoFormGroup: FormGroup;
  form: any;
  isSubmitting: any;
  fileToUpload: File | null = null;
  imageFileName: string = '';
  constructor(
    private StrService: StoreService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.StoreInfoFormGroup = this.fb.group({
      Id: [''],
      StoreName: new FormControl('', [Validators.required]),
      OwnerName: new FormControl(''),
      Tags: new FormControl('', [Validators.required]),
      Address: new FormControl('', [Validators.required]),
      GeoLocation: new FormControl('', [Validators.required]),
      OpenTime: new FormControl('09:00', [Validators.required]),
      CloseTime: new FormControl('10:00', [Validators.required]),
      StoreImage: '',
    });
  }
  ngOnInit(): void {
    this.getStoreInfo();
  }
  getStoreInfo() {
    this.StrService.GetStores().subscribe((response) => {
      this.StoresInfoArr = response;
    });
  }
  getStoreLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.StoreInfoFormGroup.get('GeoLocation')?.setValue(
        position.coords.latitude + ' ' + position.coords.longitude
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
        StoreName: formStoredStoreValue.StoreName,
        OwnerName: formStoredStoreValue.OwnerName,
        Tags: formStoredStoreValue.Tags,
        Address: formStoredStoreValue.Address,
        GeoLocation: formStoredStoreValue.GeoLocation,
        OpenTime: formatedStartTime,
        CloseTime: formatedEndTime,
        StoreImage: this.imageFileName,
      };
      console.log(payload);

      this.StrService.CreateStoreInfo(payload).subscribe(
        (response) => {
          console.log(response);
          alert('Store information added successfully');
          this.StoreInfoFormGroup.reset();
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
