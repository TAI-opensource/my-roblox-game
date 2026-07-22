export interface PlayerData {
	userId: number;
	name: string;
	cash: number;
	level: number;
}

const playerDataMap = new Map<number, PlayerData>();

export function getOrCreatePlayerData(player: Player): PlayerData {
	let data = playerDataMap.get(player.UserId);
	if (!data) {
		data = {
			userId: player.UserId,
			name: player.Name,
			cash: 0,
			level: 1,
		};
		playerDataMap.set(player.UserId, data);
	}
	return data;
}

export function removePlayerData(userId: number): void {
	playerDataMap.delete(userId);
}

export function addCash(userId: number, amount: number): void {
	const data = playerDataMap.get(userId);
	if (data) {
		data.cash += amount;
	}
}

export function getPlayerData(userId: number): PlayerData | undefined {
	return playerDataMap.get(userId);
}
