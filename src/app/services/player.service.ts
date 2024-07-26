import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { IPlayer } from '../interfaces/IPlayer';
import { NgxIndexedDBService } from 'ngx-indexed-db';

const indexDbStoreName: string = "players";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  public players$ = new BehaviorSubject<IPlayer[]>([]);

  constructor(private dbService: NgxIndexedDBService) {
    this.loadAll();
  }

  Create(name: string): void {
    this.dbService.add(indexDbStoreName, { name: name }).pipe(
      catchError(error => {
        console.error('Error creating player:', error);
        return throwError(() => error);
      })
    ).subscribe(_ => {
      this.loadAllIfNeeded();
    });
  }

  Get(id: string): Observable<IPlayer> {
    return this.dbService.getByID<IPlayer>(indexDbStoreName, id).pipe(
      map(player => {
        if (!player) {
          throw new Error(`Can't find player with id ${id}`);
        }
        return player;
      }),
      catchError(error => {
        console.error('Error fetching player:', error);
        return throwError(() => error);
      })
    );
  }

  Delete(id: number): void {
    this.dbService.delete(indexDbStoreName, id).subscribe(_ => {
      this.loadAll();
    });
  }

  private loadAllIfNeeded(): void {
    if (this.players$.observed) {
      this.loadAll();
    }
  }

  private loadAll(): void {
    this.dbService.getAll<IPlayer>(indexDbStoreName).subscribe(players => this.players$.next(players));
  }
}
