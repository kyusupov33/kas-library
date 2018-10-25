import { ChangeDetectorRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';

export interface ViewerRouterParams {
  params: Params;
  queryParams: Params;
}

export abstract class Viewer implements OnInit, OnDestroy {

  public canViewContent: boolean;
  public route: ActivatedRoute;
  private sub: Subscription;
  private cd: ChangeDetectorRef;

  protected constructor(context: Injector) {
    this.route = context.get(ActivatedRoute);
    this.cd = context.get(ChangeDetectorRef);
  }

  public abstract emitRouterParams(params: Params, queryParams: Params);

  public ngOnInit() {
    this.sub = this.subscribeRouterParamsWithQueryParams()
      .subscribe(({ params, queryParams }) => {
        this.updateViewContent(params, queryParams);
      });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private subscribeRouterParamsWithQueryParams(): Observable<ViewerRouterParams> {
    return combineLatest(this.route.params, this.route.queryParams).pipe(
      map((result) => ({ params: result[0], queryParams: result[1] }))
    );
  }

  private updateViewContent(params: Params, queryParams: Params) {
    this.updateView(false);
    this.emitRouterParams(params, queryParams);
    window.setTimeout(() => this.updateView(true));
  }

  private updateView(state: boolean) {
    this.canViewContent = state;
    this.cd.detectChanges();
  }

}
