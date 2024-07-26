import { IEconomyBoard } from "./IEconomyBoard";
import { IFaction } from "./IFaction";
import { IPlayer } from "./IPlayer";

export interface IPlayerFactionAssignment {
    faction: IFaction,
    player: IPlayer,
    economyBoard: IEconomyBoard,
}