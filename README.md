## neue
My crappy discord bot that mostly contains personal related commands and stuff, the only thing that *I guess* can be useful for others is [ETF2L](https://etf2l.org/)/[UGC](https://www.ugcleague.com/)/[RGL](https://rgl.gg/) parser. 

### Installation
Friendly reminder to myself in case I need to re-setup this on another VPS:

- Get Discord token from [here](https://discord.com/developers/applications/418819481461063680/bot)
- Get Steam token from [here](https://steamcommunity.com/dev/apikey)
- Get serveme.tf token from [here](https://serveme.tf/settings)
- Create an .env file with the following:
```.env
DISCORDTOKEN=<Discord Bot Token>
STEAMTOKEN=<Steam App Token>
SERVEMEAPIKEY=<serveme.tf API Key>
```
- Install [Docker](https://docs.docker.com/engine/install)
- `docker run -d --env-file=$(pwd)/.env --name neue simploka/neue:latest`

### TODO

- Replace XMLHttpRequest package with Axios so that a single package is used for HTTP requests
