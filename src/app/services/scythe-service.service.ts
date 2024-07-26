import { Injectable } from '@angular/core';
import { IFaction } from '../interfaces/IFaction';
import { IEconomyBoard } from '../interfaces/IEconomyBoard';
import { IPlayer } from '../interfaces/IPlayer';
import { IPlayerFactionAssignment } from '../interfaces/IPlayerFactionAssignment';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable, ReplaySubject, concatMap, from, map, of, switchMap, toArray } from 'rxjs';

const indexDbStoreName: string = "playerFactionAssignments";

@Injectable({
  providedIn: 'root'
})
export class ScytheService {

  public hasActiveGame: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public activeGame: BehaviorSubject<IPlayerFactionAssignment[]> = new BehaviorSubject<IPlayerFactionAssignment[]>([]);

  private readonly factions: IFaction[] = [
    {
      id: 0,
      name: "Nordische Königreiche",
      leaderName: "Bjorn & Mox",
      color: "#5aaad5",
      bannerImageUrl: "assets/faction_banner/nordic.png",
      imageUrl: "assets/faction/nordic.jpg",
      imagePositionTop: 38
    },
    {
      id: 1,
      name: "Sächsisches Reich",
      leaderName: "Gunter, Nacht & Tag",
      color: "#1b1b1b",
      bannerImageUrl: "assets/faction_banner/saxony.png",
      imageUrl: "assets/faction/saxony.jpg",
      imagePositionTop: 15
    },
    {
      id: 2,
      name: "Republik Polania",
      leaderName: "Anna & Wojtek",
      color: "#ffffff",
      bannerImageUrl: "assets/faction_banner/polania.png",
      imageUrl: "assets/faction/polania.jpg",
      imagePositionTop: 41
    },
    {
      id: 3,
      name: "Khanat der Krim",
      leaderName: "Zehra & Kar",
      color: "#f0af35",
      bannerImageUrl: "assets/faction_banner/crimean.png",
      imageUrl: "assets/faction/crimean.jpg",
      imagePositionTop: 31
    },
    {
      id: 4,
      name: "Rusviet-Union",
      leaderName: "Olga & Changa",
      color: "#e6171b",
      bannerImageUrl: "assets/faction_banner/rusviet.png",
      imageUrl: "assets/faction/rusviet.jpg",
      imagePositionTop: 28
    },
    {
      id: 5,
      name: "Clan Albion",
      leaderName: "Connor & Max",
      color: "#795508",
      bannerImageUrl: "assets/faction_banner/albion.png",
      imageUrl: "assets/faction/albion.jpg",
      imagePositionTop: 25
    },
    {
      id: 6,
      name: "Togawa Shogunat",
      leaderName: "Akiko & Jiro",
      color: "#5e0b92",
      bannerImageUrl: "assets/faction_banner/togawa.png",
      imageUrl: "assets/faction/togawa.jpg",
      imagePositionTop: 25
    }
  ]

  private readonly economies: IEconomyBoard[] = [
    {
      id: 0,
      name: "Industriell",
      startIndex: 1,
    },
    {
      id: 1,
      name: "Technisch",
      startIndex: 2,
    },
    {
      id: 2,
      name: "Militant",
      startIndex: 3,
    },
    {
      id: 3,
      name: "Patriotisch",
      startIndex: 4,
    },
    {
      id: 4,
      name: "Innovativ",
      startIndex: 5,
    },
    {
      id: 5,
      name: "Mechanisch",
      startIndex: 6,
    },
    {
      id: 6,
      name: "Landwirschaftlich",
      startIndex: 7,
    },
  ]

  constructor(private dbService: NgxIndexedDBService) {
    this.dbService.getAll<IPlayerFactionAssignment>(indexDbStoreName).subscribe(x => {
      if (x && x.length > 0) {
        this.hasActiveGame.next(true);
        this.activeGame.next(x.sort((a, b) => a.economyBoard.startIndex - b.economyBoard.startIndex));
      }
      else {
        this.hasActiveGame.next(false);
      }
    })
  }

  CreateGame(players: IPlayer[]): Observable<boolean> {
    if (players.length > 7) {
      throw new Error("Maximum number of players is 7");
    }

    const shuffledFactions = this.shuffleArray(this.factions);
    const shuffledEconomies = this.shuffleArray(this.economies);
    const playerFactionAssignments: IPlayerFactionAssignment[] = [];

    return this.dbService.clear(indexDbStoreName).pipe(
      switchMap(result => {
        if (!result) {
          throw new Error('Failed to clear the database');
        }

        return from(players);
      }),
      concatMap(player => {
        const faction = shuffledFactions.shift()!;
        const economy = shuffledEconomies.shift()!;

        const game: IPlayerFactionAssignment = {
          faction: faction,
          player: player,
          economyBoard: economy,
        }

        playerFactionAssignments.push(game);

        return this.dbService.add(indexDbStoreName, game);
      }),
      map(() => {
        const sortedPlayerFactionAssignments = playerFactionAssignments.sort((a, b) => a.economyBoard.startIndex - b.economyBoard.startIndex)
        this.hasActiveGame.next(true);
        this.activeGame.next(sortedPlayerFactionAssignments);
        return true;
      })
    );
  }

  FinishGame(): Observable<boolean> {
    return this.dbService.clear(indexDbStoreName).pipe(map(_ => {
      this.hasActiveGame.next(false);
      this.activeGame.next([]);
      return true;
    }));
  }

  private shuffleArray<TType>(array: TType[]): TType[] {
    let shuffled = array.slice(); // Create a copy to avoid modifying the original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
