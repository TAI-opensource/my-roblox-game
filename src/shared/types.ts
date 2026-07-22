export enum TileType { Grass=0, Water=1, Tree=2, Rock=3, Path=4, Wall=5, Door=6, Flower=7, Sand=8, Bridge=9 }
export interface Position { x: number; y: number }
export interface PlayerState { hp: number; maxHp: number; xp: number; xpToNextLevel: number; level: number; attack: number; defense: number; gold: number }
export interface EntityDef { id: string; name: string; type: "npc"|"enemy"; position: Position; color: Color3; hp: number; maxHp: number; dialog?: string[]; xpReward?: number; damage?: number; speed?: number; patrol?: Position[] }
export const TILE_SIZE = 32;
export const MAP_WIDTH = 60;
export const MAP_HEIGHT = 40;
export const MOVE_SPEED = 120;
export const ENTITY_SIZE = 24;

export interface CombatResult {
  attackerId: string;
  targetId: string;
  damage: number;
  killed: boolean;
}

export const TILE_COLORS: Record<number, Color3> = {
  [TileType.Grass]: Color3.fromRGB(106, 168, 79),
  [TileType.Water]: Color3.fromRGB(61, 138, 215),
  [TileType.Tree]: Color3.fromRGB(45, 95, 25),
  [TileType.Rock]: Color3.fromRGB(130, 130, 130),
  [TileType.Path]: Color3.fromRGB(195, 170, 130),
  [TileType.Wall]: Color3.fromRGB(140, 90, 50),
  [TileType.Door]: Color3.fromRGB(90, 60, 30),
  [TileType.Flower]: Color3.fromRGB(255, 230, 100),
  [TileType.Sand]: Color3.fromRGB(220, 200, 160),
  [TileType.Bridge]: Color3.fromRGB(150, 120, 80),
};
