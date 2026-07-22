export interface PlayerData {
    userId: number;
    name: string;
    cash: number;
    level: number;
}
export declare function getOrCreatePlayerData(player: Player): PlayerData;
export declare function removePlayerData(userId: number): void;
export declare function addCash(userId: number, amount: number): void;
export declare function getPlayerData(userId: number): PlayerData | undefined;
//# sourceMappingURL=PlayerData.d.ts.map