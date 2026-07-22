import { PlayerState, TILE_COLORS } from "../shared/types";

export interface MinimapEntity {
  x: number;
  y: number;
  isEnemy: boolean;
}

export interface MinimapData {
  playerX: number;
  playerY: number;
  tiles: number[][];
  entities: MinimapEntity[];
}

export function createHUD(screenGui: Instance) {
  const hudFrame = new Instance("Frame");
  hudFrame.Name = "HUD";
  hudFrame.Size = new UDim2(1, 0, 0, 40);
  hudFrame.Position = new UDim2(0, 0, 1, -40);
  hudFrame.BackgroundTransparency = 1;
  hudFrame.Parent = screenGui;

  const levelLabel = new Instance("TextLabel");
  levelLabel.Name = "LevelLabel";
  levelLabel.Size = new UDim2(0, 100, 0, 20);
  levelLabel.Position = new UDim2(0, 4, 0, 0);
  levelLabel.BackgroundTransparency = 1;
  levelLabel.TextColor3 = new Color3(1, 1, 1);
  levelLabel.TextStrokeTransparency = 0.5;
  levelLabel.TextSize = 14;
  levelLabel.Font = Enum.Font.GothamBold;
  levelLabel.TextXAlignment = Enum.TextXAlignment.Left;
  levelLabel.Text = "Level: 1";
  levelLabel.Parent = hudFrame;

  const goldLabel = new Instance("TextLabel");
  goldLabel.Name = "GoldLabel";
  goldLabel.Size = new UDim2(0, 100, 0, 20);
  goldLabel.Position = new UDim2(1, -104, 0, 0);
  goldLabel.BackgroundTransparency = 1;
  goldLabel.TextColor3 = new Color3(1, 1, 0);
  goldLabel.TextStrokeTransparency = 0.5;
  goldLabel.TextSize = 14;
  goldLabel.Font = Enum.Font.GothamBold;
  goldLabel.TextXAlignment = Enum.TextXAlignment.Right;
  goldLabel.Text = "Gold: 0";
  goldLabel.Parent = hudFrame;

  const hpBarFrame = new Instance("Frame");
  hpBarFrame.Name = "HPBar";
  hpBarFrame.Size = new UDim2(0, 200, 0, 20);
  hpBarFrame.Position = new UDim2(0.5, -100, 0, 0);
  hpBarFrame.BackgroundColor3 = Color3.fromRGB(180, 20, 20);
  hpBarFrame.BorderSizePixel = 1;
  hpBarFrame.Parent = hudFrame;

  const hpFill = new Instance("Frame");
  hpFill.Name = "HPFill";
  hpFill.Size = new UDim2(1, 0, 1, 0);
  hpFill.BackgroundColor3 = Color3.fromRGB(40, 200, 40);
  hpFill.BorderSizePixel = 0;
  hpFill.Parent = hpBarFrame;

  const hpText = new Instance("TextLabel");
  hpText.Name = "HPText";
  hpText.Size = new UDim2(0, 60, 0, 20);
  hpText.Position = new UDim2(1, 4, 0, 0);
  hpText.BackgroundTransparency = 1;
  hpText.TextColor3 = new Color3(1, 1, 1);
  hpText.TextStrokeTransparency = 0.5;
  hpText.TextSize = 12;
  hpText.Font = Enum.Font.GothamBold;
  hpText.TextXAlignment = Enum.TextXAlignment.Left;
  hpText.Text = "HP: 10/10";
  hpText.Parent = hpBarFrame;

  const xpBarFrame = new Instance("Frame");
  xpBarFrame.Name = "XPBar";
  xpBarFrame.Size = new UDim2(0, 200, 0, 8);
  xpBarFrame.Position = new UDim2(0.5, -100, 0, 22);
  xpBarFrame.BackgroundColor3 = Color3.fromRGB(40, 10, 60);
  xpBarFrame.BorderSizePixel = 1;
  xpBarFrame.Parent = hudFrame;

  const xpFill = new Instance("Frame");
  xpFill.Name = "XPFill";
  xpFill.Size = new UDim2(0, 0, 1, 0);
  xpFill.BackgroundColor3 = Color3.fromRGB(140, 40, 200);
  xpFill.BorderSizePixel = 0;
  xpFill.Parent = xpBarFrame;

  const minimapFrame = new Instance("Frame");
  minimapFrame.Name = "Minimap";
  minimapFrame.Size = new UDim2(0, 120, 0, 120);
  minimapFrame.Position = new UDim2(1, -130, 0, 40);
  minimapFrame.BackgroundColor3 = new Color3(0, 0, 0);
  minimapFrame.BorderSizePixel = 1;
  minimapFrame.Parent = screenGui;

  const minimapContainer = new Instance("Frame");
  minimapContainer.Name = "Container";
  minimapContainer.Size = new UDim2(1, -4, 1, -4);
  minimapContainer.Position = new UDim2(0, 2, 0, 2);
  minimapContainer.BackgroundTransparency = 1;
  minimapContainer.Parent = minimapFrame;

  const playerDot = new Instance("Frame");
  playerDot.Name = "PlayerDot";
  playerDot.Size = new UDim2(0, 4, 0, 4);
  playerDot.BackgroundColor3 = new Color3(0, 0.5, 1);
  playerDot.BorderSizePixel = 0;
  playerDot.Visible = false;
  playerDot.Parent = minimapContainer;

  const enemyDots: Frame[] = [];

  function updatePlayerState(state: PlayerState) {
    const hpPct = state.maxHp > 0 ? state.hp / state.maxHp : 0;
    hpFill.Size = new UDim2(hpPct, 0, 1, 0);
    hpText.Text = `HP: ${state.hp}/${state.maxHp}`;
    const xpPct = state.xpToNextLevel > 0 ? state.xp / state.xpToNextLevel : 0;
    xpFill.Size = new UDim2(xpPct, 0, 1, 0);
    levelLabel.Text = `Level: ${state.level}`;
    goldLabel.Text = `Gold: ${state.gold}`;
  }

  function updateEnemyCount(count: number) {
    while (enemyDots.size() < count) {
      const dot = new Instance("Frame");
      dot.Name = "EnemyDot";
      dot.Size = new UDim2(0, 4, 0, 4);
      dot.BackgroundColor3 = Color3.fromRGB(220, 30, 30);
      dot.BorderSizePixel = 0;
      dot.Visible = false;
      dot.Parent = minimapContainer;
      enemyDots.push(dot);
    }
    while (enemyDots.size() > count) {
      const dot = enemyDots.pop();
      if (dot !== undefined) {
        dot.Destroy();
      }
    }
  }

  function updateMinimap(data: MinimapData) {
    const tilePx = 2;
    const cols = 20;
    const rows = 20;

    const mc = minimapContainer.GetChildren();
    for (let i = 0; i < mc.size(); i++) {
      if (mc[i].Name === "Tile") {
        mc[i].Destroy();
      }
    }

    const halfCols = math.floor(cols / 2);
    const halfRows = math.floor(rows / 2);

    const tiles = data.tiles;
    const mapWidth = tiles.size();
    const mapHeight = mapWidth > 0 ? tiles[0].size() : 0;

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const tileX = data.playerX + gx - halfCols;
        const tileY = data.playerY + gy - halfRows;
        let color = new Color3(0.1, 0.1, 0.1);
        if (tileX >= 0 && tileX < mapWidth && tileY >= 0 && tileY < mapHeight) {
          const tileType = tiles[tileX][tileY];
          const c = TILE_COLORS[tileType];
          if (c !== undefined) {
            color = c;
          }
        }
        const tileFrame = new Instance("Frame");
        tileFrame.Name = "Tile";
        tileFrame.Size = new UDim2(0, tilePx, 0, tilePx);
        tileFrame.Position = new UDim2(0, gx * tilePx, 0, gy * tilePx);
        tileFrame.BackgroundColor3 = color;
        tileFrame.BorderSizePixel = 0;
        tileFrame.Parent = minimapContainer;
      }
    }

    playerDot.Visible = true;
    playerDot.Position = new UDim2(0, halfCols * tilePx - 1, 0, halfRows * tilePx - 1);
    playerDot.ZIndex = 10;

    let dotIdx = 0;
    const ents = data.entities;
    for (let ei = 0; ei < ents.size(); ei++) {
      const ent = ents[ei];
      if (dotIdx >= enemyDots.size()) break;
      const dx = ent.x - data.playerX + halfCols;
      const dy = ent.y - data.playerY + halfRows;
      if (dx >= 0 && dx < cols && dy >= 0 && dy < rows) {
        const dot = enemyDots[dotIdx];
        dot.Visible = true;
        dot.Position = new UDim2(0, dx * tilePx, 0, dy * tilePx);
        dot.BackgroundColor3 = ent.isEnemy
          ? Color3.fromRGB(220, 30, 30)
          : Color3.fromRGB(255, 220, 50);
        dot.ZIndex = 10;
        dotIdx++;
      }
    }
    for (let i = dotIdx; i < enemyDots.size(); i++) {
      enemyDots[i].Visible = false;
    }
  }

  return { updatePlayerState, updateEnemyCount, updateMinimap };
}
