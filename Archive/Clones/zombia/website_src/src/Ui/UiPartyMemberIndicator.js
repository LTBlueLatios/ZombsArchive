import { UiComponent } from "./UiComponent";
import { Game } from "../Game.js";

class UiPartyMemberIndicator extends UiComponent {
    constructor() {
        const memberIndicator = document.createElement("div");
        memberIndicator.className = "hud-party-member-indicator";

        document.getElementById("hud-bottom").appendChild(memberIndicator);

        super(memberIndicator);

        this.memberElements = {};
    }

    init() {
        Game.eventEmitter.on("PartyMembersUpdatedRpcReceived", this.onMembersUpdated.bind(this));
    }

    onMembersUpdated(members) {
        for (let uid in this.memberElements) {
            this.memberElements[uid].remove();
            delete this.memberElements[uid];
        }
        
        for (let member of members) {
            if (this.memberElements[member.uid] == undefined) {
                this.memberElements[member.uid] = document.createElement("div");
                this.memberElements[member.uid].className = "member-indicator";

                this.element.appendChild(this.memberElements[member.uid]);
            }

            this.memberElements[member.uid].setAttribute("data-index", members.indexOf(member));
            this.memberElements[member.uid].innerHTML = `<span>${member.name.substring(0, 2)}</span>`;
        }
    }
}

export { UiPartyMemberIndicator };