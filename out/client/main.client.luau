-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "node_modules", "@rbxts", "services")
local Players = _services.Players
local StarterGui = _services.StarterGui
local player = Players.LocalPlayer
if not player then
	error("LocalPlayer não encontrado!")
end
print(`[Client] Conectado como {player.Name}`)
StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Health, true)
print("[Client] Game Client iniciado!")
