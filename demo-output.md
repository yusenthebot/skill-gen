---
name: ora
description: >
  Elegant terminal spinners for Node.js. Use when: showing progress for async
  operations, long-running CLI tasks, or any time you need to indicate work is
  happening. NOT for: progress bars with percentages (use cli-progress), logging
  structured output, or non-TTY environments.
---

# ora

Elegant terminal spinners for Node.js. Makes async CLI operations feel polished and professional.

## Installation

```bash
npm install ora
```

## Core API

```js
import ora from 'ora';

// Basic usage
const spinner = ora('Fetching data...').start();
await doWork();
spinner.succeed('Done!');

// All stop states
spinner.succeed('Task completed');   // ✔ green
spinner.fail('Something broke');     // ✖ red
spinner.warn('Watch out');           // ⚠ yellow
spinner.info('FYI');                 // ℹ blue
spinner.stop();                      // stops silently

// Update text while running
spinner.text = 'Still working...';
spinner.color = 'yellow';
```

## Common Patterns

```js
// Promise helper
const result = await oraPromise(fetchData(), 'Loading...');

// Custom spinner style
const spinner = ora({
  text: 'Processing',
  spinner: 'dots2',       // see spinners.dev for all options
  color: 'cyan',
  prefixText: '[AI]'
});

// Persist final message
spinner.stopAndPersist({
  symbol: '🚀',
  text: 'Deployed!'
});

// Indent (useful in sub-tasks)
ora({ text: 'Sub-task', indent: 2 }).start();
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | string | — | Spinner label |
| `spinner` | string/object | `'dots'` | Spinner style (see spinners.dev) |
| `color` | string | `'cyan'` | Spinner color |
| `prefixText` | string | — | Text before spinner |
| `indent` | number | `0` | Indent level |
| `isEnabled` | boolean | auto | Force on/off |
| `isSilent` | boolean | `false` | Suppress all output |

## Tips & Gotchas

- **Non-TTY environments**: Spinner disables itself automatically in CI/pipes — no workaround needed
- **Multiple spinners**: Use separate instances; they render independently
- **Streams**: Outputs to `process.stderr` by default — won't pollute piped stdout
- **Log during spinner**: Use `spinner.clear()` + console + `spinner.render()` or just use `spinner.text`
- **Testing**: Set `isSilent: true` in tests to suppress output
