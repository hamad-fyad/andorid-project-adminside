import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchEngineService {

  constructor(private firestore: AngularFirestore) { }
  getseachterms(): Observable<any[]> {
    return this.firestore.collection("searchStats").valueChanges();
  }
  getWords():Observable<any[]>{
    return this.firestore.collection("Words").valueChanges();
  }
 
}
