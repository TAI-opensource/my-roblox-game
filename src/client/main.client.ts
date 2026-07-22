import { Players, StarterGui } from "@rbxts/services";

const player = Players.LocalPlayer;
if (!player) {
	error("LocalPlayer não encontrado!");
}

print(`[Client] Conectado como ${player.Name}`);

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, true);

print("[Client] Game Client iniciado!");
