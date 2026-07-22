import { TileType, MAP_WIDTH, MAP_HEIGHT } from "./types";

export function generateMap(): number[][] {
    const map = new Array<Array<number>>(MAP_HEIGHT);

    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = new Array<number>(MAP_WIDTH);
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = TileType.Grass;
        }
    }

    const cx = 30;
    const cy = 20;

    for (let x = 0; x < MAP_WIDTH; x++) {
        if (map[cy][x] === TileType.Grass) map[cy][x] = TileType.Path;
    }
    for (let y = 0; y < MAP_HEIGHT; y++) {
        if (map[y][cx] === TileType.Grass) map[y][cx] = TileType.Path;
    }

    for (let y = 18; y <= 22; y++) {
        for (let x = 28; x <= 32; x++) {
            map[y][x] = TileType.Path;
        }
    }

    for (let y = 18; y <= 19; y++) {
        for (let x = 28; x <= 30; x++) {
            map[y][x] = TileType.Wall;
        }
    }
    map[19][29] = TileType.Door;

    for (let y = 21; y <= 22; y++) {
        for (let x = 30; x <= 32; x++) {
            map[y][x] = TileType.Wall;
        }
    }
    map[21][31] = TileType.Door;

    for (let y = 28; y <= 35; y++) {
        for (let x = 5; x <= 15; x++) {
            map[y][x] = TileType.Water;
        }
    }

    for (let y = 27; y <= 36; y++) {
        for (let x = 4; x <= 16; x++) {
            if (y >= 28 && y <= 35 && x >= 5 && x <= 15) continue;
            if (y < 0 || y >= MAP_HEIGHT || x < 0 || x >= MAP_WIDTH) continue;
            const dx = x < 5 ? 5 - x : x > 15 ? x - 15 : 0;
            const dy = y < 28 ? 28 - y : y > 35 ? y - 35 : 0;
            if (dx + dy <= 2 && map[y][x] === TileType.Grass) {
                map[y][x] = TileType.Sand;
            }
        }
    }

    for (let x = 5; x <= 15; x++) {
        map[31][x] = TileType.Bridge;
    }

    const forestPatches = [
        { y1: 1, y2: 8, x1: 3, x2: 20 },
        { y1: 0, y2: 6, x1: 38, x2: 57 },
        { y1: 9, y2: 14, x1: 45, x2: 58 },
    ];

    for (let pi = 0; pi < forestPatches.size(); pi++) {
        const patch = forestPatches[pi];
        for (let y = patch.y1; y <= patch.y2; y++) {
            for (let x = patch.x1; x <= patch.x2; x++) {
                if (map[y][x] === TileType.Grass && math.random(1, 100) <= 65) {
                    map[y][x] = TileType.Tree;
                }
            }
        }
    }

    for (let i = 0; i < 25; i++) {
        const x = math.random(0, MAP_WIDTH - 1);
        const y = math.random(0, MAP_HEIGHT - 1);
        if (map[y][x] === TileType.Grass) {
            map[y][x] = TileType.Rock;
        }
    }

    for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
            const x = cx + dx;
            const y = cy + dy;
            if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
                if (map[y][x] === TileType.Grass && math.random(1, 100) <= 50) {
                    map[y][x] = TileType.Flower;
                }
            }
        }
    }

    return map;
}
