import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MaterialDevKitModule } from '@shared/material-devkit/material-devkit.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule],
  exports: [
    SimpleNotificationsModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDevKitModule
  ]
})
export class SharedModule {
}
