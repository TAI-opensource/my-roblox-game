import { Players } from "@rbxts/services";
import { getOrCreatePlayerData, removePlayerData } from "../shared/PlayerData";

Players.PlayerAdded.Connect((player) => {
	const data = getOrCreatePlayerData(player);
	print(`[Server] ${data.name} entrou no jogo! Cash: ${data.cash}`);

	player.CharacterAdded.Connect((character) => {
		print(`[Server] ${data.name} spawnou!`);
	});
});

Players.PlayerRemoving.Connect((player) => {
	removePlayerData(player.UserId);
	print(`[Server] ${player.Name} saiu do jogo.`);
});

print("[Server] Game Server iniciado!");
