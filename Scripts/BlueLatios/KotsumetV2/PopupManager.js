class PopupManager {
    constructor() {
        this.popups = [];
        this.container = null;
        this.setupContainer();
    }

    setupContainer() {
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.id = "popup-container";
            Object.assign(this.container.style, {
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: "10000",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                pointerEvents: "none"
            });
            document.body.appendChild(this.container);
        }
    }

    createPopupElement(message, options = {}) {
        const {
            // duration = 3000,
            color = "white",
            backgroundColor = "rgba(0, 0, 0, 0.8)",
            width = "auto",
            height = "auto",
            fontSize = "14px",
            borderRadius = "4px",
            padding = "10px 15px",
            animation = true
        } = options;

        const popup = document.createElement("div");
        Object.assign(popup.style, {
            backgroundColor,
            color,
            padding,
            borderRadius,
            width,
            height,
            fontSize,
            opacity: "0",
            transition: animation ? "opacity 0.3s ease-in-out" : "none",
            pointerEvents: "auto",
            cursor: "pointer",
            wordBreak: "break-word",
            maxWidth: "300px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        });

        // Handle multi-line messages
        if (typeof message === "string") {
            popup.textContent = message;
        } else if (message instanceof Array) {
            popup.innerHTML = message.join("<br>");
        } else {
            popup.textContent = String(message);
        }

        // Add click-to-dismiss functionality
        popup.addEventListener("click", () => {
            this.removePopup(popup);
        });

        return popup;
    }

    removePopup(popup) {
        popup.style.opacity = "0";
        setTimeout(() => {
            if (popup.parentNode === this.container) {
                this.container.removeChild(popup);
            }
        }, 300);
    }

    show(message, options = {}) {
        const popup = this.createPopupElement(message, options);
        this.container.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = "1";
        }, 10);

        if (options.duration !== 0) {
            const duration = options.duration || 3000;
            setTimeout(() => {
                this.removePopup(popup);
            }, duration);
        }

        return popup;
    }

    clearAll() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}

export default PopupManager;