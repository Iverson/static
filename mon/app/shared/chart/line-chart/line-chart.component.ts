import * as d3 from 'd3'
import { Area, Line } from 'd3-shape'
import { ScaleTime, ScaleLinear } from 'd3-scale'
import { Selection, BaseType } from 'd3-selection'

import * as Chart from '../chart'
import { LineChartSerieView } from './line-chart-serie'
import { BaseChartComponent } from '../base-chart.component'
import { ViewEncapsulation, Component } from '@angular/core'

@Component({
  selector: 'chart[type="line"]',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent extends BaseChartComponent {
  x: ScaleTime<number, number>
  y: ScaleLinear<number, number>

  addAxises() {
    this.x = d3.scaleTime()
        .rangeRound([0, this.view.width])

    this.y = d3.scaleLinear()
        .rangeRound([this.view.height, 0])

    this.update(this.series)

    this.line = d3.line<Chart.Point>()
      .x(d => this.x(d.x))
      .y(d => this.y(d.y))

    this.area = d3.area<Chart.Point>()
      .x(d => this.x(d.x))
      .y1(d => this.y(d.y))
      .y0(this.y(0))
  }

  addSerie(serie: Chart.Serie, index: number) {
    serie.color = this.colors[index]
    serie.fill = `url(#gradient-${index})`
    this.serieViews.push(new LineChartSerieView(this, serie))
  }

  update(series: Chart.Serie[]) {
    this.x.domain([
      d3.min(series, s => d3.min(s.data, d => d.x)),
      d3.max(series, s => d3.max(s.data, d => d.x))
    ])

    this.y.domain([
      0,
      d3.max(series, s => d3.max(s.data, d => d.y))
    ])
  }

}
