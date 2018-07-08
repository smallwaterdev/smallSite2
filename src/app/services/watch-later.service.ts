import { Injectable } from '@angular/core';
import {Content} from '../data-structures/Content';
@Injectable({
  providedIn: 'root'
})
export class WatchLaterService {

  constructor() { 
    if(localStorage.getItem('ids') !== undefined){

    }else{
      localStorage.setItem('ids', JSON.stringify([]));
    }
  }
  __addContentId(id): boolean{
    let ids = JSON.parse(localStorage.getItem('ids'));
    if(ids.indexOf(id) !== -1){
      return false;
    }
    ids.push(id);
    localStorage.setItem('ids', JSON.stringify(ids));
    return true;
  }
  __removeContentId(id: string){
    let ids = JSON.parse(localStorage.getItem('ids'));
    let p = ids.indexOf(id);
    if(p !== -1){
      ids.splice(p, 1);
    }
    localStorage.setItem('ids', JSON.stringify(ids));
  }
  store(content:Content){
    if(this.__addContentId(content._id)){
      localStorage.setItem(content._id, JSON.stringify(content));
    }
  }
  get(contentId: string):Content{
    return JSON.parse(localStorage.getItem(contentId));
  }
  getAll(): Content[]{
    let results :Content[] = [];
    let ids = JSON.parse(localStorage.getItem('ids')).reverse();
    for(let i of ids){
      results.push(this.get(i));
    }
    return results;
  }
  remove(contentId: string){
    this.__removeContentId(contentId);
    localStorage.removeItem(contentId);
  }
  removeAll(){
    localStorage.clear();
    localStorage.setItem('ids', JSON.stringify([]));
  }
  hasContent(id: string){
    let ids = JSON.parse(localStorage.getItem('ids'));
    return ids.indexOf(id) !== -1;
  }
}
