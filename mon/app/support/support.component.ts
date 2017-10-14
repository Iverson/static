import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { DATA_MOCK } from './data.mock'
import { menuAnimation } from '../shared/animation/menu.animation'
import { BaseComponent } from '../base.component'

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.less'],
  animations: [
    menuAnimation
  ]
})
export class SupportComponent extends BaseComponent {
  dataMock = DATA_MOCK
}
