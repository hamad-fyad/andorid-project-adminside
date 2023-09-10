import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BuildingsService {

  constructor(private firestore: AngularFirestore) { }
  getbuildings(): Observable<any[]> {
    return this.firestore.collection("Buildings").valueChanges();
  }
}
