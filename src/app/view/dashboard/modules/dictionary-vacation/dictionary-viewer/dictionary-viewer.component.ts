import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DictionaryTypeRoute } from '@modules/dictionary-vacation/dictionary-vacation.interface';
import { TableViewerConfig } from '@shared/model/table-builder/common/table-viewer.config';
import { DictionaryModuleState } from '@store/dashboard/states/dictionary-module/dictionary-module.state';
import { DictionaryResponseQueryModel } from '@shared/model/table-builder/dictionary/dictionary-response-query.model';

@Component({
  selector: 'dictionary-viewer',
  templateUrl: './dictionary-viewer.component.html',
  styleUrls: ['./dictionary-viewer.component.scss']
})
export class DictionaryViewerComponent {
  public readonly dictionaryRoutesType: DictionaryTypeRoute;
  public readonly DictionaryViewerConfig = TableViewerConfig;

  @Select(DictionaryModuleState.getDictionaryContent)
  public readonly dataSource$: Observable<DictionaryResponseQueryModel>;

  constructor(private route: ActivatedRoute) {
    this.dictionaryRoutesType = this.getTableRouteTypesFromRoute();
  }

  private getTableRouteTypesFromRoute(): DictionaryTypeRoute {
    const typeRoute = this.route.snapshot.data as DictionaryTypeRoute;
    return Object.keys(typeRoute).length ? typeRoute : null;
  }

}
