import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { FactureService } from './facture.service';
import { FournisseurService } from './fournisseur.service';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-top-right',
      timeOut: 8000
    })
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
