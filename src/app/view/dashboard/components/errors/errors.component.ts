import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { StackTraceService } from '@core/services/stack-trace/stack-trace.service';
import { ErrorsBusInterface } from '@core/services/stack-trace/stack-trace.interface';
import { ErrorsQueryParams } from '@app/view/dashboard/components/errors/errors-query.enum';

@Component({
  selector: 'errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit, OnDestroy {

  public code: string;
  public error: Error;
  public subscription: Subscription;

  constructor(private route: ActivatedRoute, private stackTrace: StackTraceService) {
    this.subscription = this.stackTrace.stream
        .subscribe((errorValue: ErrorsBusInterface) => {
          const value: Partial<ErrorsBusInterface> = errorValue || {};
          this.error = value.error;
        });
  }

  public ngOnInit() {
    this.route.queryParams.subscribe(
        (params: Params) => this.code = params[ErrorsQueryParams.CODE]
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
