import { MetamaskComponent } from './metamask/metamask.component';
import { MetamaskModule } from './metamask/metamask.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MetamaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
