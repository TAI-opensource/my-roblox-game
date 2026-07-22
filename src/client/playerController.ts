import { UserInputService } from "@rbxts/services";
import { Position, TileType, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, MOVE_SPEED } from "../shared/types";

let playerFrame: Frame;
let world: Frame;
let remoteEvent: RemoteEvent;
let currentPosition: Position = { x: 0, y: 0 };
let tileMap: TileType[][] = [];
let entityFrames = new Map<string, Frame>();
let keysPressed = new Map<Enum.KeyCode, boolean>();
let playerLabel: TextLabel | undefined;

const HALF = 12;

function passable(t: TileType): boolean {
    return t === TileType.Grass || t === TileType.Path || t === TileType.Door || t === TileType.Flower || t === TileType.Sand || t === TileType.Bridge;
}

function blocked(x: number, y: number): boolean {
    if (tileMap.size() === 0) return true;
    const tx = math.floor(x / TILE_SIZE);
    const ty = math.floor(y / TILE_SIZE);
    if (tx < 0 || tx >= MAP_WIDTH || ty < 0 || ty >= MAP_HEIGHT) return true;
    return !passable(tileMap[ty][tx]);
}

export function initPlayerController(w: Frame, pf: Frame, re: RemoteEvent, tm: TileType[][]) {
    world = w;
    playerFrame = pf;
    remoteEvent = re;
    tileMap = tm;
    playerLabel = pf.FindFirstChildOfClass("TextLabel") as TextLabel | undefined;
    UserInputService.InputBegan.Connect((input, gpe) => {
        if (gpe) return;
        if (input.UserInputType === Enum.UserInputType.Keyboard) {
            keysPressed.set(input.KeyCode, true);
        } else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
            const mp = UserInputService.GetMouseLocation();
            const entries: [string, Frame][] = [];
            entityFrames.forEach((f, id) => entries.push([id, f]));
            for (let ei = 0; ei < entries.size(); ei++) {
                const [id, f] = [entries[ei][0], entries[ei][1]];
                const ap = f.AbsolutePosition;
                const as = f.AbsoluteSize;
                if (mp.X >= ap.X && mp.X <= ap.X + as.X && mp.Y >= ap.Y && mp.Y <= ap.Y + as.Y) {
                    remoteEvent.FireServer({ type: "attack", data: { targetId: id } });
                    break;
                }
            }
        }
    });
    UserInputService.InputEnded.Connect((input) => {
        if (input.UserInputType === Enum.UserInputType.Keyboard) {
            keysPressed.set(input.KeyCode, false);
        }
    });
}

export function getPlayerPosition(): Position {
    return currentPosition;
}

export function setPlayerPosition(pos: Position) {
    currentPosition = { x: pos.x, y: pos.y };
    playerFrame.Position = UDim2.fromOffset(currentPosition.x - HALF, currentPosition.y - HALF);
}

export function updateTileMap(tm: TileType[][]) {
    tileMap = tm;
}

export function registerEntityFrame(id: string, frame: Frame) {
    entityFrames.set(id, frame);
}

export function clearEntityFrames() {
    entityFrames.clear();
}

export function handleMovement(dt: number) {
    if (tileMap.size() === 0) return;
    let dx = 0;
    let dy = 0;
    if (keysPressed.get(Enum.KeyCode.W)) dy -= 1;
    if (keysPressed.get(Enum.KeyCode.S)) dy += 1;
    if (keysPressed.get(Enum.KeyCode.A)) dx -= 1;
    if (keysPressed.get(Enum.KeyCode.D)) dx += 1;
    if (dx === 0 && dy === 0) {
        if (playerLabel) playerLabel.Text = "P";
        return;
    }
    const len = math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;
    let nx = currentPosition.x + dx * MOVE_SPEED * dt;
    let ny = currentPosition.y + dy * MOVE_SPEED * dt;
    const mx = MAP_WIDTH * TILE_SIZE - HALF;
    const my = MAP_HEIGHT * TILE_SIZE - HALF;
    nx = math.clamp(nx, HALF, mx);
    ny = math.clamp(ny, HALF, my);
    if (blocked(nx - HALF, ny - HALF) || blocked(nx + HALF - 1, ny - HALF) || blocked(nx - HALF, ny + HALF - 1) || blocked(nx + HALF - 1, ny + HALF - 1)) return;
    currentPosition.x = nx;
    currentPosition.y = ny;
    playerFrame.Position = UDim2.fromOffset(nx - HALF, ny - HALF);
    if (playerLabel) {
        if (dx < 0) playerLabel.Text = "<";
        else if (dx > 0) playerLabel.Text = ">";
        else if (dy < 0) playerLabel.Text = "^";
        else playerLabel.Text = "v";
    }
    remoteEvent.FireServer({ type: "move", data: { x: nx, y: ny } });
}
