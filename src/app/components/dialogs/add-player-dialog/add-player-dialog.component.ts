import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-player-dialog',
  templateUrl: './add-player-dialog.component.html',
  styleUrls: ['./add-player-dialog.component.scss']
})
export class AddPlayerDialogComponent {

  public name: string = "";
  constructor(public dialogRef: MatDialogRef<AddPlayerDialogComponent>) { }

  closeDialog(event: Event) {
    this.dialogRef.close(this.name);
  }
}
