import DirectionMapper from "../DirectionMapper";

const MouseMove = {
    name: "mousemove",
    worldToScreenScaleFactor: 100,
    init(socketComponent) {
        this.socketComponent = socketComponent;
    },
    update(socket) {
        const aimOffsetX = -socket.myPlayer.position.x + this.socketComponent.socketHandler.states.mousePosition.x;
        const aimOffsetY = -socket.myPlayer.position.y + this.socketComponent.socketHandler.states.mousePosition.y;
        const mouseMovedPacket = game.inputPacketCreator.screenToYaw(aimOffsetX * this.worldToScreenScaleFactor, aimOffsetY * this.worldToScreenScaleFactor);
        this.socketComponent.sendPacket(socket, 3, { mouseMoved: mouseMovedPacket });

        const aimingYaw = game.inputPacketCreator.screenToYaw(
            aimOffsetX * this.worldToScreenScaleFactor,
            aimOffsetY * this.worldToScreenScaleFactor
        );

        const yaw = DirectionMapper.aimToYaw(aimingYaw);

        if (yaw && Object.hasOwn(DirectionMapper.yawActions, yaw) && socket.lastYawSent !== yaw) {
            socket.lastYawSent = yaw;
            this.socketComponent.sendPacket(socket, 3, DirectionMapper.yawActions[yaw]);
        }
    }
}

export default MouseMove