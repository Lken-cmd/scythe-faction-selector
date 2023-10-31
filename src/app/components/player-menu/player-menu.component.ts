import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlayerService } from 'src/app/services/player.service';
import { YesNoDialogComponent } from '../dialogs/yes-no-dialog/yes-no-dialog.component';
import { AddPlayerDialogComponent } from '../dialogs/add-player-dialog/add-player-dialog.component';

@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss']
})
export class PlayerMenuComponent {

  constructor(public playerService: PlayerService, private dialog: MatDialog) { }

  OpenAddPlayerDialog(event: Event): void {
    const dialogRef = this.dialog.open(AddPlayerDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playerService.Create(result);
      }
    })
  }

  OpenDeletePlayerDialog(event: Event, id: number, name: string) {
    const dialogRef = this.dialog.open(YesNoDialogComponent, { data: { title: "Spieler löschen?", text: `Möchtest du Spieler ${name} wirklich löschen?` } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.playerService.Delete(id);
      }
    });
  }
}
