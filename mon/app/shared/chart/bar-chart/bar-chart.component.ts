import * as d3 from 'd3'
import { Area, Line } from 'd3-shape'
import { ScaleBand, ScaleLinear } from 'd3-scale'
import { Selection, BaseType } from 'd3-selection'

import * as Chart from '../chart'
import { BarChartSerieView } from './bar-chart-serie'
import { BaseChartComponent, BaseChartViewOptions } from '../base-chart.component'
import { ViewEncapsulation, Component, Input } from '@angular/core'

@Component({
  selector: 'chart[type="bar"]',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['../line-chart/line-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent extends BaseChartComponent {
  @Input() legendAlign = 'middle'

  x: ScaleBand<string>
  y: ScaleLinear<number, number>
  view: BaseChartViewOptions = {
    width: 0,
    height: 0,
    margin: {top: '12%', right: '5%', bottom: '14%', left: '5%'}
  }
  gradientRelative = true
  gradientStops = [
    {offset: '0%', opacity: '0.8'},
    {offset: '20%', opacity: '0.7'},
    {offset: '50%', opacity: '0.3'},
    {offset: '70%', opacity: '0'},
  ]

  addAxises() {
    this.x = d3.scaleBand()
      .rangeRound([0, this.view.width])
      .padding(0.15)

    this.y = d3.scaleLinear()
      .rangeRound([this.view.height, 0])

    this.update(this.series)
  }

  update(series: Chart.Serie[]) {
    this.x.domain(series[0].data.map(d => d.name))
    this.y.domain([
      0,
      d3.max(series, s => d3.max(s.data, d => d.y))
    ])
  }

  addSerie(serie: Chart.Serie, index: number) {
    this.serieViews.push(new BarChartSerieView(this, serie))
  }

}
