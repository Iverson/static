import * as d3 from 'd3'
import { Area, Line } from 'd3-shape'
import { Selection, BaseType } from 'd3-selection'
import { Input } from '@angular/core'

import * as Chart from '../chart'
import { BaseChartSerieView, LEGEND_NOWRAP_WORD_LENGTH } from '../base-chart-serie'
import { BarChartComponent } from './bar-chart.component'

export class BarChartSerieView extends BaseChartSerieView {
  private legendLineHeight: number

  constructor(
    protected chart: BarChartComponent,
    protected model: Chart.Serie,
  ) {
    super(chart, model)
  }

  render() {
    const self = this

    this.chart.view.g.selectAll('.bar')
      .data(this.model.data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${this.chart.x(d.name)}, ${this.chart.y(0)})`)
        .attr('y', d => this.chart.y(d.y))
        .append('rect')
          .attr('width', this.chart.x.bandwidth())
          .attr('height', 0)
          .attr('fill', (d, index, groups) => `url(#gradient-${index})`)


    const legendXDelta = this.chart.legendAlign === 'middle' ? this.chart.x.bandwidth() / 2 : 0
    const legendY = this.chart.view.height + this.chart.sizeY(this.chart.view.margin.bottom) / 3

    this.chart.view.g.selectAll('.legend-g')
      .data(this.model.data)
      .enter().append('g')
      .attr('class', 'legend-g')
      .attr('transform', d => `translate(${this.chart.x(d.name)}, ${legendY})`)
      .append('text')
        .attr('class', 'legend-text')
        .attr('text-anchor', this.chart.legendAlign)
        .attr('alignment-baseline', 'hanging')
        .attr('x', legendXDelta)
        .attr('fill', (d, index, groups) => this.chart.colors[index])
        .attr('opacity', 0)
        .selectAll('tspan')
          .data((d) => {
            return d.name.split(' ')
              .map((w, i, array) => {
                const next = array[i + 1]
                if (w && i < array.length - 1 && (next.length + w.length) < LEGEND_NOWRAP_WORD_LENGTH) {
                  array[i + 1] = null
                  return [w, next].join(' ')
                } else {
                  return w
                }
              })
              .filter(String)
          }
        )
        .enter().append<SVGTSpanElement>('tspan')
          .text(d => d)
          .attr('x', legendXDelta ? null : 0)
          .attr('dx', legendXDelta ? 10 : null)
          .attr('dy', function(da, index) {
            self.legendLineHeight = (this.parentNode as any).getBBox().height
            return !legendXDelta && index > 0 ? self.legendLineHeight * 1.1 : 0
          })

    this.chart.view.g.selectAll('.bar')
      .data(this.model.data)
      .append('text')
        .attr('class', 'data-label')
        .attr('text-anchor', 'middle')
        .attr('x', d => this.chart.x.bandwidth() / 2)
        .attr('y', d => -this.chart.sizeY('5%'))
        .attr('fill', (d, index, groups) => this.chart.colors[index])
        .attr('opacity', 0)
        .attr('dy', -this.chart.sizeY('3%'))

    const borderWidth = this.chart.sizeY('1.2%')

    this.chart.view.g.selectAll('.bar')
      .append('rect')
      .attr('class', 'bar-border')
      .attr('width', this.chart.x.bandwidth())
      .attr('height', borderWidth)
      .attr('y', -borderWidth)
      .attr('fill', (d, index, groups) => this.chart.colors[index])

    this.update(this.model)
  }

  update(model: Chart.Serie) {
    const self = this
    this.model = model

    this.chart.view.g.selectAll('.bar')
      .data(model.data)
      .transition()
      .delay((d, index) => index * 150)
      .duration(1000)
      .attr('transform', d => `translate(${this.chart.x(d.name)}, ${this.chart.y(d.y)})`)

    this.chart.view.g.selectAll('.bar')
      .data(model.data)
      .select('rect')
        .transition()
        .delay((d, index) => index * 150)
        .duration(1000)
        .attr('height', d => this.chart.view.height - this.chart.y(d.y))

    this.chart.view.g.selectAll('.bar')
      .data(model.data)
      .select('.data-label')
        .text(d => d.y)
        .transition()
        .delay((d, index) => 1000 + index * 150)
        .duration(1000)
        .attr('opacity', 1)
        .attr('dy', 0)

    this.chart.view.g.selectAll('.legend-text')
      .data(model.data)
      .attr('y', function<SVGTextELement>(da, index) {
        return self.legendLineHeight - this.getBBox().height
      })
      .transition()
      .delay((d, index) => 1000 + index * 150)
      .duration(1000)
      .attr('opacity', 1)
  }

  destroy() {
  }
}
