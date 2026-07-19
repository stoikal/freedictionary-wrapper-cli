const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const interval = 80;

export async function withSpinner<T>(msg: string, fn: () => Promise<T>): Promise<T> {
  if (!process.stdout.isTTY) return fn();

  let i = 0;
  const id = setInterval(() => {
    process.stdout.write(`\r${frames[i % frames.length]} ${msg}`);
    i++;
  }, interval);

  try {
    return await fn();
  } finally {
    clearInterval(id);
    process.stdout.write(`\r${" ".repeat(msg.length + 2)}\r`);
  }
}
