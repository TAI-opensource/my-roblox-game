import { Players } from "@rbxts/services";
import {
    TileType,
    Position,
    EntityDef,
    PlayerState,
    CombatResult,
    MAP_WIDTH,
    MAP_HEIGHT,
} from "../shared/types";
import { generateMap } from "../shared/mapData";

let map: number[][] = [];
let entities: EntityDef[] = [];
const playerPositions = new Map<number, Position>();
const playerStates = new Map<number, PlayerState>();
let events: RemoteEvent | undefined;
let gameLoopRunning = false;

function canWalk(tileType: number): boolean {
    return (
        tileType === TileType.Grass ||
        tileType === TileType.Path ||
        tileType === TileType.Door ||
        tileType === TileType.Flower ||
        tileType === TileType.Sand ||
        tileType === TileType.Bridge
    );
}

function isPassable(x: number, y: number): boolean {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    return canWalk(map[y][x]);
}

function isOccupied(x: number, y: number, excludeId?: string): boolean {
    for (let ei = 0; ei < entities.size(); ei++) {
        const entity = entities[ei];
        if (excludeId !== undefined && entity.id === excludeId) continue;
        if (entity.hp <= 0) continue;
        if (entity.position.x === x && entity.position.y === y) return true;
    }
    const posList: Position[] = [];
    playerPositions.forEach((p) => posList.push(p));
    for (let pi = 0; pi < posList.size(); pi++) {
        if (posList[pi].x === x && posList[pi].y === y) return true;
    }
    return false;
}

function createEntities(): void {
    entities = [
        {
            id: "npc_farmer",
            name: "Farmer",
            type: "npc",
            position: { x: 26, y: 20 },
            color: Color3.fromRGB(255, 200, 100),
            hp: 9999,
            maxHp: 9999,
            dialog: [
                "Welcome to Pixel Quest!",
                "The forest is dangerous...",
                "Be careful out there!",
            ],
            patrol: [{ x: 26, y: 20 }],
        },
        {
            id: "npc_merchant",
            name: "Merchant",
            type: "npc",
            position: { x: 33, y: 19 },
            color: Color3.fromRGB(200, 100, 50),
            hp: 9999,
            maxHp: 9999,
            dialog: [
                "I sell potions!",
                "Come back when you have gold.",
                "Travel safely!",
            ],
            patrol: [{ x: 33, y: 19 }],
        },
        {
            id: "npc_sage",
            name: "Sage",
            type: "npc",
            position: { x: 29, y: 23 },
            color: Color3.fromRGB(150, 100, 200),
            hp: 9999,
            maxHp: 9999,
            dialog: [
                "The ancient evil stirs...",
                "You must become stronger.",
                "Defeat the slimes first!",
            ],
            patrol: [{ x: 29, y: 23 }],
        },
    ];

    const enemyDefs: Array<{ name: string; pos: Position; color: Color3; hp: number; dmg: number; xp: number }> = [
        { name: "Green Slime", pos: { x: 10, y: 5 }, color: Color3.fromRGB(50, 200, 50), hp: 5, dmg: 1, xp: 5 },
        { name: "Blue Slime", pos: { x: 45, y: 8 }, color: Color3.fromRGB(50, 100, 255), hp: 7, dmg: 2, xp: 8 },
        { name: "Red Slime", pos: { x: 50, y: 30 }, color: Color3.fromRGB(255, 50, 50), hp: 9, dmg: 3, xp: 11 },
        { name: "Purple Slime", pos: { x: 8, y: 25 }, color: Color3.fromRGB(150, 50, 200), hp: 11, dmg: 4, xp: 14 },
        { name: "Dark Slime", pos: { x: 40, y: 35 }, color: Color3.fromRGB(30, 30, 30), hp: 13, dmg: 5, xp: 17 },
    ];

    for (let i = 0; i < enemyDefs.size(); i++) {
        const def = enemyDefs[i];
        entities.push({
            id: `enemy_slime_${i}`,
            name: def.name,
            type: "enemy",
            position: { x: def.pos.x, y: def.pos.y },
            color: def.color,
            hp: def.hp,
            maxHp: def.hp,
            xpReward: def.xp,
            damage: def.dmg,
            patrol: [{ x: def.pos.x, y: def.pos.y }],
        });
    }
}

function broadcastToAll(msgType: string, msgData: unknown): void {
    if (events === undefined) return;
    const msg = { type: msgType, data: msgData };
    const plist = Players.GetPlayers();
    for (let pi = 0; pi < plist.size(); pi++) {
        (events as RemoteEvent).FireClient(plist[pi], msg);
    }
}

function broadcastEntityUpdate(): void {
    broadcastToAll("entityUpdate", { entities });
}

function updatePatrol(): void {
    let changed = false;

    for (let ei = 0; ei < entities.size(); ei++) {
        const entity = entities[ei];
        if (entity.hp <= 0) continue;

        const anchor = entity.patrol?.[0];
        if (anchor === undefined) continue;

        const radius = entity.type === "npc" ? 2 : 3;
        const dx = entity.position.x - anchor.x;
        const dy = entity.position.y - anchor.y;
        const dist = math.abs(dx) + math.abs(dy);

        let nx = entity.position.x;
        let ny = entity.position.y;

        if (dist >= radius) {
            nx += dx > 0 ? -1 : dx < 0 ? 1 : 0;
            ny += dy > 0 ? -1 : dy < 0 ? 1 : 0;
        } else {
            const dirs = [
                { x: 0, y: 1 },
                { x: 0, y: -1 },
                { x: 1, y: 0 },
                { x: -1, y: 0 },
            ];
            const dir = dirs[math.random(0, 3)];
            nx = entity.position.x + dir.x;
            ny = entity.position.y + dir.y;
        }

        if (nx !== entity.position.x || ny !== entity.position.y) {
            if (
                isPassable(nx, ny) &&
                !isOccupied(nx, ny, entity.id) &&
                math.abs(nx - anchor.x) + math.abs(ny - anchor.y) <= radius
            ) {
                entity.position = { x: nx, y: ny };
                changed = true;
            }
        }
    }

    if (changed) {
        broadcastEntityUpdate();
    }
}

function startGameLoop(): void {
    if (gameLoopRunning) return;
    gameLoopRunning = true;

    task.spawn(() => {
        while (gameLoopRunning) {
            task.wait(0.5);
            updatePatrol();
        }
    });
}

function respawnEntity(entityId: string): void {
    task.wait(10);

    const entity = entities.find((e) => e.id === entityId);
    if (entity === undefined) return;

    entity.hp = entity.maxHp;
    const anchor = entity.patrol?.[0];
    if (anchor !== undefined) {
        entity.position = { x: anchor.x, y: anchor.y };
    }
    broadcastEntityUpdate();
}

function findNearestEntity(pos: Position, maxDist: number): EntityDef | undefined {
    let nearest: EntityDef | undefined;
    let nearestDist = maxDist;

    for (let ei = 0; ei < entities.size(); ei++) {
        const entity = entities[ei];
        if (entity.hp <= 0) continue;
        if (entity.type !== "enemy") continue;
        const dist = math.abs(entity.position.x - pos.x) + math.abs(entity.position.y - pos.y);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearest = entity;
        }
    }

    return nearest;
}

export function initGameManager(player: Player, remoteEvent: RemoteEvent): void {
    events = remoteEvent;

    if (map.size() === 0) {
        map = generateMap();
    }
    if (entities.size() === 0) {
        createEntities();
    }

    startGameLoop();

    const pState: PlayerState = {
        hp: 10,
        maxHp: 10,
        xp: 0,
        xpToNextLevel: 20,
        level: 1,
        attack: 3,
        defense: 1,
        gold: 0,
    };
    playerStates.set(player.UserId, pState);

    const spawnPos: Position = { x: 29, y: 20 };
    playerPositions.set(player.UserId, spawnPos);

    const initMsg = {
        type: "init",
        data: {
            map,
            entities,
            playerPosition: spawnPos,
            playerState: pState,
        },
    };
    (events as RemoteEvent).FireClient(player, initMsg);

    const conn = (events as RemoteEvent).OnServerEvent.Connect(
        (plr: Player, ...args: unknown[]) => {
            if (plr !== player) return;
            const msg = args[0] as { type: string; data: unknown } | undefined;
            if (msg === undefined) return;

            if (msg.type === "move") {
                const moveData = msg.data as { position?: Position } | undefined;
                const targetPos = moveData?.position;
                if (targetPos === undefined) return;

                const currentPos = playerPositions.get(player.UserId);
                if (currentPos === undefined) return;

                const dx = targetPos.x - currentPos.x;
                const dy = targetPos.y - currentPos.y;

                if (math.abs(dx) + math.abs(dy) !== 1) return;
                if (!isPassable(targetPos.x, targetPos.y)) return;
                if (isOccupied(targetPos.x, targetPos.y)) return;

                playerPositions.set(player.UserId, targetPos);

                broadcastToAll("entityUpdate", {
                    entities,
                    playerPositions: [
                        { userId: player.UserId, position: targetPos },
                    ],
                });
            } else if (msg.type === "attack") {
                const pPos = playerPositions.get(player.UserId);
                if (pPos === undefined) return;

                const target = findNearestEntity(pPos, 2);
                if (target === undefined) return;

                const bonus = math.random(1, 3);
                const damage = pState.attack + bonus;
                target.hp -= damage;
                const killed = target.hp <= 0;

                if (target.hp < 0) target.hp = 0;

                const result: CombatResult = {
                    attackerId: "" + player.UserId,
                    targetId: target.id,
                    damage,
                    killed,
                };

                broadcastToAll("combatResult", result);

                if (killed) {
                    if (target.xpReward !== undefined) {
                        pState.xp += target.xpReward;
                        pState.gold += target.xpReward;

                        while (pState.xp >= pState.xpToNextLevel) {
                            pState.xp -= pState.xpToNextLevel;
                            pState.level += 1;
                            pState.xpToNextLevel = math.floor(pState.xpToNextLevel * 1.5);
                            pState.attack += 1;
                            pState.defense += 1;
                            pState.maxHp += 2;
                            pState.hp = pState.maxHp;
                        }

                        const stateMsg = {
                            type: "playerUpdate",
                            data: { playerState: pState },
                        };
                        (events as RemoteEvent).FireClient(player, stateMsg);
                    }

                    task.spawn(() => respawnEntity(target.id));
                    broadcastEntityUpdate();
                }
            }
        },
    );

    player.CharacterAdded.Connect(() => {
        const reinitMsg = {
            type: "init",
            data: {
                map,
                entities,
                playerPosition: playerPositions.get(player.UserId),
                playerState: playerStates.get(player.UserId),
            },
        };
        (events as RemoteEvent).FireClient(player, reinitMsg);
    });

    player.AncestryChanged.Connect(() => {
        if (!player.IsDescendantOf(game)) {
            conn.Disconnect();
            playerPositions.delete(player.UserId);
            playerStates.delete(player.UserId);

            if (Players.GetPlayers().size() === 0) {
                gameLoopRunning = false;
            }
        }
    });
}
