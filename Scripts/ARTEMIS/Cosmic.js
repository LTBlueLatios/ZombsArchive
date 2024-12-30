// ==UserScript==
// @name         Cosmic
// @namespace    http://tampermonkey.net/
// @version      Alpha
// @description  Working on alpha.
// @author       ARTEMIS
// @match        https://zombs.io/
// @icon         https://cdn.discordapp.com/attachments/1083849335093075978/1124514630459469904/galaxy.png
// @grant        none
// ==/UserScript==

/**
 * Name: Cosmic
 * Author: ARTEMIS
 * Version: Alpha build 1
 */

// modified css
let css = `

.btn {
    display: inline-block;
    height: 40px;
    margin-top: 5px;
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

.btn:hover, .btn:active {
    background-color: #555;
    color: #fff;
}

.btn-green {
    background-color: #47950d;
}

.btn-green:hover, .btn-green:active {
    background-color: #64b820;
}

.btn-red {
    background-color: #b3353c;
}

.btn-red:hover, .btn-red:active {
    background-color: #cb575b;
}

.btn-blue {
    background-color: #1d8dee;
}

.btn-blue:hover, .btn-blue:active {
    background-color: #4fa7ee;
}

.btn-purple {
    background-color: #7237e4;
}

.btn-purple:hover, .btn-purple:active {
    background-color: #8259e4;
}

.btn-gold {
    background-color: #bf6509;
}

.btn-gold:hover, .btn-gold:active {
    background-color: #bf7b3c;
}

.btn-twitter {
    background-color: #1b95e0;
}

.btn-twitter:hover, .btn-twitter:active {
    background-color: #0c7abf;
}

.btn-facebook {
    background-color: #4267b2;
}

.btn-facebook:hover, .btn-facebook:active {
    background-color: #365899;
}

.btn-google {
    background-color: #dd4b39;
}

.btn-google:hover, .btn-google:active {
    background-color: #ba3f31;
}

.btn-discord {
    background-color: #7289da;
}

.btn-discord:hover, .btn-discord:active {
    background-color: #5a6db0;
}

.btn-youtube {
    background-color: #e52d27;
}

.btn-youtube:hover, .btn-youtube:active {
    background-color: #ba2521;
}

.hud-intro::before {
    background-image: url('https://cdn.discordapp.com/attachments/1083849335093075978/1124688106449285150/pxfuel.jpg');
    background-size: cover;
}

.hud-catalog {
    display: none;
    position: fixed;
    padding: 10px;
    width: 450px;
    height: 600px;
    overflow-y: auto;
    top: 22%;
    left: 38%;
    background: rgba(0, 0, 0, 0.6);
    border: 5px outset #ffffff;
    opacity: 1;
    color: #eee;
    border-radius: 4px;
    z-index: 15;
}

::-webkit-scrollbar-track {
    display: none;
}

::-webkit-scrollbar {
    display: none;
}

::-webkit-scrollbar-thumb {
    display: none;
}

<style>
</style>
`;
let style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

//Removes unneeded game elements
const removeElements = () => {

    const selectors = ['.ad-unit', '.hud-intro-stone', '.hud-intro-tree', 'hud-intro-more-games'];

    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.remove());
    });
};

removeElements();

//Main menu style modifications
const introFooter = document.querySelector(".hud-intro-footer");
const bottomRight = document.querySelector(".hud-intro-corner-bottom-right");
const bottomLeft = document.querySelector(".hud-intro-corner-bottom-left");
const youTuber = document.querySelector(".hud-intro-corner-top-left");
const leaderBoard = document.querySelector(".hud-intro-corner-top-right");
const introMain = document.querySelector(".hud-intro-main");

introFooter.innerHTML = `

<h2>© 2023 ZOMBS.io | Cosmic | ARTEMIS Mods 2023</h2>

`;
bottomRight.innerHTML = `

<button class="btn btn-blue" style="width: 100%;" onclick="discordServer();">Discord Server</button>
<br>
<button class="btn btn-blue" style="width: 100%;" onclick="openCatalog();">Catalog</button>
<br>
<button class="btn btn-blue" style="width: 100%;">Configs</button>

`;

//Discord server
discordServer = () => {
    var url = 'https://discord.gg/Py7QX7axzG';
    var win = window.open(url, '_blank');
    win.focus();
}

// New tab icon
var link = document.querySelector("link[rel='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = 'https://cdn.discordapp.com/attachments/1083849335093075978/1124514630459469904/galaxy.png';

// Better page title
if (document.title !== 'Cosmic | ZOMBS.io' && window.location.href === 'https://zombs.io/') {
    document.title = 'Cosmic | ZOMBS.io';
}

// Catalog
let catalogHTML = `
<div class="hud-catalog">
    <center>
        <h2>
            Catalog
        </h2>
    </center>
    <hr/>
        <h3>
            • Update version here •
        </h3>
        <p>
            - Added
            <br>
            - Added
            <br>
            - Added
            <br>
        <p>
    <hr/>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", catalogHTML);

openCatalog = () => {

    const scriptCatalog = document.querySelector(".hud-catalog");
    const introHole = ['.hud-intro-corner-bottom-left', '.hud-intro-corner-top-left', '.hud-intro-corner-top-right', '.hud-intro-main'];

    if (scriptCatalog.style.display === "none" || scriptCatalog.style.display === "") {
        scriptCatalog.style.display = "block";
        introHole.style.display = "none";
    } else {
        scriptCatalog.style.display = "none";
    }
}