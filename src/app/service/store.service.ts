import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '../models/storemodel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = 'http://localhost:5013/api/Store';
  GetStores(): Observable<Store[]> {
    return this.httpClient.get<Store[]>(this.baseUrl);
  }

  CreateStoreInfo(storeInfo: Store): Observable<Store> {
    storeInfo.Id = '00000000-0000-0000-0000-000000000000';
    console.log('inside Create store info');
    return this.httpClient.post<Store>(this.baseUrl, storeInfo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
