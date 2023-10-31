import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ScytheService } from './services/scythe-service.service';
import { catchError, map, of } from 'rxjs';

export const hasActiveGame: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const scytheService = inject(ScytheService);

  return scytheService.hasActiveGame.pipe(
    map(result => {
      if (result) {
        return true;
      } else {
        return router.parseUrl("/new");
      }
    }),
    catchError(() => {
      router.navigate(["new"]);
      return of(false);
    })
  );
};

export const hasNoActiveGame: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const scytheService = inject(ScytheService);

  return scytheService.hasActiveGame.pipe(
    map(result => {
      if (!result) {
        return true;
      } else {
        return router.parseUrl("/current");
      }
    }),
    catchError(() => {
      router.navigate(["new"]);
      return of(false);
    })
  );
};
