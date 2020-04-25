import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContatosComponent } from './contatos/contatos.component';
import { TituloComponent } from './_shared/titulo/titulo.component';
import { FooterComponent } from './_shared/footer/footer.component';

import { DateTimeFormatPipePipe } from './_helps/DateTimeFormatPipe.pipe';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { EventoService } from './_services/evento.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { EventoEditComponent } from './eventos/evento-edit/evento-edit.component';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        EventosComponent,
        EventosComponent,
        PalestrantesComponent,
        DashboardComponent,
        ContatosComponent,
        DateTimeFormatPipePipe,
        TituloComponent,
        FooterComponent,
        UserComponent,
        RegistrationComponent,
        LoginComponent,
        EventoEditComponent
    ],
    imports: [
        BrowserModule,
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        ToastrModule.forRoot({
          timeOut: 3000,
          preventDuplicates: true,
          progressBar: true
        }), // ToastrModule added
        TabsModule.forRoot(),
        NgxMaskModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
    ],
    providers: [
      EventoService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
