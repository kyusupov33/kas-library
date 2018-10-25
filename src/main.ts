import { environment } from '@env';
import { AppBootstrap } from '@app/app-bootstrap.class';
import { AppModule } from '@app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Bug: https://github.com/angular/angular-cli/issues/8234#issuecomment-340202362
const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

declare const module: any;
const isProd = environment.production;
const webpackModule = module;

AppBootstrap
  .switchProductionMode(isProd)
  .run(webpackModule, bootstrap);
