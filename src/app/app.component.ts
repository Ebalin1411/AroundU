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
import { runPostSignalSetFn } from '@angular/core/primitives/signals';

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

  constructor(private StrService: StoreService, private fb: FormBuilder) {
    this.StoreInfoFormGroup = this.fb.group({
      Id: [''],
      StoreName: new FormControl('', [Validators.required]),
      OwnerName: new FormControl(''),
      Tags: new FormControl('', [Validators.required]),
      Address: new FormControl('', [Validators.required]),
      GeoLocation: new FormControl('', [Validators.required]),
      OpenTime: new FormControl('09:00', [Validators.required]),
      CloseTime: new FormControl('10:00', [Validators.required]),
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
      };
      console.log(payload);
      this.StrService.CreateStoreInfo(payload).subscribe(
        (response) => {
          console.log(response);
          this.getStoreInfo();
          console.log('store information added successfully', response);
          alert('Store information added successfully');
          this.StoreInfoFormGroup.reset();
        },
        (errors) => {
          console.error('Error saving date:', errors);
        }
      );
    } else {
      console.error('Please Fill up the Form...');
    }
  }
  title = 'AroundU';
}
