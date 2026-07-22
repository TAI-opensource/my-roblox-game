import { Players, TweenService } from "@rbxts/services";

const player = Players.LocalPlayer;

let combatLogFrame: ScrollingFrame | undefined;
let combatMessages: string[] = [];

function getOrCreateCombatLog(screenGui: Instance): ScrollingFrame {
  if (combatLogFrame !== undefined && combatLogFrame.Parent !== undefined) {
    return combatLogFrame;
  }

  const frame = new Instance("ScrollingFrame");
  frame.Name = "CombatLog";
  frame.Size = new UDim2(0, 200, 0, 100);
  frame.Position = new UDim2(0, 4, 0, 4);
  frame.BackgroundColor3 = new Color3(0, 0, 0);
  frame.BackgroundTransparency = 0.4;
  frame.BorderSizePixel = 1;
  frame.BorderColor3 = new Color3(0.5, 0.5, 0.5);
  frame.ScrollBarThickness = 4;
  frame.Parent = screenGui;

  combatLogFrame = frame;
  return frame;
}

export function initCombatSystem(screenGui: Instance) {
  getOrCreateCombatLog(screenGui);
}

export function showDamageNumber(target: Frame, damage: number) {
  const playerGui = player?.FindFirstChildOfClass("PlayerGui");
  if (playerGui === undefined) return;

  const label = new Instance("TextLabel");
  label.Name = "DamageNumber";
  label.Size = new UDim2(0, 60, 0, 20);
  label.BackgroundTransparency = 1;
  label.TextColor3 = new Color3(1, 0.2, 0.2);
  label.TextStrokeTransparency = 0.3;
  label.TextSize = 20;
  label.Font = Enum.Font.GothamBold;
  label.Text = tostring(-damage);
  label.ZIndex = 100;
  label.Parent = playerGui;

  const absPos = target.AbsolutePosition;
  const absSize = target.AbsoluteSize;
  const startX = absPos.X + absSize.X / 2 - 30;
  const startY = absPos.Y - 10;
  label.Position = new UDim2(0, startX, 0, startY);
  label.AnchorPoint = new Vector2(0, 1);

  const goal: { [key: string]: UDim2 | number } = {
    Position: new UDim2(0, startX, 0, startY - 40),
    TextTransparency: 1,
  };
  const tweenInfo = new TweenInfo(0.8, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
  const tween = TweenService.Create(label, tweenInfo, goal);
  tween.Completed.Connect(() => {
    label.Destroy();
  });
  tween.Play();
}

export function showCombatLog(message: string) {
  const pg = player?.FindFirstChildOfClass("PlayerGui");
  if (pg === undefined) return;
  const screenGui = pg.FindFirstChild("PixelQuestGui");
  if (screenGui === undefined) return;

  const frame = getOrCreateCombatLog(screenGui);

  combatMessages.push(message);
  if (combatMessages.size() > 5) {
    combatMessages.shift();
  }

  const children = frame.GetChildren();
  for (let i = 0; i < children.size(); i++) {
    const child = children[i];
    if (child.IsA("TextLabel")) {
      child.Destroy();
    }
  }

  for (let i = 0; i < combatMessages.size(); i++) {
    const entry = new Instance("TextLabel");
    entry.Name = "CombatEntry";
    entry.Size = new UDim2(1, -8, 0, 18);
    entry.Position = new UDim2(0, 4, 0, i * 18);
    entry.BackgroundTransparency = 1;
    entry.TextColor3 = new Color3(1, 1, 1);
    entry.TextSize = 12;
    entry.Font = Enum.Font.Gotham;
    entry.TextXAlignment = Enum.TextXAlignment.Left;
    entry.Text = combatMessages[i];
    entry.Parent = frame;
  }

  frame.CanvasSize = new UDim2(0, 0, 0, combatMessages.size() * 18);
  frame.CanvasPosition = new Vector2(0, combatMessages.size() * 18);
}

export function flashEntity(entityFrame: Frame) {
  const originalColor = entityFrame.BackgroundColor3;
  entityFrame.BackgroundColor3 = Color3.fromRGB(255, 50, 50);
  task.delay(0.2, () => {
    entityFrame.BackgroundColor3 = originalColor;
  });
}
