import { Component, OnInit } from '@angular/core';
import {Content }from '../data-structures/Content';
import { WatchLaterService } from '../services/watch-later.service';
import { FormattingService } from '../services/formatting.service';
import { ScrollingService } from '../services/scrolling.service';
@Component({
  selector: 'app-watch-later-list',
  templateUrl: './watch-later-list.component.html',
  styleUrls: ['./watch-later-list.component.scss']
})
export class WatchLaterListComponent implements OnInit {

  constructor(
    private watchLater: WatchLaterService,
    private formatter: FormattingService,
    private scrolling: ScrollingService
  ) { }
  contents: Content[] = []; 
  ngOnInit() {
    this.scrolling.stopScrolling();
    this.scrolling.goTop();
    this.contents = this.watchLater.getAll();
  }
  removeWatchLater(no: number, id: string){
    this.contents.splice(no, 1);
    this.watchLater.remove(id);
  }

}
