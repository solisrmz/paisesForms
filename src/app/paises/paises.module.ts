import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaisesRoutingModule } from './paises-routing.module';
import { SelectorComponent } from './pages/selector/selector.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [SelectorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaisesRoutingModule
  ]
})
export class PaisesModule { }
