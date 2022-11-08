math.randomseed(os.time())
difficulties = {"Easy", "Medium", "Hard"}

request = function()
    local id = math.random(1, 3)
    path = wrk.path .. difficulties[id]
    return wrk.format(nil, path)
 end