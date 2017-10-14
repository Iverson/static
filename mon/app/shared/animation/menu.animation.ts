import { trigger, transition, query, useAnimation, style, animate, stagger } from '@angular/animations'

export const duration = '300ms cubic-bezier(.35,0,.25,1)'

export const menuAnimation = trigger('menuAnimation', [
  transition(':enter', [
    query('.logo, .chart-tabs-item, .chart-tabs-item span', [
      style({ opacity: 0 }),
    ]),
    style({ transform: 'translateX(100%)' }),

    animate(200, style({transform: 'translateX(100%)'})),
    animate(duration, style({ transform: 'translateX(0)' })),

    query('.logo', [
      animate(duration, style({ opacity: 1 })),
    ]),

    query('.chart-tabs-item', [
      stagger(150, [
        animate(duration, style({ opacity: 1 })),
      ])
    ], {optional: true}),

    query('.chart-tabs-item span', [
      stagger(150, [
        animate(duration, style({ opacity: 1 })),
      ])
    ], {optional: true})
  ])
])
