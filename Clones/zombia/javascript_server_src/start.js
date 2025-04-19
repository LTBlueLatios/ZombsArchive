const { spawn, exec } = require("child_process");
const path = require("path");
const customFlags = process.argv.slice(2);
const serverPath = path.join(__dirname, "server.js");

let gameServers = [{
      mode: "standard",
      port: 8000
  },
  {
      mode: "scarcity",
      port: 8001
  },
];

for (const server of gameServers) {
  const nodeArgs = [
      "--expose-gc",
      "--max-old-space-size=512",
      serverPath,
      `--game-mode=${server.mode}`,
      `--port=${server.port}`,
      ...customFlags
  ];
  const spawnNode = () => {
      const child = spawn(process.execPath, nodeArgs, {
          stdio: "inherit"
      });
      child.on("close", (code) => {
          console.log(`Child process exited with code ${code}`);
          spawnNode();
      });
      child.on("error", (err) => {
          console.error("Failed to start child process:", err);
      });
  }
  spawnNode();
}