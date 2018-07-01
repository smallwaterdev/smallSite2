import { Injectable } from '@angular/core';
import {Content} from '../data-structures/Content';

class ContentList{
  sessionId: string = "";
  contentIds: string[] = [];
}
class ContentListQueue{
  __inner_array:ContentList[];
  __limit: number;
  __contents: Map<string, Content>;
  __content_counters: Map<string, number>;
  constructor(limit: number){
    this.__limit = limit;
    this.__inner_array = []; 
    this.__contents = new Map<string, Content>();
    this.__content_counters = new Map<string, number>();
  }
  __store_content(id: string, content: Content){
    let value = this.__content_counters.get(id);
    if(value === undefined){
      this.__content_counters.set(id, 1);
      this.__contents.set(id, content);
    }else{
      this.__content_counters.set(id, value + 1);
    }
  }

  __remove_content(id: string): Content{
    let value = this.__content_counters.get(id);
    if(value === undefined){
      return undefined;
    }else if(value > 1){
      this.__content_counters.set(id, value -1);
      return this.__contents.get(id);
    }else{
      let result = this.__contents.get(id);
      this.__content_counters.delete(id);
      this.__contents.delete(id);
      return result;
    }
  }
  push(sessionId: string, contents: Content[]){
    if(this.__inner_array.length >= this.__limit){
      this.pop();
    }
    let content_ids: string[] = [];
    contents.forEach(ele=>{
      this.__store_content(ele._id, ele);
      content_ids.push(ele._id)
    });
    this.__inner_array.push({sessionId: sessionId, contentIds: content_ids});
  }

  pop(): Content[]{
    let result: Content[] = [];
    let contentList =  this.__inner_array.splice(0,1)[0];
    if(!contentList){
      return result;
    }
    contentList.contentIds.forEach(id=>{
      result.push(this.__remove_content(id));
    });
    return result;
  }

  getContent(id: string): Content{
    return this.__contents.get(id);
  }

  getContentList(sessionId: string): Content[]{
    for(let item of this.__inner_array){
      if(item.sessionId === sessionId){
        let results : Content[]= [];
        item.contentIds.forEach(id=>{
          results.push(this.__contents.get(id));
        });
        console.log(`List hit ${sessionId}`);
        return results;
      }
    }
    return undefined;
  }

}

@Injectable({
  providedIn: 'root'
})

export class LocalCacheService {
  contentsQueue: ContentListQueue;
  constructor() { 
    console.log('Cache created')
    this.contentsQueue = new ContentListQueue(20);
  }
  // return undefined or content object
  getContentById(id: string): Content{
    
    return this.contentsQueue.getContent(id);
  }

  getContentListByUrl(url: string): Content[]{
    
    return this.contentsQueue.getContentList(url);
  }

  storeContentList(sessionid: string, contents: Content[]){
    console.log(`Cache ${sessionid}`);
    this.contentsQueue.push(sessionid, contents);
  }
}

