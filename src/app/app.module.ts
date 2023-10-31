import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PlayerMenuComponent } from './components/player-menu/player-menu.component';
import { YesNoDialogComponent } from './components/dialogs/yes-no-dialog/yes-no-dialog.component';
import { AddPlayerDialogComponent } from './components/dialogs/add-player-dialog/add-player-dialog.component';
import { NewGameComponent } from './components/new-game/new-game.component';
import { CurrentGameComponent } from './components/current-game/current-game.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const dbConfig: DBConfig = {
  name: 'ScytheFactionSelector',
  version: 1,
  objectStoresMeta: [{
    store: 'players',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
    ]
  },
  {
    store: 'playerFactionAssignments',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'faction', keypath: 'faction', options: { unique: false } },
      { name: 'player', keypath: 'player', options: { unique: false } },
      { name: 'economyBoard', keypath: 'economyBoard', options: { unique: false } }
    ]
  }]
};

@NgModule({
  declarations: [
    AppComponent,
    PlayerMenuComponent,
    YesNoDialogComponent,
    AddPlayerDialogComponent,
    NewGameComponent,
    CurrentGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxIndexedDBModule.forRoot(dbConfig),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
