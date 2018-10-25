import { ApplicationRef, enableProdMode, NgModuleRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';
import { environment } from '@env';

type BootstrapRef = () => Promise<NgModuleRef<any>>;

export class AppBootstrap {

  public static switchProductionMode(isProduction: boolean) {
    if (isProduction) {
      enableProdMode();
    }

    return this;
  }

  public static run(esModule, bootstrap: BootstrapRef) {
    if (environment.hmr && esModule['hot']) {
      this.hmrBootstrap(esModule, bootstrap);
    } else {
      bootstrap().then();
    }
  }

  public static hmrBootstrap(esModule, bootstrap: BootstrapRef) {
    let ngModule: NgModuleRef<any>;
    esModule.hot.accept();
    bootstrap().then((mod) => (ngModule = mod));
    esModule.hot.dispose(() => {
      const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
      const elements = appRef.components.map((c) => c.location.nativeElement);
      const makeVisible = createNewHosts(elements);
      ngModule.destroy();
      makeVisible();
    });
  }

}
