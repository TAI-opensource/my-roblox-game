-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "node_modules", "@rbxts", "services").Players
local _PlayerData = TS.import(script, game:GetService("ReplicatedStorage"), "Shared", "PlayerData")
local getOrCreatePlayerData = _PlayerData.getOrCreatePlayerData
local removePlayerData = _PlayerData.removePlayerData
Players.PlayerAdded:Connect(function(player)
	local data = getOrCreatePlayerData(player)
	print(`[Server] {data.name} entrou no jogo! Cash: {data.cash}`)
	player.CharacterAdded:Connect(function(character)
		print(`[Server] {data.name} spawnou!`)
	end)
end)
Players.PlayerRemoving:Connect(function(player)
	removePlayerData(player.UserId)
	print(`[Server] {player.Name} saiu do jogo.`)
end)
print("[Server] Game Server iniciado!")
