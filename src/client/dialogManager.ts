import { UserInputService } from "@rbxts/services";

let dialogFrame: Frame | undefined;
let speakerNameLabel: TextLabel | undefined;
let dialogTextLabel: TextLabel | undefined;
let continueButton: TextButton | undefined;
let currentLines: string[] = [];
let currentLineIndex = 0;
let onDialogComplete: (() => void) | undefined;
let continueConnection: RBXScriptConnection | undefined;

function onContinueClick() {
  if (currentLines.size() === 0) return;
  currentLineIndex++;
  if (currentLineIndex >= currentLines.size()) {
    hideDialog();
    if (onDialogComplete !== undefined) {
      onDialogComplete();
    }
    return;
  }
  if (dialogTextLabel !== undefined) {
    dialogTextLabel.Text = currentLines[currentLineIndex];
  }
}

function onKeyPress(inputObject: InputObject, gameProcessedEvent: boolean) {
  if (gameProcessedEvent) return;
  if (inputObject.KeyCode === Enum.KeyCode.Space || inputObject.KeyCode === Enum.KeyCode.Return) {
    onContinueClick();
  }
}

function createDialogUI(screenGui: Instance) {
  const overlay = new Instance("Frame");
  overlay.Name = "DialogOverlay";
  overlay.Size = new UDim2(1, 0, 1, 0);
  overlay.BackgroundColor3 = new Color3(0, 0, 0);
  overlay.BackgroundTransparency = 0.4;
  overlay.Parent = screenGui;

  const box = new Instance("Frame");
  box.Name = "DialogBox";
  box.Size = new UDim2(0, 400, 0, 160);
  box.Position = new UDim2(0.5, -200, 0.5, -80);
  box.BackgroundColor3 = new Color3(1, 1, 1);
  box.BorderSizePixel = 2;
  box.BorderColor3 = new Color3(0, 0, 0);
  box.Parent = overlay;

  const speakerLabel = new Instance("TextLabel");
  speakerLabel.Name = "SpeakerName";
  speakerLabel.Size = new UDim2(1, -20, 0, 30);
  speakerLabel.Position = new UDim2(0, 10, 0, 6);
  speakerLabel.BackgroundTransparency = 1;
  speakerLabel.TextColor3 = new Color3(0, 0, 0);
  speakerLabel.TextSize = 18;
  speakerLabel.Font = Enum.Font.GothamBold;
  speakerLabel.TextXAlignment = Enum.TextXAlignment.Left;
  speakerLabel.Text = "";
  speakerLabel.Parent = box;

  const dialogText = new Instance("TextLabel");
  dialogText.Name = "DialogText";
  dialogText.Size = new UDim2(1, -20, 1, -70);
  dialogText.Position = new UDim2(0, 10, 0, 36);
  dialogText.BackgroundTransparency = 1;
  dialogText.TextColor3 = new Color3(0.2, 0.2, 0.2);
  dialogText.TextSize = 16;
  dialogText.Font = Enum.Font.Gotham;
  dialogText.TextXAlignment = Enum.TextXAlignment.Left;
  dialogText.TextYAlignment = Enum.TextYAlignment.Top;
  dialogText.TextWrapped = true;
  dialogText.Text = "";
  dialogText.Parent = box;

  const btn = new Instance("TextButton");
  btn.Name = "ContinueButton";
  btn.Size = new UDim2(0, 140, 0, 26);
  btn.Position = new UDim2(1, -150, 1, -32);
  btn.BackgroundColor3 = new Color3(0.9, 0.9, 0.9);
  btn.BorderSizePixel = 1;
  btn.BorderColor3 = new Color3(0, 0, 0);
  btn.TextColor3 = new Color3(0, 0, 0);
  btn.TextSize = 14;
  btn.Font = Enum.Font.Gotham;
  btn.Text = "Click to continue...";
  btn.Parent = box;

  dialogFrame = overlay;
  speakerNameLabel = speakerLabel;
  dialogTextLabel = dialogText;
  continueButton = btn;

  btn.MouseButton1Click.Connect(onContinueClick);
  continueConnection = UserInputService.InputBegan.Connect(onKeyPress);
}

export function showDialog(speaker: string, lines: string[], onComplete: () => void) {
  hideDialog();
  const player = game.GetService("Players").LocalPlayer;
  if (player === undefined) return;
  const pg = player.FindFirstChildOfClass("PlayerGui");
  if (pg === undefined) return;
  const screenGui = pg.FindFirstChild("PixelQuestGui");
  if (screenGui === undefined) return;

  currentLines = lines;
  currentLineIndex = 0;
  onDialogComplete = onComplete;

  createDialogUI(screenGui);

  if (speakerNameLabel !== undefined) {
    speakerNameLabel.Text = speaker;
  }
  if (dialogTextLabel !== undefined && lines.size() > 0) {
    dialogTextLabel.Text = lines[0];
  }
}

export function hideDialog() {
  if (continueConnection !== undefined) {
    continueConnection.Disconnect();
    continueConnection = undefined;
  }
  if (dialogFrame !== undefined) {
    dialogFrame.Destroy();
    dialogFrame = undefined;
  }
  speakerNameLabel = undefined;
  dialogTextLabel = undefined;
  continueButton = undefined;
  currentLines = [];
  currentLineIndex = 0;
  onDialogComplete = undefined;
}
