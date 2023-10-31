import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScytheService } from 'src/app/services/scythe-service.service';
import { YesNoDialogComponent } from '../dialogs/yes-no-dialog/yes-no-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent {
  constructor(public scytheService: ScytheService, private dialog: MatDialog, private router: Router) { }

  FinishGame(event: Event) {
    const dialogRef = this.dialog.open(YesNoDialogComponent, { data: { title: "Spiel beenden?", text: "Möchtest du das Spiel wirklich beenden?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.scytheService.FinishGame().subscribe(_ => {
          this.router.navigate(["new"]);
        });
      }
    });
  }
}
