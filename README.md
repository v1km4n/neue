## neue
My crappy discord bot that mostly contains personal related commands and stuff, the only thing that *I guess* can be useful for others is [ETF2L](https://etf2l.org/)/[UGC](https://www.ugcleague.com/)/[RGL](https://rgl.gg/) parser. 

### Installation
Friendly reminder to myself in case I need to re-setup this on another VPS:

- Take Discord token from [here](https://discord.com/developers/applications/418819481461063680/bot)
- Take Steam token from [here](https://steamcommunity.com/dev/apikey)
- Install [Docker](https://docs.docker.com/engine/install)
- docker run -d -e DISCORDTOKEN="`le discord token`" -e STEAMTOKEN="`le steam token`" --name neue simploka/neue:latest

### TODO

- Make use of GitHub Actions for Docker image tagging & publishing as well as deployment of the bot itself
- Use a separate vars file and Docker volumes instead of env vars for token storage
