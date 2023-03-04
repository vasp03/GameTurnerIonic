import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameTurnerPage } from './game-turner.page';

const routes: Routes = [
  {
    path: '',
    component: GameTurnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameTurnerPageRoutingModule {}
