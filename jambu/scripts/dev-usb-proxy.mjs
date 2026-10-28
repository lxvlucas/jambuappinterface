// Expo --localhost may listen on IPv6 only on Windows. ADB reverse uses IPv4.
// Keep this bridge on loopback; it does not expose Metro to the local network.
import net from 'node:net';
for (const port of [8095, 8096]) {
const server = net.createServer(client => {
  const upstream = net.connect(8095, '::1');
  client.pipe(upstream).pipe(client);
  client.on('error', () => upstream.destroy());
  upstream.on('error', () => client.destroy());
  client.on('close', () => upstream.destroy());
});
server.listen(port, '127.0.0.1', () => process.stdout.write(`USB bridge: 127.0.0.1:${port} → [::1]:8095\n`));
}
