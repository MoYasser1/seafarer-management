import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Auth components
import { LoginComponent } from './auth/login/login';
import { AuthService } from './auth/auth';

// Seafarer components
import { SeafarerListComponent } from './seafarers/seafarer-list/seafarer-list';
import { SeafarerFormComponent } from './seafarers/seafarer-form/seafarer-form';
import { SeafarerService } from './seafarers/services/seafarer';

// Interceptors
import { TokenInterceptor } from './shared/interceptors/token-interceptor';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SeafarerListComponent,
        SeafarerFormComponent
    ],
    imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    RouterModule
],
    providers: [
        AuthService,
        SeafarerService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
