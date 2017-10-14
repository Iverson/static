import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DATA_MOCK } from './data.mock'
import { menuAnimation } from '../shared/animation/menu.animation'
import { BaseComponent } from '../base.component'

@Component({
  selector: 'app-affilate',
  templateUrl: './affilate.component.html',
  animations: [
    menuAnimation
  ]
})
export class AffilateComponent extends BaseComponent {
  dataMock = DATA_MOCK
}
