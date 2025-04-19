import { Game } from "../Game.js";
import { UiMenuGrid } from "./UiMenuGrid.js";

const grawlix = require("grawlix");
const grawlixRacism = require("grawlix-racism");

grawlix.loadPlugin(grawlixRacism);

grawlix.setDefaults({
    randomize: false
});

class UiMenuGridParties extends UiMenuGrid {
    constructor() {
        super("Parties");

        Game.ui.components.uiMenuGridParties = this;

        this.partyLeader = 0;

        this.element.innerHTML = `
        <div class="hud-grid-exit"></div>
        <h3>Parties</h3>
        <div class="hud-party-tabs">
            <a class="hud-party-tabs-link">Your Party</a>
            <a class="hud-party-tabs-link">Open Parties</a>
        </div>
        <div id="hud-party-members" class="hud-party-members"></div>
        <div id="hud-party-grid" class="hud-party-grid">
            <div class="hud-party-joining">Requesting to join...</div>
            <button class="hud-party-cancel-request">Cancel your request</button>
            <div class="hud-party-empty">No parties are currently available to join.</div>
        </div>
        <div class="hud-party-actions">
            <input type="text" class="hud-party-name" placeholder="Your party"s name..." maxlength="16">
            <input type="text" class="hud-party-key" placeholder="Your party link...">
            <a class="hud-party-key-randomise">
            <a class="btn btn-red hud-party-leave">Leave Party</a>
            <a class="btn hud-party-visibility is-private">Private</a>
        </div>
        `;

        this.membersElem = this.element.querySelector(".hud-party-members");
        this.memberElems = {};

        this.requestedUids = {};

        this.gridJoiningElem = this.element.querySelector(".hud-party-joining");
        this.cancelRequestButton = this.element.querySelector(".hud-party-cancel-request");
        this.cancelRequestButton.addEventListener("mouseup", () => {
            Game.network.sendRpc({
                name: "CancelPartyRequest"
            })
        })

        this.gridEmptyElem = this.element.querySelector(".hud-party-empty");
        this.gridElem = this.element.querySelector(".hud-party-grid");

        this.partyNameElem = this.element.querySelector(".hud-party-name");
        this.partyNameElem.addEventListener("keydown", event => {
            event.stopPropagation();
        });

        this.partyNameElem.addEventListener("keyup", this.onPartyNameKeyUp.bind(this));

        this.partyKeyElem = this.element.querySelector(".hud-party-key");

        this.partyKeyElem.addEventListener("focus", () => {
            this.partyKeyElem.select();
        });

        this.partyKeyElem.addEventListener("keydown", event => {
            event.stopPropagation();
        });

        this.partyKeyElem.addEventListener("keyup", event => {
            event.stopPropagation();
        });

        this.leaveElem = this.element.querySelector(".hud-party-leave");
        this.leaveElem.addEventListener("click", this.leaveParty.bind(this));

        this.visibilityElem = this.element.querySelector(".hud-party-visibility");
        this.visibilityElem.addEventListener("click", this.toggleVisiblity.bind(this));

        this.randomiseKeyButton = this.element.querySelector(".hud-party-key-randomise");

        this.randomiseKeyButton.addEventListener("click", () => {
            Game.network.sendRpc({
                name: "RandomisePartyKey"
            })
        })

        this.partyElems = {};
        this.partyData = null;

        const tabDivs = this.element.querySelectorAll(".hud-party-tabs-link");
        for (let tab of tabDivs) {
            tab.addEventListener("mouseup", this.setTab.bind(this, tab));
        }
        this.setTab(tabDivs[0]);


        this.hasInitialised = false;
        this.init();
    }

    init() {
        if (this.hasInitialised == true) return;
        this.hasInitialised = true;
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("UpdatePartyRpcReceived", this.onPartyUpdate.bind(this));
        Game.eventEmitter.on("PartyKeyRpcReceived", this.onPartyKey.bind(this));
        Game.eventEmitter.on("PartyMembersUpdatedRpcReceived", this.onMembersUpdated.bind(this));
        Game.eventEmitter.on("PartyRequestRpcReceived", this.onPartyRequest.bind(this));
        Game.eventEmitter.on("PartyRequestMetRpcReceived", this.onPartyRequestMet.bind(this));
        Game.eventEmitter.on("PartyRequestCancelledRpcReceived", this.onPartyRequestCancelled.bind(this));
    }

    onEnterWorld() {
        this.gridJoiningElem.style.display = "none";
        this.cancelRequestButton.style.display = "none";
    }

    setTab(tab) {
        const tabDivs = this.element.querySelectorAll(".hud-party-tabs-link");
        tab.classList.add("is-active");
        for (let tabDiv of tabDivs) {
            if (tabDiv.textContent !== tab.textContent) tabDiv.classList.remove("is-active");
        }

        this.gridElem.style.display = tab.textContent == "Your Party" ? "none" : "block";
        this.membersElem.style.display = tab.textContent == "Your Party" ? "block" : "none";
    }

    onPartyUpdate(data) {
        let partyData = {};
        for (let i in data) {
            partyData[data[i].partyId] = data[i];
        }
        this.partyData = partyData;
        this.update();
    }

    update() {
        for (let partyId in this.partyData) {
            if (!(partyId in this.partyElems) && this.partyData[partyId].isOpen !== false) {
                for (let i in this.partyElems) {
                    this.partyElems[i].remove();
                    delete this.partyElems[i];
                }
            }
        }

        const pendingRemoval = {};
        for (let partyId in this.partyElems) pendingRemoval[partyId] = true;

        for (let partyId in this.partyData) {
            if (partyId == Game.ui.getPlayerTick()?.partyId && this.partyData[partyId].isOpen === false) continue;
            delete pendingRemoval[partyId];

            const partyData = this.partyData[partyId];
            let partyElem = this.partyElems[partyId];
            if (!this.partyElems[partyId]) {
                partyElem = document.createElement("div");
                partyElem.className = "hud-party-link";
                this.gridElem.appendChild(partyElem);
                this.partyElems[partyId] = partyElem;
                partyElem.addEventListener("click", this.onPartyClick.bind(this, partyData.partyId));
            }

            if (Game.ui.getPlayerTick()?.partyId == partyId) {
                partyElem.classList.add("is-active");
                partyElem.classList.remove("is-disabled");
            } else if (partyData.memberCount >= partyData.memberLimit) {
                partyElem.classList.remove("is-active");
                partyElem.classList.add("is-disabled");
            } else {
                partyElem.classList.remove("is-active");
                partyElem.classList.remove("is-disabled");
            }

            partyElem.innerHTML = `
            <strong id="name"></strong>
            <span>${partyData.memberCount}/${partyData.memberLimit}</span>`;

            partyElem.querySelector("#name").appendChild(document.createTextNode(Game.network.languageFilterEnabled ? grawlix(partyData.partyName) : partyData.partyName));
        }

        for (let partyId in pendingRemoval) {
            if (!this.partyElems[partyId]) continue;
            this.partyElems[partyId].remove();
            delete this.partyElems[partyId];
        }

        this.gridEmptyElem.style.display = Object.keys(this.partyElems || {}).length > 0 ? "none" : "block";

        const playerPartyData = this.partyData?.[Game.ui.getPlayerTick()?.partyId];

        if (!playerPartyData) return;

        this.partyKeyElem.removeAttribute("disabled");

        if (document.activeElement !== this.partyNameElem) {
            this.partyNameElem.value = playerPartyData.partyName;
        }

        const isPartyLeader = Game.renderer.world.localPlayer === this.partyLeader;

        this.visibilityElem.classList[isPartyLeader ? "remove" : "add"]("is-disabled");

        if (isPartyLeader) this.partyNameElem.removeAttribute("disabled"); else this.partyNameElem.setAttribute("disabled", "true");

        this.visibilityElem.classList[playerPartyData.isOpen ? "remove" : "add"]("is-private");
        this.visibilityElem.innerText = playerPartyData.isOpen ? "Public" : "Private";
    }

    onPartyKey(data) {
        Game.ui.partyKey = data.partyKey;
        this.partyKeyElem.value = `${window.location.protocol}//${document.location.hostname}/#/${Game.network.options.serverData.id}/${data.partyKey}`;
        this.update();
    }

    onPartyNameKeyUp(event) {
        Game.network.sendRpc({
            name: "SetPartyName",
            partyName: this.partyNameElem.value
        });
        event.stopPropagation();
    }

    onMembersUpdated(members) {
        this.partyLeader = members.find(e => e.isLeader === true).uid;

        const isPartyLeader = Game.renderer.world.localPlayer === this.partyLeader;

        Game.ui.playerPartyLeader = this.partyLeader;

        for (let i in this.memberElems) {
            this.memberElems[i].remove();
            delete this.memberElems[i];
        }

        if (members.length <= 1) {
            this.leaveElem.classList.add("is-disabled");
        } else {
            this.leaveElem.classList.remove("is-disabled");
        }

        for (let i in members) {
            const memberElem = document.createElement("div");
            const member = members[i];
            memberElem.className = "hud-member-link";
            memberElem.innerHTML = `
            <strong id="name"></strong>
            <small>${(member.uid == this.partyLeader ? "Leader" : "Member")}</small>
            <div class="hud-member-actions">
                <a class="hud-member-can-place btn ${(!isPartyLeader || member.uid === this.partyLeader ? " is-disabled" : "")} ${(member.canPlace ? " is-active" : "")}">
                <span class="hud-party-permissions-tick">&check;</span> Can place
                </a>
                <a class="hud-member-can-sell btn ${(!isPartyLeader || member.uid === this.partyLeader ? " is-disabled" : "")} ${(member.canSell ? " is-active" : "")}">
                <span class="hud-party-permissions-tick">&check;</span> Can sell
                </a>
                <a class="hud-member-kick btn btn-red ${(!isPartyLeader || member.uid === this.partyLeader ? " is-disabled" : "")}">Kick</a>
            </div>
            `;

            memberElem.querySelector("#name").appendChild(document.createTextNode(Game.network.languageFilterEnabled ? grawlix(member.name) : member.name));

            this.membersElem.appendChild(memberElem);
            this.memberElems[member.uid] = memberElem;
            if (isPartyLeader && !(member.uid === this.partyLeader)) {
                memberElem.querySelector(".hud-member-kick").addEventListener("click", this.onPartyMemberKick.bind(this, member));
                memberElem.querySelector(".hud-member-can-place").addEventListener("click", this.onPartyMemberPermissionToggle.bind(this, member.uid, "Place"));
                memberElem.querySelector(".hud-member-can-sell").addEventListener("click", this.onPartyMemberPermissionToggle.bind(this, member.uid, "Sell"));
            }
        }

        // Make the randomise key button unclickable if not the leader
        this.randomiseKeyButton.classList[isPartyLeader ? "remove" : "add"]("locked");
    }

    leaveParty() {
        if (this.leaveElem.classList.contains("is-disabled")) return;

        let confirmationText = "Are you sure you want to leave your party?";
        if (Game.ui.factory !== null) confirmationText = "Are you sure you want to abandon your base?";
        Game.ui.components.uiPopupOverlay.showConfirmation(confirmationText, 10000, () => {
            Game.network.sendRpc({
                name: "LeaveParty"
            })
        });
    }

    toggleVisiblity() {
        Game.network.sendRpc({
            name: "TogglePartyVisibility"
        });
    }

    onPartyClick(partyId) {
        if (partyId == Game.ui.getPlayerTick()?.partyId) return;

        if (Game.ui.factory !== null) {
            Game.ui.components.uiPopupOverlay.showConfirmation("Are you sure you want to abandon your base?", 10000, () => {
                this.requestParty(partyId)
            });
        } else this.requestParty(partyId);
    }

    requestParty(partyId) {
        if (this.partyElems[partyId].classList.contains("is-disabled")) return;
        this.gridJoiningElem.style.display = "block";
        this.cancelRequestButton.style.display = "block";
        this.gridElem.classList.add("is-disabled");

        Game.network.sendRpc({
            name: "JoinParty",
            partyId
        })
    }

    onPartyMemberKick(data) {
        Game.ui.components.uiPopupOverlay.showConfirmation(`Are you sure you want to kick <b>${data.name}</b> from your party?`, 10000, () => {
            Game.network.sendRpc({
                name: "KickMember",
                uid: parseInt(data.uid)
            });
        });
    }

    onPartyMemberPermissionToggle(uid, permission) {
        let permissions = ["Sell", "Place"];

        Game.network.sendRpc({
            name: "TogglePartyPermission",
            permission: permissions.indexOf(permission),
            uid: parseInt(uid)
        })
    }

    onPartyRequest(data) {
        this.requestedUids[data.uid] = Game.ui.components.uiPopupOverlay.showConfirmation(`<b>${data.name}</b> has requested to join your party.`, 30000, () => {
            Game.network.sendRpc({
                name: "PartyRequestResponse",
                accepted: true,
                uid: parseInt(data.uid)
            });
        }, () => {
            Game.network.sendRpc({
                name: "PartyRequestResponse",
                accepted: false,
                uid: parseInt(data.uid)
            });
        }, true);
    }

    onPartyRequestMet() {
        this.gridJoiningElem.style.display = "none";
        this.cancelRequestButton.style.display = "none";
        this.gridElem.classList.remove("is-disabled");
    }

    onPartyRequestCancelled(data) {
        Game.ui.components.uiPopupOverlay.removePopup(this.requestedUids[data.uid]);
        delete this.requestedUids[data.uid];
    }
}

export { UiMenuGridParties };