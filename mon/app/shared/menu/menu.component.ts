import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core'
import { inDownListAnimation } from '../animation/slide.animation'


export interface TabItem {
  name: string
  route: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  @Input() tabs: TabItem[] = []
  // @HostBinding('@menuAnimation') public animate = true

  constructor() { }

  ngOnInit() {
  }
}
