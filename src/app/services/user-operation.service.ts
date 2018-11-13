import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,of, Subscriber, Subject} from 'rxjs';
import {  Result } from '../data-structures/GeneralResult';
import {smallData_user_addr, urlPrefix} from './config';
import {LocalCacheService} from './local-cache.service';
import { WatchLaterService } from './watch-later.service';
import {User} from '../data-structures/User';
@Injectable({
  providedIn: 'root'
})

export class UserOperationService {


  smallData_user_addr:string = smallData_user_addr + urlPrefix;
  user: User = null;

  // Observable string sources
  private userMountEvt_ = new Subject<User>();
  private userUnMountEvt_ = new Subject<null>();

  public userMount$ = this.userMountEvt_.asObservable();
  public userUnMount$ = this.userUnMountEvt_.asObservable();

  constructor(
    private http: HttpClient
  ) { 
    
  }
  __notifyUserMountSubscribers(user: User){
    this.userMountEvt_.next(user);
  }
  __notifyUserUnMountSubscribers(){
    this.userUnMountEvt_.next(null);
  }

  /*init(){
    this.queryUserWithSession().subscribe(data=>{
      if(data){
        this.__notifyUserMountSubscribers(data);
      }else{
        this.__notifyUserUnMountSubscribers();
      }
    });
  }*/

  queryUserWithSession(){
    const httpObserver = {
      next: data=>{
        if(data.success && data.value){
          this.user = data.value;  
          this.__notifyUserMountSubscribers(data.value);
        }else{
          this.user = null;
          this.__notifyUserUnMountSubscribers();
        }
      },
      error: err=>{
        this.user = null;  
        this.__notifyUserUnMountSubscribers();
      }
    };
    let isLoginUrl = `${this.smallData_user_addr}/user/login/query`;
    this.http.post(isLoginUrl, {}, {withCredentials: true }).subscribe(httpObserver);
  }

  login(id: string, password): Observable<User>{
    const loginReq: Observable<User> = new Observable((observable)=>{
       const httpObserver = {
        next: data=>{
          if(data.success && data.value){
            this.user = data.value;
            observable.next(data.value);
            this.__notifyUserMountSubscribers(data.value);

          }else{
            this.user = null;
            observable.next(null);
            this.__notifyUserUnMountSubscribers();
          }
        },
        error: err=>{
          this.user = null;
          observable.next(null);
          this.__notifyUserUnMountSubscribers();
        }
      };
      /////// login now ///////////
      let loginUrl = `${this.smallData_user_addr}/user/login`;
      let value = {id: id, password: password};
      this.http.post(loginUrl, value, {withCredentials: true }).subscribe(httpObserver);
      //
    });
    return loginReq;
  }

  logout(): Observable<Result>{
    const logoutReq: Observable<Result> = new Observable((observable)=>{
      const httpObserver = {
       next: data=>{
        this.__notifyUserUnMountSubscribers();
         this.user = null;
         if(data.success){
           observable.next(data);
         }else{
           observable.next(data);
         }
       },
       error: err=>{
        this.__notifyUserUnMountSubscribers();
         this.user = null;
         observable.next({
           success: false,
           reasons:[err.message],
           value:null
         });
       }
     };
     /////// login now ///////////
     let loginUrl = `${this.smallData_user_addr}/user/logout`;
     this.http.post(loginUrl, {},{withCredentials: true }).subscribe(httpObserver);
     //
   });
   return logoutReq;
  }

  signup(username: string, email: string, password: string): Observable<User>{
    const loginReq: Observable<User> = new Observable((observable)=>{
      const httpObserver = {
       next: data=>{
         if(data.success && data.value){
           this.user = data.value;
           observable.next(data.value);
           this.__notifyUserMountSubscribers(data.value);

         }else{
           this.user = null;
           observable.next(null);
           this.__notifyUserUnMountSubscribers();
         }
       },
       error: err=>{
         this.user = null;
         observable.next(null);
         this.__notifyUserUnMountSubscribers();
       }
     };
     /////// signup now ///////////
     let loginUrl = `${this.smallData_user_addr}/user/signup`;
     let value = {username: username, email:email, password: password};
     this.http.post(loginUrl, value, {withCredentials: true }).subscribe(httpObserver);
     //
   });
   return loginReq;
    
  }
}
