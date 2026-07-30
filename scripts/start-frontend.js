const { spawn } = require('child_process');
const net = require('net');

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (err) => {
      // Windows can reserve a port and report EACCES instead of EADDRINUSE.
      // In either case, try the next port rather than aborting startup.
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    server.listen(startPort, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function main() {
  const port = await findAvailablePort(3001);
  const child = spawn('npm', ['--prefix', 'frontend', 'start'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
    shell: true,
  });

  child.on('exit', (code) => process.exit(code || 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
