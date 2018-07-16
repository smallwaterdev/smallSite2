import { Component, OnInit, Input } from '@angular/core';
import {Content} from '../data-structures/Content';
import {FormattingService} from '../services/formatting.service';
@Component({
  selector: 'app-content-info',
  templateUrl: './content-info.component.html',
  styleUrls: ['./content-info.component.scss']
})
export class ContentInfoComponent implements OnInit {
  @Input('content') content: Content;
  constructor(
    public formatter: FormattingService,
  ) { }

  ngOnInit() {
  }

}
