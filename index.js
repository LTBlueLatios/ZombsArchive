function strictLog(message) {
    if (typeof message != "string")
        throw new TypeError("Message must be a string");
    console.log(message);
}

strictLog("Hello, World!");
