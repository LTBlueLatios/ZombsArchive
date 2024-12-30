import AutoBuild from "./Scripts/AutoBuild.js";

class ScriptManager {
    session;
    scripts = new Map();

    constructor(session) {
        this.session = session;

        this.registerScripts([
            AutoBuild
        ]);
    }

    registerScripts(scripts) {
        if (!Array.isArray(scripts)) scripts = [scripts];

        scripts.forEach(plugin => {
            plugin.init(this.session);
            this.scripts.set(plugin.name, plugin);
        });
    }

    toggleScript(scriptName) {
        if (this.scripts.has(scriptName)) {
            const script = this.scripts.get(scriptName);
            script.status = !script.status;
            script.status ? script.onEnable() : script.onDisable();

            this.session.broadcastNotice({
                notice: "ToggledScript",
                name: scriptName,
                status: script.status
            });
        } else {
            this.session.broadcastNotice({
                notice: "ScriptNotFound",
                name: scriptName
            });
        }
    }
}

export default ScriptManager;