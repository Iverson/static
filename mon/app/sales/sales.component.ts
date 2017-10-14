import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DATA_MOCK } from './data.mock'
import { menuAnimation } from '../shared/animation/menu.animation'
import { BaseComponent } from '../base.component'

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.less'],
  animations: [
    menuAnimation
  ]
})
export class SalesComponent extends BaseComponent {
  dataMock = DATA_MOCK
}
