import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerMenuComponent } from './components/player-menu/player-menu.component';
import { NewGameComponent } from './components/new-game/new-game.component';
import { CurrentGameComponent } from './components/current-game/current-game.component';
import { hasActiveGame, hasNoActiveGame } from './active-game.guard';

const routes: Routes = [
  { path: 'players', component: PlayerMenuComponent, },
  { path: 'new', component: NewGameComponent, canActivate: [hasNoActiveGame] },
  { path: 'current', component: CurrentGameComponent, canActivate: [hasActiveGame]},
  { path: '', redirectTo: '/new', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
