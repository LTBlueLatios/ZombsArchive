const $ = (element) => {
    const x = document.getElementsByClassName(element);
    return x.length === 1 ? x[0] : Object.values(x);
};
const createElement = html => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
};
const styles = document.createElement("style");
styles.appendChild(document.createTextNode(`
.hud-menu-XXX {
    display: none;
    position: fixed;
    top: 46%;
    left: 43%;
    width: 1000px;
    height: 640px;
    margin: -270px 0 0 -300px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.6);
    color: #eee;
    border-radius: 4px;
    z-index: 15;
    box-shadow: 0 0 20px #999999;
    animation: glow 2s infinite alternate;
}


.hud-menu-XXX h3 {
    display: block;
    margin: 0;
    line-height: 20px;
}

.hud-menu-XXX .hud-XXX-grid {
    display: block;
    position: relative;
    top: 60%;
    height: 570px;
    margin: 20px 0 0;
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    overflow: auto;
    border-radius: 3px;
}
.hud-menu-XXX .hud-XXX-grid::-webkit-scrollbar {
    display: none;
}

.hud-menu-XXX .hud-XXX-grid label {
    display: block;
    margin: 0 0 20px;
    cursor: default;
}

.hud-menu-XXX .hud-XXX-grid label:last-child {
    margin-bottom: 0;
}

.hud-menu-XXX .hud-XXX-grid label > span {
    display: block;
    margin: 0 0 8px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    font-size: 12px;
}

.hud-menu-XXX .hud-XXX-grid .hud-XXX-settings {
    display: block;
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 24px;
    list-style: none;
    padding: 0;
}

.hud-menu-XXX .hud-XXX-grid .hud-XXX-settings li {
    display: inline-block;
    width: 49%;
}

.hud-menu-XXX .hud-XXX-grid .hud-XXX-settings li strong {
    color: #eee;
}

.hud-menu-XXX .hud-XXX-grid .hud-XXX-hints {
    display: block;
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 20px;
    list-style: none;
    padding: 0;
}

.hud-menu-XXX .hud-XXX-grid .hud-XXX-hints li {
    position: relative;
    height: 30px;
    line-height: 30px;
    padding: 0 0 0 48px;
    margin: 0 0 4px;
}

.hud-menu-XXX .hud-XXX-grid .hud-XXX-hints li:last-child {
    margin-bottom: 0;
}

.hud-menu-XXX .hud-XXX-grid .hud-XXX-hints li .hud-XXX-hints-icon {
    position: absolute;
    top: 50%;
    left: 0;
    width: 32px;
    height: 32px;
    margin: -16px 0 0;
    background-size: cover;
    background-position: center;
}

.hud-spell-icons .hud-spell-icon[data-type=XXX]::before {
    background-image: url('https://cdn-icons-png.freepik.com/512/771/771203.png');
}

.hud-chat {
    width: auto;
    min-width: 500px;
}

`))

document.head.appendChild(styles);
document.body.insertAdjacentHTML("afterbegin", `
    <style>
        .hud-XXX-sidebar {
            width: 200px; /* Adjust the width as needed */
            float: left;
        }
        .hud-XXX-grid {
            width: calc(100% - 210px); /* Adjust the width by subtracting sidebar width + margin */
            float: right;
        }
    </style>
    <div id="hud-menu-XXX" class="hud-menu hud-menu-XXX">
        <a class="hud-menu-close"></a>
        <div style="text-align:center">
            <div class="xxx hud-XXX-sidebar"></div>
            <div class="hud-XXX-grid"></div>
        </div>
    </div>
`);

const icon = createElement(`<div class="hud-spell-icon" data-type="XXX">XXX</div>`);
$("hud-spell-icons").appendChild(icon);
icon.addEventListener("click", () => {
    menu.style.display == "" ? menu.style.display = "block" : menu.style.display = "";
    $("hud-menu-party").style.display = "";
    $("hud-menu-shop").style.display = "";
    $("hud-menu-settings").style.display = "";
});
$("hud-menu-icon").forEach(e => { e.addEventListener("click", () => menu.style.display = ""); });
document.addEventListener("keyup", e => {
    const activeTag = document.activeElement.tagName.toLowerCase();
    if (activeTag == 'input' || activeTag == 'textarea') return;
    (e.keyCode == 80 || e.keyCode == 66 || e.keyCode == 79 || e.keyCode == 27) && (menu.style.display = "");
});
$("hud-menu-close")[0].addEventListener("click", () => menu.style.display = "");
$("hud").addEventListener("mouseup", () => menu.style.display = "");
game.network.addRpcHandler("Dead", () => menu.style.display = "");
const menu = $("hud-menu-XXX");
menu.addEventListener('mousedown', e => e.stopPropagation());
menu.addEventListener('mouseup', e => e.stopPropagation());

const equipItem = (item, tier) => {
    game.network.sendRpc({ name: "EquipItem", itemName: item, tier: tier });
};

const buyItem = (item, tier) => {
    game.network.sendRpc({ name: "BuyItem", itemName: item, tier: tier });
}

const shopShortcut = (item, tier) => {
    buyItem(item, tier);
    if (game.ui.playerWeaponName !== item) equipItem(item, tier);
}

const buyWeapon = (weapon, list) => {
    const tier = game.ui.inventory[weapon]?.tier | 0;
    if (game.ui.playerTick.gold > list[tier]) return shopShortcut(weapon, tier + 1);
    if (weapon != "ZombieShield") equipItem(weapon, tier);
}

const buyPet = (item, tier) => {
    if ((!game.ui.getPlayerPetName() && window.activated) || game.ui.getPlayerPetName() == item) return shopShortcut("PetRevive", 1);
    let i = 0;
    const j = setInterval(() => {
        shopShortcut(item, tier);
        if (++i >= 25 || game.ui.getPlayerPetName() == item) {
            clearInterval(j);
        }
    }, 250);
}

const getPetTier = (num) => {
    if (document.querySelectorAll(".hud-shop-item-tier")[5].childNodes[0].textContent.match(/\d+/) != null) {
        const petLevel = document.querySelectorAll(".hud-shop-item-tier")[num].childNodes[0].textContent.match(/\d+/)[0]
        if (petLevel <= 8) return 1;
        if (petLevel <= 16) return 2;
        if (petLevel <= 24) return 3;
        if (petLevel <= 32) return 4;
        if (petLevel <= 48) return 5;
        if (petLevel <= 64) return 6;
        if (petLevel <= 96) return 7;
        if (petLevel > 96) return 8;
    } else return 8;
}

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<a id="shopshortcut1"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-pickaxe-t7[1].svg"></a>
<a id="shopshortcut2"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-spear-t7[1].svg"></a>
<a id="shopshortcut3"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-bow-t7[1].svg"></a>
<a id="shopshortcut4"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-bomb-t7[1].svg"></a>
<a id="shopshortcut5"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-health-potion[1].svg"></a>
<a id="shopshortcut6"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-pet-health-potion[1].svg"></a>
<a id="shopshortcut7"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-shield-t1[1].svg"></a>
<a id="shopshortcut8"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-pet-ghost-t1[1].svg"></a>
<a id="shopshortcut9"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-pet-miner-t8[1].svg"></a>
<a id="shopshortcut10"><img src="/pictures/65698807-c047-4e77-bf51-7937b4cef560_inventory-pet-carl-t8[1].svg"></a>
`;


document.getElementById('shopshortcut1').addEventListener('click', () => buyWeapon("Pickaxe", pickaxePrices));
document.getElementById('shopshortcut2').addEventListener('click', () => buyWeapon("Spear", spearPrices));
document.getElementById('shopshortcut3').addEventListener('click', () => buyWeapon("Bow", bowPrices));
document.getElementById('shopshortcut4').addEventListener('click', () => buyWeapon("Bomb", bombPrices));
document.getElementById('shopshortcut5').addEventListener('click', () => shopShortcut("HealthPotion", 1));
document.getElementById('shopshortcut6').addEventListener('click', () => shopShortcut("PetHealthPotion", 1));
document.getElementById('shopshortcut7').addEventListener('click', () => buyWeapon("ZombieShield", shieldPrices));
document.getElementById('shopshortcut8').addEventListener('click', () => game.ui.getPlayerPetUid() && game.network.sendRpc({ name: "DeleteBuilding", uid: game.ui.getPlayerPetUid() }));
document.getElementById('shopshortcut9').addEventListener('click', () => buyPet("PetMiner", getPetTier(6)));
document.getElementById('shopshortcut10').addEventListener('click', () => buyPet("PetCARL", getPetTier(6)));

const css = `
 .btn:hover {
     cursor: pointer;
}
.btn-blue, .btn-white {
    background-image: url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdata.1freewallpapers.com%2Fdownload%2Ftexture-black-background-2560x1600.jpg&f=1&nofb=1&ipt=13b39bd487316526123425843c2c5f2eff5eae32f65b29982f729bc5afed56aa&ipo=images);
    background-size: cover;
    color: #fff;
    line-height: inherit;
    padding: 10px;
    border: 2px solid black;
    border-color: #828282;
    flex: 1;
    margin: 0;
}
.btn-graphite {
    background-image: url(https://img.freepik.com/free-photo/black-concrete-wall_24972-1046.jpg?size=626&ext=jpg&ga=GA1.1.34264412.1711238400&semt=ais);
    background-size: cover;
    color: #fff;
    line-height: inherit;
    padding:0.6em 2em;
    border: 1px solid black;
    border-color: #828282;
}
.btn-blue:graphite{
     color: #fff;
     background-image: url(https://img.freepik.com/free-photo/black-concrete-wall_24972-1046.jpg?size=626&ext=jpg&ga=GA1.1.34264412.1711238400&semt=ais);
     background-size: cover;
}
`;

const stl = document.createElement("style");
stl.appendChild(document.createTextNode(css));
document.head.appendChild(stl);
stl.type = "text/css";

$("xxx").innerHTML = `
<button class="btn btn-blue Main" style="width:100%;">Main</button><br>
<button class="btn btn-blue AutoBuild" style="width:100%;">AutoBuild</button><br>
<button class="btn btn-blue WebSockets" style="width:100%;">WebSockets</button><br>
<button class="btn btn-blue Settings" style="width:100%;">Settings</button><br>
<button class="btn btn-blue Others" style="width:100%;">Others</button>
`;
// display: flex; flex-direction: column; align-items: stretch; height: auto;

// t = toggle
// b = button

const html1 = `<div class="MainMenu">
<p>Auto Heal + Auto Pet (Revive + Evolve)</p>
<hr>
<button class="btn btn-blue autoheal t" style="width:45%">Enable Auto Heal</button>
<button class="btn btn-blue autopetheal t" style="width:45%">Enable Auto Pet Heal</button>
<button class="btn btn-blue autorevivepet t" style="width:45%">Enable Auto Revive Pet</button>
<button class="btn btn-blue autoevolve t" style="width:45%">Enable Auto Evolve Pet</button>
<button class="btn btn-blue autorespawn t" style="width:45%">Enable Auto Respawn</button>
<hr>
<p>Auto (Upgrade + Build + Bow + Aim) + PlayerFollower + Ahrc</p>
<hr>
<button class="btn btn-blue autobuild t" style="width:45%">Enable Auto Build</button>
<button class="btn btn-blue smartautoupgrade t" style="width:45%">Enable Smart Auto Upgrade</button>
<input type="text" class="btn btn-white auainput" placeholder="max tier" value="2" style="width:45%">
<button class="btn btn-blue autoupgradeall t" style="width:45%">Enable Auto Upgrade All</button>
<button class="btn btn-blue autodelete t" style="width:45%">Enable Auto Delete</button>
<button class="btn btn-blue playerinfo t" style="width:45%">Enable Player Info</button>
<button class="btn btn-blue autobow t" style="width:45%">Enable Auto Bow</button>
<button class="btn btn-blue autoaim t" style="width:45%">Enable Auto Aim</button>
<button class="btn btn-blue playerfollower t" style="width:45%">Enable Player Follower</button>
<button class="btn btn-blue ahrc t" style="width:45%">Enable Ahrc</button>
<hr>
<p>[cols]x[rows] Walls + (Join + Leave) Party</p>
<hr>
<input type="text" class="btn btn-white wallsinput" placeholder="[cols]x[rows]" value="7x7" style="width:45%">
<button class="btn btn-blue autowalls t" style="width:45%">Enable Walls</button>
<br>
<button class="btn btn-blue advancedautowalls t" style="width:45%">Enable Advanced Walls</button>
<br>
<input type="text" class="btn btn-white joininput" placeholder="Party Share Key" style="width:45%">
<button class="btn btn-blue join b" style="width:45%">Join</button>
<input type="text" class="btn btn-white joininput2" placeholder="Party Share Key" style="width:45%">
<button class="btn btn-blue join2 b" style="width:45%">Join</button>
<button class="btn btn-blue leave b" style="width:45%">Leave Party</button>
<hr>
<p>Upgrade Tower Health (uth)</p>
<hr>
<input type="text" class="btn btn-white uthinput" placeholder="heal level" value="25" style="width:45%">
<button class="btn btn-blue uth t" style="width:45%">Enable UTH</button>
<hr>
</div>`;

const container1 = document.createElement(`div`);
container1.className = "MainMenu";

html1.split("\n").forEach((e, pos) => {
    const a = createElement(e.trim());
    if (pos == 0 || a == null) return;
    container1.appendChild(a);
});

const html2 = `<div class="AutoBuildMenu">
<p>Popular Bases</p>
<hr>
<button class="btn btn-blue sirrXBase b" style="width:45%">Sirr0m X Base</button>
<button class="btn btn-blue sirr0mBase b" style="width:45%">Sirr0m + Base</button>
<button class="btn btn-blue luckyBase b" style="width:45%">Lucky Corner Base</button>
<button class="btn btn-blue twoEntBase b" style="width:45%">Two Ent Base</button>
<button class="btn btn-blue goldBase b" style="width:45%">Gold Base</button>
<button class="btn btn-blue raidBase b" style="width:45%">Raid Base</button>
<button class="btn btn-blue smallRaidBase b" style="width:45%">Small Raid Base</button>
<hr>
<p>Base Saver</p>
<hr>
<input type="text" class="btn btn-white recordinput" placeholder="Enter Base Name" style="width:45%">
<button class="btn btn-blue recordBase b" style="width:45%">Record Base</button>
<hr>
<p>Auto Build (Confirmed Base: "<strong class="confirmedbase">null</strong>")</p>
<hr>
<button class="btn btn-blue buildBase b" style="width:45%">Build Confirmed Base</button>
<button class="btn btn-blue deleteBase b" style="width:45%">Delete Confirmed Base</button>
<button class="btn btn-blue autobuildconfirm t" style="width:45%">Enable Auto Build</button>
<button class="btn btn-blue smartautoupgradeconfirm t" style="width:45%">Enable Smart Auto Upgrade</button>
<input type="text" class="btn btn-white auacinput" placeholder="max tier" value="2" style="width:45%">
<button class="btn btn-blue autoupgradeallconfirm t" style="width:45%">Enable Auto Upgrade All</button>
<button class="btn btn-blue autodeleteconfirm t" style="width:45%">Enable Auto Delete</button>
<hr>
<p>Saved Bases</p>
<hr>
<div class="savedbases"></div>
<hr>
</div>`

const container2 = document.createElement('div');
container2.className = "AutoBuildMenu";

html2.split("\n").forEach((e, pos) => {
    const a = createElement(e.trim());
    if (pos == 0 || a == null) return;
    container2.appendChild(a);
});

const html3 = `<div class="WebSocketsMenu">
<p>Send/Delete Sockets</p>
<hr>
<input type="text" class="btn btn-white altName" placeholder="Enter Alt Name" style="width:45%">
<button class="btn btn-blue sendAlt b" style="width:45%">Send Alt</button>
<input type="text" class="btn btn-white deleteinput" placeholder="Enter Socket ID" style="width:45%">
<button class="btn btn-blue deleteAlt b" style="width:45%">Delete Alt</button>
<button class="btn btn-blue deleteAllAlts b" style="width:45%">Delete All Alts</button>
<button class="btn btn-blue autorefiller t" style="width:45%">Enable Refiller</button>
<hr>
<p>Socket Scripts</p>
<hr>
<button class="btn btn-blue autohealsocket t" style="width:45%">Enable Auto Heal</button>
<button class="btn btn-blue autopethealsocket t" style="width:45%">Enable Auto Pet Heal</button>
<button class="btn btn-blue autorevivepetsocket t" style="width:45%">Enable Auto Revive Pet</button>
<button class="btn btn-blue autoevolvesocket t" style="width:45%">Enable Auto Evolve Pet</button>
<button class="btn btn-blue autorespawnsocket t" style="width:45%">Enable Auto Respawn</button>
<button class="btn btn-blue mouseaim t" style="width:45%">Enable Mouse Aim</button>
<button class="btn btn-blue mousemove t" style="width:45%">Enable Mouse Move</button>
<button class="btn btn-blue freezemouse t" style="width:45%">Enable Freeze Position</button>
<select class="btn btn-blue autobuildsocketlist" style="width:45%"><option value="default">Default</option><option value="luckybase">Lucky Corner Base</option><option value="raidbase">Raid Base</option></select>
<button class="btn btn-blue autobuildsocket t" style="width:45%">Enable AutoBuild</button>
<input type="text" class="btn btn-white ausinput" placeholder="max tier" value="2" style="width:45%">
<button class="btn btn-blue autoupgradeallsocket t" style="width:45%">Enable Auto Upgrade All</button>
<hr>
<p>Socket Raiding</p>
<hr>
<input type="text" class="btn btn-white spearmaxtier" placeholder="Max Tier" value="3" style="width:30%">
<button class="btn btn-blue autobuyspear t" style="width:30%">Enable Auto Buy Spear</button>
<button class="btn btn-blue autoequipspear t" style="width:30%">Enable Auto Equip Spear</button>
<input type="text" class="btn btn-white farmspearmaxtier" placeholder="Max Tier" value="3" style="width:45%">
<button class="btn btn-blue autofarmspear t" style="width:45%">Enable Auto Farm Spear</button>
<input type="text" class="btn btn-white ahrcid" placeholder="Alt Id" style="width:45%">
<button class="btn btn-blue ahrcsocket t" style="width:45%">Enable AHRC</button>
<input type="text" class="btn btn-white playerfinderid" placeholder="Rank" style="width:45%">
<button class="btn btn-blue playerfinder b" style="width:45%">PlayerFind Target</button>
<button class="btn btn-blue autoattack t" style="width:45%">Enable Auto Attack</button>
<button class="btn btn-blue pressurebug t" style="width:45%">Enable Pressure Bug</button>
<select class="btn btn-blue chatspamlist" style="width:45%"><option value="crashspam">Crash Spam</option><option value="tctctctctc">TCTCTCTCTC</option><option value="kgkgkgkgkg">KGKGKGKGKG</option></select>
<button class="btn btn-blue chatspam t" style="width:45%">Enable Chat Spam</button>
<button class="btn btn-blue xkeysocket t" style="width:45%">Enable X Key</button>
<hr>
<p>Socket Boss Gold Farm</p>
<hr>
<button class="btn btn-blue joinbeforebosssocket t" style="width:45%">Enable Join Before Boss Wave</button>
<button class="btn btn-blue leaveafterbosssocket t" style="width:45%">Enable Leave After Boss Wave</button>
<button class="btn btn-blue notifybeforebosswave t" style="width:45%">Enable Notify Before Boss Wave</button>
<hr>
<p>Sockets Info</p>
<hr>
<div class="socketsinfo"></div>
<hr>
</div>`;

const container3 = document.createElement('div');
container3.className = 'WebSocketsMenu';

html3.split("\n").forEach((e, pos) => {
    const a = createElement(e.trim());
    if (pos == 0 || a == null) return;
    container3.appendChild(a);
});

const html4 = `<div class="SettingsMenu">
<p>Mouse Settings</p>
<hr>
Right click for reverse alt movement
<hr>
<p>Input Settings</p>
<hr>
<input type="text" class="btn btn-white setting" placeholder="auto heal level" value="15" style="width:45%">
<strong>- Autoheal level</strong>
<br>
<input type="text" class="btn btn-white setting" placeholder="auto pet heal level" value="30" style="width:45%">
<strong>- Autopetheal level</strong>
<hr>
<p>Keys Settings</p>
<hr>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="C" style="width:45%">
<strong>- Auto Build</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="V" style="width:45%">
<strong>- Sell Pet(s)</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="H" style="width:45%">
<strong>- Sockets Leave Party</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="J" style="width:45%">
<strong>- Sockets Join Party</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="K" style="width:45%">
<strong>- Clear Messages</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="L" style="width:45%">
<strong>- Send Alt(s)</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="M" style="width:45%">
<strong>- Equip Pet(s)</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="N" style="width:45%">
<strong>- Auto Revive Pet(s)</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="X" style="width:45%">
<strong>- Upgrade All</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="Z" style="width:45%">
<strong>- Auto Bow</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="[" style="width:45%">
<strong>- Leave Party</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="\`" style="width:45%">
<strong>- Player Info</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="-" style="width:45%">
<strong>- Show GoldStash</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="I" style="width:45%">
<strong>- Freeze MouseMove</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="/" style="width:45%">
<strong>- Toggle MouseMove</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="]" style="width:45%">
<strong>- Join Alt</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="." style="width:45%">
<strong>- alt 1 by 1</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="," style="width:45%">
<strong>- alts heal towers</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="R" style="width:45%">
<strong>- alts upgrade building/s</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="Y" style="width:45%">
<strong>- build walls around the base</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="G" style="width:45%">
<strong>- Toggle Player Follower</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value=";" style="width:45%">
<strong>- second nearest alt 1 by 1</strong>
<br>
<input type="text" class="btn btn-white key" placeholder="Enter Key" value="'" style="width:45%">
<strong>- Move to locked position</strong>
<br>
<hr>
<p>Commands Settings</p>
<hr>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!send (amt)" style="width:45%">
<strong>- Send x Alts</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!close (id)" style="width:45%">
<strong>- Delete Alt Id</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!reset" style="width:45%">
<strong>- Delete All Alts</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!ahrc (id)" style="width:45%">
<strong>- Enable MainPlayer or Alt AHRC</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!ahrc" style="width:45%">
<strong>- Disable AHRC on All Players</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!join (psk)" style="width:45%">
<strong>- Join PSK</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!pop" style="width:45%">
<strong>- Show Server Population</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!da" style="width:45%">
<strong>- Enable Delete All</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!da" style="width:45%">
<strong>- Disable Delete All</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!aa" style="width:45%">
<strong>- Enable Auto Aim</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!aa" style="width:45%">
<strong>- Disable Auto Aim</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!sockets" style="width:45%">
<strong>- Shows sockets amount</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!al" style="width:45%">
<strong>- <small>Alts with base leave or Alt [id] leave</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!aj" style="width:45%">
<strong>- Alt [id] join main player</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!aaj" style="width:45%">
<strong>- Alts with base join</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!as (?tier)" style="width:45%">
<strong>- <small>Enable Alts Auto Buy & Equip Spear</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!as" style="width:45%">
<strong>- <small>Disable Alts Auto Buy & Equip Spear</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!af (?tier)" style="width:45%">
<strong>- Enable Alts Auto Farm Spear (?tier)</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!af" style="width:45%">
<strong>- Disable Alts Auto Farm Spear</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!javb" style="width:45%">
<strong>- Joins alt's visible base</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!ajlp" style="width:45%">
<strong>- Alt Join Last Player Party</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!timeout (?id)" style="width:45%">
<strong>- <small>Timeout alts. If [id], timeout alt [id]</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!up" style="width:45%">
<strong>- Alts move up</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!down" style="width:45%">
<strong>- Alts move down</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!right" style="width:45%">
<strong>- Alts move right</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!left" style="width:45%">
<strong>- Alts move left</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!stop" style="width:45%">
<strong>- <small>Alts stop moving. Warning: No move for awhile, they dc</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!ft (rank)" style="width:45%">
<strong>- <small>Player finder: If alts find the player with [rank], player found.</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!uth" style="width:45%">
<strong>- Enable UTH</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!uth" style="width:45%">
<strong>- Disable UTH</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!atk" style="width:45%">
<strong>- Enable Auto Attack</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!atk" style="width:45%">
<strong>- Disable Auto Attack</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!pb" style="width:45%">
<strong>- Enable Pressure Bug</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!pb" style="width:45%">
<strong>- Disable Pressure Bug</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!arf" style="width:45%">
<strong>- Enable auto refiller</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!arf" style="width:45%">
<strong>- Disable auto refiller</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!ab (base_name)" style="width:45%">
<strong>- Enable auto build (base name)</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!ab" style="width:45%">
<strong>- Disable auto build</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!au (tier)" style="width:45%">
<strong>- Enable auto upgrade (base name [tier])</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!au" style="width:45%">
<strong>- Disable auto upgrade</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!ad" style="width:45%">
<strong>- <small>Enable auto delete buildings that DNE in (base name)</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!ad" style="width:45%">
<strong>- Disable auto delete</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!spam (type)" style="width:45%">
<strong>- <small>Enable chat spam</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!spam" style="width:45%">
<strong>- Disable chat spam</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!jahwb" style="width:45%">
<strong>- <small>Join's alt's highest wave base<small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="1b1" style="width:45%">
<strong>- Alt 1b1</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="2b2" style="width:45%">
<strong>- Alt 2b2</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="4b4" style="width:45%">
<strong>- Alt 4b4</strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!resetrenderer" style="width:45%">
<strong>- <small>Resets Renderer (might be useful against crash)</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!aito" style="width:45%">
<strong>- <small>Enables aito for alts in parties</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!aito" style="width:45%">
<strong>- <small>Disables aito for alts in parties</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!resetids" style="width:45%">
<strong>- <small>Resets Alt ids (sets ids from 1 to n)</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!resetsavedpartyids" style="width:45%">
<strong>- <small>Resets stored players and their stashes (essential sometimes)</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!s" style="width:45%">
<strong>- <small>Shows stats of alts or alt [id]</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!jahrc" style="width:45%">
<strong>- <small>Alt [oldId] leave and Alt [id] join your party with enabled ahrc</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!xk" style="width:45%">
<strong>- <small>Enables X Key</small></strong>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!!xk" style="width:45%">
<strong>- <small>Disables X Key</small></strong>
<br>
<br>
<input type="text" class="btn btn-white cmd" placeholder="Enter Command" value="!lock" style="width:45%">
<strong>- <small>Locks position for x key or 1b1 purposes</small></strong>
<br>
<button class="btn btn-blue resetSettings b" style="width:45%">Reset Settings</button>
<button class="btn btn-blue saveSettings b" style="width:45%">Save Settings</button>
<hr>
</div>`;

const container4 = document.createElement("div");
container4.className = 'SettingsMenu';

html4.split("\n").forEach((e, pos) => {
    const a = createElement(e.trim());
    if (pos == 0 || a == null) return;
    container4.appendChild(a);
});


const html5 = `<div class="OthersMenu">
<p>Others</p>
<hr>
<button class="btn btn-white 36i6" style="width:45%">Enable Exact Rss Counter</button>
<button class="btn btn-white 37i6" style="width:45%">Enable Auto Buy Spear</button>
<hr>
<button class="btn btn-white 38i6" style="width:45%">Enable Auto Buy Pickaxe</button>
<button class="btn btn-white 39i6" style="width:45%">Enable Auto Buy Bomb</button>
<hr>
<button class="btn btn-white 40i6" style="width:45%">Enable Auto Buy Bow</button>
<button class="btn btn-white 41i6" style="width:45%">Enable Auto Buy Shield</button>
<hr>
</div>`;

const container5 = document.createElement('div');
container5.className = "OthersMenu";

html5.split("\n").forEach((e, pos) => {
    const a = createElement(e.trim());
    if (pos == 0 || a == null) return;
    container5.appendChild(a);
});


$("hud-XXX-grid").appendChild(container1);
$("hud-XXX-grid").appendChild(container2);
$("hud-XXX-grid").appendChild(container3);
$("hud-XXX-grid").appendChild(container4);
$("hud-XXX-grid").appendChild(container5);

["Main", "AutoBuild", "WebSockets", "Settings", "Others"].forEach(e => {
    $(e).addEventListener("click", function () {
        ["Main", "AutoBuild", "WebSockets", "Settings", "Others"].forEach(e => {
            $(e + "Menu").style.display = "none";
            $(e).innerText = e;
        });
        $(this.classList[2] + "Menu").style.display = "block";
        $(this.classList[2]).innerText = "- - -";
    });
});

$("t").forEach(e => {
    e.addEventListener("click", function () {
        const toggle = this.innerText.includes("Enable");
        this.innerText = this.innerText.replace(toggle ? "Enable" : "Disable", toggle ? "Disable" : "Enable");
        script[this.classList[2]] = toggle;
        try {
            script[this.classList[2] + "toggle"]?.(toggle);
        } catch {
            const toggle = this.innerText.includes("Enable");
            this.innerText = this.innerText.replace(toggle ? "Enable" : "Disable", toggle ? "Disable" : "Enable");
            script[this.classList[2]] = toggle;
        }
    });
});

$("b").forEach(e => {
    e.addEventListener("click", function () {
        onClickBtn[this.classList[2]]();
    });
});

class Script {
    constructor() {
        this.autoheal = true;
        this.autopetheal = true;
        this.autorevivepet = false;
        this.autoevolve = true;
        this.autorespawn = false;
        this.autobuild = false;
        this.smartautoupgrade = false;
        this.autoupgradeall = false;
        this.autodelete = false;
        this.playerinfo = false;
        this.autobow = false;
        this.autoaim = false;
        this.playerfollower = false;
        this.ahrc = false;
        this.autowalls = false;
        this.advancedautowalls = true;
        this.uth = false;
        this.autobuildconfirm = false;
        this.smartautoupgradeconfirm = false;
        this.autoupgradeallconfirm = false;
        this.autodeleteconfirm = false;
        this.autorefiller = false;
        this.autohealsocket = true;
        this.autopethealsocket = true;
        this.autorevivepetsocket = false;
        this.autoevolvesocket = true;
        this.autorespawnsocket = true;
        this.mouseaim = true;
        this.mousemove = false;
        this.freezemouse = false;
        this.autobuyspear = false;
        this.autoequipspear = false;
        this.autofarmspear = false;
        this.ahrcsocket = false;
        this.autoattack = false;
        this.pressurebug = false;
        this.chatspam = false;
        this.joinbeforebosssocket = false;
        this.leaveafterbosssocket = false;
        this.notifybeforebosswave = false;
        this.autobuildsocket = false;
        this.autoupgradeallsocket = false;
        this.xkeysocket = false;
    }
    playerinfotoggle() {
        if (!script.playerinfo) {
            handler.entities.forEach(e => {
                if (e.model != "GamePlayer") return;
                const entity = game.world.entities.get(e.uid);
                entity && (entity.currentModel.nameEntity.text.text = socketsUid.has(e.uid) ? socketsUid.get(e.uid) : entity.targetTick.name);
            });
        }
    }
    autobuildtoggle() {
        if (script.autobuild && !handler.gs) {
            game.ui.components.PopupOverlay.showHint(`You need a stash to enable autorebuilder.`);
            throw new Error();
        }
        handler.inactiveRebuilder.clear();
        handler.rebuilder.clear();
        if (script.autobuild) {
            handler.buildings.forEach(e => {
                const yaw = handler.yawBuildings.get(e.uid)?.targetTick?.yaw || 0;
                handler.rebuilder.set((e.x - handler.gs.x) / 24 + (e.y - handler.gs.y) / 24 * 1000, [(e.x - handler.gs.x) / 24, (e.y - handler.gs.y) / 24, e.type, yaw]);
            });
        }
    }
    smartautoupgradetoggle() {
        if (script.smartautoupgrade && !handler.gs) {
            game.ui.components.PopupOverlay.showHint(`You need a stash to enable autoreupgrader.`);
            throw new Error();
        }
        handler.inactiveReupgrader.clear();
        handler.reupgrader.clear();
        if (script.smartautoupgrade) {
            handler.buildings.forEach(e => {
                handler.reupgrader.set((e.x - handler.gs.x) / 24 + (e.y - handler.gs.y) / 24 * 1000, [(e.x - handler.gs.x) / 24, (e.y - handler.gs.y) / 24, e.tier]);
            });
        }
    }
    autoupgradealltoggle() {
        if (script.autoupgradeall && !handler.gs) {
            game.ui.components.PopupOverlay.showHint(`You need a stash to enable autoreupgrader.`);
            throw new Error();
        }
        handler.inactiveReupgraderAll.clear();
        handler.reupgraderAll.clear();
        if (script.autoupgradeall) {
            const auaTier = parseInt($("auainput").value);
            handler.buildings.forEach(e => {
                const index = (e.x - handler.gs.x) / 24 + (e.y - handler.gs.y) / 24 * 1000;
                handler.reupgraderAll.set(index, [(e.x - handler.gs.x) / 24, (e.y - handler.gs.y) / 24]);
                if (e.tier < auaTier) {
                    handler.inactiveReupgraderAll.set(index, [(e.x - handler.gs.x) / 24, (e.y - handler.gs.y) / 24, auaTier, e.tier, e.uid, handler.tick]);
                }
            });
        }
    }
    autobuildconfirmtoggle() {
        handler.inactiveRebuilderconfirm.clear();
        handler.rebuilderconfirm.clear();
        if (script.autobuildconfirm) {
            const arr = JSON.parse(autobuild.confirmedBase);
            if (!arr) {
                game.ui.components.PopupOverlay.showHint(`You haven't confirmed or selected a base.`);
                throw new Error();
            }
            for (let i = 1; i < arr.length; i++) {
                const index = arr[i];
                const e = autobuild.decodeBuilding(index);
                handler.rebuilderconfirm.set(e[0] * 2 + e[1] * 2 * 1000, [e[0] * 2, e[1] * 2, autobuild.buildingSchemaArr[e[4]], e[3] * 90]);
            }
            if (handler.gs && !handler.gs.dead) {
                handler.rebuilderconfirm.forEach(e => {
                    if (!handler.buildings.get(e[0] + e[1] * 1000)) {
                        handler.inactiveRebuilderconfirm.set(e[0] + e[1] * 1000, e);
                    }
                });
            }
        }
    }
    smartautoupgradeconfirmtoggle() {
        handler.inactiveReupgraderconfirm.clear();
        handler.reupgraderconfirm.clear();
        if (script.smartautoupgradeconfirm) {
            const arr = JSON.parse(autobuild.confirmedBase);
            if (!arr) {
                game.ui.components.PopupOverlay.showHint(`You haven't confirmed or selected a base.`);
                throw new Error();
            }
            let stashTier = 1;
            for (let i = 1; i < arr.length; i++) {
                const index = arr[i];
                const e = autobuild.decodeBuilding(index);
                handler.reupgraderconfirm.set(e[0] * 2 + e[1] * 2 * 1000, [e[0] * 2, e[1] * 2, e[2]]);
                if (e[2] > stashTier) stashTier = e[2];
            }
            handler.reupgraderconfirm.set(0, [0, 0, stashTier]);
            if (handler.gs && !handler.gs.dead) {
                handler.reupgraderconfirm.forEach(e => {
                    const building = handler.buildings.get(e[0] + e[1] * 1000);
                    if (building && e[2] > building.tier) {
                        handler.inactiveReupgraderconfirm.set(e[0] + e[1] * 1000, [e[0], e[1], e[2], building.tier, building.uid, handler.tick]);
                    }
                });
            }
        }
    }
    autoupgradeallconfirmtoggle() {
        handler.inactiveReupgraderAllconfirm.clear();
        handler.reupgraderAllconfrim.clear();
        if (script.autoupgradeallconfirm) {
            const arr = JSON.parse(autobuild.confirmedBase);
            if (!arr) {
                game.ui.components.PopupOverlay.showHint(`You haven't confirmed or selected a base.`);
                throw new Error();
            }
            const auacTier = parseInt($("auacinput").value);
            handler.reupgraderAllconfrim.set(0, [0, 0]);
            for (let i = 1; i < arr.length; i++) {
                const index = arr[i];
                const e = autobuild.decodeBuilding(index);
                handler.reupgraderAllconfrim.set(e[0] * 2 + e[1] * 2 * 1000, [e[0] * 2, e[1] * 2]);
            }
            if (handler.gs && !handler.gs.dead) {
                handler.reupgraderAllconfrim.forEach(e => {
                    const building = handler.buildings.get(e[0] + e[1] * 1000);
                    if (building && auacTier > building.tier) {
                        handler.inactiveReupgraderAllconfirm.set(e[0] + e[1] * 1000, [e[0], e[1], auacTier, building.tier, building.uid, handler.tick]);
                    }
                });
            }
        }
    }
    autodeletetoggle() {
        handler.deleteBuildingSet.clear();
        if (script.autodelete) {
            handler.deleteTrigger = 0;
            handler.buildingsUid.forEach(e => {
                if (e.type === "GoldStash") return;
                handler.deleteBuildingSet.add(e.uid);
            });
            handler.sellUid = handler.deleteBuildingSet.keys().next().value;
        }
    }
    autodeleteconfirmtoggle() {
        handler.deleteconfirm.clear();
        handler.deleteBuildingConfirmSet.clear();
        if (script.autodeleteconfirm) {
            const arr = JSON.parse(autobuild.confirmedBase);
            if (!arr) {
                game.ui.components.PopupOverlay.showHint(`You haven't confirmed or selected a base.`);
                throw new Error();
            }
            for (let i = 1; i < arr.length; i++) {
                const index = arr[i];
                const e = autobuild.decodeBuilding(index);
                handler.deleteconfirm.set(e[0] * 2 + e[1] * 2 * 1000, [e[0] * 2, e[1] * 2, autobuild.buildingSchemaArr[e[4]]]);
            }
            handler.deleteconfirmTrigger = 0;
            handler.buildingsUid.forEach(e => {
                const index = (e.x - handler.gs.x) / 24 + (e.y - handler.gs.y) / 24 * 1000;
                if (e.type === "GoldStash" || (handler.deleteconfirm.get(index) && handler.deleteconfirm.get(index)[2] === e.type)) return;
                handler.deleteBuildingConfirmSet.add(e.uid);
            });
            handler.sellconfirmUid = handler.deleteBuildingConfirmSet.keys().next().value;
        }
    }
    freezemousetoggle() {
        if (script.freezemouse) {
            handler.lockPos = { x: handler.worldPos.x, y: handler.worldPos.y };
        }
    }
    autobuildsockettoggle() {
        if ($("autobuildsocketlist").value == "default" && script.autobuildsocket && !handler.gs) {
            game.ui.components.PopupOverlay.showHint(`You need a stash to enable autorebuilder.`);
            throw new Error();
        }
        handler.rebuildersocket.clear();
        sockets.forEach(e => {
            e.inactiveRebuildersocket.clear();
        });
        if (script.autobuildsocket) {
            if ($("autobuildsocketlist").value == "default") {
                handler.buildings.forEach(e => {
                    const yaw = handler.yawBuildings.get(e.uid)?.targetTick?.yaw || 0;
                    handler.rebuildersocket.set((e.x - handler.gs.x) / 24 + (e.y - handler.gs.y) / 24 * 1000, [(e.x - handler.gs.x) / 24, (e.y - handler.gs.y) / 24, e.type, yaw]);
                });
            } else {
                const arr = JSON.parse(localStorage[`x${$("autobuildsocketlist").value}`]);
                for (let i = 1; i < arr.length; i++) {
                    const index = arr[i];
                    const e = autobuild.decodeBuilding(index);
                    handler.rebuildersocket.set(e[0] * 2 + e[1] * 2 * 1000, [e[0] * 2, e[1] * 2, autobuild.buildingSchemaArr[e[4]], e[3] * 90]);
                }
                handler.rebuildersocket.forEach(e => {
                    sockets.forEach(r => {
                        if (r.gs && !r.gs.dead && !r.buildings.get(e[0] + e[1] * 1000)) {
                            r.inactiveRebuildersocket.set(e[0] + e[1] * 1000, e);
                        }
                    });
                });
            }
        }
    }
    autoupgradeallsockettoggle() {
        sockets.forEach(r => {
            r.inactiveReupgraderAllsocket.clear();
        });
        if (script.autoupgradeallsocket) {
            const auaTier = parseInt($("ausinput").value);
            sockets.forEach(r => {
                r.buildings.forEach(e => {
                    const index = (e.x - r.gs.x) / 24 + (e.y - r.gs.y) / 24 * 1000;
                    if (e.tier < auaTier) {
                        r.inactiveReupgraderAllsocket.set(index, [(e.x - r.gs.x) / 24, (e.y - r.gs.y) / 24, auaTier, e.tier, e.uid, r.tick]);
                    }
                });
            });
        }
    }
    playerfollowertoggle() {
        if (script.playerfollower) {
            let nearestDistance = Infinity;
            let nearestPlayerUid;
            handler.entities.forEach(entity => {
                if (entity.targetTick.model == "GamePlayer" && entity.targetTick.uid !== handler.myPlayer.uid && entity.targetTick.partyId !== handler.myPlayer.partyId && !entity.targetTick.dead && !socketsUid.has(entity.targetTick.uid)) {
                    const distance = Math.hypot(entity.targetTick.position.x - handler.myPlayer.position.x, entity.targetTick.position.y - handler.myPlayer.position.y);
                    if (nearestDistance > distance) {
                        nearestDistance = distance;
                        nearestPlayerUid = entity.targetTick.uid;
                    }
                }
            });
            if (!nearestPlayerUid) {
                game.ui.components.PopupOverlay.showHint(`No nearest Player.`);
                throw new Error();
            }
            handler.playerFollowerUid = nearestPlayerUid;
            const position = handler.entities.get(handler.playerFollowerUid).targetTick.position;
            const x = ((Math.round(((Math.atan2(position.y - handler.myPlayer.position.y, position.x - handler.myPlayer.position.x) * 180 / Math.PI + 450) % 360) / 45) * 45) % 360) % 360;
            handler.sendPacket(3, { up: (x == 0 || x == 45 || x == 315) ? 1 : 0, down: (x == 135 || x == 180 || x == 225) ? 1 : 0, right: (x == 45 || x == 90 || x == 135) ? 1 : 0, left: (x == 225 || x == 270 || x == 315) ? 1 : 0 });
        }
    }
    xkeysockettoggle() {
        if (script.xkeysocket) {
            sockets.forEach(e => e.sendPacket(3, { mouseDown: e.aimingYaw }));
        } else {
            sockets.forEach(e => e.sendPacket(3, { mouseUp: 1 }));
        }
    }
}

const script = new Script();

for (const i in script) {
    const _this = $(i);
    const toggle = script[i];
    _this.innerText = _this.innerText.replace(toggle ? "Enable" : "Disable", toggle ? "Disable" : "Enable");
    script[i] = toggle;
    game.world.myUid && script[i + "toggle"]?.(toggle);
}

script.version = "1.7.5";

const onClickBtn = {
    join() { game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: $("joininput").value }); },
    join2() { game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: $("joininput2").value }); },
    leave() { game.network.sendPacket(9, { name: "LeaveParty" }); },
    sirrXBase() {
        $("confirmedbase").innerText = "sirrxbase";
        autobuild.confirmedBase = localStorage[`x${"sirrxbase"}`];
        game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
            autobuild.BuildBase(autobuild.confirmedBase);
        })
    },
    sirr0mBase() {
        $("confirmedbase").innerText = "sirr0mbase";
        autobuild.confirmedBase = localStorage[`x${"sirr0mbase"}`];
        game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
            autobuild.BuildBase(autobuild.confirmedBase);
        })
    },
    luckyBase() {
        $("confirmedbase").innerText = "luckybase";
        autobuild.confirmedBase = localStorage[`x${"luckybase"}`];
        game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
            autobuild.BuildBase(autobuild.confirmedBase);
        })
    },
    twoEntBase() {
        $("confirmedbase").innerText = "twoentbase";
        autobuild.confirmedBase = localStorage[`x${"twoentbase"}`];
        game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
            autobuild.BuildBase(autobuild.confirmedBase);
        })
    },
    goldBase() {
        $("confirmedbase").innerText = "goldbase";
        autobuild.confirmedBase = localStorage[`x${"goldbase"}`];
        game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
            autobuild.BuildBase(autobuild.confirmedBase);
        })
    },
    raidBase() {
        $("confirmedbase").innerText = "raidbase";
        autobuild.confirmedBase = localStorage[`x${"raidbase"}`];
        game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
            autobuild.BuildBase(autobuild.confirmedBase);
        })
    },
    smallRaidBase() {
        $("confirmedbase").innerText = "smallraidbase";
        autobuild.confirmedBase = localStorage[`x${"smallraidbase"}`];
        game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
            autobuild.BuildBase(autobuild.confirmedBase);
        })
    },
    recordBase() {
        game.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to record base?`, 1e4, () => {
            localStorage[`x${$("recordinput").value}`] = autobuild.getBaseCode();
            game.ui.components.PopupOverlay.showHint(`Successfully recorded the base.`);
            $("confirmedbase").innerText = $("recordinput").value;
            autobuild.confirmedBase = localStorage[`x${$("recordinput").value}`];
            resetSavedBases();
        });
    },
    confirmBase(base, shouldBuild) {
        if (localStorage[base ? base : `x${$("selectinput").value}`]) {
            $("confirmedbase").innerText = base ? base.substr(1) : $("selectinput").value;
            autobuild.confirmedBase = localStorage[base ? base : `x${$("selectinput").value}`];
            shouldBuild && game.ui.getComponent("PopupOverlay").showConfirmation(`Do you want to build the confirmed base?`, 1e4, () => {
                autobuild.BuildBase(autobuild.confirmedBase);
            });
        }
    },
    buildBase() {
        autobuild.confirmedBase && autobuild.BuildBase(autobuild.confirmedBase);
    },
    deleteBase(base) {
        localStorage[base ? base : `x${$("confirmedbase").innerText}`] && game.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to delete the confirmed base?`, 1e4, () => {
            delete localStorage[base ? base : `x${$("confirmedbase").innerText}`];
            if (!base || "x" + $("confirmedbase").innerText === base) {
                $("confirmedbase").innerText = "null";
                autobuild.confirmedBase = null;
            }
            resetSavedBases();
        });
    },
    sendAlt() {
        new Bot();
    },
    deleteAllAlts() {
        game.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to delete all alts?`, 1e4, () => {
            sockets.forEach(e => (e.ws.close(), e.removeMap()));
            sockets.clear();
            socketsUid.clear();
            if (script.autorefiller) $("autorefiller").click();
        });
    },
    deleteAlt() {
        const id = parseInt($("deleteinput").value);
        sockets.get(id).ws.close();
        sockets.get(id).removeMap();
        socketsUid.delete(sockets.get(id).uid);
        sockets.delete(id);
    },
    resetSettings() {
        localStorage.keys = keysJSON;
        const arr = JSON.parse(keysJSON);
        arr.forEach((e, pos) => {
            keys[pos][0] = e;
        });
        $("key").forEach((e, pos) => {
            e.value = arr[pos];
        });
        keysMap = new Map(keys);

        localStorage.settings = settingsJSON;
        const settingsArr = JSON.parse(settingsJSON);
        settingsArr.forEach((e, pos) => {
            settings[pos][0] = e;
        });
        $("setting").forEach((e, pos) => {
            e.value = settingsArr[pos];
        });

        localStorage.cmds = cmdsJSON;
        const cmdsArr = JSON.parse(localStorage.cmds);
        cmdsArr.forEach((e, pos) => {
            cmds[pos][0] = e.toLowerCase();
        });
        $("cmd").forEach((e, pos) => {
            e.value = cmdsArr[pos].toLowerCase() + (cmdsParameter[pos] ? (" " + cmdsParameter[pos]) : "");
        });
        cmdsMap = new Map(cmds);
    },
    saveSettings() {
        $("key").forEach((e, position) => {
            keys[position][0] = e.value;
        });
        localStorage.keys = JSON.stringify($("key").map(e => e.value));
        keysMap = new Map(keys);

        $("setting").forEach((e, position) => {
            settings[position][0] = parseInt(e.value);
        });
        localStorage.settings = JSON.stringify($("setting").map(e => e.value));

        $("cmd").forEach((e, position) => {
            cmds[position][0] = e.value.split(" ")[0].toLowerCase();
        });
        localStorage.cmds = JSON.stringify($("cmd").map(e => e.value.split(" ")[0].toLowerCase()));
        cmdsMap = new Map(cmds);
    },
    playerfinder() {
        const rank = parseInt($("playerfinderid")) - 1;
        if (!game.ui.components.Leaderboard.leaderboardData[rank]) return;
        const uid = game.ui.components.Leaderboard.leaderboardData[rank].uid;
        let target = null;
        let gs = null;
        handler.savedPartyIds.forEach(e => (e.players.has(uid) && (target = e.players.get(uid), gs = e.gs)));
        if (target) {
            game.ui.components.PopupOverlay.showHint(target.name + " found, position: {x: " + target.position.x + ", y: " + target.position.y + "}");
            game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: target.name + " found, position: {x: " + target.position.x + ", y: " + target.position.y + "}" });
            if (gs) {
                game.ui.components.PopupOverlay.showHint(target.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}");
                game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: target.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}" });
                handler.baseFindingList.delete(e.targetTick.partyId);
            } else {
                handler.baseFindingList.set(target.partyId, target.name);
            }
            return;
        }
        handler.playerFindingList.add(uid);
        game.ui.components.PopupOverlay.showHint(`Player finding ${game.ui.components.Leaderboard.leaderboardData[rank].name}. If target is nearby alts, found.`, 8000, null, 1);
    }
}

const settings = [
    [20], // heal level
    [30], // pet heal level
]

const settingsJSON = JSON.stringify(settings.map(e => e[0]));
if (!localStorage.settings) localStorage.settings = settingsJSON;
if (localStorage.settings != settingsJSON) {
    const arr = JSON.parse(localStorage.settings);
    arr.forEach((e, pos) => {
        settings[pos][0] = e;
    });
    $("setting").forEach((e, pos) => {
        e.value = arr[pos];
    });
}

const keys = [
    [
        "C", (key) => {
            $("autobuild").click();
            game.ui.components.PopupOverlay.showHint(`Auto Build ${script.autobuild ? "On" : "Off"}, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "V", (key) => {
            handler.sendPacket(9, { name: "DeleteBuilding", uid: handler.myPlayer.petUid });
            script.pressurebug && sockets.forEach(e => e.sendPacket(9, { name: "DeleteBuilding", uid: e.myPlayer.petUid }));
            game.ui.components.PopupOverlay.showHint(`Sold Pet, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "H", () => {
            sockets.forEach(e => {
                if (e.myPlayer.partyId == handler.myPlayer.partyId) e.sendPacket(9, { name: "LeaveParty" });
            });
        }
    ],
    [
        "J", () => {
            sockets.forEach(e => {
                if (!e.gs) e.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
            });
        }
    ],
    [
        "K", () => {
            const id = document.getElementById("chatFilter");
            id.innerText == "All" ? (id.click(), id.click()) : id.click();
            if (id.innerText == "All") game.ui.components.PopupOverlay.showHint(`Disable Chat is Off`, 8000, null, 1);
            if (id.innerText == "None") game.ui.components.PopupOverlay.showHint(`Disable Chat is On`, 8000, null, 1);
            $("hud-chat-message").length === undefined ? $("hud-chat-message").remove() : $("hud-chat-message").forEach(e => e.remove());
        }
    ],
    [
        "L", () => {
            new Bot();
        }
    ],
    [
        "M", (key) => {
            !handler.petActivated && handler.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 });
            script.pressurebug && sockets.forEach(e => e.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 }));
            game.ui.components.PopupOverlay.showHint(`Equipped Carl, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "N", (key) => {
            $("autorevivepet").click();
            script.pressurebug && ($("autorevivepetsocket").click(), script.autorevivepetsocket != script.autorevivepet && script.autorevivepetsocket == false && $("autorevivepetsocket").click());
            game.ui.components.PopupOverlay.showHint(`Auto Pet Revive ${script.autorevivepet ? "On" : "Off"}, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "X", (key) => {
            $("autoupgradeall").click();
            game.ui.components.PopupOverlay.showHint(`Auto Upgrade ${script.autoupgradeall ? "On" : "Off"}, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "Z", (key) => {
            $("autobow").click();
            game.ui.components.PopupOverlay.showHint(`Auto Bow ${script.autobow ? "On" : "Off"}, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "[", (key) => {
            handler.sendPacket(9, { name: "LeaveParty" });
            game.ui.components.PopupOverlay.showHint(`Left party, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "`", (key) => {
            $("playerinfo").click();
            game.ui.components.PopupOverlay.showHint(`Player Info, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        "-", () => {
            game.ui.components.PlacementOverlay.startPlacing("GoldStash");
        }
    ],
    [
        "I", () => {
            $("freezemouse").click();
        }
    ],
    [
        "/", () => {
            $("mousemove").click();
        }
    ],
    [
        "]", (key) => {
            let found;
            sockets.forEach(e => {
                if (!e.gs && e.partyInfo.length != 4) {
                    found = true;
                    handler.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: e.partyShareKey });
                }
            });
            !found && sockets.forEach(e => {
                if (e.partyInfo.length != 4) {
                    found = true;
                    handler.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: e.partyShareKey });
                }
            });
            game.ui.components.PopupOverlay.showHint(`Joined alt that doesn't have a base, Key ${key}`, 8000, null, 1);
        }
    ],
    [
        ".", () => {
            handler._1b1();
        }
    ],
    [
        ",", () => {
            const encoded = game.network.codec.encode(9, { name: "CastSpell", spell: "HealTowersSpell", x: Math.round(handler.worldPos.x), y: Math.round(handler.worldPos.y), tier: 1 });
            game.network.socket.send(encoded);
            sockets.forEach(e => e.ws.send(encoded));
        }
    ],
    [
        "R", () => {
            setTimeout(() => {
                const uid = game.ui.components.BuildingOverlay.buildingUid;
                const shift = game.ui.components.BuildingOverlay.shouldUpgradeAll;
                const buildings = game.ui.components.BuildingOverlay.buildingsToUpgrade;
                uid && sockets.forEach(e => {
                    if (e.myPlayer.partyId !== handler.myPlayer.partyId) return;
                    shift && buildings.forEach(u => {
                        const r = e.buildingsUid.get(u);
                        Math.hypot((e.myPlayer.position.x - r.x), (e.myPlayer.position.y - r.y)) <= 768 && r.uid != uid && e.upgrade(r.uid);
                    });
                    e.upgrade(uid);
                });
                if (game.ui.components.PlacementOverlay.buildingId || uid) return;
                sockets.forEach(e => { e.gs && Math.hypot((e.myPlayer.position.x - e.gs.x), (e.myPlayer.position.y - e.gs.y)) <= 768 && e.upgrade(e.gs.uid) });
                //sockets.forEach(e => {e.gs && e.buildingsUid.forEach(r => {r.type == "GoldMine" && Math.hypot((e.myPlayer.position.x - r.x), (e.myPlayer.position.y - r.y)) <= 768 && e.upgrade(r.uid);})});
            }, 100);
        }
    ],
    [
        "Y", () => {
            autobuild.BuildBase(localStorage[`x${"wallstrap"}`]);
        }
    ],
    [
        "G", () => {
            $("playerfollower").click();
        }
    ],
    [
        ";", () => {
            handler._1b1Second();
        }
    ],
    [
        "'", () => {
            handler.MoveOpp();
        }
    ]
];

const cmds = [
    [
        "!send", (amt) => {
            for (let i = 0; i < parseInt(amt || 1); i++) {
                new Bot();
            }
        }
    ],
    [
        "!close", (id) => {
            if (!sockets.has(parseInt(id))) return;
            sockets.get(parseInt(id)).ws.close();
            sockets.get(parseInt(id)).removeMap();
            socketsUid.delete(sockets.get(parseInt(id)).uid);
            sockets.delete(parseInt(id));
        }
    ],
    [
        "!reset", () => {
            $("deleteAllAlts").click();
        }
    ],
    [
        "!ahrc", (id) => {
            if (!id && !script.ahrc) {
                $("ahrc").click();
                if (script.ahrcsocket) $("ahrcsocket").click();
            }
            if (id && (id == "all" || sockets.has(parseInt(id)))) {
                $("ahrcid").value = id;
                if (id != "all" && script.ahrc) $("ahrc").click();
                if (!script.ahrcsocket) $("ahrcsocket").click(); else ($("ahrcsocket").click(), $("ahrcsocket").click());

            }
        }
    ],
    [
        "!!ahrc", () => {
            if (script.ahrc) $("ahrc").click();
            if (script.ahrcsocket) $("ahrcsocket").click();
        }
    ],
    [
        "!join", (psk = "") => {
            if (psk.length == 20) return handler.join(psk);
            if (sockets.has(parseInt(psk))) {
                handler.join(sockets.get(parseInt(psk)).partyShareKey);
                const partyInfo = sockets.get(parseInt(psk)).partyInfo;
                if (partyInfo.length == 4) game.ui.components.PopupOverlay.showHint(`Full party. Alts ${JSON.stringify(partyInfo.map(e => socketsUid.get(e.playerUid)))} are in the party.`);
            }
        }
    ],
    [
        "!pop", () => {
            game.ui.components.PopupOverlay.showHint(`There are ${players} players in the server.`);
        }
    ],
    [
        "!da", () => {
            if (!script.autodelete) $("autodelete").click();
        }
    ],
    [
        "!!da", () => {
            if (script.autodelete) $("autodelete").click();
        }
    ],
    [
        "!aa", () => {
            if (!script.autoaim) $("autoaim").click();
        }
    ],
    [
        "!!aa", () => {
            if (script.autoaim) $("autoaim").click();
        }
    ],
    [
        "!sockets", () => {
            sockets.forEach((e, i) => {
                if (socketsUid.has(e.uid) && (e.ws.readyState === 3 || e.ws.readyState === 2)) socketsUid.delete(e.uid);
                if (e.ws.readyState === 3 || e.ws.readyState === 2) (sockets.get(i).removeMap(), sockets.delete(i));
            });
            game.ui.components.PopupOverlay.showHint(`There are ${sockets.size} sockets in the server.`);
        }
    ],
    [
        "!al", (id) => {
            if (sockets.has(parseInt(id))) return sockets.get(parseInt(id)).sendPacket(9, { name: "LeaveParty" });
            sockets.forEach(e => {
                if (e.myPlayer.partyId !== handler.myPlayer.partyId) e.sendPacket(9, { name: "LeaveParty" });
            });
        }
    ],
    [
        "!aj", (id) => {
            if (!sockets.has(parseInt(id))) return;
            sockets.get(parseInt(id)).sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
        }
    ],
    [
        "!aaj", () => {
            sockets.forEach(e => {
                if (e.gs) e.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
            });
        }
    ],
    [
        "!as", (value) => {
            if (value && parseInt(value)) $("spearmaxtier").value = value;
            if (!script.autobuyspear) $("autobuyspear").click();
            if (!script.autoequipspear) $("autoequipspear").click();
        }
    ],
    [
        "!!as", () => {
            if (script.autobuyspear) $("autobuyspear").click();
            if (script.autoequipspear) $("autoequipspear").click();
        }
    ],
    [
        "!af", (value) => {
            if (value && parseInt(value)) $("farmspearmaxtier").value = value;
            if (!script.autofarmspear) $("autofarmspear").click();
        }
    ],
    [
        "!!af", () => {
            if (script.autofarmspear) $("autofarmspear").click();
        }
    ],
    [
        "!javb", () => {
            const arr = [];
            let psk;
            game.world.entities.forEach(e => e.targetTick.model == "GoldStash" && e.node.alpha == 1 && sockets.forEach(r => r.gs && r.gs.uid == e.targetTick.uid && (arr.push(r.altId), psk = r.partyShareKey)));
            handler.join(psk);
            if (arr.length === 4) game.ui.components.PopupOverlay.showHint(`Full party. Alts ${JSON.stringify(arr)} are in the party.`);
        }
    ],
    [
        "!ajlp", () => {
            const str = $("hud-keys").innerText.split("\n").join("");
            const psk = str.substring(str.length - 40, str.length - 20);
            let found;
            sockets.forEach(e => {
                if (!e.gs && !found) {
                    found = true;
                    e.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk });
                }
            });
        }
    ],
    [
        "!timeout", (value) => {
            if (value && sockets.has(parseInt(value))) return sockets.get(parseInt(value)).timeout();
            if (!value) sockets.forEach(e => e.timeout());
        }
    ],
    [
        "!up", () => {
            sockets.forEach(e => e.sendPacket(3, { up: 1, down: 0 }));
        }
    ],
    [
        "!down", () => {
            sockets.forEach(e => e.sendPacket(3, { up: 0, down: 1 }));
        }
    ],
    [
        "!right", () => {
            sockets.forEach(e => e.sendPacket(3, { right: 1, left: 0 }));
        }
    ],
    [
        "!left", () => {
            sockets.forEach(e => e.sendPacket(3, { right: 0, left: 1 }));
        }
    ],
    [
        "!stop", () => {
            sockets.forEach(e => e.sendPacket(3, { right: 0, left: 0, up: 0, down: 0 }));
        }
    ],
    [
        "!ft", (value) => {
            const rank = parseInt(value || 1) - 1;
            if (!game.ui.components.Leaderboard.leaderboardData[rank]) return;
            const uid = game.ui.components.Leaderboard.leaderboardData[rank].uid;
            let target = null;
            let gs = null;
            handler.savedPartyIds.forEach(e => (e.players.has(uid) && (target = e.players.get(uid), gs = e.gs)));
            if (target) {
                game.ui.components.PopupOverlay.showHint(target.name + " found, position: {x: " + target.position.x + ", y: " + target.position.y + "}");
                game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: target.name + " found, position: {x: " + target.position.x + ", y: " + target.position.y + "}" });
                if (gs) {
                    game.ui.components.PopupOverlay.showHint(target.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}");
                    game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: target.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}" });
                    handler.baseFindingList.delete(target.partyId);
                } else {
                    handler.baseFindingList.set(target.partyId, target.name);
                }
                return;
            }
            handler.playerFindingList.add(uid);
        }
    ],
    [
        "!uth", () => {
            if (!script.uth) $("uth").click();
        }
    ],
    [
        "!!uth", () => {
            if (script.uth) $("uth").click();
        }
    ],
    [
        "!atk", () => {
            if (!script.autoattack) $("autoattack").click();
        }
    ],
    [
        "!!atk", () => {
            if (script.autoattack) $("autoattack").click();
        }
    ],
    [
        "!pb", () => {
            if (!script.pressurebug) $("pressurebug").click();
        }
    ],
    [
        "!!pb", () => {
            if (script.pressurebug) $("pressurebug").click();
        }
    ],
    [
        "!arf", () => {
            if (!script.autorefiller) $("autorefiller").click();
        }
    ],
    [
        "!!arf", () => {
            if (script.autorefiller) $("autorefiller").click();
        }
    ],
    [
        "!ab", (value) => {
            if (value && localStorage[`x${value}`]) {
                $("confirmedbase").innerText = value;
                autobuild.confirmedBase = localStorage[`x${value}`];
            }
            script.autobuildconfirm ? ($("autobuildconfirm").click(), $("autobuildconfirm").click()) : $("autobuildconfirm").click();
            script.autoupgradeallconfirm && $("autoupgradeallconfirm").click();
            script.autodeleteconfirm && ($("autodeleteconfirm").click(), $("autodeleteconfirm").click());
            if (value == "goldbase" && (!script.uth && !script.joinbeforebosssocket && !script.leaveafterbosssocket && !script.notifybeforebosswave)) game.ui.getComponent("PopupOverlay").showConfirmation(`Would you like to enable UTH and scripts that help you farm gold from bosses?`, 1e4, () => {
                $("uth").click();
                $("joinbeforebosssocket").click();
                $("leaveafterbosssocket").click();
                $("notifybeforebosswave").click();
            });
        }
    ],
    [
        "!!ab", () => {
            if (script.autobuildconfirm) $("autobuildconfirm").click();
        }
    ],
    [
        "!au", (value) => {
            if (value) $("auacinput").value = value;
            script.autoupgradeallconfirm ? ($("autoupgradeallconfirm").click(), $("autoupgradeallconfirm").click()) : $("autoupgradeallconfirm").click();
        }
    ],
    [
        "!!au", () => {
            if (script.autoupgradeallconfirm) $("autoupgradeallconfirm").click();
        }
    ],
    [
        "!ad", () => {
            script.autodeleteconfirm ? ($("autodeleteconfirm").click(), $("autodeleteconfirm").click()) : $("autodeleteconfirm").click();
        }
    ],
    [
        "!!ad", () => {
            if (script.autodeleteconfirm) $("autodeleteconfirm").click();
        }
    ],
    [
        "!spam", (value) => {
            if (value && handler.chatspam[value]) $("chatspamlist").value = value;
            if (!script.chatspam) $("chatspam").click();
        }
    ],
    [
        "!!spam", () => {
            if (script.chatspam) $("chatspam").click();
        }
    ],
    [
        "!jahwb", () => {
            let highest = -1;
            let socketUid = null;
            sockets.forEach(e => e.myPlayer.wave > highest && (highest = e.myPlayer.wave, socketUid = e.uid));
            handler.join(sockets.get(socketsUid.get(socketUid)).partyShareKey);
        }
    ],
    [
        "1b1", () => {
            handler._1b1();
        }
    ],
    [
        "2b2", () => {
            handler._1b1(); handler._1b1();
        }
    ],
    [
        "4b4", () => {
            handler._1b1(); handler._1b1(); handler._1b1(); handler._1b1();
        }
    ],
    [
        "!resetrenderer", () => {
            document.body.removeChild(game.renderer.renderer.view);
            game.renderer.renderer = PIXI.autoDetectRenderer({ backgroundColor: 0x222222, preference: 'webgl' });
            PIXI.settings.ROUND_PIXELS = true;
            game.renderer.renderer.view.oncontextmenu = (e) => e.preventDefault();
            document.body.appendChild(game.renderer.renderer.view);
            game.renderer.onWindowResize();
        }
    ],
    [
        "!aito", () => {
            handler.aitoSocket = true;
        }
    ],
    [
        "!!aito", () => {
            handler.aitoSocket = false;
        }
    ],
    [
        "!resetids", () => {
            let i = 0;
            Array.from(sockets).forEach(r => {
                const id = ++i;
                const e = r[1];
                if (id === e.altId) return;
                sockets.set(id, e);
                sockets.delete(e.altId);
                socketsUid.set(e.uid, id);
                e.altId = id;
            })
            altId = sockets.size;
        }
    ],
    [
        "!resetsavedpartyids", () => {
            handler.savedPartyIds.clear();
        }
    ],
    [
        "!s", (id) => {
            if (sockets.has(parseInt(id))) {
                const myPlayer = sockets.get(parseInt(id)).myPlayer;
                game.ui.components.Chat.onMessageReceived({ displayName: id, message: `${id}, W ${numberAbbreviate(myPlayer.wood)}, S ${numberAbbreviate(myPlayer.stone)}, G ${numberAbbreviate(myPlayer.gold)}, T ${numberAbbreviate(myPlayer.token)}` });
                return;
            }
            sockets.forEach((e, id) => {
                game.ui.components.Chat.onMessageReceived({ displayName: `${id}`, message: `${id}, W ${numberAbbreviate(e.myPlayer.wood)}, S ${numberAbbreviate(e.myPlayer.stone)}, G ${numberAbbreviate(e.myPlayer.gold)}, T ${numberAbbreviate(e.myPlayer.token)}` });
            });
        }
    ],
    [
        "!jahrc", (id) => {
            id = parseInt(id);
            if (!sockets.has(id)) return;
            handler.oldId && id != handler.oldId && (sockets.get(handler.oldId).join(handler.oldPsk), sockets.get(handler.oldId).leave());
            handler.oldId = id;
            handler.oldPsk = sockets.get(id).partyShareKey;
            sockets.get(id).join(handler.partyShareKey);
            setTimeout(() => { sockets.get(id).join(handler.partyShareKey); }, 300);
            $("ahrcid").value = id;
            if (script.ahrc) $("ahrc").click();
            if (script.ahrcsocket) $("ahrcsocket").click();
            $("ahrcsocket").click();
        }
    ],
    [
        "!xk", () => {
            if (!script.xkeysocket) $("xkeysocket").click();
        }
    ],
    [
        "!!xk", () => {
            if (script.xkeysocket) $("xkeysocket").click();
        }
    ],
    [
        "!lock", () => {
            handler.altsLockPos = { x: handler.worldPos.x, y: handler.worldPos.y };
        }
    ]
];

const keysJSON = JSON.stringify(keys.map(e => e[0]));
if (!localStorage.keys || script.version != localStorage.version) localStorage.keys = keysJSON;
if (localStorage.keys != keysJSON) {
    const arr = JSON.parse(localStorage.keys);
    arr.forEach((e, pos) => { keys[pos][0] = e; });
    $("key").forEach((e, pos) => {
        e.value = arr[pos];
    });
};
let keysMap = new Map(keys);

const cmdsJSON = JSON.stringify(cmds.map(e => e[0]));
const cmdsParameter = $("cmd").map(e => e.value.split(" ")[1] || "");
if (!localStorage.cmds || script.version != localStorage.version) localStorage.cmds = cmdsJSON;
if (localStorage.cmds != cmdsJSON) {
    const arr = JSON.parse(localStorage.cmds);
    arr.forEach((e, pos) => { cmds[pos][0] = e.toLowerCase(); });
    $("cmd").forEach((e, pos) => { e.value = arr[pos].toLowerCase() + (cmdsParameter[pos] ? (" " + cmdsParameter[pos]) : ""); });
};
let cmdsMap = new Map(cmds);

localStorage.version = script.version;

class Handler {
    constructor() {
        this.tick = null;
        this.uid = null;
        this.myPlayer = null;
        this.myPet = null;
        this.entities = new Map();
        this.inventory = {};
        this.partyInfo = [];
        this.partyShareKey = "";
        this.dayCycle = { cycleStartTick: 100, nightEndTick: 0, dayEndTick: 1300, isDay: 1 };
        this.parties = {};
        this.buildings = new Map();
        this.buildingUids_1 = {};
        this.petActivated = false;
        this.gs = null;
        this.rebuilder = new Map();
        this.inactiveRebuilder = new Map();
        this.reupgrader = new Map();
        this.inactiveReupgrader = new Map();
        this.rebuilderconfirm = new Map();
        this.inactiveRebuilderconfirm = new Map();
        this.reupgraderconfirm = new Map();
        this.inactiveReupgraderconfirm = new Map();
        this.reupgraderAll = new Map();
        this.inactiveReupgraderAll = new Map();
        this.reupgraderAllconfrim = new Map();
        this.inactiveReupgraderAllconfirm = new Map();
        this.nearestPlayer = null;
        this.nearestPlayerDistance = Infinity;
        this.harvesters = new Map();
        this.buildingsUid = new Map();
        this.harvesterTicks = [
            { tick: 0, resetTick: 31, deposit: 0.4, tier: 1 },
            { tick: 0, resetTick: 29, deposit: 0.6, tier: 2 },
            { tick: 0, resetTick: 27, deposit: 0.7, tier: 3 },
            { tick: 0, resetTick: 24, deposit: 1, tier: 4 },
            { tick: 0, resetTick: 22, deposit: 1.2, tier: 5 },
            { tick: 0, resetTick: 20, deposit: 1.4, tier: 6 },
            { tick: 0, resetTick: 18, deposit: 2.4, tier: 7 },
            { tick: 0, resetTick: 16, deposit: 3, tier: 8 }
        ];
        this.positionRest = null;
        this.lockPos = { x: 12000, y: 12000 };
        game.network.addPacketHandler(4, this.onMessage.bind(this));
        game.network.addPacketHandler(0, this.onMessage.bind(this));
        game.network.addPacketHandler(9, this.onMessage.bind(this));
        this.healTick = 0;
        this.petHealTick = 0;
        this.evolvePetTick = 0;
        this.petActivated = null;
        this.mousePs = { x: 0, y: 0 };
        this.worldPos = { x: 0, y: 0 };
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.deleteBuildingSet = new Set();
        this.deleteTrigger = 0;
        this.sellUid = null;
        this.deleteBuildingConfirmSet = new Set();
        this.deleteconfirm = new Map();
        this.deleteconfirmTrigger = 0;
        this.sellconfirmUid = null;
        this.uthObj = { "Door": 1, "SlowTrap": 2, "ArrowTower": 3, "CannonTower": 4, "MeleeTower": 5, "BombTower": 6, "MagicTower": 7, "GoldMine": 8, "Harvester": 9, "GoldStash": 10 };
        this.uthEntities = new Map();
        this.yawBuildings = new Map();
        this.borders = [new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics()];
        this.colors = [0xFFFFFF, 0xFF0000, 0xFFFF00, 0x00FF00, 0x0000FF];
        this.sizes = [48, 864, 1680, 2544, 5040];
        this.borders.forEach((item, index) => {
            item.lineStyle(3, this.colors[index]);
            item.drawRect(-this.sizes[index], -this.sizes[index], 2 * this.sizes[index], 2 * this.sizes[index]);
            game.world.renderer.entities.node.addChild(item);
            item.position = { x: -2400000, y: -2400000 };
        });
        this.borders2 = [new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics()];
        this.borders2.forEach((item, index) => {
            item.lineStyle(3, this.colors[index]);
            item.drawRect(-this.sizes[index], -this.sizes[index], 2 * this.sizes[index], 2 * this.sizes[index]);
            game.world.renderer.entities.node.addChild(item);
            item.position = { x: -2400000, y: -2400000 };
        });
        this.circle = new PIXI.Graphics();
        this.circle.beginFill(0xffffff);
        this.circle.drawCircle(0, 0, 1313);
        this.circle.endFill();
        this.circle.alpha = 0.1;
        game.world.renderer.entities.node.addChild(this.circle);
        this.circle.position = { x: -2400000, y: -2400000 };
        this.reverseMouseMove = false;
        document.addEventListener("mousedown", (e) => (e.button == 2 && (handler.reverseMouseMove = true)));
        document.addEventListener("mouseup", (e) => (e.button == 2 && (handler.reverseMouseMove = false)));
        this.spearmaxtier = $("spearmaxtier").value;
        $("hud-toolbar-item")[0].addEventListener("click", () => sockets.forEach(e => e.equip("Pickaxe", e.inventory.Pickaxe.tier)));
        this.minimap = document.getElementById("hud-map");
        this.playerFindingList = new Set();
        this.baseFindingList = new Map();
        this.lastEntityTime = 0;
        this.audio = new Audio();
        this.audio.src = "https://cdn.discordapp.com/attachments/776401978414727179/1226652360680669225/Rick_Roll_Different_link__no_ads.mp3?ex=66258c08&is=66131708&hm=0a1e36c1110aac2b3692f9264026617133959d08f4d46e1a5958ee9b6cf7e734&";
        this.chatSpamList = {
            "crashspam": '.......................................................................................................................................<img src onerror="game.network.socket.send([]);client&&client.closeSession(client.connectedToId);[...Array(4e9)];"',
            "tctctctctc": 'TCTCTCTCTC = TERRORIST COMMUNITY TRASH CAN OF THE CUNTS THE CLAN OF TURKISH CHICKEN',
            "kgkgkgkgkg": 'KGKGKGKGKG = KIDNAPPED GAY KINDERGARTEN GALLING KNUCKLEHEAD GASP KNEE-SLAPPER GAWK KFC GRANDMOTHERFUCKER',
        }
        this.timeoutId = 0;
        this.timeoutTick = 0;
        this.timeoutServerTick = 0;
        this.timeoutPing = 999;
        this.paused = 0;
        this.autotimeout = false;
        this.savedPartyIds = new Map();
        this.rebuildersocket = new Map();
        this.lastPlayerTickDead = 0;
        game.world.removeEntity2 = game.world.removeEntity;
        game.world.removeEntity = this.removeEntity.bind(this);
        game.world.createEntity2 = game.world.createEntity;
        game.world.createEntity = this.createEntity.bind(this);
    }
    onMessage(data) {
        if (data.opcode === 4) {
            this.onEnterWorldHandler(data);
        }
        if (data.opcode === 0) {
            this.onEntityUpdateHandler(data);
            this.lastEntityTime = Date.now();
        }
        if (data.opcode === 9) {
            this.onRpcHandler(data);
        }
    }
    onEnterWorldHandler(data) {
        if (!data.allowed) return;
        this.tick = data.tick;
        this.uid = data.uid;
        //this.testPing().then(e => (this.ping = Math.ceil(e / 50)));
    }
    onEntityUpdate(data) {
        if (data.model == "GamePlayer" || data.model == "PetCARL" || data.model == "PetMiner") {
            this.entities.set(data.uid, { targetTick: data, uid: data.uid, model: data.model });
            return;
        }
        if (data === true || !this.entities.has(data.uid)) return;
        const tick = this.entities.get(data.uid).targetTick;
        Object.keys(data).forEach(r => { tick[r] = data[r] });
    }
    onUthEntityUpdate(data) {
        if (this.uthObj[data.model]) {
            this.uthEntities.set(data.uid, { targetTick: { health: data.health, maxHealth: data.maxHealth, partyId: data.partyId, position: { x: data.position.x, y: data.position.y }, tick: 0 }, uid: data.uid, model: data.model });
            return;
        }
        if (data === true || !this.uthEntities.has(data.uid)) return;
        const tick = this.uthEntities.get(data.uid).targetTick;
        data.health && (tick.health = data.health);
        data.maxHealth && (tick.maxHealth = data.maxHealth, tick.tick = 0);
    }
    onEntityUpdateHandler(data) {
        this.tick = data.tick;
        this.entitiesData = data.entities;
        this.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
        data.entities.forEach((data, uid) => {
            this.onEntityUpdate(data);
            this.onUthEntityUpdate(data);
            if (data.model == "GamePlayer" || data.model == "GoldStash") {
                !this.savedPartyIds.has(data.partyId) && this.savedPartyIds.set(data.partyId, { gs: null, players: new Map() });
                const tick = this.savedPartyIds.get(data.partyId);
                if (data.model == "GamePlayer") tick.players.set(data.uid, data);
                if (data.model == "GoldStash") {
                    tick.gs = data;
                    if (this.baseFindingList.has(data.partyId)) {
                        game.ui.components.PopupOverlay.showHint(handler.baseFindingList.get(data.partyId) + "'s gold stash found, position: {x: " + data.position.x + ", y: " + data.position.y + "}");
                        game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: handler.baseFindingList.get(data.partyId) + "'s gold stash found, position: {x: " + data.position.x + ", y: " + data.position.y + "}" });
                        this.baseFindingList.delete(data.partyId);
                    }
                }
            }
            if (data.model == "GoldStash") {
                this.borders.forEach(item => {
                    item.position = data.position;
                });
                this.circle.position = data.position;
            }
            if (game.ui.components.PlacementOverlay.buildingId == "GoldStash") {
                const position = game.ui.components.PlacementOverlay.gridPos;
                this.borders2.forEach(item => {
                    item.position = position;
                });
                this.hasPlacementOverlay = true;
            }
            if (this.hasPlacementOverlay && game.ui.components.PlacementOverlay.buildingId !== "GoldStash") {
                const position = { x: -2400000, y: -2400000 };
                this.borders2.forEach(item => {
                    item.position = position;
                });
                this.hasPlacementOverlay = false;
            }
            if (data.model == "Harvester" || data.model == "MeleeTower") {
                this.yawBuildings.set(data.uid, { targetTick: { yaw: data.yaw, uid: data.uid }, uid: data.uid });
            }
            if (game.world.entities.get(uid)) {
                if (game.world.entities.get(uid).node.alpha != 1) game.world.entities.get(uid).setAlpha(1);
            }
        });
        if (data.entities.get(this.uid).dead !== undefined) {
            this.lastPlayerTickDead = data.entities.get(this.uid).dead;
        }
        this.nearestPlayer = null;
        this.nearestPlayerDistance = Infinity;
        this.entities.forEach(e => {
            if (!data.entities.has(e.uid)) {
                this.entities.delete(e.uid);
                return;
            }
            if (e.model == "GamePlayer" && this.playerFindingList.has(e.uid)) {
                game.ui.components.PopupOverlay.showHint(e.targetTick.name + " found, position: {x: " + e.targetTick.position.x + ", y: " + e.targetTick.position.y + "}");
                game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: e.targetTick.name + " found, position: {x: " + e.targetTick.position.x + ", y: " + e.targetTick.position.y + "}" });
                this.playerFindingList.delete(e.uid);
                const gs = this.savedPartyIds.get(e.targetTick.partyId)?.gs;
                if (gs) {
                    game.ui.components.PopupOverlay.showHint(e.targetTick.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}");
                    game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: e.targetTick.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}" });
                    this.baseFindingList.delete(e.targetTick.partyId);
                } else {
                    this.baseFindingList.set(e.targetTick.partyId, e.targetTick.name);
                }
            }
            if (this.myPlayer && e.uid != this.uid && e.model == "GamePlayer" && Math.hypot(e.targetTick.position.x - this.myPlayer.position.x, e.targetTick.position.y - this.myPlayer.position.y) < this.nearestPlayerDistance && e.targetTick.partyId !== this.myPlayer.partyId && !e.targetTick.dead) {
                this.nearestPlayerDistance = Math.hypot(e.targetTick.position.x - this.myPlayer.position.x, e.targetTick.position.y - this.myPlayer.position.y);
                this.nearestPlayer = e.targetTick;
            }
            if (e.model == "GamePlayer" && script.playerinfo) {
                const entity = game.world.entities.get(e.uid);
                entity && (entity.currentModel.nameEntity.text.text = `${socketsUid.has(e.uid) ? socketsUid.get(e.uid) : entity.targetTick.name}, W ${numberAbbreviate(entity.targetTick.wood)}, S ${numberAbbreviate(entity.targetTick.stone)}, G ${numberAbbreviate(entity.targetTick.gold)}, T ${numberAbbreviate(entity.targetTick.token)} \nX ${numberAbbreviate(entity.targetTick.position.x)}, Y ${numberAbbreviate(entity.targetTick.position.y)}, PID ${entity.targetTick.partyId}, TO ${entity.targetTick.isPaused}`);
            }
        });
        this.yawBuildings.forEach(e => {
            if (!data.entities.has(e.uid) && !this.buildingsUid.has(e.uid)) {
                this.yawBuildings.delete(e.uid);
            }
        });
        this.myPlayer = this.entities.get(this.uid).targetTick;
        this.myPet = this.entities.get(this.myPlayer.petUid)?.targetTick || null;

        if (!this.petActivated && this.myPet) {
            this.petActivated = true;
        }

        if (script.autoheal && this.myPlayer.health / 5 < settings[0][0]) {
            this.heal();
        }
        if (script.autopetheal && this.myPet && this.myPet.health / this.myPet.maxHealth * 100 < settings[1][0]) {
            this.petHeal();
        }
        if (script.autorevivepet && (this.petActivated || window.activated)) {
            this.buy("PetRevive", 1);
            this.equip("PetRevive", 1);
        }
        if (script.autoevolve && this.myPet) {
            const list = evolvePetArr[this.myPet.tier - 1];
            if (list && this.myPlayer.token >= list[0] && Math.floor(this.myPet.experience / 100) + 1 >= list[1]) {
                this.evolvePet();
            }
        }
        if (script.autorespawn) {
            this.sendPacket(3, { respawn: 1 });
        }
        if (script.autobow) {
            if (window.thisWeapon === "Bow") {
                this.sendPacket(3, { space: 1 });
                this.sendPacket(3, { space: 0 });
            } else {
                this.sendPacket(3, { mouseDown: script.autoaim ? (Math.round((180 / Math.PI * Math.atan2(this.nearestPlayer.position.y - this.myPlayer.position.y, this.nearestPlayer.position.x - this.myPlayer.position.x) + 450)) % 360) : game.inputPacketCreator.lastAnyYaw });
            }
        }
        if (script.autoaim && this.nearestPlayer && !(script.autobow && window.thisWeapon !== "Bow")) {
            this.sendPacket(3, { mouseMoved: (Math.round((180 / Math.PI * Math.atan2(this.nearestPlayer.position.y - this.myPlayer.position.y, this.nearestPlayer.position.x - this.myPlayer.position.x) + 450)) % 360) });
        }
        script.ahrc && this.harvesterTicks.forEach(e => {
            e.tick++;
            if (e.tick >= e.resetTick) {
                e.tick = 0;
                this.depositAhrc(e);
            }
            if (e.tick == 1) {
                this.collectAhrc(e);
            }
        });
        this.gs && script.autobuild && this.inactiveRebuilder.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.abs(this.myPlayer.position.x - x) < 576 && Math.abs(this.myPlayer.position.y - y) < 576) {
                this.sendPacket(9, { name: "MakeBuilding", x: x, y: y, type: e[2], yaw: e[3] });
            }
        });
        this.gs && script.autoupgradeall && this.inactiveReupgraderAll.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.hypot((this.myPlayer.position.x - x), (this.myPlayer.position.y - y)) <= 768) {
                if (e[5] - this.tick <= 0) {
                    e[5] = this.tick + 7;
                    this.sendPacket(9, { name: "UpgradeBuilding", uid: e[4] });
                }
            }
        });
        this.gs && script.smartautoupgrade && this.inactiveReupgrader.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.hypot((this.myPlayer.position.x - x), (this.myPlayer.position.y - y)) <= 768) {
                if (e[5] - this.tick <= 0) {
                    e[5] = this.tick + 7;
                    this.sendPacket(9, { name: "UpgradeBuilding", uid: e[4] });
                }
            }
        });
        this.gs && script.autobuildconfirm && this.inactiveRebuilderconfirm.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.abs(this.myPlayer.position.x - x) < 576 && Math.abs(this.myPlayer.position.y - y) < 576) {
                this.sendPacket(9, { name: "MakeBuilding", x: x, y: y, type: e[2], yaw: e[3] });
            }
        });
        this.gs && script.smartautoupgradeconfirm && this.inactiveReupgraderconfirm.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.hypot((this.myPlayer.position.x - x), (this.myPlayer.position.y - y)) <= 768) {
                if (e[5] - this.tick <= 0) {
                    e[5] = this.tick + 7;
                    this.sendPacket(9, { name: "UpgradeBuilding", uid: e[4] });
                }
            }
        });
        this.gs && script.autoupgradeallconfirm && this.inactiveReupgraderAllconfirm.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.hypot((this.myPlayer.position.x - x), (this.myPlayer.position.y - y)) <= 768) {
                if (e[5] - this.tick <= 0) {
                    e[5] = this.tick + 7;
                    this.sendPacket(9, { name: "UpgradeBuilding", uid: e[4] });
                }
            }
        });
        if (this.gs && script.autodelete) {
            this.deleteTrigger = (this.deleteTrigger + 1) % 3;
            const building = this.buildingsUid.get(this.sellUid);
            if (building && !(Math.abs(this.myPlayer.position.x - building.x) < 1150 && Math.abs(this.myPlayer.position.y - building.y) < 1150)) {
                const len = this.deleteBuildingSet.size;
                for (let i = 0; i < len; i++) {
                    const building = this.buildingsUid.get(this.sellUid);
                    if (building && !(Math.abs(this.myPlayer.position.x - building.x) < 1150 && Math.abs(this.myPlayer.position.y - building.y) < 1150)) {
                        const uid = this.sellUid;
                        this.deleteBuildingSet.delete(uid);
                        this.sellUid = this.deleteBuildingSet.keys().next().value;
                        uid && this.buildingsUid.has(uid) && this.deleteBuildingSet.add(uid);
                        const building = this.buildingsUid.get(this.sellUid);
                        if (building && Math.abs(this.myPlayer.position.x - building.x) < 1150 && Math.abs(this.myPlayer.position.y - building.y) < 1150) break;
                    }
                }
            }
            this.sellUid && this.sendPacket(9, { name: "DeleteBuilding", uid: this.sellUid });
            if (this.deleteTrigger === 0) {
                const uid = this.sellUid;
                this.deleteBuildingSet.delete(uid);
                this.sellUid = this.deleteBuildingSet.keys().next().value;
                uid && this.buildingsUid.has(uid) && this.deleteBuildingSet.add(uid);
            }
        }
        if (this.gs && script.autodeleteconfirm) {
            this.deleteconfirmTrigger = (this.deleteconfirmTrigger + 1) % 3;
            const building = this.buildingsUid.get(this.sellconfirmUid);
            if (building && !(Math.abs(this.myPlayer.position.x - building.x) < 1150 && Math.abs(this.myPlayer.position.y - building.y) < 1150)) {
                const len = this.deleteBuildingConfirmSet.size;
                for (let i = 0; i < len; i++) {
                    const building = this.buildingsUid.get(this.sellconfirmUid);
                    if (building && !(Math.abs(this.myPlayer.position.x - building.x) < 1150 && Math.abs(this.myPlayer.position.y - building.y) < 1150)) {
                        const uid = this.sellconfirmUid;
                        this.deleteBuildingConfirmSet.delete(uid);
                        this.sellconfirmUid = this.deleteBuildingConfirmSet.keys().next().value;
                        uid && this.buildingsUid.has(uid) && this.deleteBuildingConfirmSet.add(uid);
                        const building = this.buildingsUid.get(this.sellconfirmUid);
                        if (building && Math.abs(this.myPlayer.position.x - building.x) < 1150 && Math.abs(this.myPlayer.position.y - building.y) < 1150) break;
                    }
                }
            }
            this.sellconfirmUid && this.sendPacket(9, { name: "DeleteBuilding", uid: this.sellconfirmUid });
            if (this.deleteconfirmTrigger === 0) {
                const uid = this.sellconfirmUid;
                this.deleteBuildingConfirmSet.delete(uid);
                this.sellconfirmUid = this.deleteBuildingConfirmSet.keys().next().value;
                uid && this.buildingsUid.has(uid) && this.deleteBuildingConfirmSet.add(uid);
            }
        }
        const healLevel = parseInt($("uthinput").value) || 25;
        this.uthEntities.forEach(e => {
            if (!data.entities.has(e.uid)) {
                this.uthEntities.delete(e.uid);
                return;
            }
            if (script.uth && this.tick >= e.targetTick.tick && this.myPlayer.partyId == e.targetTick.partyId && e.targetTick.health / e.targetTick.maxHealth * 100 <= healLevel && Math.hypot(this.myPlayer.position.x - e.targetTick.position.x, this.myPlayer.position.y - e.targetTick.position.y) <= 768) {
                e.targetTick.tick = this.tick + 7;
                this.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid });
            }
        });
        this.worldPos = this.screenToWorld(this.mousePs.x, this.mousePs.y);
        this.spearmaxtier = parseInt($("spearmaxtier").value);
        this.farmspearmaxtier = parseInt($("farmspearmaxtier").value);
        this.ahrcid = $("ahrcid").value;
        this.chatspam = game.network.codec.encode(9, { name: "SendChatMessage", channel: "Local", message: this.chatSpamList[$("chatspamlist").value] });
        if (this.myPlayer.wave == 8) {
            if (script.joinbeforebosssocket && this.tick % 2400 === 1100) {
                sockets.forEach(e => { !e.gs && e.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: this.partyShareKey }) });
            }
            if (script.leaveafterbosssocket && this.tick % 2400 === 1200) {
                sockets.forEach(e => { if (e.myPlayer.partyId == this.myPlayer.partyId) e.sendPacket(9, { name: "LeaveParty" }) });
            }
        }
        if (this.autotimeout) {
            if (this.tick > this.timeoutTick) this.timeoutTick = this.tick + 4800;
            if (this.myPlayer.isPaused === 1 && this.paused === 0 && this.hasTimeouted) {
                this.hasTimeouted = false;
                this.timeoutServerTick = this.tick + 4800;
                this.timeoutPing = Math.min(this.timeoutPing, this.timeoutServerTick - this.timeoutTick);
                if (this.timeoutTick < this.timeoutServerTick - this.timeoutPing) this.timeoutTick = this.timeoutServerTick - this.timeoutPing;
            }
            if (this.timeoutTick > this.timeoutServerTick) (this.timeout(), this.hasTimeouted = true);
        }
        this.paused = this.myPlayer.isPaused;
        if (script.playerfollower) {
            const target = data.entities.get(this.playerFollowerUid);
            if (!target) return;
            const position = target.position || this.entities.get(this.playerFollowerUid).targetTick.position;
            const x = ((Math.round(((Math.atan2(position.y - this.myPlayer.position.y, position.x - this.myPlayer.position.x) * 180 / Math.PI + 450) % 360) / 45) * 45) % 360) % 360;
            this.sendPacket(3, { up: (x == 0 || x == 45 || x == 315) ? 1 : 0, down: (x == 135 || x == 180 || x == 225) ? 1 : 0, right: (x == 45 || x == 90 || x == 135) ? 1 : 0, left: (x == 225 || x == 270 || x == 315) ? 1 : 0 });
        }
    }
    onRpcHandler(data) {
        switch (data.name) {
            case "LocalBuilding":
                const gs = data.response.find(e => e.type == "GoldStash");
                if (gs) {
                    this.gs = gs;
                    if (gs.dead) {
                        this.gs = null;
                        this.buildings.clear();
                    }
                }
                const auaTier = parseInt($("auainput").value);
                const auacTier = parseInt($("auacinput").value);
                data.response.forEach(e => {
                    if (this.buildingUids_1[e.uid]) return;
                    if (e.dead && !this.buildingUids_1[e.uid]) {
                        this.buildingUids_1[e.uid] = true;
                        setTimeout(() => {
                            delete this.buildingUids_1[e.uid];
                        }, 500);
                    }
                    e.type == "Harvester" && this.harvesters.set(e.uid, e);
                    e.type == "Harvester" && e.dead && this.harvesters.delete(e.uid);
                    this.buildingsUid.set(e.uid, e);
                    e.dead && this.buildingsUid.delete(e.uid);
                    if (script.autodelete && e.type != "GoldStash") {
                        this.deleteBuildingSet.add(e.uid);
                        e.dead && this.deleteBuildingSet.delete(e.uid);
                    }
                    if (this.gs) {
                        const index = (e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000;
                        this.buildings.set(index, e);
                        e.dead && this.buildings.delete(index);
                        if (script.autobuild && this.rebuilder.get(index)) {
                            const rebuilder = this.rebuilder.get(index);
                            e.dead ? this.inactiveRebuilder.set(index, rebuilder) : this.inactiveRebuilder.delete(index);
                        }
                        if (script.autoupgradeall) {
                            if (e.dead) {
                                this.inactiveReupgraderAll.delete(index);
                            } else if (e.tier < auaTier) {
                                !this.inactiveReupgraderAll.get(index) && this.inactiveReupgraderAll.set(index, [(e.x - this.gs.x) / 24, (e.y - this.gs.y) / 24, auaTier, e.tier, e.uid, this.tick]);
                            } else {
                                this.inactiveReupgraderAll.delete(index);
                            }
                        }
                        if (script.smartautoupgrade && this.reupgrader.get(index)) {
                            const reupgrader = this.reupgrader.get(index);
                            if (e.dead) {
                                this.inactiveReupgrader.delete(index);
                            } else if (e.tier < reupgrader[2]) {
                                !this.inactiveReupgrader.get(index) && this.inactiveReupgrader.set(index, [reupgrader[0], reupgrader[1], reupgrader[2], e.tier, e.uid, this.tick]);
                            } else {
                                this.inactiveReupgrader.delete(index);
                            }
                        }
                        if (script.autobuildconfirm && this.rebuilderconfirm.get(index)) {
                            const rebuilder = this.rebuilderconfirm.get(index);
                            e.dead ? this.inactiveRebuilderconfirm.set(index, rebuilder) : this.inactiveRebuilderconfirm.delete(index);
                        }
                        if (script.smartautoupgradeconfirm && this.reupgraderconfirm.get(index)) {
                            const reupgrader = this.reupgraderconfirm.get(index);
                            if (e.dead) {
                                this.inactiveReupgraderconfirm.delete(index);
                            } else if (e.tier < reupgrader[2]) {
                                !this.inactiveReupgraderconfirm.get(index) && this.inactiveReupgraderconfirm.set(index, [reupgrader[0], reupgrader[1], reupgrader[2], e.tier, e.uid, this.tick]);
                            } else {
                                this.inactiveReupgraderconfirm.delete(index);
                            }
                        }
                        if (script.autoupgradeallconfirm && this.reupgraderAllconfrim.get(index)) {
                            const reupgrader = this.reupgraderAllconfrim.get(index);
                            if (e.dead) {
                                this.inactiveReupgraderAllconfirm.delete(index);
                            } else if (e.tier < auacTier) {
                                !this.inactiveReupgraderAllconfirm.get(index) && this.inactiveReupgraderAllconfirm.set(index, [reupgrader[0], reupgrader[1], auacTier, e.tier, e.uid, this.tick]);
                            } else {
                                this.inactiveReupgraderAllconfirm.delete(index);
                            }
                        }
                        if (script.autodeleteconfirm && e.type != "GoldStash" && (!this.deleteconfirm.get(index) || this.deleteconfirm.get(index)[2] != e.type)) {
                            this.deleteBuildingConfirmSet.add(e.uid);
                            e.dead && this.deleteBuildingConfirmSet.delete(e.uid);
                        }
                    }
                });
                if (gs && !gs.dead) {
                    if (script.autobuild) {
                        this.rebuilder.forEach(e => {
                            if (!this.buildings.get(e[0] + e[1] * 1000)) {
                                this.inactiveRebuilder.set(e[0] + e[1] * 1000, e);
                            }
                        });
                    }
                    if (script.autobuildconfirm) {
                        this.rebuilderconfirm.forEach(e => {
                            if (!this.buildings.get(e[0] + e[1] * 1000)) {
                                this.inactiveRebuilderconfirm.set(e[0] + e[1] * 1000, e);
                            }
                        });
                    }
                }
                break;
            case "DayCycle":
                this.dayCycle = data.response;
                if (this.dayCycle.isDay && this.aitoSocket) {
                    const aitoObj = new Map();
                    sockets.forEach(e => {
                        !aitoObj.has(e.myPlayer.partyId) && aitoObj.set(e.myPlayer.partyId, []);
                        aitoObj.get(e.myPlayer.partyId).push(e.myPlayer.uid);
                    });
                    aitoObj.forEach(e => {
                        const socket = sockets.get(socketsUid.get(e[this.timeoutId % e.length]));
                        if (e.length > 2) (socket.timeout(), socket.autotimeout = false);
                        if (e.length <= 2) socket.autotimeout = true;
                    });
                    this.timeoutId++;
                }
                break;
            case "PartyShareKey":
                this.partyShareKey = data.response.partyShareKey;
                break;
            case "PartyInfo":
                this.partyInfo = data.response;
                break;
            case "Leaderboard":
                sockets.forEach((e, i) => {
                    if (socketsUid.has(e.uid) && (e.ws.readyState === 3 || e.ws.readyState === 2)) socketsUid.delete(e.uid);
                    if (e.ws.readyState === 3 || e.ws.readyState === 2) (sockets.get(i).removeMap(), sockets.delete(i));
                });
                break;
        }
    }
    sendPacket(opcode, data) {
        if (game.network.socket && game.network.socket.readyState === 1) game.network.socket.send(game.network.codec.encode(opcode, data));
    }
    heal() {
        if (this.tick > this.healTick) {
            this.healTick = this.tick + 15;
            this.buy("HealthPotion", 1);
            this.equip("HealthPotion", 1);
        }
    }
    petHeal() {
        if (this.tick > this.petHealTick) {
            this.petHealTick = this.tick + 15;
            this.buy("PetHealthPotion", 1);
            this.equip("PetHealthPotion", 1);
        }
    }
    evolvePet() {
        if (this.tick > this.evolvePetTick) {
            this.evolvePetTick = this.tick + 30;
            this.buy(this.myPet.model, this.myPet.tier + 1);
        }
    }
    buy(item, tier) {
        this.sendPacket(9, { name: "BuyItem", itemName: item, tier: tier });
    }
    equip(item, tier) {
        this.sendPacket(9, { name: "EquipItem", itemName: item, tier: tier });
    }
    depositAhrc(tick) {
        this.harvesters.forEach(e => {
            if (e.tier == tick.tier) {
                this.sendPacket(9, { name: "AddDepositToHarvester", uid: e.uid, deposit: tick.deposit });
            }
        });
    }
    collectAhrc(tick) {
        this.harvesters.forEach(e => {
            if (e.tier == tick.tier) {
                this.sendPacket(9, { name: "CollectHarvester", uid: e.uid });
            }
        });
    }
    onMouseMove(event) {
        if (script.advancedautowalls && game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
            if (!this.oldGridPos) {
                const oldWorldPos = this.screenToWorld(this.mousePs.x, this.mousePs.y);
                this.oldGridPos = {
                    x: ((oldWorldPos.x / 48 | 0) + 0.5) * 48,
                    y: ((oldWorldPos.y / 48 | 0) + 0.5) * 48
                }
            }
            const worldPos = this.screenToWorld(event.clientX, event.clientY);
            const gridPos = {
                x: ((worldPos.x / 48 | 0) + 0.5) * 48,
                y: ((worldPos.y / 48 | 0) + 0.5) * 48
            }
            while (this.oldGridPos.y != gridPos.y || this.oldGridPos.x != gridPos.x) {
                const x = (Math.round(((Math.atan2(gridPos.y - this.oldGridPos.y, gridPos.x - this.oldGridPos.x) * 180 / Math.PI + 450) % 360) / 45) * 45) % 360;
                if (x == 0 || x == 45 || x == 315) this.oldGridPos.y -= 48;
                if (x == 45 || x == 90 || x == 135) this.oldGridPos.x += 48;
                if (x == 135 || x == 180 || x == 225) this.oldGridPos.y += 48;
                if (x == 225 || x == 270 || x == 315) this.oldGridPos.x -= 48;
                this.sendPacket(9, { name: 'MakeBuilding', x: this.oldGridPos.x, y: this.oldGridPos.y, type: "Wall", yaw: 0 });
            }
        } else {
            this.oldGridPos = null;
        }
        this.mousePs = { x: event.clientX, y: event.clientY };
        if (!this.myPlayer) return;
        this.worldPos = this.screenToWorld(event.clientX, event.clientY);
        if (!(game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall")) return;
        if (script.autowalls) {
            const gridPos = {
                x: ((this.worldPos.x / 48 | 0) + 0.5) * 48,
                y: ((this.worldPos.y / 48 | 0) + 0.5) * 48
            }
            const position = $("wallsinput").value.split("x");
            const columns = parseInt(position[0]);
            const rows = parseInt(position[1]);
            for (let x = -Math.floor(columns / 2); x < Math.round(columns / 2); x++) {
                for (let y = -Math.floor(rows / 2); y < Math.round(rows / 2); y++) {
                    this.sendPacket(9, { name: 'MakeBuilding', x: gridPos.x + x * 48, y: gridPos.y + y * 48, type: "Wall", yaw: 0 });
                }
            }
        }
    }
    screenToWorld(x, y) {
        if (!this.uid) return;
        const ratio = Math.max((window.innerWidth * window.devicePixelRatio) / 1920, (window.innerHeight * window.devicePixelRatio) / 1080);
        const scale = ratio == game.renderer.scale ? ratio : game.renderer.scale;
        return {
            x: window.devicePixelRatio * x / scale + this.myPlayer.position.x - (window.devicePixelRatio * window.innerWidth / 2) / scale,
            y: window.devicePixelRatio * y / scale + this.myPlayer.position.y - (window.devicePixelRatio * window.innerHeight / 2) / scale
        };
    };
    join(psk) {
        this.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk });
    }
    leave() {
        this.sendPacket(9, { name: "LeaveParty" });
    }
    timeout() {
        this.sendPacket(9, { name: "BuyItem", itemName: "Pause", tier: 1 });
    }
    videoalert() {
        this.audio.play();
    };
    alarm() {
        !this.onlyOpenOnceOnTimeout && (this.onlyOpenOnceOnTimeout = true, this.videoalert(), setTimeout(() => { this.onlyOpenOnceOnTimeout = false }, 24000));
    };
    _1b1() {
        let nearestSocket;
        let nearestDistance = Infinity;
        sockets.forEach(e => {
            const distance = e.myPlayer ? Math.hypot(e.myPlayer.position.x - handler.worldPos.x, e.myPlayer.position.y - handler.worldPos.y) : Infinity;
            if (nearestDistance > distance && !e.hit) {
                nearestDistance = distance;
                nearestSocket = e;
            }
        });
        if (!nearestSocket || nearestSocket.hit) return;
        nearestSocket.hit = 1;
        const tier = nearestSocket.inventory.Spear?.tier || 0;
        tier && nearestSocket.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: tier });
        for (let i = tier; i < parseInt($("spearmaxtier").value); i++) {
            nearestSocket.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: i + 1 });
            nearestSocket.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: i + 1 });
        }
        nearestSocket.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
        setTimeout(() => { nearestSocket.sendPacket(3, { mouseDown: nearestSocket.aimingYaw }) }, 100);
        setTimeout(() => { nearestSocket.sendPacket(3, { mouseUp: 1 }) }, 7000);
        setTimeout(() => { nearestSocket.hit = 0 }, 7500);
    }
    _1b1Second() {
        const arr = [];
        sockets.forEach(e => {
            const distance = e.myPlayer ? Math.hypot(e.myPlayer.position.x - handler.worldPos.x, e.myPlayer.position.y - handler.worldPos.y) : Infinity;
            if (!e.hit) {
                arr.push([distance, e]);
            }
        });
        const sorted = arr.sort((a, b) => a[0] - b[0]);
        if (!sorted[1]) return;
        const nearestSocket = sorted[1][1];
        if (!nearestSocket || nearestSocket.hit) return;
        nearestSocket.hit = 1;
        const tier = nearestSocket.inventory.Spear?.tier || 0;
        tier && nearestSocket.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: tier });
        for (let i = tier; i < parseInt($("spearmaxtier").value); i++) {
            nearestSocket.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: i + 1 });
            nearestSocket.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: i + 1 });
        }
        nearestSocket.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
        setTimeout(() => { nearestSocket.sendPacket(3, { mouseDown: nearestSocket.aimingYaw }) }, 100);
        setTimeout(() => { nearestSocket.sendPacket(3, { mouseUp: 1 }) }, 7000);
        setTimeout(() => { nearestSocket.hit = 0 }, 7500);
    }
    MoveOpp() {
        const arr = [];
        sockets.forEach(e => {
            const distance = e.myPlayer ? handler.measureDistance(e.myPlayer.position.x - handler.worldPos.x, e.myPlayer.position.y - handler.worldPos.y) : 0;
            if (e.tick - e.deadTick >= 1200) {
                arr.push([distance, e]);
            }
        });
        const sorted = arr.sort((a, b) => b[0] - a[0]);
        if (!sorted[0]) return;
        const nearestSocket = sorted[0][1];
        nearestSocket.deadTick = nearestSocket.tick - 1170;
        nearestSocket.reverseMouseMove2 = true;
        setTimeout(() => {
            nearestSocket.reverseMouseMove2 = false;
        }, 500);
    }
    measureDistance(x, y) {
        return Math.abs(x * y);
    }
    async testPing() {
        !this.pingtest && game.network.addRpcHandler("Failure", e => this.pingtest(e));
        this.sendPacket(9, { name: "MakeBuilding", x: 0, y: 0, type: "ping", yaw: 0 });
        const ping = Date.now();
        return await new Promise(resolve => this.pingtest = r => r.type == "ping" && resolve(Date.now() - ping));
    }
    isOffset(x) {
        return x % 48 === 24 ? ~~(0 <= (x % 200) && (x % 200) <= 16) : ~~(0 <= (x % 200) && (x % 200) <= 40);
    };
    isInRange(p1, p2) {
        const dx = ~~(p2.x / 200) - ~~(p1.x / 200);
        const dy = ~~(p2.y / 200) - ~~(p1.y / 200 + 1 / 2) + 0.5;
        return dx <= 5 + ~~this.isOffset(p2.x) && dy <= 3.5 + ~~this.isOffset(p2.y) && dx >= -5 && dy >= -3.5;
    };
    removeEntity(uid) {
        if (this.entitiesData.has(uid) || !game.world.entities.get(uid)) return;
        const model = game.world.entities.get(uid).targetTick.model;
        if (uid <= 825) {
            if (game.world.entities.get(uid).node.alpha != 0.5) game.world.entities.get(uid).setAlpha(0.5);
            return;
        };
        if (game.ui.buildingSchema[model]) {
            if (this.isInRange(game.world.entities.get(this.uid).fromTick.position, game.world.entities.get(uid).fromTick.position, model)) {
                if (this.lastPlayerTickDead == game.world.entities.get(this.uid).fromTick.dead) {
                    game.world.removeEntity2(uid);
                }
            } else if (game.world.entities.get(uid).node.alpha != 0.5) game.world.entities.get(uid).setAlpha(0.5);
            return;
        };
        if (socketsUid.has(uid)) {
            game.world.updateEntity(uid, sockets.get(socketsUid.get(uid)).playerData);
            if (game.world.entities.get(uid).node.alpha != 0.5) game.world.entities.get(uid).setAlpha(0.5);
            return;
        }
        game.world.removeEntity2(uid);
    }
    createEntity(entity) {
        if (!game.world.entities.has(entity.uid)) {
            game.world.createEntity2(entity);
        }
    }
}

const handler = new Handler();

class AutoBuild {
    constructor() {
        this.buildingSchemaObj = { "Wall": 0, "Door": 1, "SlowTrap": 2, "ArrowTower": 3, "CannonTower": 4, "MeleeTower": 5, "BombTower": 6, "MagicTower": 7, "GoldMine": 8, "Harvester": 9, "GoldStash": 10 };
        this.buildingSchemaArr = ['Wall', 'Door', 'SlowTrap', 'ArrowTower', 'CannonTower', 'MeleeTower', 'BombTower', 'MagicTower', 'GoldMine', 'Harvester', 'GoldStash'];
        this.confirmedBase = null;
    }
    getBaseCode() {
        const buildingsArr = Object.values(game.ui.buildings);
        const stash = buildingsArr.shift();
        const arr = [stash.x / 48 + stash.y / 48 * 500];
        buildingsArr.forEach(e => arr.push(this.encodeBuilding((e.x - stash.x) / 48, (e.y - stash.y) / 48, e.tier, (typeof handler == "undefined" ? (game.world.entities[e.uid]?.targetTick?.yaw || 0) : (handler.yawBuildings.get(e.uid)?.targetTick?.yaw || 0)) / 90, this.buildingSchemaObj[e.type])));
        return JSON.stringify(arr);
    }
    BuildBase(baseCode) {
        const arr = JSON.parse(baseCode);
        let stash = Object.values(game.ui.buildings)[0];
        if (!stash) {
            stash = { x: (arr[0] % 500 | 0) * 48, y: (arr[0] / 500 | 0) * 48 };
            game.network.sendRpc({ name: "MakeBuilding", x: stash.x, y: stash.y, type: "GoldStash", yaw: 0 });
        }
        for (let i = 1; i < arr.length; i++) {
            const index = arr[i];
            const e = this.decodeBuilding(index);
            game.network.sendRpc({ name: "MakeBuilding", x: stash.x + e[0] * 48, y: stash.y + e[1] * 48, type: this.buildingSchemaArr[e[4]], yaw: e[3] * 90 });
        }
    }
    encodeBuilding(x, y, tier, yaw, key) {
        if (key <= 2) return yaw * 10 ** 6 + (y + 18.5) * 10 ** 4 + (x + 18.5) * 10 ** 2 + tier * 10 + key;
        if (key == 9) return yaw * 10 ** 8 + (y + 492) * 10 ** 5 + (x + 492) * 10 ** 2 + tier * 10 + key;
        return yaw * 10 ** 6 + (y + 18) * 10 ** 4 + (x + 18) * 10 ** 2 + tier * 10 + key;
    }
    decodeBuilding(num) {
        if (num % 10 <= 2) return [(num / 10 ** 2 | 0) % 100 - 18.5, (num / 10 ** 4 | 0) % 100 - 18.5, (num / 10 | 0) % 10, num / 10 ** 6 | 0, num % 10];
        if (num % 10 == 9) return [(num / 10 ** 2 | 0) % 1000 - 492, (num / 10 ** 5 | 0) % 1000 - 492, (num / 10 | 0) % 10, num / 10 ** 8 | 0, num % 10];
        return [(num / 10 ** 2 | 0) % 100 - 18, (num / 10 ** 4 | 0) % 100 - 18, (num / 10 | 0) % 10, num / 10 ** 6 | 0, num % 10];
    }
}

const autobuild = new AutoBuild();

localStorage[`x${"sirr0mbase"}`] = '[0,182081,172081,162081,162181,172181,182181,201981,202081,202181,212181,212081,211981,191781,201781,211781,211681,201681,191681,171881,161881,161781,161681,171681,171781,181782,171982,201882,192082,171581,141781,151781,142081,152081,172281,172381,202281,222081,232081,221781,231781,201581,201481,161383,202386,222486,202583,172483,172684,172887,241986,252186,262386,272583,292583,282386,302387,292187,301987,272183,261983,281984,271684,291687,251683,241486,231286,251286,261486,211386,231480,191284,191084,211184,231084,251083,250883,271283,281488,291288,291087,270984,270784,250687,230887,210987,190887,271180,281180,161184,160987,140887,120783,100787,80987,61187,61384,71587,81787,101784,91584,81384,81184,101183,100983,120983,101386,121386,121186,141286,141084,141480,151480,131580,131680,111583,121783,112083,132081,132181,92084,72087,82287,72487,52687,62884,72684,92484,102284,82883,92683,102883,113083,93086,133086,132888,132688,112688,132488,152388,152586,152783,152984,122980,122880,112486,122286,142380,52880,73080,83080,202784,222684,202987,222887,242987,242788,262883,311280,311180,301580,301480,312580,322480,292780,263080,173080,62580,71780,71080,90880,110580,120580,160880,270680,290880,290980,300980,50549189,49148189,48049289,49250489,62181,72381,62481,52581,42681,42781,42881,52981,63081,73181,63181,53081,42981,83181,83281,133281,143281,153281,163181,173181,183281,193282,203281,213181,243181,253181,263181,273081,282981,282881,282781,272781,262781,262681,252681,242680,252581,242581,242481,262580,252480,242381,241781,241680,233081,253280,292881,302781,312681,322581,332481,322381,312281,312181,322081,331981,331882,331781,321681,311581,311481,321381,331281,331181,321081,310981,300881,290781,280681,270581,260581,250581,240780,240681,230781,220881,200781,190681,203180,190780,180682,170681,160781,150781,130681,120681,110681,100681,90781,70981,80881,61081,51280,51380,51181,41281,41381,61681,61781,51881,51982,52081,62080,61580,51581,41481,51480,32780,32880,93380,103380,113380,123380,133380,143380,73280,260480,321980,311680,140780,140681,130580,192682,192582,192482,111982,121982,131982,241882,251882,261882,271882,72281,181382,181282,153180,223081,210881,311380,311080,31380,49649219,49249619,48849219,49248819,242281,242181,222381,232381,252381,93281,103281,113281,123281,321280,321180]'
localStorage[`x${"luckybase"}`] = '[0,202088,242488,242288,202787,272087,262284,272484,242784,282288,262688,243080,253080,292480,302480,302580,292580,262981,262881,272881,292681,282681,282781,252680,242680,262580,262480,202280,212280,222180,222080,222488,222684,201883,202383,222288,202584,252084,221883,182283,241887,49049089,49249089,49449089,222888,242980,252980,232083,49049289,182083,182687,182487,261887,49049489]'
localStorage[`x${"twoentbase"}`] = '[0,141084,261483,230884,281487,102284,112484,82287,301081,290981,280981,301481,301181,301281,301381,291281,152486,302581,302681,292681,292781,282781,282881,103081,311381,291680,181481,191481,192381,182381,263081,272880,140684,160687,210580,200580,190580,180580,170580,220581,150581,130681,292881,291781,120780,130780,100980,91180,91081,280881,270881,270781,250887,281180,291181,291081,281081,292480,282981,190883,110887,110781,100881,273081,123080,243181,253181,263181,172883,282287,82480,152883,232883,243080,253080,240780,101087,240681,120681,240581,200687,292581,272981,291380,271287,252887,270980,282680,142683,133080,192280,170883,150884,130884,180684,220684,81487,91287,132884,101484,210883,211286,182686,162686,131284,111284,121084,122284,92487,92680,92781,202686,122684,102687,250780,260781,171286,250681,151286,132483,161086,181086,201086,191286,172486,241483,251283,102981,112887,102880,261087,192486,212486,262283,252483,272487,161486,242688,232488,241088,221088,222688,201486,221488,162286,231288,202286,201980,161882,171882,201880,262687,82180,223084,301581,161980,72181,82581,71781,113081,81781,81680,82081,71581,72081,81380,133181,72381,81281,82681,143084,72281,163087,183084,92881,81181,100781,72581,72481,81081,92981,90981,71681,82781,71381,71481,90881,71281,82881,80981,260681,292180,123181,113181,133281,123281,143281,153281,163280,173381,173280,183381,183280,193381,193280,223281,233281,243281,253281,302381,302481,312381,312481,302281,302181,301781,301681,311481,250581,230581,190481,200481,180481,160580,170481,140581,130581,71981,211982,192883,212883,203087,203280,213280,203381,292081,302081,211880,50249289,50049289,49849289,49649289,191580,72681,62381,62280,93080,171686,181580,103180,153381,223381,233381,62481,72781,243380,152086,132083,112084,92087,151686,131683,111684,91687,191686,211683,231683,251684,271687,192086,212083,232083,252084,272087,222288,61681,62181,61481,71882,61580,141483,71181,71081,80880,90780,110681,100680,242283,120581,140481,150481,220481,240480,311280,311681,301881,301982,270680,280780,290880,312580,312280,312181,311580,302781,292980,283080,273180,163380,213380,210480,160480,121484,48249289,48449289,48649289,48849289,171980,172086,182280,142283,82980,230481,130480,133380,143381,61381,62580,61280]'
localStorage[`x${"sirrxbase"}`] = '[0,182288,162288,192486,192688,192888,202286,212483,212686,221988,221783,241786,261786,281988,181486,161486,201486,171286,191286,191086,141786,101986,81986,82184,92384,211283,211083,72387,230984,81784,171083,101783,121683,151084,151284,261583,281584,301783,281783,301983,282188,241986,261986,2302185,242183,262183,252383,292387,282587,262587,272384,212883,232783,232987,183183,172486,172686,172886,152886,152683,132784,132987,153087,82587,71387,81187,81584,91384,101584,121484,130984,131184,111084,271384,281187,291387,301587,251384,261184,241583,112381,132482,142482,101282,111481,131382,141382,251082,261082,241382,252782,262782,242482,291080,81080,71081,82780,163280,213280,203281,203181,173181,173281,193081,183081,173081,203081,272980,223281,253281,153281,292780,232682,171881,161881,191781,191681,201981,211981,201882,211882,181782,181682,171982,161982,232482,101182,221682,231682,222182,232182,142182,152182,141682,151682,252887,102582,102682,292881,233180,243181,243281,233281,1213085,143180,133181,133281,143281,141986,121886,122086,102186,132584,152483,231281,241481,231382,232581,242381,231182,122283,80981,102980,103081,123281,273081,71280,71181,301280,301181,253080,302781,253181,263081,263181,72580,123080,113081,123181,113181,72681,72781,302580,302681,112684,112887,50148389,48350189,210883,61983,250887,230787,190683,170684,190888,170884,150884,62187,61787,61587,110887,130787,150687,210687,270880,200580,190580,180580,170580,100880,51780,51880,51980,52080,182081,182181,192082,192182,62380,62481,52381,52281,51481,51381,61381,51581,130581,130681,150581,140581,240581,240681,220581,230581,230680,140680,61480,51680,52180,210580,160580,100781,52581,52481,120780,110781,110681,120681,61281,61181,51281,250780,260681,250681,260781,62581,62681,41781,41881,41981,42081,42281,42181,41681,41581,41481,42381,170481,180481,190481,200481,150481,160481,220481,210481,140481,31980,31880,31780,31680,32180,32080,311480,312380,312481,311381,312581,311181,311281,312681,312781,322180,322080,321980,321880,321780,321680,321281,321581,322581,322281,322381,322481,321381,321481,331481,331581,331681,331781,331881,331981,332081,332181,332281,332381,341680,341780,341880,341980,342080,342180,203381,173381,163381,183381,193381,233381,223381,213381,143381,153381,193480,203480,213480,163480,173480,183480,48348389,210380,200380,190380,180380,170380,160380,50150189]';
localStorage[`x${"goldbase"}`] = '[0,49249419,49449419,49449219,162017,161817,161617,181617,201617,152212,162212,172212,182212,192212,202212,212212,222212,222112,222012,221912,221812,221712,221612,221512,211512,201512,191512,181512,171512,161512,151712,151812,151912,152012,152112,151612,151512,141512,131512,151412,151312,132212,142212,152312,152412,222312,222412,232212,242212,231512,241512,221412,221312,241614,241814,242014,262014,261814,261614,162414,182414,202414,202614,182614,162614,122014,121814,121614,101614,101814,102014,161214,181214,201214,161014,181014,201014,160816,180816,200816,81616,81816,82016,162816,182816,202816,282016,281816,281616,232313,252313,252513,232513,252713,272513,232716,272716,272316,231313,251313,251113,231113,271113,250913,271316,270916,230916,131313,111313,131113,111113,91113,110913,91316,90916,130916,132313,112313,132513,112513,112713,92513,92716,132716,92316,61918,61718,173018,193018,301918,301718,170618,190618]';
localStorage[`x${"raidbase"}`] = '[0,172228,192228,152228,212228,171428,191428,151428,211428,222016,221816,221616,142016,141816,141616,232213,222413,142413,132213,131413,141213,181216,182416,231413,221213,121613,122013,242013,241613,161216,201216,162416,202416]'
localStorage[`x${"wallstrap"}`] = '[0,363610,363510,363410,363310,363210,363110,363010,362910,362810,362710,362610,362510,362410,362310,362210,362110,362010,361910,361810,361710,361610,361510,361410,361310,361210,361110,361010,360910,360810,360710,360610,360510,360410,360310,360210,360110,350110,340110,330110,320110,310110,300110,290110,280110,270110,260110,250110,240110,230110,220110,210110,200110,190110,180110,170110,160110,150110,140110,130110,120110,110110,100110,90110,80110,70110,60110,50110,40110,30110,20110,10110,10210,10310,10410,10510,10610,10710,10810,10910,11010,11110,11210,11310,11410,11510,11610,11710,11810,11910,12010,12110,12210,12310,12410,12510,12610,12710,12810,12910,13010,13110,13210,13310,13410,13510,13610,23610,33610,43610,53610,63610,73610,83610,93610,103610,113610,123610,133610,143610,153610,163610,173610,183610,193610,203610,213610,223610,233610,243610,253610,263610,273610,283610,293610,303610,313610,323610,333610,343610,353610]';
localStorage[`x${"smallraidbase"}`] = '[0,182016,201816,162018,142018,141818,141618,161618,161818,181618,201618]';

const resetSavedBases = () => {
    $("savedbases").innerHTML = "";
    const container = document.createElement('div');
    Object.keys(localStorage).filter(e => e[0] == "x" && e != "xluckybase" && e != "xsirr0mbase" && e != "xraidbase" && e != "xsmallraidbase" && e != "xsirrxbase" && e != "xtwoentbase" && e != "xgoldbase" && e != "xwallstrap").forEach(e => {
        container.appendChild(createElement(`<button class="btn btn-blue ${e}" onclick="onClickBtn.confirmBase('${e}', true)" style="width:45%">${e.substr(1)}</button>`));
        container.appendChild(createElement(`<button class="btn btn-white ${e}" onclick="onClickBtn.deleteBase('${e}')" style="width:25%">${"delete"}</button>`));
        container.appendChild(createElement(`<br>`));
    });
    $("savedbases").appendChild(container);
}

resetSavedBases();

let altId = 0;
const sockets = new Map();
const socketsUid = new Map();

const evolvePetArr = [[100, 9], [100, 17], [100, 25], [100, 33], [200, 49], [200, 65], [300, 97]];
const spearCosts = [1400, 2800, 5600, 11200, 22500, 45000, 90000];
const spearSumCosts = [1400, 4200, 9800, 21000, 43500, 88500, 178500];

class Bot {
    constructor(name, sid, psk, ip) {
        if (ip) {
            let count = 0;
            sockets.forEach(e => ip == e.ip && (count++));
            if (count >= 7) return;
        }
        this.name = name || ($("altName").value || handler.myPlayer.name);
        this.altId = null;
        this.serverId = sid || game.options.serverId;
        this.server = game.options.servers[this.serverId];
        this.ws = new WebSocket(`wss://${this.server.host}:443/`);
        this.ws.binaryType = "arraybuffer";
        this.ws.onmessage = this.onMessage.bind(this);
        this.codec = new BinCodec();

        this.partyShareKey = (psk === null || ip) ? "" : (psk || handler.partyShareKey || "");
        this.inventory = {};
        this.partyInfo = [];
        this.buildingUids_1 = {};
        this.harvesters = new Map();
        this.buildingsUid = new Map();
        this.aimingYaw = null;

        this.myPlayer = null;
        this.myPet = null;
        this.gs = null;
        this.entities = new Map();

        this.harvesterTicks = [
            { tick: 0, resetTick: 31, deposit: 0.4, tier: 1 },
            { tick: 0, resetTick: 29, deposit: 0.6, tier: 2 },
            { tick: 0, resetTick: 27, deposit: 0.7, tier: 3 },
            { tick: 0, resetTick: 24, deposit: 1, tier: 4 },
            { tick: 0, resetTick: 22, deposit: 1.2, tier: 5 },
            { tick: 0, resetTick: 20, deposit: 1.4, tier: 6 },
            { tick: 0, resetTick: 18, deposit: 2.4, tier: 7 },
            { tick: 0, resetTick: 16, deposit: 3, tier: 8 }
        ];

        this.entityDiv = document.createElement("div");
        this.entityDiv.classList.add("hud-map-player");
        this.entityDiv.setAttribute('data-index', "5");
        this.entityDiv.style.display = "none";
        handler.minimap.appendChild(this.entityDiv);
        this.ip = ip;
        if (!ip) fetch("https://api.ipify.org").then(e => e.text()).then(e => (this.ip = e));
        this.opcode10Blends = [];
        this.timeoutTick = 0;
        this.timeoutServerTick = 0;
        this.timeoutPing = 999;
        this.paused = 0;
        this.autotimeout = false;
        this.inactiveRebuildersocket = new Map();
        this.buildings = new Map();
        this.inactiveReupgraderAllsocket = new Map();
        this.reverseMouseMove2 = false;
    }
    sendPacket(event, data) {
        this.ws.readyState == 1 && this.ws.send(this.codec.encode(event, data));
    }
    async onMessage(msg) {
        const opcode = new Uint8Array(msg.data)[0];
        if (opcode == 5) {
            this.lowestTime = Infinity;
            this.seed = {};
            this.tries = 9;
            const time = Date.now();
            const rand = Math.floor(Math.random() * 99999999);
            privateUser.decodeopcode5[rand] = e => {
                this.sendPacket(4, { displayName: this.name, extra: new Uint8Array(e[5]) });
                this.enterworld2 = new Uint8Array(e[6]);
                this.lowestTime = Math.min(this.lowestTime, Date.now() - time);
                delete privateUser.decodeopcode5[rand];
            }
            this.blended = JSON.stringify(Array.from(new Uint8Array(msg.data)));
            privateUser.sendMessage(`decodeOpcode5,  ;${this.blended},  ;${this.server.hostname},  ;${this.seed},  ;[],  ;${rand}`);
            return;
        }
        if (opcode == 10) {
            const time = Date.now();
            const num = this.tries === 9 ? 0.0001 : Math.round(Math.random() * 99) + 1;
            const rand = Math.floor(Math.random() * 99999999);
            this.opcode10Blends.push(Array.from(new Uint8Array(msg.data)));
            privateUser.decodeopcode5[rand] = e => {
                if (this.tries != 0) {
                    this.lowestTime > Date.now() - time && (this.lowestTime = Date.now() - time, this.seed = num);
                    this.tries--;
                }
                this.ws.send(new Uint8Array(e));
                delete privateUser.decodeopcode5[rand];
            }
            privateUser.sendMessage(`decodeOpcode5,  ;${this.blended},  ;${this.server.hostname},  ;${this.tries == 0 ? this.seed : num},  ;${JSON.stringify(this.opcode10Blends)},  ;${rand}`);
            return;
        }
        const data = this.codec.decode(msg.data);
        switch (opcode) {
            case 4:
                this.onEnterWorldHandler(data);
                break;
            case 0:
                this.onEntityUpdateHandler(data);
                break;
            case 9:
                this.onRpcHandler(data);
                break;
        }
    }
    onEnterWorldHandler(data) {
        if (!data.allowed) return;
        this.uid = data.uid;
        this.enterworld2 && this.ws.send(this.enterworld2);
        this.partyShareKey && this.join(this.partyShareKey);
        for (let i = 0; i < 26; i++) this.ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
        this.ws.send(new Uint8Array([7, 0]));
        this.ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
        this.sendPacket(9, { name: "BuyItem", itemName: "PetCARL", tier: 1 });
        this.sendPacket(9, { name: "BuyItem", itemName: "PetMiner", tier: 1 });
        this.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 });
        console.log("bot in game");
        this.altId = ++altId;
        sockets.set(this.altId, this);
        socketsUid.set(this.uid, this.altId);

        const container = document.createElement('div');

        this.playerid = createElement(`<h3>${this.altId}</h3>`);
        this.playerinfo = createElement(`<p>W: 0, S: 0, G: 0, T: 0</p>`);
        this.playerinfo2 = createElement(`<p>PID: 0, TO: 0, Wave: 0</p>`);

        container.appendChild(this.playerid);
        container.appendChild(createElement(`<hr>`));
        container.appendChild(this.playerinfo);
        container.appendChild(this.playerinfo2);

        container.appendChild(createElement(`<button class="btn btn-white ${this.uid}" style="width:30%">Enable AB</button>`));
        container.appendChild(createElement(`<button class="btn btn-white ${this.uid}" style="width:30%">Enable AU</button>`));
        container.appendChild(createElement(`<button class="btn btn-white ${this.uid}" style="width:30%">Enable AHRC</button>`));
        container.appendChild(createElement(`<br>`));
        container.appendChild(createElement(`<button class="btn btn-white ${this.uid}" onclick="sockets.get(socketsUid.get(${this.uid})).join(handler.partyShareKey);" style="width:30%">Alt Join</button>`));
        container.appendChild(createElement(`<button class="btn btn-white ${this.uid}" onclick="handler.join(sockets.get(socketsUid.get(${this.uid})).partyShareKey);" style="width:30%">Join Alt</button>`));
        container.appendChild(createElement(`<button class="btn btn-white ${this.uid}" onclick="sockets.get(socketsUid.get(${this.uid})).leave();" style="width:30%">Alt Leave</button>`));
        container.appendChild(createElement(`<br>`));
        container.appendChild(createElement(`<input type="text" class="btn btn-white ${this.uid}i" placeholder="Alt id" style="width:45%">`));
        container.appendChild(createElement(`<button class="btn btn-white ${this.uid}" onclick="sockets.get(socketsUid.get(${this.uid})).join(sockets.get(parseInt($('${this.uid}i').value))?.partyShareKey);" style="width:45%">Alt Join [id]</button>`));
        container.appendChild(createElement(`<hr>`));

        this.container = container;
        $("socketsinfo").appendChild(this.container);

        updateTick();
    }
    onEntityUpdateHandler(data) {
        this.tick = data.tick;
        if (!this.deadTick) this.deadTick = data.tick;
        this.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
        this.playerData = data.entities.get(this.uid);
        data.entities.forEach((data) => {
            if (data.model == "GamePlayer" || data.model == "GoldStash") {
                !handler.savedPartyIds.has(data.partyId) && handler.savedPartyIds.set(data.partyId, { gs: null, players: new Map() });
                const tick = handler.savedPartyIds.get(data.partyId);
                if (data.model == "GamePlayer") tick.players.set(data.uid, data);
                if (data.model == "GoldStash") {
                    tick.gs = data;
                    if (handler.baseFindingList.has(data.partyId)) {
                        game.ui.components.PopupOverlay.showHint(handler.baseFindingList.get(data.partyId) + "'s gold stash found, position: {x: " + data.position.x + ", y: " + data.position.y + "}");
                        game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: handler.baseFindingList.get(data.partyId) + "'s gold stash found, position: {x: " + data.position.x + ", y: " + data.position.y + "}" });
                        handler.baseFindingList.delete(data.partyId);
                    }
                }
            }
            if ((data.model == "GamePlayer" && this.uid === data.uid) || ((data.model == "PetCARL" || data.model == "PetMiner") && this.playerData.petUid === data.uid)) {
                this.entities.set(data.uid, { targetTick: data, uid: data.uid, model: data.model });
                this.uid === data.uid && game.world.createEntity(data);
                return;
            }
            if (data === true || !this.entities.has(data.uid)) return;
            const tick = this.entities.get(data.uid).targetTick;
            Object.keys(data).forEach(r => { tick[r] = data[r] });
        });
        this.entities.forEach(e => {
            if (!data.entities.has(e.uid)) {
                this.entities.delete(e.uid);
                return;
            }
            if (e.model == "GamePlayer" && handler.playerFindingList.has(e.uid)) {
                game.ui.components.PopupOverlay.showHint(e.targetTick.name + " found, position: {x: " + e.targetTick.position.x + ", y: " + e.targetTick.position.y + "}");
                game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: e.targetTick.name + " found, position: {x: " + e.targetTick.position.x + ", y: " + e.targetTick.position.y + "}" });
                handler.playerFindingList.delete(e.uid);
                const gs = handler.savedPartyIds.get(e.targetTick.partyId)?.gs;
                if (gs) {
                    game.ui.components.PopupOverlay.showHint(e.targetTick.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}");
                    game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: e.targetTick.name + "'s gold stash found, position: {x: " + gs.position.x + ", y: " + gs.position.y + "}" });
                    handler.baseFindingList.delete(e.targetTick.partyId);
                } else {
                    handler.baseFindingList.set(e.targetTick.partyId, e.targetTick.name);
                }
            }
        });
        this.myPlayer = this.entities.get(this.uid).targetTick;
        this.myPet = this.entities.get(this.myPlayer.petUid)?.targetTick || null;

        this.entityDiv.style.left = `${Math.round(this.myPlayer.position.x / 24000 * 100)}%`;
        this.entityDiv.style.top = `${Math.round(this.myPlayer.position.y / 24000 * 100)}%`;

        if (this.myPlayer.partyId === handler.myPlayer.partyId && this.entityDiv.style.display != "none") this.entityDiv.style.display = "none";
        if (this.myPlayer.partyId !== handler.myPlayer.partyId && this.entityDiv.style.display != "block") this.entityDiv.style.display = "block";

        //const info1 = `W: ${numberAbbreviate(this.myPlayer.wood)}, S: ${numberAbbreviate(this.myPlayer.stone)}, G: ${numberAbbreviate(this.myPlayer.gold)}, T: ${numberAbbreviate(this.myPlayer.token)}`;
        //const info2 = `PID: ${this.myPlayer.partyId}, TO: ${this.myPlayer.isPaused}, Wave: ${this.myPlayer.wave}`;

        //if (this.playerinfo.innerText != info1) this.playerinfo.innerText = info1;
        //if (this.playerinfo2.innerText != info2) this.playerinfo2.innerText = info2;

        if (!this.petActivated && this.myPet) this.petActivated = true;

        if (script.autohealsocket && this.myPlayer.health / 5 < settings[0][0]) {
            this.heal();
        }
        if (script.autopethealsocket && this.myPet && this.myPet.health / this.myPet.maxHealth * 100 < settings[1][0]) {
            this.petHeal();
        }
        if (script.autorevivepetsocket && this.petActivated) {
            this.buy("PetRevive", 1);
            this.equip("PetRevive", 1);
        }
        if (script.autoevolvesocket && this.myPet) {
            const list = evolvePetArr[this.myPet.tier - 1];
            if (list && this.myPlayer.token >= list[0] && Math.floor(this.myPet.experience / 100) + 1 >= list[1]) {
                this.evolvePet();
            }
        }
        if (script.autorespawnsocket) {
            this.sendPacket(3, { respawn: 1 });
        }
        if (script.mouseaim) {
            const target = script.freezemouse ? handler.lockPos : handler.worldPos;
            this.aimingYaw = (Math.round((180 / Math.PI * Math.atan2(target.y - this.myPlayer.position.y, target.x - this.myPlayer.position.x) + 450)) % 360);
            this.sendPacket(3, { mouseMoved: this.aimingYaw });
        }
        if (script.mousemove) {
            if (this.reverseMouseMove2) {
                const a1 = Math.ceil(((Math.atan2(handler.altsLockPos.y - this.myPlayer.position.y, handler.altsLockPos.x - this.myPlayer.position.x) * 180 / Math.PI + 450) % 360) / 45) * 45;
                const a2 = Math.floor(((Math.atan2(handler.altsLockPos.y - this.myPlayer.position.y, handler.altsLockPos.x - this.myPlayer.position.x) * 180 / Math.PI + 450) % 360) / 45) * 45;
                const x = (a1 % 90 == 0 ? a2 : a1) % 360;
                this.sendPacket(3, { up: (x == 0 || x == 45 || x == 315) ? 1 : 0, down: (x == 135 || x == 180 || x == 225) ? 1 : 0, right: (x == 45 || x == 90 || x == 135) ? 1 : 0, left: (x == 225 || x == 270 || x == 315) ? 1 : 0 });
            } else {
                const target = script.freezemouse ? handler.lockPos : handler.worldPos;
                const reverse = ((handler.reverseMouseMove || this.reverseMouseMove) | 0) * 180;
                const x = (((Math.round(((Math.atan2(target.y - this.myPlayer.position.y, target.x - this.myPlayer.position.x) * 180 / Math.PI + 450) % 360) / 45) * 45) % 360) + reverse) % 360;
                this.sendPacket(3, { up: (x == 0 || x == 45 || x == 315) ? 1 : 0, down: (x == 135 || x == 180 || x == 225) ? 1 : 0, right: (x == 45 || x == 90 || x == 135) ? 1 : 0, left: (x == 225 || x == 270 || x == 315) ? 1 : 0 });
            }
        }
        if (script.autobuyspear && this.myPlayer.gold > spearCosts[(this.inventory.Spear?.tier || 0)] && handler.spearmaxtier > (this.inventory.Spear?.tier || 0)) {
            this.buy("Spear", (this.inventory.Spear?.tier || 0) + 1);
        }
        if (script.autoequipspear && this.inventory.Spear && this.myPlayer.weaponName != "Spear") {
            this.equip("Spear", this.inventory.Spear.tier);
        }
        if (script.autofarmspear) {
            if (!this.gs && this.myPlayer.gold < spearSumCosts[handler.farmspearmaxtier - 1] && this.myPlayer.partyId !== handler.myPlayer.partyId) {
                this.join(handler.partyShareKey);
            }
            if (this.myPlayer.partyId == handler.myPlayer.partyId && this.myPlayer.gold > spearSumCosts[handler.farmspearmaxtier - 1]) {
                this.leave();
            }
        }
        script.ahrcsocket && (parseInt(handler.ahrcid) == this.altId || handler.ahrcid == "all") && this.harvesterTicks.forEach(e => {
            e.tick++;
            if (e.tick >= e.resetTick) {
                e.tick = 0;
                this.depositAhrc(e);
            }
            if (e.tick == 1) {
                this.collectAhrc(e);
            }
        });
        if (script.chatspam) {
            if (!this.chatspamtick) this.ws.readyState == 1 && this.ws.send(handler.chatspam);
            this.chatspamtick = ((this.chatspamtick + 1) || 1) % 24;
        }
        if (this.myPlayer.wave == 8) {
            if (script.notifybeforebosswave && this.tick % 2400 === 2000) {
                game.ui.getComponent("PopupOverlay").showConfirmation(`Socket [${this.altId}] has a wave 8 base. Would you like to join?`, 1e4, () => {
                    handler.join(this.partyShareKey);
                });
            }
        }
        if (this.autotimeout) {
            if (this.tick > this.timeoutTick) this.timeoutTick = this.tick + 4800;
            if (this.myPlayer.isPaused === 1 && this.paused === 0 && this.hasTimeouted) {
                this.hasTimeouted = false;
                this.timeoutServerTick = this.tick + 4800;
                this.timeoutPing = Math.min(this.timeoutPing, this.timeoutServerTick - this.timeoutTick);
                if (this.timeoutTick < this.timeoutServerTick - this.timeoutPing) this.timeoutTick = this.timeoutServerTick - this.timeoutPing;
            }
            if (this.timeoutTick > this.timeoutServerTick) (this.timeout(), this.hasTimeouted = true);
        }
        this.paused = this.myPlayer.isPaused;
        this.gs && script.autobuildsocket && this.inactiveRebuildersocket.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.abs(this.myPlayer.position.x - x) < 576 && Math.abs(this.myPlayer.position.y - y) < 576) {
                this.sendPacket(9, { name: "MakeBuilding", x: x, y: y, type: e[2], yaw: e[3] });
            }
        });
        this.gs && script.autoupgradeallsocket && this.inactiveReupgraderAllsocket.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.hypot((this.myPlayer.position.x - x), (this.myPlayer.position.y - y)) <= 768) {
                if (e[5] - this.tick <= 0) {
                    e[5] = this.tick + 7;
                    this.sendPacket(9, { name: "UpgradeBuilding", uid: e[4] });
                }
            }
        });
        if (script.xkeysocket) {
            if (!this.inventory.Bomb && this.myPlayer.gold >= 100) this.buy("Bomb", 1);
            if (this.inventory.Bomb && this.myPlayer.weaponName !== "Bomb") this.equip("Bomb", this.inventory.Bomb.tier);
        }
    }
    onRpcHandler(data) {
        switch (data.name) {
            case "LocalBuilding":
                const gs = data.response.find(e => e.type == "GoldStash");
                gs && (gs.dead ? (this.gs = null, this.buildings.clear(), this.inactiveReupgraderAllsocket.clear(), this.inactiveRebuildersocket.clear()) : this.gs = gs);
                const auaTier = parseInt($("ausinput").value);
                data.response.forEach(e => {
                    if (this.buildingUids_1[e.uid]) return;
                    if (e.dead && !this.buildingUids_1[e.uid]) {
                        this.buildingUids_1[e.uid] = true;
                        setTimeout(() => { delete this.buildingUids_1[e.uid]; }, 500);
                    }
                    e.type == "Harvester" && this.harvesters.set(e.uid, e);
                    e.type == "Harvester" && e.dead && this.harvesters.delete(e.uid);
                    this.buildingsUid.set(e.uid, e);
                    e.dead && this.buildingsUid.delete(e.uid);
                    if (this.gs) {
                        const index = (e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000;
                        this.buildings.set(index, e);
                        e.dead && this.buildings.delete(index);
                        if (script.autobuildsocket && handler.rebuildersocket.get(index)) {
                            const rebuilder = handler.rebuildersocket.get(index);
                            e.dead ? this.inactiveRebuildersocket.set(index, rebuilder) : this.inactiveRebuildersocket.delete(index);
                        }
                        if (script.autoupgradeallsocket) {
                            if (e.dead) {
                                this.inactiveReupgraderAllsocket.delete(index);
                            } else if (e.tier < auaTier) {
                                !this.inactiveReupgraderAllsocket.get(index) && this.inactiveReupgraderAllsocket.set(index, [(e.x - this.gs.x) / 24, (e.y - this.gs.y) / 24, auaTier, e.tier, e.uid, this.tick]);
                            } else {
                                this.inactiveReupgraderAllsocket.delete(index);
                            }
                        }
                    }
                });
                if (gs && !gs.dead && script.autobuildsocket) {
                    handler.rebuildersocket.forEach(e => {
                        if (!this.buildings.get(e[0] + e[1] * 1000)) {
                            this.inactiveRebuildersocket.set(e[0] + e[1] * 1000, e);
                        }
                    });
                }
                break;
            case "PartyShareKey":
                this.partyShareKey = data.response.partyShareKey;
                break;
            case "SetItem":
                this.inventory[data.response.itemName] = data.response;
                if (this.inventory.HatHorns && !this.inventory.HatHorns.stacks) this.buy("HatHorns", 1);
                if (!this.inventory[data.response.itemName].stacks) delete this.inventory[data.response.itemName];
                if (data.response.itemName == "ZombieShield" && data.response.stacks) this.equip("ZombieShield", data.response.tier);
                break;
            case "PartyInfo":
                this.partyInfo = data.response;
                break;
            case "Dead":
                this.deadTick = this.tick;
                if (!script.mousemove) return;
                this.reverseMouseMove = true;
                setTimeout(() => { this.reverseMouseMove = null; }, 500);
                break;
            case "Leaderboard":
                this.partyInfo[0].playerUid == this.uid && this.partyInfo.forEach(e => {
                    if ((e.playerUid == handler.uid || socketsUid.has(e.playerUid)) && !e.canSell) this.sendPacket(9, { name: "SetPartyMemberCanSell", uid: e.playerUid, canSell: 1 });
                });
                break;
            case "SetPartyList":
                const x = data.response.map(r => r.memberCount).reduce((a, b) => a + b, 0);
                if (players != x) {
                    players = x;
                    game.ui.components.PopupOverlay.showHint(`There are ${x} players in the server.`);
                    document.getElementsByClassName("hud-party-server")[0].innerHTML = `${x}/32 <small>-</small><small>${game.network.connectionOptions.name}</small>`;
                }
                break;
        }
    }
    heal() {
        if (this.tick > (this.healTick || 0)) {
            this.healTick = this.tick + 15;
            this.buy("HealthPotion", 1);
            this.equip("HealthPotion", 1);
        }
    }
    petHeal() {
        if (this.tick > (this.petHealTick || 0)) {
            this.petHealTick = this.tick + 15;
            this.buy("PetHealthPotion", 1);
            this.equip("PetHealthPotion", 1);
        }
    }
    evolvePet() {
        if (this.tick > (this.evolvePetTick || 0)) {
            this.evolvePetTick = this.tick + 30;
            this.buy(this.myPet.model, this.myPet.tier + 1);
        }
    }
    depositAhrc(tick) {
        this.harvesters.forEach(e => {
            if (e.tier == tick.tier) {
                this.sendPacket(9, { name: "AddDepositToHarvester", uid: e.uid, deposit: tick.deposit });
            }
        })
    }
    collectAhrc(tick) {
        this.harvesters.forEach(e => {
            if (e.tier == tick.tier) {
                this.sendPacket(9, { name: "CollectHarvester", uid: e.uid });
            }
        })
    }
    buy(item, tier) {
        this.sendPacket(9, { name: "BuyItem", itemName: item, tier: tier });
    }
    equip(item, tier) {
        this.sendPacket(9, { name: "EquipItem", itemName: item, tier: tier });
    }
    join(psk) {
        this.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk });
    }
    leave() {
        this.sendPacket(9, { name: "LeaveParty" });
    }
    upgrade(uid) {
        this.sendPacket(9, { name: "UpgradeBuilding", uid: uid });
    }
    timeout() {
        this.sendPacket(9, { name: "BuyItem", itemName: "Pause", tier: 1 });
    }
    removeMap() {
        handler.minimap.removeChild(this.entityDiv);
        $("socketsinfo").removeChild(this.container);
    }
}

document.addEventListener("keydown", e => {
    if (e.repeat || e.ctrlKey) return;
    const activeTag = document.activeElement.tagName.toLowerCase();
    if (activeTag == 'input' || activeTag == 'textarea') return;
    (keysMap.get(e.key.toUpperCase()) || keysMap.get(e.key.toLowerCase()))?.(e.key.toUpperCase());
});

const directCmds = new Set(["ar", "ab", "au", "atb", "apr", "aph", "pt", "rpt", "aaz", "ahrc", "pl", "ape", "arc", "pf", "at", "sync", "set", "uth", "hth"]);
const conditionalCmds = new Set(["aa"]);
const nonToggleCmds = new Set(["lock", "sell"]);

const cmdHandler = msg => {
    const toggle = msg.startsWith("##") ? false : msg.startsWith("#") ? true : null;
    if (toggle === null) return;
    const args = msg.substr(1 + !toggle | 0).split(" ");
    const cmd = args[0].toLowerCase();
    if (directCmds.has(cmd)) {
        user.sendMessage((toggle ? "e" : "d") + cmd);
        return;
    }
    if (conditionalCmds.has(cmd)) {
        if (toggle) {
            switch (cmd) {
                case "aa":
                    user.sendMessage("eaa");
                    user.sendMessage("e" + cmd + "p" + ",  ;" + (args[1] || 0) + ",  ;" + (args[2] || 359));
                    break;
            }
        } else {
            if (cmd == "aa") return (user.sendMessage("daa"), user.sendMessage("d" + cmd + "p"));
            user.sendMessage("d" + cmd);
        }
        return;
    }
    if (nonToggleCmds.has(cmd)) {
        switch (cmd) {
            case "lock":
                user.sendMessage(cmd + ",  ;" + args[1] + " " + args[2]);
                break;
            case "sell":
                handler.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `#sell ${(Math.floor(Math.random() * 98) + 2) * 66991}` })
                break;
        }
        return;
    }
}

game.network.oldSendRpc = game.network.sendRpc;
game.network.sendRpc = function (m) {
    if (m.name == "SendChatMessage") {
        const args = m.message.split(" ");
        if (typeof cmdsMap.get(args[0].toLowerCase()) == "function") {
            cmdsMap.get(args[0].toLowerCase())(args[1]);
            return;
        }
        if (m.message.startsWith("#")) {
            cmdHandler(m.message);
            return;
        }
        if (m.message.startsWith("!") || m.message.startsWith("#")) return;
    }
    this.oldSendRpc(m);
}

const getId = ID => {
    return document.getElementById(ID);
}

const getElement = ELEMENT => {
    return document.getElementsByClassName(ELEMENT);
}

if (localStorage.getItem("blockedNames") == null) {
    localStorage.setItem("blockedNames", "[]");
}

getElement("hud-settings-grid")[0].innerHTML += `<center><h3>Chat filter</h3>\n<button class="btn btn-green" style="width: 99%;" id="chatFilter" filter="all">All</button>\n<input type="text" class="btn" id="nameToBlock" style="width: 99%; margin-top: 1%;" maxlength=35 placeholder="Name of person you want to block/unblock..."></input>\n<button class="btn btn-red" id="blockName" style="width: 45%; margin-top: 1%;">Block</button><button class="btn btn-green" id="unblockName" style="margin-top: 1%; margin-left: 1%; width: 45%;">Unblock</button>\n<button class="btn btn-green" id="showBlocked" style="width:99%; margin-top: 1%;">Show Blocked Names</button></center>\n<div style="margin-top: 1%;" id="blockNamesList"></div>`;
const filterButton = getId("chatFilter");
filterButton.onclick = () => {
    const f = filterButton.getAttribute("filter");
    let newF = "all";
    if (f == "all") {
        newF = "party";
    } else if (f == "party") {
        newF = "none";
    } else if (f == "none") {
        newF = "all";
    }
    filterButton.setAttribute("filter", newF);
    switch (newF) {
        case "all":
            filterButton.setAttribute("class", "btn btn-green");
            filterButton.textContent = "All";
            break;
        case "party":
            filterButton.setAttribute("class", "btn btn-gold");
            filterButton.textContent = "Party";
            break;
        case "none":
            filterButton.setAttribute("class", "btn btn-red");
            filterButton.textContent = "None";
            break;
    }
}

const blockButton = getId("blockName");
blockButton.onclick = () => {
    const blocked = JSON.parse(localStorage.getItem("blockedNames"));
    const nameToBlock = getId("nameToBlock").value;
    if (blocked.includes(nameToBlock)) return;
    blocked.push(nameToBlock);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

const unblockButton = getId("unblockName");
unblockButton.onclick = () => {
    const blocked = JSON.parse(localStorage.getItem("blockedNames"));
    const nameToUnblock = getId("nameToBlock").value;
    if (blocked.indexOf(nameToUnblock) == -1) return;
    blocked.splice(blocked.indexOf(nameToUnblock), 1);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

const showBlockedButton = getId("showBlocked");
showBlockedButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let str = "<h3>";
    str += blocked.join(", ");
    str += "</h3>";
    getId("blockNamesList").innerHTML = str;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
const onMessageReceived = (msg => {
    const filter = filterButton.getAttribute("filter");
    switch (filter) {
        case "party": {
            const party = Game.currentGame.ui.playerPartyMembers;
            const uids = [];
            for (const member of party) {
                uids.push(member.playerUid);
            }
            if (!uids.includes(msg.uid)) return;
        }
            break;
        case "none":
            return;
            break;
    }
    const blockedNames = JSON.parse(localStorage.getItem("blockedNames"));
    const a = game.ui.getComponent("Chat");
    const random = Math.random() * 9999999 | 0;
    const b = Sanitize(msg.displayName);
    const c = Sanitize(msg.message);
    const d = a.ui.createElement(`<div class="hud-chat-message"><b><strong id='displayName${random}'>${b}</strong></b>: ${c}</div>`);
    if (blockedNames.includes(b) || socketsUid.has(msg.uid)) return;
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
    document.getElementById("displayName" + random).addEventListener("mousedown", e => {
        if (e.button != 2) return;
        game.ui.components.Chat.copyText(c);
    });
})

game.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);


game.ui.components.Resources.numberAbbreviate = (e = 0) => window.showerss ? e.toLocaleString("en") : numberAbbreviate(e);

$("36i6").addEventListener('click', function () {
    $("36i6").innerText = `${(window.showerss = !window.showerss) ? "Disable" : "Enable"} Exact Rss Counter`;
});

const autoBuy = [[false, "38i6"], [false, "37i6"], [false, "40i6"], [false, "39i6"], [false, "41i6"]];

autoBuy.forEach(e => {
    $(e[1]).addEventListener('click', () => {
        e[0] = !e[0];
        $(e[1]).innerText = $(e[1]).innerText.replace(e[0] ? "Enable" : "Disable", e[0] ? "Disable" : "Enable");
    })
})

const pickaxePrices = [0, 1000, 3000, 5000, 8000, 24000, 90000];
const spearPrices = [1400, 2800, 5600, 11200, 22500, 45000, 90000];
const bowPrices = [100, 400, 2000, 7000, 24000, 30000, 90000];
const bombPrices = [100, 400, 3000, 5000, 24000, 50000, 90000];
const shieldPrices = [1000, 3000, 7000, 14000, 18000, 22000, 24000, 30000, 45000, 70000];

game.network.addEntityUpdateHandler(() => {
    const obj = game.ui.components.MenuShop.shopItems;
    [[autoBuy[0][0], obj.Pickaxe, pickaxePrices], [autoBuy[1][0], obj.Spear, spearPrices], [autoBuy[2][0], obj.Bow, bowPrices], [autoBuy[3][0], obj.Bomb, bombPrices], [autoBuy[4][0], obj.ZombieShield, shieldPrices]].forEach(e => {
        if (e[0] && game.ui.playerTick.gold >= e[2][e[1].nextTier - 1]) e[1].componentElem.click();
    });
});

getElement("hud-party-members")[0].style.display = "block";
getElement("hud-party-grid")[0].style.display = "none";
const privateTab = document.createElement("a");
privateTab.className = "hud-party-tabs-link";
privateTab.id = "privateTab";
privateTab.innerHTML = "Closed Parties";
const privateHud = document.createElement("div");
privateHud.className = "hud-private hud-party-grid";
privateHud.id = "privateHud";
privateHud.style = "display: none;";
getElement("hud-party-tabs")[0].appendChild(privateTab);
getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);
const keyTab = document.createElement("a");
keyTab.className = "hud-party-tabs-link";
keyTab.id = "keyTab";
keyTab.innerHTML = "Keys";
getElement("hud-party-tabs")[0].appendChild(keyTab);
const keyHud = document.createElement("div");
keyHud.className = "hud-keys hud-party-grid";
keyHud.id = "keyHud";
keyHud.style = "display: none;";
getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, getElement("hud-party-actions")[0]);
getId("privateTab").onclick = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    }
    getId("privateTab").className = "hud-party-tabs-link is-active";
    getId("privateHud").setAttribute("style", "display: block;");
    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    }
    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    }
    if (getId("privateHud").getAttribute("style") == "display: none;") {
        getId("privateHud").setAttribute("style", "display: block;");
    }
    if (getId("keyHud").getAttribute("style") == "display: block;") {
        getId("keyHud").setAttribute("style", "display: none;");
    }
}
getElement("hud-party-tabs-link")[0].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getElement("hud-party-tabs-link")[1].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getId("keyTab").onmouseup = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    }
    getId("keyTab").className = "hud-party-tabs-link is-active";
    getId("keyHud").setAttribute("style", "display: block;");
    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    }
    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    }
    if (getId("privateHud").getAttribute("style") == "display: block;") {
        getId("privateHud").setAttribute("style", "display: none;");
    }
    if (getId("keyHud").getAttribute("style") == "display: none;") {
        getId("keyHud").setAttribute("style", "display: block;");
    }
}

let num = 0;
Game.currentGame.network.addRpcHandler("PartyShareKey", e => {
    const el = document.createElement('div');
    el.innerText = e.partyShareKey;
    el.className = `tag${num++}`;
    document.getElementsByClassName('hud-keys hud-party-grid')[0].appendChild(el);
    document.getElementsByClassName(`${el.className}`)[0].addEventListener('click', e => {
        game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: el.innerText });
    })
});

let players = null;

let fullserveralarm = false;
let disconnectalarm = false;

game.network.addRpcHandler("SetPartyList", e => {
    const x = e.map(r => r.memberCount).reduce((a, b) => a + b, 0);
    if (players != x) {
        players = x;
        game.ui.components.PopupOverlay.showHint(`There are ${x} players in the server.`);
        document.getElementsByClassName("hud-party-server")[0].innerHTML = `${x}/32 <small>-</small><small>${game.network.connectionOptions.name}</small>`;
        if (fullserveralarm && players === 32) {
            handler.alarm();
        }
    }
    const parties = e.filter(r => r.isOpen === 0).map(e => "<div style=\"width: relative; height: relative;\" class=\"hud-party-link is-disabled\"><strong>" + Sanitize(e.partyName) + "</strong><span>" + e.memberCount + "/4</span></div>").join("");
    getId("privateHud").innerHTML = parties;
});

const disconnectInterval = setInterval(() => {
    if (disconnectalarm && Date.now() - handler.lastEntityTime > 60000) {
        clearInterval(disconnectInterval);
        handler.alarm();
    }
}, 500);

$("hud-party-joining").remove();

const countArr = ["", "K", "M", "B", "T"];
const numberAbbreviate = (num = 0) => {
    const c = Math.floor(Math.log10(Math.floor(num))) / 3 | 0;
    return Math.floor(Math.floor(num) / 10 ** (3 * c) * 10) / 10 + countArr[c];
}

$("hud").addEventListener("mousedown", e => {
    script.autoattack && e.button == 0 && sockets.forEach(e => e.sendPacket(3, { mouseDown: e.aimingYaw }));
});

$("hud").addEventListener("mouseup", e => {
    script.autoattack && e.button == 0 && sockets.forEach(e => e.sendPacket(3, { mouseUp: 1 }));
});

document.addEventListener("keydown", e => {
    !e.repeat && e.keyCode == 32 && script.autoattack && (sockets.forEach(e => e.sendPacket(3, { space: 1 })), sockets.forEach(e => e.sendPacket(3, { space: 0 })));
});

let altReq = 4;
let refillTick = 0;

const updateTick = () => (refillTick = handler.tick);

const refill = () => {
    if (handler.tick - refillTick > 100) altReq = 4;
    const min = Math.min(altReq, 32 - players);
    if (min != 0) {
        refillTick = handler.tick;
        altReq -= min;
        fetch("https://api.ipify.org").then(e => e.text()).then(ip => {
            let count = 0;
            sockets.forEach(e => ip == e.ip && (count++));
            for (let i = 0; i < Math.min(min, 7 - count); i++) {
                new Bot(null, null, null, ip);
            }
            refillTick = handler.tick;
        });
        return;
    }
    if (handler.dayCycle.isDay && altReq == 4) {
        refillTick = handler.tick;
        altReq -= 1;
        fetch("https://api.ipify.org").then(e => e.text()).then(ip => {
            let count = 0;
            sockets.forEach(e => ip == e.ip && (count++));
            count < 7 && new Bot(null, null, null, ip);
            refillTick = handler.tick;
        });
    }
}

game.network.addEntityUpdateHandler(() => script.autorefiller && refill());

let hasBeenInWorld = false;

game.network.addEnterWorldHandler(() => {
    if (!hasBeenInWorld) {
        hasBeenInWorld = true;
        setInterval(() => {
            const currentCoords = {
                x: game.ui.playerTick?.position?.x || 0,
                y: game.ui.playerTick?.position?.y || 0
            };
            document.querySelector("#coords").innerText = `X: ${currentCoords.x}\n Y: ${currentCoords.y}`;
        }, 16);

        const x = document.createElement('div');
        x.style = 'position: relative; margin: 0;';
        x.innerHTML = `<h3 id="coords"; style="margin: 0; color: white;"></h3>`;
        x.style.textAlign = "left";
        document.querySelector("#hud > div.hud-bottom-left").append(x);
    }
});