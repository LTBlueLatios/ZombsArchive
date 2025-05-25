// ==UserScript==
// @name         Kotsumet-Client
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A client with Kotsumet in respect of mind, Hana and Kotaro included ;D
// @author       BlueLatios
// @match        http://*.zombs.io/
// @match        http://localhost:*/
// @icon         https://yt3.ggpht.com/ytc/AMLnZu_uRLjtiScCZVHS7Nd7UL5WZA1XFw8nD5_PZ_Nzeg=s900-c-k-c0x00ffffff-no-rj
// @grant        none
// ==/UserScript==
var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Caveat Brush');
document.head.appendChild(link);

let clientcss = `
.hud-menu-shop {
    background: rgba(48, 175, 239, 0.8);
    color: #eee;
    border-style: solid;
    border-color: #eee;
    border-radius: 24px;
    border-width: 6px;
}
.ad-unit-medrec-shop {
    position: absolute;
    top: 60px;
    right: 20px;
    width: 300px;
    height: 390px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    text-align: center;
    font-family: 'Caveat Brush';
    font-size: 24px;
}
`;

let shopinfohtml = `
<style>
</style>
<h1>Kotsumet Client</h1>
<div id=div1>
<h2>Author</h2>
<p>BlueLatios</p>
<h3>Helpers</h3>
<p>Trollers, L O L O L, Jrcc, Artemis</p>
</div>
`
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(clientcss));
document.head.appendChild(styles);
styles = "text/css";

setInterval(() => {
    document.getElementsByClassName("ad-unit-medrec-shop")[0].innerHTML = shopinfohtml
    document.getElementsByClassName("ad-unit-leaderboard-shop")[0].innerHTML = "somethin :/"
}, 1000); //Because Yang is a whore, we have to loop this to make it work, I'll optimize it later