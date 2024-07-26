import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IPlayer } from 'src/app/interfaces/IPlayer';
import { PlayerService } from 'src/app/services/player.service';
import { ScytheService } from 'src/app/services/scythe-service.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {

  public searchInput: string = "";
  public filteredPlayers: IPlayer[] = [];
  public selectedPlayerIds: Set<number> = new Set();

  private players: IPlayer[] = [];
  private searchInput$: Subject<string> = new Subject<string>();
  constructor(public playerService: PlayerService, private scytheService: ScytheService, private router: Router) { }

  ngOnInit(): void {
    this.playerService.players$.subscribe(players => {
      this.players = players;
      this.filterPlayers();
    });

    this.searchInput$.pipe(
      debounceTime(300)
    ).subscribe(input => {
      this.searchInput = input;
      this.filterPlayers();
    });
  }

  filterPlayers() {
    if (this.searchInput) {
      this.filteredPlayers = this.players.filter(user =>
        user.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      this.filteredPlayers = this.players;
    }
  }

  toggleSelection(selected: boolean, playerId: number) {
    if (selected) {
      this.selectedPlayerIds.add(playerId);
    } else {
      this.selectedPlayerIds.delete(playerId);
    }
  }

  createGame(event: Event) {
    if (this.selectedPlayerIds.size > 0) {
      const players = this.players.filter(p => this.selectedPlayerIds.has(p.id));

      if (this.selectedPlayerIds.size === 1) {
        players.push({
          id: -1,
          name: "Automa",
        });
      }

      this.scytheService.CreateGame(players).subscribe(_ => {
        this.router.navigate(["current"]);
      });
    }
  }
}
