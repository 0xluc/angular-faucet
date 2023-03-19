import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    InputNumberModule,
    FormsModule
  ],
  exports:[
    WalletComponent
  ]
})
export class WalletModule { }
