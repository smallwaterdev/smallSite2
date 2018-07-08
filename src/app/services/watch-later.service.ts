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
  __getIds(){
    let ids = localStorage.getItem('ids');
    if(ids === undefined){
      localStorage.setItem('ids', JSON.stringify([]));
      return [];
    }else{
      return JSON.parse(ids);
    }
  }
  __addContentId(id): boolean{
    let ids = this.__getIds();
    if(ids.indexOf(id) !== -1){
      return false;
    }
    ids.push(id);
    localStorage.setItem('ids', JSON.stringify(ids));
    return true;
  }
  __removeContentId(id: string){
    let ids = this.__getIds();
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
    let ids = this.__getIds().reverse();
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
    let ids = this.__getIds();
    return ids.indexOf(id) !== -1;
  }
}
