import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { fadeAnimation } from '@core/animation/fade.animation';
import { Dictionary } from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary.class';
import { DictionaryResponseQueryModel } from '@shared/model/table-builder/dictionary/dictionary-response-query.model';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [fadeAnimation]
})
export class DictionaryComponent extends Dictionary {
  constructor(context: Injector) {
    super(context);
  }

  public dictionaryRequest(): void {
    this.dictionaryRegistry
      .getDictionaryByType(this.type)
      .subscribe((dictionary: DictionaryResponseQueryModel) => {
        this.setDictionarySourceData(dictionary);
      });
  }

}
