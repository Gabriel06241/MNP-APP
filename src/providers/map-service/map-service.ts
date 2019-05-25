import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MapServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello MapServiceProvider Provider');
  }

}
