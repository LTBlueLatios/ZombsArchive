(() => {
  // ../WasmModule.js
  var wasmbuffers;
  var WasmModule = () => {
    const Module = { repeater: 0 };
    Module.decodeBlendInternal = (blended) => {
      Module.asm.j(24, 132);
      const pos = Module.asm.j(228, 132);
      const extra = new Uint8Array(blended);
      for (let i = 0; i < 132; i++) {
        Module.HEAPU8[pos + i] = extra[i + 1];
      }
      Module.asm.j(172, 36);
      const index = Module.asm.j(4, 152);
      const arraybuffer = new ArrayBuffer(64);
      const list = new Uint8Array(arraybuffer);
      for (let i = 0; i < 64; i++) {
        list[i] = Module.HEAPU8[index + i];
      }
      return arraybuffer;
    };
    Module.onDecodeOpcode5 = (blended, hostname, callback) => {
      Module.blended = blended;
      Module.hostname = hostname;
      if (!Module.ready) return Module.opcode5Callback = callback;
      Module.asm.j(255, 140);
      const decoded = Module.decodeBlendInternal(blended);
      const mcs = Module.asm.j(187, 22);
      const opcode6Data = [6];
      for (let i = 0; i < 16; i++) {
        opcode6Data.push(Module.HEAPU8[mcs + i]);
      }
      callback({ 5: decoded, 6: new Uint8Array(opcode6Data) });
    };
    Module.finalizeOpcode10 = (blended) => {
      const decoded = Module.decodeBlendInternal(blended);
      const list = new Uint8Array(decoded);
      const data = [10];
      for (let i = 0; i < decoded.byteLength; i++) {
        data.push(list[i]);
      }
      return new Uint8Array(data);
    };
    const instantiate = (wasmbuffers2) => {
      WebAssembly.instantiate(wasmbuffers2, {
        "a": {
          "d": () => {
          },
          "f": () => {
          },
          "c": () => {
          },
          "e": () => {
          },
          "b": () => [0, 0, 1, 0, 24][Module.repeater %= 5, Module.repeater++],
          "a": () => (Module.HEAPU8.set(new Uint8Array([...new TextEncoder().encode(Module.hostname)]), 200), 200)
        }
      }).then((asm) => {
        3;
        Module.asm = asm.instance.exports;
        Module.HEAPU8 = new Uint8Array(Module.asm.g.buffer);
        Module.asm.h();
        Module.asm.i(0, 0);
        Module.ready = true;
        if (Module.opcode5Callback) Module.onDecodeOpcode5(Module.blended, Module.hostname, Module.opcode5Callback);
      });
    };
    wasmbuffers ? instantiate(wasmbuffers) : fetch("http://localhost/zombs/zombs_wasm.wasm").then((e) => e.arrayBuffer().then((r) => {
      wasmbuffers = new Uint8Array(r);
      instantiate(wasmbuffers);
    }));
    return Module;
  };
  var WasmModule_default = WasmModule;

  // DeadOrcas.js
  var DEAD_ORCAS = [
    { name: "Kandu 1, F | 1971, 5", altNamed: false },
    { name: "Kilroy, M | 1978, 8", altNamed: false },
    { name: "Ramu, M | 1986, 14", altNamed: false },
    { name: "Kona, F | 1987, 6", altNamed: false },
    { name: "Orky 2, M | 1988, 20", altNamed: false },
    { name: "Kenau, F | 1991, 11", altNamed: false },
    { name: "Kandu 5, F | 1991, 15", altNamed: false },
    { name: "Nootka 5, F | 1994, 13", altNamed: false },
    { name: "Splash, M | 1994, 17", altNamed: false },
    { name: "Shamu, F | 1971, 14", altNamed: false },
    { name: "Kalina, F | 2010, 25", altNamed: false },
    { name: "Taima, F | 2010, 20", altNamed: false },
    { name: "Sumar, M | 2010, 12", altNamed: false },
    { name: "Taku, M | 2007, 14", altNamed: false },
    { name: "Tilikum, M | 2017, 36", altNamed: false },
    { name: "Kayla, F | 2019, 30", altNamed: false },
    { name: "Unna, F | 2015, 18", altNamed: false },
    { name: "Kyara, F | 2017, 0.25", altNamed: false },
    { name: "Kasatka, F | 2017, 42", altNamed: false },
    { name: "Vicky, F | 2013, 17", altNamed: false },
    { name: "Nakai, M | 2021, 20", altNamed: false },
    { name: "Kalia, F | 2022, 22", altNamed: false },
    { name: "Halyn, F | 2022, 2", altNamed: false },
    { name: "Kohana, F | 2022, 20", altNamed: false },
    { name: "Skyla, F | 2021, 17", altNamed: false },
    { name: "Keto, M | 2023, 33", altNamed: false },
    { name: "Amaya, F | 2021, 6", altNamed: false },
    { name: "Corky 2, F | 2017, 53", altNamed: false },
    { name: "Ulises, M | 1994, 18", altNamed: false },
    { name: "Winston, M | 1986, 11", altNamed: false },
    { name: "Kanduke, M | 1990, 17", altNamed: false }
  ];
  var DeadOrcas_default = DEAD_ORCAS;

  // SocketComponent.js
  var PACKETS = Object.freeze({
    ENTITY_UPDATE: 0,
    ENTER_WORLD: 4,
    PRE_ENTER_WORLD: 5,
    RPC: 9,
    WASM_KEEPALIVE: 10
  });
  var SocketComponent = {
    init(socketHandler2) {
      this.socketHandler = socketHandler2;
      this.codecWorker = new Worker("http://localhost/zombs/Kotsumet/CodecWorker.js");
      this.codecWorker.onmessage = ({ data }) => this.handleCodecWorker(data);
      this.codecWorker.onerror = console.error;
      this.wasmWorker = new Worker("http://localhost/zombs/Kotsumet/WasmWorker.js");
      this.wasmWorker.onmessage = ({ data }) => this.handleWasmWorker(data);
      this.wasmWorker.postMessage({ task: "load" });
      this.wasmWorker.onerror = console.error;
    },
    handleCodecWorker(data) {
      const { id, action, result, opcode } = data;
      const socket = this.socketHandler.getSocketById(id);
      if (action === "decoded") {
        const packetType = Object.keys(PACKETS).find((key) => PACKETS[key] === opcode);
        switch (packetType) {
          case "ENTITY_UPDATE":
            this.handleEntityUpdate(JSON.parse(result), socket);
            break;
          case "ENTER_WORLD":
            this.handleEnterWorld(result, socket);
            break;
          case "RPC":
            this.handleRPC(result, socket);
            break;
        }
      } else if (action === "encoded") {
        socket.send(result);
      }
    },
    handleWasmWorker(data) {
      const { id, task, result } = data;
      const socket = this.socketHandler.getSocketById(id);
      if (task === "opcode5") {
        this.sendPacket(socket, 4, {
          displayName: socket.name,
          extra: result[5]
        });
        socket.enterWorld2 = result[6];
      }
      if (task === "opcode10") {
        socket.send(result);
      }
    },
    handleOpen(event, socket) {
      this.codecWorker.postMessage({
        task: "initialise",
        id: socket.socketID
      });
      this.wasmWorker.postMessage({
        task: "instantiate",
        id: socket.socketID
      });
      socket.mapPointer = {};
      socket.myPlayer = {
        uid: null,
        position: { x: 0, y: 0 },
        model: "GamePlayer"
      };
      socket.inventory = {};
      socket.buildings = {};
      socket.hasStash = false;
      socket.hasStashAlreadySet = false;
      socket.inWorld = false;
      socket.wasmModule = WasmModule_default();
      socket.name = this.generateName();
    },
    generateName(type = "FuckSeaWorld", options) {
      const orca = DeadOrcas_default.find((orca2) => !orca2.altNamed);
      switch (type) {
        case "Main":
          return game.options.nickname;
        case "RandomUnicode":
          return this.enerateRandomUnicode();
        case "Preset":
          if (options.preset == "longName") return "\u0623\u0641\u0627\u0633\u062A\u0633\u0642\u064A\u0646\u0627\u0643\u0645\u0648\u0647\u0627".repeat(28);
          break;
        case "FuckSeaWorld":
          orca.altNamed = true;
          return orca.name;
      }
    },
    generateRandomUnicode() {
      const startUnicode = 33;
      const endUnicode = 126;
      let result = "";
      for (let i = 0; i < 28; i++) {
        const randomUnicode = Math.floor(Math.random() * (endUnicode - startUnicode + 1)) + startUnicode;
        result += String.fromCharCode(randomUnicode);
      }
      return result;
    },
    handleMessage(event, socket) {
      const opcode = new Uint8Array(event.data)[0];
      const message = new Uint8Array(event.data);
      if (opcode === PACKETS.PRE_ENTER_WORLD) {
        this.wasmWorker.postMessage({
          task: "opcode5",
          payload: {
            blended: message,
            hostname: game.network.connectionOptions.ipAddress
          },
          id: socket.socketID
        });
        return;
      }
      if (opcode === PACKETS.WASM_KEEPALIVE) {
        this.wasmWorker.postMessage({
          task: "opcode10",
          payload: message,
          id: socket.socketID
        });
        return;
      }
      this.codecWorker.postMessage({
        task: "decode",
        id: socket.socketID,
        opcode: new Uint8Array(event.data)[0],
        buffer: new Uint8Array(event.data)
      });
    },
    handleClose(event, socket) {
      game.ui.getComponent("PopupOverlay").showHint("Socket closed", event.message);
      this.wasmWorker.postMessage({
        task: "close",
        id: socket.socketID
      });
      const orcaNameToFind = socket.name;
      const index = DeadOrcas_default.findIndex((orca) => orca.name === orcaNameToFind);
      if (index !== -1) {
        DeadOrcas_default[index].altNamed = false;
        console.log(`AltNamed property for ${orcaNameToFind} set to false.`);
      } else {
        console.log("Orca not found, this shouldn't happen!");
      }
      socket.player?.remove?.();
      if (this.socketHandler.sockets.has(socket.socketID)) {
        this.socketHandler.sockets.delete(socket.socketID);
      } else {
        console.log("Socket not found in the sockets map ???");
      }
    },
    handleEnterWorld(decodedMessage, socket) {
      if (!decodedMessage.allowed) {
        socket.close();
        game.ui.getComponent("PopupOverlay").showHint("Socket closed, server is at max capacity");
        return;
      }
      socket.send(socket.enterWorld2);
      socket.myPlayer.uid = decodedMessage.uid;
      socket.inWorld = true;
      game.ui.getComponent("PopupOverlay").showHint(`Socket with id ${socket.socketID} joined`);
      this.sendPacket(socket, 3, {
        up: 1
      });
      this.sendPacket(socket, 9, {
        name: "JoinPartyByShareKey",
        partyShareKey: game.ui.playerPartyShareKey
      });
      socket.send(new Uint8Array([8, 18]));
      this.sendPacket(socket, 9, {
        name: "BuyItem",
        itemName: "PetCARL",
        tier: 1
      });
      this.sendPacket(socket, 9, {
        name: "BuyItem",
        itemName: "PetMiner",
        tier: 1
      });
      socket.send(new Uint8Array([7, 0]));
      socket.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
      socket.mapPointer = document.createElement("div");
      socket.mapPointer.classList.add("hud-map-player");
      socket.mapPointer.style.display = "block";
      socket.mapPointer.dataset.index = "4";
      document.getElementsByClassName("hud-map")[0].appendChild(socket.mapPointer);
    },
    handleEntityUpdate(decodedMessage, socket) {
      for (const uid in decodedMessage.entities[socket.myPlayer.uid]) {
        if (uid !== "uid") {
          socket.myPlayer[uid] = decodedMessage.entities[socket.myPlayer.uid][uid];
          if (socket.myPlayer[uid].petUid?.targetTick) {
            socket.petUid = socket.myPlayer[uid].petUid.targetTick;
          }
        }
      }
      socket.mapPointer.style.left = `${(socket.myPlayer.position.x * 1 / 240).toFixed()}%`;
      socket.mapPointer.style.top = `${(socket.myPlayer.position.y * 1 / 240).toFixed()}%`;
      const entity = game.world.entities[socket.myPlayer.uid];
      if (!entity) return;
      if (this.socketHandler.states.showAltID) {
        entity.targetTick.name = socket.socketID.toString();
      } else {
        entity.targetTick.name = socket.name;
      }
    },
    handleRPC(decodedMessage, socket) {
      const { name } = decodedMessage;
      switch (name) {
        case "Dead":
          this.sendPacket(socket, 3, {
            respawn: 1
          });
          this.sendPacket(socket, 3, {
            mouseUp: 1
          });
          break;
        case "SetItem":
          socket.inventory[decodedMessage.response.itemName] = decodedMessage.response;
          !socket.inventory[decodedMessage.response.itemName].stacks ? delete socket.inventory[decodedMessage.response.itemName] : 0;
          break;
        case "LocalBuilding":
          for (const i in decodedMessage.response) {
            socket.buildings[decodedMessage.response[i].uid] = decodedMessage.response[i];
            socket.buildings[decodedMessage.response[i].uid].dead ? delete socket.buildings[decodedMessage.response[i].uid] : 0;
          }
          break;
        case "PartyShareKey":
          socket.partyShareKey = decodedMessage.response.partyShareKey;
          break;
      }
    },
    sendPacket(socket, opcode, data, all = false) {
      if (all === true) {
        this.socketHandler.sockets.forEach((socket2) => {
          if (!socket2.inWorld) return;
          this.codecWorker.postMessage({
            task: "encode",
            id: socket2.socketID,
            opcode,
            buffer: data
          });
        });
        return;
      }
      if (socket.readyState === 1) {
        this.codecWorker.postMessage({
          task: "encode",
          id: socket.socketID,
          opcode,
          buffer: data
        });
      }
    }
  };
  var SocketComponent_default = SocketComponent;

  // SocketHandler.js
  var SocketHandler = class {
    sockets = /* @__PURE__ */ new Map();
    socketPlugins = /* @__PURE__ */ new Map();
    socketID = 0;
    states = {
      mousePosition: { x: 0, y: 0 },
      locked: false,
      controlled: true,
      showAltID: true
    };
    constructor() {
      SocketComponent_default.init(this);
      game.network.addEntityUpdateHandler(() => this.handleTick());
      document.addEventListener("SocketEvent", (data) => {
        const { action, payload } = data.detail;
        this.sockets.forEach((socket) => {
          let buyTier, equipTier;
          switch (action) {
            case "BuyItem":
              if (payload.itemName === "Pickaxe") return;
              buyTier = socket.inventory[payload.itemName]?.tier ? socket.inventory[payload.itemName].tier + 1 : 1;
              SocketComponent_default.sendPacket(socket, 9, {
                name: "BuyItem",
                itemName: payload.itemName,
                tier: buyTier
              });
              break;
            case "EquipItem":
              if (socket.inventory[payload.itemName] === void 0 || socket.inventory[payload.itemName] === null) return;
              equipTier = socket.inventory[payload.itemName].tier;
              SocketComponent_default.sendPacket(socket, 9, {
                name: "EquipItem",
                itemName: payload.itemName,
                tier: equipTier
              });
              break;
            case "JoinMain":
              SocketComponent_default.sendPacket(socket, 9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
              break;
            case "LeaveParty":
              SocketComponent_default.sendPacket(socket, 9, { name: "LeaveParty" });
              break;
          }
        });
      });
    }
    registerPlugins(plugins) {
      plugins.forEach((plugin) => {
        this.socketPlugins.set(plugin.name, plugin);
      });
    }
    createSocket() {
      const server = game.options.servers[game.options.serverId];
      const socket = new WebSocket(`wss://${server.hostname}:443/`);
      socket.binaryType = "arraybuffer";
      const id = this.socketID++;
      socket.socketID = id;
      this.bindListeners(socket);
      this.sockets.set(id, socket);
    }
    bindListeners(socket) {
      socket.onopen = (event) => SocketComponent_default.handleOpen(event, socket);
      socket.onmessage = (event) => SocketComponent_default.handleMessage(event, socket);
      socket.onclose = (event) => SocketComponent_default.handleClose(event, socket);
    }
    handleTick() {
      if (!this.states.locked) this.states.mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
      this.socketPlugins.forEach((plugin) => {
        if (typeof plugin.update === "function") {
          this.sockets.forEach((socket) => {
            if (!socket.inWorld) return;
            plugin.update(socket);
          });
        }
      });
    }
    getSocketById(socketID) {
      return this.sockets.get(socketID) || null;
    }
    getClosestPlayerToMouse() {
      const { x: mouseX, y: mouseY } = this.states.mousePosition;
      let closestSocket = null;
      let closestDistanceSquared = Number.MAX_VALUE;
      this.sockets.forEach((socket) => {
        if (socket.myPlayer.entityClass === "PlayerEntity") {
          const dx = mouseX - socket.myPlayer.position.x;
          const dy = mouseY - socket.myPlayer.position.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < closestDistanceSquared) {
            closestDistanceSquared = distanceSquared;
            closestSocket = socket;
          }
        }
      });
      return closestSocket;
    }
  };
  var SocketHandler_default = SocketHandler;

  // DirectionMapper.js
  var DirectionMapper = {
    yawActions: {
      90: { right: 1, left: 0, up: 0, down: 0 },
      225: { down: 1, left: 1, up: 0, right: 0 },
      44: { down: 0, left: 0, up: 1, right: 1 },
      314: { down: 0, left: 1, up: 1, right: 0 },
      135: { down: 1, left: 0, up: 0, right: 1 },
      359: { up: 1, down: 0, right: 0, left: 0 },
      180: { down: 1, up: 0, right: 0, left: 0 },
      270: { left: 1, right: 0, up: 0, down: 0 }
    },
    precomputedYaw: {},
    typeToValue: {
      "top": 359,
      "top right": 44,
      "right": 90,
      "bottom right": 135,
      "bottom": 180,
      "bottom left": 225,
      "left": 270,
      "top left": 314
    },
    init() {
      const tolerance = 22.5;
      for (let num = 0; num < 360; num++) {
        let closestAngle = null;
        let minDifference = Infinity;
        for (const angle in this.yawActions) {
          const yawAngle = parseInt(angle);
          const difference = Math.min(
            Math.abs(num - yawAngle),
            Math.abs(num + 360 - yawAngle),
            Math.abs(num - 360 - yawAngle)
          );
          if (difference <= tolerance && difference < minDifference) {
            closestAngle = yawAngle;
            minDifference = difference;
          }
        }
        this.precomputedYaw[num] = closestAngle;
      }
    },
    aimToYaw(num, reverseYaw = false) {
      let matchingMovement = this.precomputedYaw[num];
      if (reverseYaw && matchingMovement !== null) {
        matchingMovement = (matchingMovement + 180) % 360;
      }
      return matchingMovement;
    }
  };
  DirectionMapper.init();
  var DirectionMapper_default = DirectionMapper;

  // SocketPlugins/MouseMove.js
  var MouseMove = {
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
      const yaw = DirectionMapper_default.aimToYaw(aimingYaw);
      if (yaw && Object.hasOwn(DirectionMapper_default.yawActions, yaw) && socket.lastYawSent !== yaw) {
        socket.lastYawSent = yaw;
        this.socketComponent.sendPacket(socket, 3, DirectionMapper_default.yawActions[yaw]);
      }
    }
  };
  var MouseMove_default = MouseMove;

  // CommandParser.js
  var CommandParser = class _CommandParser {
    constructor() {
      this.commands = /* @__PURE__ */ new Map();
      this.prefix = "/";
    }
    parseCommandAndArgs(message) {
      const trimmed = message.slice(this.prefix.length).trim();
      const commandEnd = trimmed.search(/\s/);
      if (commandEnd === -1) {
        return {
          command: trimmed.toLowerCase(),
          argsString: ""
        };
      }
      return {
        command: trimmed.slice(0, commandEnd).toLowerCase(),
        argsString: trimmed.slice(commandEnd + 1)
      };
    }
    parseArgs(argsString) {
      const args = [];
      const options = {};
      let current = "";
      let inQuote = false;
      let currentOption = null;
      for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        if (char === '"') {
          inQuote = !inQuote;
          if (!inQuote) this.finalizeCurrentToken(current, currentOption, args, options);
          current = "";
          continue;
        }
        if (!inQuote) {
          if (char === "-" && argsString[i + 1] === "-") {
            this.finalizeCurrentToken(current, currentOption, args, options);
            currentOption = "";
            current = "";
            i++;
            continue;
          }
          if (char === " ") {
            this.finalizeCurrentToken(current, currentOption, args, options);
            current = "";
            continue;
          }
        }
        current += char;
      }
      this.finalizeCurrentToken(current, currentOption, args, options);
      return { args, options };
    }
    registerCommand(name, {
      description = "",
      usage = "",
      execute,
      minArgs = 0,
      maxArgs = Infinity
    }) {
      this.commands.set(name.toLowerCase(), {
        name,
        description,
        usage,
        execute,
        minArgs,
        maxArgs
      });
    }
    // Handle command execution
    async handleCommand(message) {
      if (!message.startsWith(this.prefix)) {
        return false;
      }
      const { command: commandName, argsString } = this.parseCommandAndArgs(message);
      const command = this.commands.get(commandName);
      if (!command) {
        throw new Error(`Unknown command: ${commandName}`);
      }
      const { args, options } = this.parseArgs(argsString);
      if (args.length < command.minArgs || args.length > command.maxArgs) {
        throw new Error(
          `Invalid number of arguments. Usage: ${command.usage}`
        );
      }
      try {
        await command.execute({ args, options });
        return true;
      } catch (error) {
        throw new Error(`Error executing command ${commandName}: ${error.message}`);
      }
    }
    getCommandHelp(commandName) {
      const command = this.commands.get(commandName.toLowerCase());
      if (!command) {
        return null;
      }
      return {
        name: command.name,
        description: command.description,
        usage: command.usage
      };
    }
    listCommands() {
      return Array.from(this.commands.values()).map((cmd) => ({
        name: cmd.name,
        description: cmd.description,
        usage: cmd.usage
      }));
    }
    // ===== Utility Methods =====
    static addToken(token, currentOption, args, options) {
      if (currentOption) {
        options[currentOption] = token || true;
      } else if (token) {
        args.push(token);
      }
    }
    static finalizeCurrentToken(current, currentOption, args, options) {
      _CommandParser.addToken(current, currentOption, args, options);
    }
  };
  var CommandParser_default = CommandParser;

  // PopupManager.js
  var PopupManager = class {
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
      if (typeof message === "string") {
        popup.textContent = message;
      } else if (message instanceof Array) {
        popup.innerHTML = message.join("<br>");
      } else {
        popup.textContent = String(message);
      }
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
        const duration = options.duration || 3e3;
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
  };
  var PopupManager_default = PopupManager;

  // AutoBuild.js
  var AutoBuild = class {
    constructor() {
      this.buildingSchemaObj = { "Wall": 0, "Door": 1, "SlowTrap": 2, "ArrowTower": 3, "CannonTower": 4, "MeleeTower": 5, "BombTower": 6, "MagicTower": 7, "GoldMine": 8, "Harvester": 9, "GoldStash": 10 };
      this.buildingSchemaArr = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester", "GoldStash"];
      this.confirmedBase = null;
    }
    getBaseCode() {
      const buildingsArr = Object.values(game.ui.buildings);
      const stash = buildingsArr.shift();
      const arr = [stash.x / 48 + stash.y / 48 * 500];
      buildingsArr.forEach((e) => arr.push(this.encodeBuilding((e.x - stash.x) / 48, (e.y - stash.y) / 48, e.tier, 0 / 90, this.buildingSchemaObj[e.type])));
      return JSON.stringify(arr);
    }
    buildBase(baseCode) {
      const arr = JSON.parse(baseCode);
      let stash = Object.values(game.ui.buildings)[0];
      if (!stash) {
        stash = { x: Math.floor(arr[0] % 500) * 48, y: Math.floor(arr[0] / 500) * 48 };
        game.network.sendRpc({ name: "MakeBuilding", x: stash.x, y: stash.y, type: "GoldStash", yaw: 0 });
      }
      for (let i = 1; i < arr.length; i++) {
        const index = arr[i];
        const e = this.decodeBuilding(index);
        game.network.sendRpc({ name: "MakeBuilding", x: stash.x + e[0] * 48, y: stash.y + e[1] * 48, type: this.buildingSchemaArr[e[4]], yaw: e[3] * 90 });
      }
    }
    encodeBuilding(x, y, tier, yaw, key) {
      if (key <= 2) return yaw * 10 ** 6 + (y + 18.5) * 10 ** 4 + (x + 18.5) * 10 ** 2 + tier * 10 + key;
      if (key == 9) return yaw * 10 ** 8 + (y + 492) * 10 ** 5 + (x + 492) * 10 ** 2 + tier * 10 + key;
      return yaw * 10 ** 6 + (y + 18) * 10 ** 4 + (x + 18) * 10 ** 2 + tier * 10 + key;
    }
    decodeBuilding(num) {
      if (num % 10 <= 2) return [Math.round(Math.floor(num / 10 ** 2) % 100) - 18.5, Math.round(Math.floor(num / 10 ** 4) % 100) - 18.5, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 6), num % 10];
      if (num % 10 == 9) return [Math.round(Math.floor(num / 10 ** 2) % 1e3) - 492, Math.round(Math.floor(num / 10 ** 5) % 1e3) - 492, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 8), num % 10];
      return [Math.round(Math.floor(num / 10 ** 2) % 100) - 18, Math.round(Math.floor(num / 10 ** 4) % 100) - 18, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 6), num % 10];
    }
  };
  var AutoBuild_default = AutoBuild;

  // ../scanner.js
  var Scanner = class {
    constructor(sid) {
      this.name = "God's Eye - " + Math.random().toString().substring(2, 6);
      this.serverId = sid || game.options.serverId;
      this.server = game.options.servers[this.serverId];
      this.ws = new WebSocket(`wss://${this.server.hostname}:443/`);
      this.ws.binaryType = "arraybuffer";
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = () => this.handleClose();
      this.codec = new game.networkType().codec;
      this.Module = WasmModule_default();
      this.counter = 0;
      this.discordWebhookUrl = "https://discord.com/api/webhooks/1308118715778469970/aHpuryQQ0xRp0iHS0EYZWaERb2hBHndBqqgZJXUH01Cs93sez3wRvKQiHR7ROsR0eQiy";
    }
    sendPacket(event, data) {
      this.ws.readyState == 1 && this.ws.send(this.codec.encode(event, data));
    }
    onMessage(msg) {
      const opcode = new Uint8Array(msg.data)[0];
      if (opcode == 5) {
        this.Module.onDecodeOpcode5(new Uint8Array(msg.data), this.server.ipAddress, (e) => {
          this.sendPacket(4, { displayName: this.name, extra: e[5] });
          this.enterworld2 = e[6];
        });
        return;
      }
      if (opcode == 10) {
        this.ws.send(this.Module.finalizeOpcode10(new Uint8Array(msg.data)));
        return;
      }
      const data = this.codec.decode(msg.data);
      switch (opcode) {
        case 4:
          this.onEnterWorldHandler(data);
          break;
        case 9:
          this.handleRpc(data);
          break;
      }
    }
    onEnterWorldHandler(data) {
      if (!data.allowed) {
        this.sendPayloadToDiscord({
          content: `Attempted to scan server ${this.serverId}. Server is full`,
          username: this.name
        });
        return;
      }
      this.uid = data.uid;
      this.enterworld2 && this.ws.send(this.enterworld2);
      for (let i = 0; i < 26; i++) this.ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
      this.ws.send(new Uint8Array([7, 0]));
      this.ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
      console.log("bot in game");
    }
    handleRpc(data) {
      if (data.name == "Leaderboard") {
        this.counter++;
        if (this.counter !== 2) {
          return;
        }
        const currentDate = (/* @__PURE__ */ new Date()).toLocaleString();
        const payload = this.constructPayload(data.response, currentDate);
        this.sendPayloadToDiscord(payload);
        this.ws.close();
      }
    }
    constructPayload(responseData, currentDate) {
      const responseList = this.generateResponseList(responseData);
      return {
        content: `**Leaderboard response**
Date: ${currentDate}
Server ID: ${this.serverId}
Response:
${responseList}`,
        username: this.name
      };
    }
    generateResponseList(responseData) {
      return responseData.map((item) => `- Name: ${item.name}, UID: ${item.uid}, Score: ${item.score}, Wave: ${item.wave}
`).join("");
    }
    sendPayloadToDiscord(payload) {
      fetch(this.discordWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message to Discord webhook");
        }
        console.log("Message sent to Discord webhook");
      }).catch((error) => {
        console.error("Error sending message to Discord webhook:", error);
      });
    }
    handleClose() {
      console.log("closed");
    }
  };
  var scanner_default = Scanner;

  // Kotsumet.js
  var autoBuild = new AutoBuild_default();
  globalThis.Scanner = scanner_default;
  var socketHandler = new SocketHandler_default();
  socketHandler.registerPlugins([MouseMove_default]);
  MouseMove_default.init(SocketComponent_default);
  globalThis.socketHandler = socketHandler;
  function createEvent(type, data) {
    document.dispatchEvent(new CustomEvent(type, data));
  }
  var commandParser = new CommandParser_default();
  var popupManager = new PopupManager_default();
  var originalSendRpc = game.network.sendRpc;
  game.network.sendRpc = async function() {
    const args = Array.from(arguments);
    const rpcName = args[0].name;
    if (rpcName == "BuyItem" && args[0].itemName) {
      createEvent("SocketEvent", {
        detail: {
          action: "BuyItem",
          payload: {
            itemName: args[0].itemName
          }
        }
      });
    }
    if (rpcName == "EquipItem" && args[0].itemName) {
      createEvent("SocketEvent", {
        detail: {
          action: "EquipItem",
          payload: {
            itemName: args[0].itemName
          }
        }
      });
    }
    if (rpcName === "SendChatMessage") {
      try {
        const handled = await commandParser.handleCommand(args[0].message);
        if (handled) {
          return;
        }
      } catch (error) {
        popupManager.show(`Command error: ${error.message}`);
        return;
      }
    }
    return originalSendRpc.apply(this, args);
  };
  commandParser.registerCommand("test", {
    description: "A test command",
    usage: "/test [message] [--color red|blue|green]",
    minArgs: 0,
    maxArgs: 1,
    execute: ({ args, options }) => {
      const message = args[0] || "test!";
      const color = options.color || "white";
      popupManager.show(message, { color });
    }
  });
  var originalSendInput = game.network.sendInput;
  game.network.sendInput = function(...args) {
    const result = originalSendInput.apply(this, args);
    if (!socketHandler.states.controlled) return;
    const [inputData] = args;
    if (Object.hasOwn(inputData, "space")) {
      SocketComponent_default.sendPacket(null, 3, {
        space: inputData.space
      }, true);
    }
    if (Object.hasOwn(inputData, "mouseDown")) {
      SocketComponent_default.sendPacket(null, 3, {
        mouseDown: inputData.mouseDown
      }, true);
    } else if (Object.hasOwn(inputData, "mouseUp")) {
      SocketComponent_default.sendPacket(null, 3, {
        mouseUp: inputData.mouseUp
      }, true);
    }
    return result;
  };
  document.addEventListener("keydown", (event) => {
    let socket, message, base;
    switch (event.key) {
      case "l":
        socketHandler.createSocket();
        break;
      case ".":
        socket = socketHandler.getClosestPlayerToMouse();
        SocketComponent_default.sendPacket(socket, 9, {
          name: "BuyItem",
          itemName: "HealthPotion",
          tier: 1
        });
        SocketComponent_default.sendPacket(socket, 9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
        SocketComponent_default.sendPacket(socket, 3, {
          mouseDown: 1
        });
        break;
      case "u":
        socketHandler.states.locked = !socketHandler.states.locked;
        message = socketHandler.states.locked ? "Alt's are now: Locked" : "Alt's are now: Unlocked";
        popupManager.show(message);
        break;
      case "j":
        createEvent("SocketEvent", {
          detail: {
            action: "JoinMain"
          }
        });
        break;
      case "h":
        createEvent("SocketEvent", {
          detail: {
            action: "LeaveParty"
          }
        });
        break;
      case "i":
        game.network.sendRpc({
          name: "LeaveParty"
        });
        break;
      case "[":
        socketHandler.sockets.forEach((socket2) => {
          if (Object.values(socket2.buildings).length == 0) {
            game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: socket2.partyShareKey });
          }
        });
        break;
      case "]":
        base = "[0,171214,191214,172414,192414,212511,222511,232511,242511,252511,252411,252311,252211,252111,251611,251511,251411,251311,251211,241211,231211,221211,211211,161211,151211,141211,131211,121211,121311,121411,121511,121611,122111,122211,122311,122411,122511,132511,142511,152511,162511,131313,151313,132313,132113,212313,232313,231513,231313,171416,191416,172216,192216,121914,121714,141916,141716,241914,241714,221916,221716,211518,211318,131518,151518,152118,152318,212118,232118]";
        autoBuild.buildBase(base);
        break;
      case "c":
        socketHandler.states.controlled = !socketHandler.states.controlled;
        message = socketHandler.states.controlled ? "Sockets are now: Controlled" : "Sockets are now: Not Controlled";
        popupManager.show(message);
        break;
      case "/":
        game.ui.components.Chat.startTyping();
        break;
      case "m":
        if (!socketHandler.states.controlled) return;
        socketHandler.sockets.forEach((socket2) => {
          SocketComponent_default.sendPacket(socket2, 9, { name: "BuyItem", itemName: "PetMiner", tier: 1 });
          SocketComponent_default.sendPacket(socket2, 9, { name: "EquipItem", itemName: "PetMiner", tier: 1 });
        });
        break;
      case "n":
        if (!socketHandler.states.controlled) return;
        socketHandler.sockets.forEach((socket2) => {
          SocketComponent_default.sendPacket(socket2, 9, { name: "BuyItem", itemName: "PetRevive", tier: 1 });
          SocketComponent_default.sendPacket(socket2, 9, { name: "EquipItem", itemName: "PetRevive", tier: 1 });
        });
        break;
      case "g":
        if (!socketHandler.states.controlled) return;
        socketHandler.sockets.forEach((socket2) => {
          console.log(socket2.myPlayer.petUid);
          SocketComponent_default.sendPacket(socket2, 9, { name: "DeleteBuilding", uid: socket2.myPlayer.petUid });
        });
        break;
      case "y":
        socketHandler.states.showAltID = !socketHandler.states.showAltID;
        message = socketHandler.states.showAltID ? "Socket IDs are now: Shown" : "Socket IDs are now: Hidden";
        popupManager.show(message);
        break;
    }
  });
})();
