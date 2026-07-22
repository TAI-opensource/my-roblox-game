import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_COLORS, TileType } from "../shared/types";

export function renderMap(world: Frame, map: number[][]): void {
  for (let row = 0; row < MAP_HEIGHT; row++) {
    for (let col = 0; col < MAP_WIDTH; col++) {
      const tileType = map[row]?.[col] ?? 0;
      const tile = new Instance("Frame");
      tile.Size = UDim2.fromOffset(TILE_SIZE, TILE_SIZE);
      tile.Position = UDim2.fromOffset(col * TILE_SIZE, row * TILE_SIZE);
      tile.BackgroundColor3 = TILE_COLORS[tileType] ?? TILE_COLORS[0];
      tile.BorderSizePixel = 0;
      tile.Parent = world;

      if (tileType === TileType.Water) {
        tile.BorderSizePixel = 1;
        tile.BorderColor3 = Color3.fromRGB(41, 108, 185);
      } else if (tileType === TileType.Tree) {
        const shade = new Instance("Frame");
        shade.Size = UDim2.fromOffset(TILE_SIZE, TILE_SIZE / 3);
        shade.Position = UDim2.fromOffset(0, 0);
        shade.BackgroundColor3 = Color3.fromRGB(30, 70, 15);
        shade.BorderSizePixel = 0;
        shade.BackgroundTransparency = 0.3;
        shade.Parent = tile;
      } else if (tileType === TileType.Rock) {
        tile.BorderSizePixel = 1;
        tile.BorderColor3 = Color3.fromRGB(100, 100, 100);
      } else if (tileType === TileType.Path) {
        const inner = new Instance("Frame");
        inner.Size = UDim2.fromOffset(TILE_SIZE / 2, TILE_SIZE / 2);
        inner.Position = UDim2.fromOffset(TILE_SIZE / 4, TILE_SIZE / 4);
        inner.BackgroundColor3 = Color3.fromRGB(215, 192, 150);
        inner.BorderSizePixel = 0;
        inner.Parent = tile;
      }
    }
  }
}
