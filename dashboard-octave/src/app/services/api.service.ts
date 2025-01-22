import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://octave-api.sierrawireless.io/v5.0/gustave_eiffelssio/event?path=/gustave_eiffelssio/devices/devuceregani/environment'; 
  constructor(private http: HttpClient) {}
  getData(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('X-Auth-User', 'mohamed_branki_regani');
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('X-Auth-Token', '85o6RH5fTg1JNHi6GPVZhRalHJoZ8kgn');
  
    return this.http.get<any>(this.apiUrl, { headers });
  }
}
