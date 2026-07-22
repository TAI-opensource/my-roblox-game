-- Compiled with roblox-ts v3.0.0
local playerDataMap = {}
local function getOrCreatePlayerData(player)
	local _userId = player.UserId
	local data = playerDataMap[_userId]
	if not data then
		data = {
			userId = player.UserId,
			name = player.Name,
			cash = 0,
			level = 1,
		}
		local _userId_1 = player.UserId
		local _data = data
		playerDataMap[_userId_1] = _data
	end
	return data
end
local function removePlayerData(userId)
	local _userId = userId
	playerDataMap[_userId] = nil
end
local function addCash(userId, amount)
	local _userId = userId
	local data = playerDataMap[_userId]
	if data then
		data.cash += amount
	end
end
local function getPlayerData(userId)
	local _userId = userId
	return playerDataMap[_userId]
end
return {
	getOrCreatePlayerData = getOrCreatePlayerData,
	removePlayerData = removePlayerData,
	addCash = addCash,
	getPlayerData = getPlayerData,
}
