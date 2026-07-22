import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from "../shared/types";

let gameView: Frame;
let world: Frame;

export function initCamera(gv: Frame, w: Frame) {
    gameView = gv;
    world = w;
}

export function updateCamera(targetX: number, targetY: number) {
    const viewSize = gameView.AbsoluteSize;
    if (viewSize.X === 0 || viewSize.Y === 0) return;
    const targetCamX = targetX - viewSize.X / 2;
    const targetCamY = targetY - viewSize.Y / 2;
    let camX = -world.Position.X.Offset;
    let camY = -world.Position.Y.Offset;
    const lerpFactor = 1 - math.pow(0.5, 8 * (1 / 60));
    camX += (targetCamX - camX) * lerpFactor;
    camY += (targetCamY - camY) * lerpFactor;
    const worldWidth = MAP_WIDTH * TILE_SIZE;
    const worldHeight = MAP_HEIGHT * TILE_SIZE;
    const maxCamX = math.max(0, worldWidth - viewSize.X);
    const maxCamY = math.max(0, worldHeight - viewSize.Y);
    camX = math.clamp(camX, 0, maxCamX);
    camY = math.clamp(camY, 0, maxCamY);
    world.Position = UDim2.fromOffset(-camX, -camY);
}
