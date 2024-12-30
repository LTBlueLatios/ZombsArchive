# Changelog

## August 13, 2024 - Minor Update
- Minor security update

## January 17, 2024 - Minor Update
- Security update

## December 31, 2023 - Minor Update
- Security update

## December 11, 2023 - Minor Update
- Magic towers now fire 4 projectiles at max tier
- Local bans are now cleared every hour (global bans still clear monthly)
- Bomb tower and melee tower received a buff

## July 11, 2023 - Minor Update
- Increase pickaxe harvest count from [1, 2, 2, 3, 3, 4, 6] to [1.5, 3, 3, 4.5, 4.5, 6, 9]
- Increase gold mine gold per second from [4, 6, 7, 10, 12, 15, 25, 35] to [6, 8, 10.5, 15, 18, 22.5, 37.5, 52.5]
- Increase harvester harvest amount from [2.5, 4.65, 4.55, 7.2, 8.25, 10, 13.5, 16] to [3.75, 6.975, 6.825, 10.8, 12.375, 15, 20.25, 24]
- Increase harvester max storage from [400, 800, 1200, 1600, 2000, 2400, 2800, 3600] to [800, 1600, 2400, 3200, 4000, 4800, 5600, 7200]
- Increase harvester max deposit from [800, 1200, 1400, 2000, 2400, 2800, 4800, 6000] to [1600, 2400, 2800, 4000, 4800, 4800, 9600, 12000]
- Remove stricter disconnects when the server is full and the player is dead
- Increase afk timer check from 3 minutes to 6 minutes
- Fix a few gold mine precision bugs which caused a lower rate of gold to be earned

## January 4, 2023 - Minor Update
- The game now runs over https, which should fix some redirect loop errors

## September 2, 2022 - Minor Update
- Fix some implicit casting to float which caused inconsistent score to be gained per wave

## January 18, 2022 - Minor Update
- Fix some hostility detection bugs with pets
- Party share keys now change when kicking players. New keys are broadcast to non leader party members after 5 seconds
- Add a 1 second kick party member cooldown
- Limit building delete range
- Add a 100 ms delete building cooldown
- Fix wave 14 not spawning zombies
- Afk checking is now more strict
- Internal infrastructure maintenance

## January 8, 2022 - Minor Update
- Pets now keep their health percent when leveling up. Evolution remains the same. This fixes a pet invulnerability issue.
- Add missing token rewards to some bosses
- Remove Crossbow, which was invisible and never added to the game
- Fix party applications being acceptable by non leaders
- Fix towers and traps not attacking when players are attacked directly by players
- Fix pet damage not adding to hostility detection for buildings and players
- Pets now do zero damage to buildings without a gold stash
- Fix buildings not regenning when a 0 damage attack occurs
- Remove hostility from a player when it joins the party to stop towers from attacking the joining player
- Fix shield not being auto equipped, which made shields above tier 1 useless
- Add a "Can Sell Buildings" toggle cooldown of 100 ms to fix a party disconnection exploit

## November 20, 2021 - Minor Update
- Decrease spear damage to buildings from [3, 3.5, 4, 4.5, 5, 5.5, 5.5] to [0.75, 1.50, 2.25, 3, 3.75, 4.5, 5.25]
- Increase spear gold costs from [100, 400, 3000, 5000, 25000, 35000, 90000] to [1400, 2800, 5600, 11200, 22500, 45000, 90000]
- Cannon tower damage to players increased from [5, 5, 5, 5, 5, 5, 6, 8] to [5, 5, 6, 6, 7, 7, 8, 8]
- Arrow tower damage to players increased from [5, 5, 5, 5, 5, 5, 6, 6] to [5, 5, 6, 6, 7, 7, 8, 8]
- Bomb tower damage to players increased from [10, 10, 10, 10, 10, 10, 10, 10] to [9, 9, 10, 10, 11, 11, 12, 12]
- Magic tower damage to players increased from [5, 5, 5, 5, 5, 5, 5, 5] to [5, 5, 5, 6, 6, 6, 7, 7]
- Melee tower damage to players increased from [5, 5, 5, 5, 5, 5, 6, 6] to [5, 6, 7, 8, 9, 10, 11, 12]
- Increase distance between bases slightly because bomb towers can reach into other players bases
- Disallow damage to player objects if no gold stash is owned
- Minor security fixes

## November 13, 2021 - Minor Update
- Fix invincible pet bug
- Allow building over dead players and projectiles
- Add a 10 second pet potting cooldown
- Reduce bot flooding with challenge / response upgrades

## August 23, 2021 - Minor Update
- Extend hostility detection to work on individual players to stop scripts that start new partys and kick themselves to undo the old hostility detection
- Fix one method of pet invulnerability
- Zombie day time damage is now based on % of max health instead of % of current health to fix max tier walls + low level waves from lagging out the server
- Lower party change cooldown to 1 second from 15 seconds because the disconnection exploit has been fixed for a while now
- Remove cooldowns for open party toggle and party names because the disconnection exploit has been fixed  for a while now

## July 29, 2021 - Minor Update
- Seed the random number generator with more data to stop all of the game servers from having the same layout
- Fix off by one max player count bug

## April 24, 2021 - Minor Update
- Fix towers slowing down after some time due to floating point loss of precision
- Add a challenge / response system to help cut down on bot connections
- Harden game servers a bit against DoS attacks

## April 10, 2021 - Minor Update
- Fix a game server crash bug
- Reject rapid connections

## July 19, 2020 - Minor Update
- Fix disconnection exploit by sending party list once every 2.5 seconds instead of once for every change

## June 19, 2020 - Minor Update
- Reduce building walking time from 15 seconds to 3 seconds
- Reduce spawn invulnerability from 30 seconds to 3 seconds
- Prevent selling gold stash
- Delay leaderboard sending to help guard against scanning bots

## May 25, 2020 - Minor Update
- Fix disconnection exploit from spamming packets which broadcast to all players

## Jan 16, 2020 - Minor Update
- Fix gold generating exploit from rapid selling of buildings
- Also limit party joins once per 15 seconds that don't use a share key
- Limit pet respawning to once per 3 seconds to fix speed bug
- Limit health potion purchases to once per 15 seconds to prevent auto pot invulnerability

## Jan 15, 2020 - Minor Update
- Remove unused global chat due to abuse
- Limit party joins/leaves to once per 15 seconds because hostility detection works per party
- Disallow chat shortly after joining to allow time for ban checks to remove abusive players

## Jan 2, 2020 - Minor Update
- Ban ip's from individual game servers when they hit 10 concurrent (local ban). These are cleared when the server restarts.
- Globally ban ip's from all game servers if the join rate is too high.
- Global bans are copied (cached) locally on each server the first time the banned ip joins and are treated as local bans
- Global bans are cleared on the first day of each month
- Global bans which were cached as local bans will not clear until the game server restarts
- Backport a game server crash fix from zombsroyale

## May 7, 2019 - Minor Update
- Fix healing spell invulnerability bug

## Sept 24, 2017 - Minor Update
- Disable automatic disconnect when afk for 5 minutes

## July 10, 2017 - Minor Update

- Minor client optimization
- Fixed some internal performance metrics

## July 9, 2017 - Minor Update

- New Spell: HEAL TOWERS SPELL. Use the heal spell located on the left side of your screen to cast an AOE heal on your towers that repair them over time!
- You can now walk through your own buildings for 15 seconds after respawning
- Health potions are no longer usable for 3 seconds after being hit by an enemy tower
- Fixed resources displaying as negative when their values are too high
- Fixed score integer overflow
- Reduce bow range and speed

## June 26, 2017 - Minor Update

- Fixed the melee tower graphics.
- Fixed harvester capacity bar overflowing.
- Potential fix for network delay issue.

## June 25, 2017 - Minor Update

- New Pet - WOODY THE HARVESTER. Woody will follow you around and harvest resources that you target, levelling up in the process.
- Optimized rendering of assets for better performance.
- Optimized rendering of the game UI.

## June 12, 2017 - Minor Update

- New Building - RESOURCE HARVESTERS. You can now place 2 harvesters anywhere on the map that will automatically harvest resources for you. They are fuelled by gold and require manual collection by hitting or clicking the Collect button.
- Added a fix for mouse buttons being held down blocking input.
- Added profanity filtering on usernames and party names.

## June 6, 2017 - Minor Update

- Fix display on high DPI devices.
- Made text rendering sharper in-game.
- Added shield bar to overall UI.

## June 3, 2017 - Minor Update

- Fixed an issue with building limits not resetting when players leave the party.
- Fixed an issue where you couldn't re-purchase some items in the Shop when you die.
- Made resource display more precise.

## June 2, 2017 - Minor Update

- Reworked the user interface to be more minimal and feature-complete.
- You can now reset the walkthrough by opening the settings menu and scrolling to the bottom.

## June 1, 2017 - Minor Update

- New Tower Unit - SLOW TRAPS. Place these strategically around your base to slow incoming zombies!
- Quality of Life - when weapon is equipped, you now cannot accidentally select a tower

## May 31, 2017 - Minor Update

- New Tier buildings - Tier 8 (Emerald) buildings are now available to build!
- Party function - Party leaders now can allow or disallow members from selling party buildings
- New Zombie tier - orange tiers!

## May 30, 2017 - Minor Update

- NEW TOWER - A new tower arrives! The spiky melee tower packs a punch, but it can only shoot in 1 direction. Press R when placing to determine which direction it will face. Choose it's position wisely, and this tower can do some serious damage to enemy zombies
- On-Hit Effects - When a zombie is damaged, you will now see an on-hit indicator showing that your towers have hit them!
- Waves - Boss waves were buffed, normal waves above level 100 were made more difficult, and bosses have started giving much more gold when you kill them
- Major Update coming soon

## May 28, 2017 - Minor Update

- Minor text fixes: Gold mines are always capped at 8 but multiply gold income by the number of players in a party.

## May 25, 2017 - Minor Update

- Reduced cooldown on potion use.

## May 24, 2017 - Minor Update

- [Feature] Spacebar now activates auto-harvesting.
- [Pet] Experience progress now displayed below the pet and shows level.
- [Other] You now keep all your items when you die.
- [Other] Added a leaderboard to the homepage. Note: Tracking only started today.

- Evolving pet before revive is no longer bugged.
- You are invulnerable when you respawn for 30 seconds.
- Fixed tokens not dropping by bosses.

## May 21, 2017 - Minor Update

- Added Kick function to party (only leader can kick).
- Added more purple zombies.
- Added a cooldown to using health potions to prevent abuse.
- Fixed a display bug with the party and shop menus.
- Server population should update much more frequently.

## May 18, 2017 - Minor Update

- Minor text fixes.
- Nerfed neutral monsters being too strong.
- Prevented neutral monsters from attacking towers and destroying bases.

## May 17, 2017 - Major Update

- [PETS] You can now have a pet that fights along with you. Check out the shop for how to obtain the first one. You level your pet via killing zombies and monsters around the map. You can also evolve your pet to make it stronger!
- [MONSTER CAMPS] There are now monster camps around the map that you can kill for experience for your pet. You can also kill them for fun. They will do more things later!
- [BOSS WAVES] There are now simple boss waves every 8 waves. These check how defensive your base is, they aren't made to be too hard. Bosses also drop tokens which you use to buy special things coming in the near future.
- [HATS] Hats!

- A few more new zombies - purple tier!
- Pet whistle calls your pet to return to you.
- There are now damage numbers when you or your pet hit enemies.
- More performance optimization and fixes.
- When players leave your party, their gold mines will despawn to prevent abuse.

## May 14, 2017 - Minor Update

- [PERFORMANCE] Network and frame rates optimized for lower-end systems.
- [WEAPONS] Bombs now collide with buildings.
- [BASE] You can no longer place a gold stash too close to another player's stash.
- [PLAYER] You are now given 30s of invulnerability when you respawn.
- [PLAYER] Added F key to use a health potion.

- Zombies no longer pause and move in random directions.
- Chat messages now show directly above the player and in a chatlog.

## May 12, 2017 - Major Update

- [WEAPONS] Buffed weapons massively against zombies and increased gold cost to balance.
- [ZOMBIES] Added a new yellow zombie tier and updated assets for all of the zombies. End-game waves will be harder - teamwork is much more important for climbing waves and achieving high scores!
- [SHOP] Added new Shield item to Shop (press B) that absorbs damage from zombies only.
- [SHOP] Added new Timeout item that prevents the next wave from attacking for one day-night cycle. Use this to take time to rebuild your base/adjust!
- [ZOMBIES] Adjusted waves 35-50 (red zombie waves are harder now - be careful).
- [TOWERS/PVP] Towers now attack you if you attack another player's base!
- [WEAPONS] Normalized damage across towers, players and zombies to reduce PvP snowballing.

- Added changelog to homepage.
- Added feedback widget to homepage.
- Added featured YouTuber functionality - contact us on Discord, Twitter or via the feedback form if you're interested.
- Added share buttons to invite directly to your party after the game ends.

## May 10, 2017 - Minor Update

- Fixed weapons not being usable after respawning.
- Fixed some potential server crashes.

## May 9, 2017 - Minor Update

- Temporarily disabled player vs. base damage so players can't grief (working on a better fix for this top enable more fun PvP).
- Fixed party invite not showing actual name.
