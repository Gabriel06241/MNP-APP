import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RoutineProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RoutineProvider Provider');
  }

}
