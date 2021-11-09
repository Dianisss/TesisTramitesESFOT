import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { last, map } from 'rxjs/operators';
import auth from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  url: string = 'https://us-central1-esfot-web.cloudfunctions.net/CreateMail';
  url2: string = 'https://us-central1-esfot-web.cloudfunctions.net/DeleteMail';

  private UserRoles = 'nodata';

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore, private http: HttpClient, private snack: MatSnackBar, private router: Router) { }

  loginMailUser(mail, pass){
    return this.afsAuth.signInWithEmailAndPassword(mail, pass)
  }

  resetPassword(mail)
  {
    this.afsAuth.sendPasswordResetEmail(mail)
    this.snack.open('Si su email es valido, se envio un correo para reestablecer la contraseña', '', {duration: 2500})
  }

  createMailUser(mail, pass, name, lastname, roles, cedula?:'', celularm?:'', dir?:'', url?:'', birthdate?:''){
    let errorC = false;
    let msg = ''
    let body={
        mail: mail,
        pwd: pass,
        name: name,
        lastname: lastname,
        birthdate: '',
        cedula: '',
        celular: '',
        dir: '',
        role: roles,
        imgUrl: '',
        enabled: false
    }
    return this.http.post(this.url, body).toPromise()
    .catch(msg =>{
      console.log(msg);
      if(msg.error == 'ALREADY_EXISTS'){
        errorC = true;
        this.snack.open('Ya existe un usuario con este correo', '', {duration: 3000});
        return
      }
    }).finally(() => {
      if(!errorC)
      {
        this.snack.open('Usuario creado con exito.', '', {duration: 3000})
        this.router.navigate(['/login']);
      }

    });
  }

  sendMailVerification(mail)
  {
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://esfot-web.firebaseapp.com/#/login',
      // This must be true.
      handleCodeInApp: true,

      //dynamicLinkDomain: 'example.page.link'
    };

    this.afsAuth.sendSignInLinkToEmail(mail, actionCodeSettings).then(result =>{
      console.log(result);
    })
  }

  deleteUser(uid){
    let body={uid: uid}
    return this.http.post(this.url2, body).toPromise()
    .catch(msg =>{
      console.log(msg);
    }).finally(() => {
      this.snack.open('Usuario eliminado con exito', '', {duration: 2000});
    });
  }

  logoutUser(){
    return this.afsAuth.signOut();
  }

  isAuth(){
  return this.afsAuth.authState.pipe(map(auth => auth ));
  }

  updateUserRoles(role){
  this.UserRoles = role;
  }

  getUserRoles(){
  return this.UserRoles;
  }

  listUsers(){
    return this.afs.collection<UserInterface>(`users`).valueChanges();
  }

  getUserData(userUid){
    return this.afs.doc<UserInterface>(`users/${userUid}`).valueChanges()
  }

  updateUser(userUid, name, lastname, usrUrl){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userUid}`);
    const data = {
      name: name,
      lastname: lastname,
      usrUrl: usrUrl
    }
    return userRef.set(data, { merge: true})
  }

  updateUserCarnet(userUid, carnetUrl){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userUid}`);
    const data = {
      carnetUrl: carnetUrl
    }
    return userRef.set(data, { merge: true})
  }

  enableUser(userUid){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userUid}`);
    const data = {
      enabled: true
    }
    return userRef.set(data, { merge: true})
  }

  createCategory(catName, desc, cover){
    const res = this.afs.collection('Category').add({
      name: catName,
      desc: desc,
      cover: cover,
      subcats: []
    })
    console.log(res.then(result =>{
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${result.id}`);
      const data = {
        id: result.id
      }
      return userRef.update(data);
    }))
  }

  updateCategory(id, catName, desc, cover){
    console.log(id);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${id}`);
    const data = {
      name: catName,
      desc: desc,
      cover: cover
    }
    return userRef.set(data, { merge: true})
  }

  updateSubCategory(id, cats){
    console.log(id);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${id}`);
    const data = {
      subcats: cats
    }
    return userRef.set(data, { merge: true})
  }

  updateTema(id, tema)
  {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${id}`);
    const data = {
      temas: tema
    }
    return userRef.set(data, { merge: true})
  }

  listCats(){
    return this.afs.collection<UserInterface>(`Category`).valueChanges();
  }

  listSuggest(){
    return this.afs.collection<UserInterface>(`Sugerencia`).valueChanges();
  }

  listAlerts(){
    return this.afs.collection<UserInterface>(`alertas`).valueChanges();
  }

  createSuggest(title, desc, cause, id){
    const res = this.afs.collection('Sugerencia').add({
      title: title,
      desc: desc,
      reason: cause,
      unread: false,
      state: 'Pendiente',
      stateReason: '',
      uid: id
    })
    console.log(res.then(result =>{
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Sugerencia/${result.id}`);
      const data = {
        id: result.id
      }
      return userRef.update(data);
    }))
  }

  createAlert(desc, reason){
    const res = this.afs.collection('alertas').add({
      desc: desc,
      reason: reason,
      time: new Date()
    })
    console.log(res.then(result =>{
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`alertas/${result.id}`);
      const data = {
        id: result.id
      }
      return userRef.update(data);
    }))
  }

  updateSuggest(id, desc, state)
  {
    console.log(id)
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Sugerencia/${id}`);
    const data = {
      state: state,
      stateReason: desc,
      unread: true
    }
    return userRef.set(data, { merge: true})
  }

  markReadSuggets(id)
  {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Sugerencia/${id}`);
    const data = {
      unread: false
    }
    return userRef.set(data, { merge: true})
  }

  markReadAlert(vistos, uid)
  {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    const data = {
      vistos: vistos
    }
    return userRef.set(data, { merge: true})
  }

  deleteSuggest(id)
  {
    return this.afs.collection(`Sugerencia`).doc(id).delete();
  }

  deleteCategory(id){
    return this.afs.collection(`Category`).doc(id).delete();
  }

  pushNewTema(id, temas){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${id}`);
    const data = {
      temas: temas
    }
    return userRef.set(data, { merge: true})
  }


}
