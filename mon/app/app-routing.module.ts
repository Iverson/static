import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { SupportComponent } from './support/support.component'
import { SalesComponent } from './sales/sales.component'
import { AffilateComponent } from './affilate/affilate.component'
import { Affilate2Component } from './affilate2/affilate2.component'

const appRoutes: Routes = [
  { path: '', redirectTo: 'support', pathMatch: 'full' },
  { path: 'support/:id', component: SupportComponent },
  { path: 'support', redirectTo: 'support/all' },
  { path: 'sales/:id', component: SalesComponent },
  { path: 'sales', redirectTo: 'sales/vip' },
  { path: 'affilate/:id', component: AffilateComponent },
  { path: 'affilate', redirectTo: 'affilate/all' },
  { path: 'affilate2/:id', component: Affilate2Component },
  { path: 'affilate2', redirectTo: 'affilate2/all' },
  { path: '**', redirectTo: 'support/all' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  static components = [
    SupportComponent,
    SalesComponent,
    AffilateComponent,
    Affilate2Component
  ]
}
