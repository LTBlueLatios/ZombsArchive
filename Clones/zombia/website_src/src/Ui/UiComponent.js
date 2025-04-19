class UiComponent {
    constructor(element) {
        this.element = element;
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }

    isVisible() {
        return window.getComputedStyle(this.element).display !== "none";
    }
}

export { UiComponent };