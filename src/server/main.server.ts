import { Players, ReplicatedStorage } from "@rbxts/services";
import { initGameManager } from "./gameManager";

const events = new Instance("RemoteEvent");
events.Name = "PixelQuestSync";
events.Parent = ReplicatedStorage;

print("[Pixel Quest] Servidor iniciado!");

Players.PlayerAdded.Connect((player) => {
    initGameManager(player, events);
});
