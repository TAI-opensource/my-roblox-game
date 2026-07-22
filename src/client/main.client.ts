import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, TileType } from "../shared/types";
import { initCamera, updateCamera } from "./camera";
import { initPlayerController, getPlayerPosition, handleMovement, setPlayerPosition, updateTileMap, registerEntityFrame, clearEntityFrames } from "./playerController";

const player = Players.LocalPlayer as Player;
const gui = new Instance("ScreenGui");
gui.Name = "PixelQuestGui";
gui.ResetOnSpawn = false;
gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
gui.Parent = player.WaitForChild("PlayerGui");

const gameView = new Instance("Frame");
gameView.Name = "GameView";
gameView.Size = UDim2.fromScale(1, 1);
gameView.Position = UDim2.fromScale(0, 0);
gameView.BackgroundColor3 = Color3.fromRGB(0, 0, 0);
gameView.BorderSizePixel = 0;
gameView.ClipsDescendants = true;
gameView.Parent = gui;

const world = new Instance("Frame");
world.Name = "WorldContainer";
world.Size = UDim2.fromOffset(MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
world.BackgroundColor3 = Color3.fromRGB(50, 50, 50);
world.Parent = gameView;

const playerFrame = new Instance("Frame");
playerFrame.Name = "PlayerFrame";
playerFrame.Size = UDim2.fromOffset(28, 28);
playerFrame.BackgroundColor3 = Color3.fromRGB(66, 134, 244);
playerFrame.BorderSizePixel = 0;
playerFrame.ZIndex = 10;
playerFrame.Parent = world;

const playerLabel = new Instance("TextLabel");
playerLabel.Name = "PlayerLabel";
playerLabel.Size = UDim2.fromScale(1, 1);
playerLabel.BackgroundTransparency = 1;
playerLabel.Text = "P";
playerLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
playerLabel.TextScaled = true;
playerLabel.Font = Enum.Font.SourceSansBold;
playerLabel.Parent = playerFrame;

const syncEvent = ReplicatedStorage.WaitForChild("PixelQuestSync") as RemoteEvent;
let tileMap: TileType[][] = [];

initCamera(gameView, world);
initPlayerController(world, playerFrame, syncEvent, tileMap);

function tileColor(t: TileType): Color3 {
    if (t === TileType.Grass) return Color3.fromRGB(34, 139, 34);
    if (t === TileType.Water) return Color3.fromRGB(30, 144, 255);
    if (t === TileType.Tree) return Color3.fromRGB(0, 100, 0);
    if (t === TileType.Rock) return Color3.fromRGB(128, 128, 128);
    if (t === TileType.Path) return Color3.fromRGB(210, 180, 140);
    if (t === TileType.Wall) return Color3.fromRGB(101, 67, 33);
    if (t === TileType.Door) return Color3.fromRGB(139, 69, 19);
    if (t === TileType.Flower) return Color3.fromRGB(255, 105, 180);
    if (t === TileType.Sand) return Color3.fromRGB(194, 178, 128);
    if (t === TileType.Bridge) return Color3.fromRGB(160, 82, 45);
    return Color3.fromRGB(0, 0, 0);
}

function generateMap(): TileType[][] {
    const map: TileType[][] = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        const row: TileType[] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1) {
                row.push(TileType.Wall);
            } else if (y > MAP_HEIGHT / 2 - 5 && y < MAP_HEIGHT / 2 + 5 && x > MAP_WIDTH / 2 - 2 && x < MAP_WIDTH / 2 + 2) {
                row.push(TileType.Water);
            } else {
                const r = math.random();
                if (r < 0.05) row.push(TileType.Tree);
                else if (r < 0.08) row.push(TileType.Rock);
                else if (r < 0.1) row.push(TileType.Flower);
                else if (r < 0.12) row.push(TileType.Sand);
                else row.push(TileType.Grass);
            }
        }
        map.push(row);
    }
    return map;
}

function renderMap(map: TileType[][]) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tf = new Instance("Frame");
            tf.Size = UDim2.fromOffset(TILE_SIZE, TILE_SIZE);
            tf.Position = UDim2.fromOffset(x * TILE_SIZE, y * TILE_SIZE);
            tf.BackgroundColor3 = tileColor(map[y][x]);
            tf.BorderSizePixel = 0;
            tf.Parent = world;
        }
    }
}

function renderEntity(data: { id: string; position: { x: number; y: number }; color?: Color3; type: string }) {
    const f = new Instance("Frame");
    f.Name = "Entity_" + data.id;
    f.Size = UDim2.fromOffset(28, 28);
    f.Position = UDim2.fromOffset(data.position.x - 14, data.position.y - 14);
    f.BackgroundColor3 = data.color || Color3.fromRGB(255, 0, 0);
    f.BorderSizePixel = 0;
    f.ZIndex = 10;
    f.Parent = world;
    const l = new Instance("TextLabel");
    l.Size = UDim2.fromScale(1, 1);
    l.BackgroundTransparency = 1;
    l.Text = data.type === "enemy" ? "E" : "N";
    l.TextColor3 = Color3.fromRGB(255, 255, 255);
    l.TextScaled = true;
    l.Font = Enum.Font.SourceSansBold;
    l.ZIndex = 11;
    l.Parent = f;
    if (data.type === "enemy") {
        registerEntityFrame(data.id, f);
    }
}

syncEvent.OnClientEvent.Connect((msg: { type: string; data: unknown }) => {
    if (msg.type === "init" && msg.data !== undefined) {
        const data = msg.data as { playerPosition?: { x: number; y: number }; entities?: Array<{ id: string; position: { x: number; y: number }; color?: Color3; type: string }> };
        const wc = world.GetChildren();
        for (let ci = 0; ci < wc.size(); ci++) {
            if (wc[ci] !== playerFrame && wc[ci] !== playerLabel) wc[ci].Destroy();
        }
        clearEntityFrames();
        tileMap = generateMap();
        renderMap(tileMap);
        updateTileMap(tileMap);
        const sp = data.playerPosition;
        if (sp !== undefined) setPlayerPosition({ x: sp.x, y: sp.y });
        else setPlayerPosition({ x: (MAP_WIDTH * TILE_SIZE) / 2, y: (MAP_HEIGHT * TILE_SIZE) / 2 });
        const entityList = data.entities;
        if (entityList !== undefined) {
            for (let ei = 0; ei < entityList.size(); ei++) {
                renderEntity(entityList[ei]);
            }
        }
        updateCamera(getPlayerPosition().x, getPlayerPosition().y);
    } else if (msg.type === "entityUpdate" && msg.data !== undefined) {
        const data = msg.data as { entities: Array<{ id: string; position: { x: number; y: number } }> };
        if (data.entities !== undefined) {
            for (let ei = 0; ei < data.entities.size(); ei++) {
                const ent = data.entities[ei];
                const frame = world.FindFirstChild("Entity_" + ent.id) as Frame;
                if (frame !== undefined) {
                    frame.Position = UDim2.fromOffset(ent.position.x * TILE_SIZE + 2, ent.position.y * TILE_SIZE + 2);
                }
            }
        }
    } else if (msg.type === "combatResult" && msg.data !== undefined) {
        const data = msg.data as { message?: string };
        if (data.message !== undefined) print(data.message);
    }
});

RunService.Heartbeat.Connect((dt: number) => {
    handleMovement(dt);
    updateCamera(getPlayerPosition().x, getPlayerPosition().y);
});
