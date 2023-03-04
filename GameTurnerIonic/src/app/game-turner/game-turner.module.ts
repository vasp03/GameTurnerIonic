import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameTurnerPageRoutingModule } from './game-turner-routing.module';

import { GameTurnerPage } from './game-turner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameTurnerPageRoutingModule
  ],
  declarations: [GameTurnerPage]
})
export class GameTurnerPageModule {}
