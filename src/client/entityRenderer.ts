import { TILE_SIZE, EntityDef } from "../shared/types";

export function initEntities(world: Frame, entities: EntityDef[]): Map<string, Frame> {
  const entityMap = new Map<string, Frame>();

  for (let i = 0; i < entities.size(); i++) {
    const entity = entities[i];
    const frame = createEntityFrame(entity);
    frame.Parent = world;
    entityMap.set(entity.id, frame);
  }

  return entityMap;
}

export function updateEntityFrames(entityMap: Map<string, Frame>, entities: EntityDef[]): void {
  for (let i = 0; i < entities.size(); i++) {
    const entity = entities[i];
    const frame = entityMap.get(entity.id);
    if (!frame) continue;

    frame.Position = UDim2.fromOffset(
      entity.position.x * TILE_SIZE + 4,
      entity.position.y * TILE_SIZE + 4,
    );
  }
}

export function createPlayerFrame(world: Frame): Frame {
  const frame = new Instance("Frame");
  frame.Size = UDim2.fromOffset(24, 24);
  frame.BackgroundColor3 = Color3.fromRGB(66, 134, 244);
  frame.BorderSizePixel = 0;
  frame.Position = UDim2.fromOffset(0, 0);
  frame.Parent = world;

  const label = new Instance("TextLabel");
  label.Size = UDim2.fromScale(1, 1);
  label.BackgroundTransparency = 1;
  label.Text = "P";
  label.TextColor3 = Color3.fromRGB(255, 255, 255);
  label.TextScaled = true;
  label.Font = Enum.Font.SourceSansBold;
  label.Parent = frame;

  return frame;
}

function createEntityFrame(entity: EntityDef): Frame {
  const frame = new Instance("Frame");
  frame.Size = UDim2.fromOffset(28, 28);
  frame.BackgroundColor3 = entity.color;
  frame.BorderSizePixel = 0;
  frame.ZIndex = 10;
  frame.Position = UDim2.fromOffset(
    entity.position.x * TILE_SIZE + 4,
    entity.position.y * TILE_SIZE + 4,
  );

  const nameLabel = new Instance("TextLabel");
  nameLabel.Size = UDim2.fromScale(1, 1);
  nameLabel.Position = UDim2.fromOffset(0, -18);
  nameLabel.BackgroundTransparency = 1;
  nameLabel.Text = entity.name.size() > 6 ? entity.name.sub(0, 6) : entity.name;
  nameLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
  nameLabel.TextSize = 10;
  nameLabel.Font = Enum.Font.SourceSansBold;
  nameLabel.Parent = frame;

  const hpBar = new Instance("Frame");
  hpBar.Size = UDim2.fromScale(1, 1);
  hpBar.BackgroundColor3 = Color3.fromRGB(200, 50, 50);
  hpBar.BorderSizePixel = 0;
  hpBar.Parent = frame;

  const hpFill = new Instance("Frame");
  hpFill.Size = UDim2.fromScale(entity.hp / math.max(entity.maxHp, 1), 1);
  hpFill.BackgroundColor3 = Color3.fromRGB(50, 200, 50);
  hpFill.BorderSizePixel = 0;
  hpFill.Parent = hpBar;

  const clipContainer = new Instance("Frame");
  clipContainer.Size = UDim2.fromOffset(24, 3);
  clipContainer.Position = UDim2.fromOffset(0, -3);
  clipContainer.BackgroundTransparency = 1;
  clipContainer.BorderSizePixel = 0;
  clipContainer.ClipsDescendants = true;
  hpBar.Parent = clipContainer;
  clipContainer.Parent = frame;

  return frame;
}
