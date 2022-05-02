import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

import { CaptureHtmlComponent } from './component/capture-html/capture-html.component';
import { PasteEventListenerComponent } from './component/paste-event-listener/paste-event-listener.component';
import { ArtifactListComponent } from './component/artifact-list/artifact-list.component';
export { ArtifactListComponent } from './component/artifact-list/artifact-list.component';

export { GlobalProgressService } from './service/global-progress.service';
export { OcrService } from './service/ocr.service';
export { CharacterService } from './service/character.service';
export { StorageService } from './service/storage.service';
export { HttpService } from './service/http.service';

export * from './const/const';
export * from './interface/interface';
export * from './class/character';

export const genshindb = require('genshin-db');

let shardList: any[] = [
  CaptureHtmlComponent,
  PasteEventListenerComponent,
  ArtifactListComponent,
];

@NgModule({
  declarations: [shardList],
  imports: [
    CommonModule,
    AngularMaterialModule,
    TranslateModule.forChild({
      extend: true,
    }),
  ],
  exports: shardList.concat([TranslateModule]),
})
export class SharedModule {}
