import * as PIXI from "pixi.js";

class Entity {
    constructor(node = null) {
        this.attachments = [];
        this.parent = null;
        this.isVisible = true;
        this.setNode(node || new PIXI.Container());
    }

    getNode() {
        return this.node;
    }

    setNode(node) {
        this.node = node;
    }

    getParent() {
        return this.parent;
    }

    setParent(parent) {
        if (parent == null) {
            if (this.currentModel !== undefined) {
                this.currentModel.removedParentFunction?.();
                for (const attachment of this.currentModel.attachments) {
                    attachment.setParent(null);
                }
            }

            for (const attachment of this.attachments) {
                attachment.setParent(null);
            }
        }

        this.parent = parent;
    }

    getAttachments() {
        return this.attachments;
    }

    addAttachment(attachment, zIndex = 0) {
        const node = attachment.getNode();
        node.zIndex = zIndex;
        attachment.setParent(this);
        this.node.addChild(attachment.getNode());
        this.attachments.push(attachment);
        this.node.children.sort((a, b) => {
            if (a.zIndex == b.zIndex) return 0;
            return a.zIndex < b.zIndex ? -1 : 1;
        })
    }

    removeAttachment(attachment) {
        if (!attachment) return;
        this.node.removeChild(attachment.getNode());
        attachment.setParent(null);
        if (this.attachments.indexOf(attachment) > -1) this.attachments.splice(this.attachments.indexOf(attachment), 1);
    }

    getRotation() {
        return this.node.rotation * 180 / Math.PI;
    }

    setRotation(degrees) {
        this.node.rotation = degrees * Math.PI / 180;
    }

    getAlpha() {
        return this.node.alpha;
    }

    setAlpha(alpha) {
        if (this.node.alpha !== alpha) this.node.alpha = alpha;
    }

    getScale() {
        return this.node.scale;
    }

    setScale(scale) {
        this.node.scale.x = scale;
        this.node.scale.y = scale;
    }

    getScaleX() {
        return this.node.scale.x;
    }

    setScaleX(scale) {
        this.node.scale.x = scale;
    }

    getScaleY() {
        return this.node.scale.y;
    }

    setScaleY(scale) {
        this.node.scale.y = scale;
    }

    getFilters() {
        return this.node.filters;
    }

    setFilters(filters) {
        this.node.filters = filters;
    }

    getPosition() {
        return this.node.position;
    }

    setPosition(x, y) {
        if (this.node.position.x !== x) this.node.position.x = x;
        if (this.node.position.y !== y) this.node.position.y = y;
    }

    getPositionX() {
        return this.node.position.x;
    }

    setPositionX(x) {
        if (this.node.position.x !== x) this.node.position.x = x;
    }

    getPositionY() {
        return this.node.position.y;
    }

    setPositionY(y) {
        if (this.node.position.y !== y) this.node.position.y = y;
    }

    getPivotPoint() {
        return this.node.pivot;
    }

    setPivotPoint(x, y) {
        this.node.pivot.x = x;
        this.node.pivot.y = y;
    }

    getVisible() {
        return this.isVisible;
    }

    setVisible(visible) {
        this.isVisible = visible;
        this.node.visible = visible;
    }

    update(dt, tick) {
        for (const attachment of this.attachments) attachment.update(dt, tick);
    }
}

export { Entity };