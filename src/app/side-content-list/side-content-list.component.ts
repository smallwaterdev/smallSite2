import { Component, OnInit, Input } from '@angular/core';
import { Content } from '../data-structures/Content';
import {FormattingService} from '../services/formatting.service';
@Component({
  selector: 'app-side-content-list',
  templateUrl: './side-content-list.component.html',
  styleUrls: ['./side-content-list.component.scss']
})
export class SideContentListComponent implements OnInit {

  constructor(public formatter: FormattingService) { }
  @Input('content-list') contents: Content [];
  ngOnInit() {

  }
  

}
