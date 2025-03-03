import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { io } from 'socket.io-client';
import { createInterface } from './ui.js';
import { parseEmojis } from './emojis.js';

const program = new Command();

console.log(gradient.pastel.multiline(figlet.textSync('Limbo', { font: 'Standard', horizontalLayout: 'full' })))

program
  .version('1.0.0')
  .description('A terminal-based WebSocket chat client')
  .option('-s, --server <url>', 'WebSocket server URL', 'http://localhost:3001')
  .option('-u, --username <name>', 'Your username')
  .action(async (options) => {
    if (!options.username) {
      console.log(chalk.yellow('Please provide a username with --username or -u option'));
      process.exit(1);
    }

    try {
      const socket = io(options.server);
      console.log(chalk.green(`Connecting to ${options.server}...`));

      const connectionTimeout = setTimeout(() => {
        console.log(chalk.red('Connection timeout. Server not responding.'));
        process.exit(1);
      }, 10000);

      socket.on('connect', () => {
        clearTimeout(connectionTimeout);
        console.log(chalk.green('Connected to the server!'));
        console.log(chalk.blue(`Logging in as: ${options.username}`));

        const { screen, messageList, inputBar, statusBar } = createInterface();

        statusBar.setContent(`{bold}Status:{/bold} Connecting... | {bold}Server:{/bold} ${options.server}`);
        screen.render();

        socket.emit('send-message', {
          username: options.username,
          content: `Hello, I'm ${options.username}!`,
          timestamp: new Date().toISOString()
        });

        const ensureFocus = () => {
          inputBar.focus();
          screen.render();
        };

        setTimeout(ensureFocus, 100);

        statusBar.setContent(`{bold}Connected as:{/bold} ${options.username} | {bold}Server:{/bold} ${options.server} | [PageUp/Down]: Scroll | Try typing :) or :fire:`);
        screen.render();

        socket.on('receive-message', (message) => {
          const isOwnMessage = message.username === options.username;
          const isSystem = message.username === 'System';

          const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          const parsedContent = parseEmojis(message.content);

          let formattedMessage;
          if (isSystem) {
            formattedMessage = `{yellow-fg}${parsedContent}{/yellow-fg}`;

            if (parsedContent.includes('already in use')) {
              statusBar.setContent(`{red-fg}{bold}Error:{/bold} Username already in use{/red-fg} | Press Ctrl+C to exit`);
              screen.render();
            }
          } else if (isOwnMessage) {
            formattedMessage = `{right}{bold}You{/bold} (${formattedTime}):{/right}\n{right}${parsedContent}{/right}`;
          } else {
            formattedMessage = `{bold}${message.username}{/bold} (${formattedTime}):\n${parsedContent}`;
          }

          messageList.pushLine(formattedMessage);
          messageList.setScrollPerc(100);

          screen.render();
          ensureFocus();
        });

        inputBar.key('enter', () => {
          const text = inputBar.getValue();
          if (text.trim()) {
            const message = {
              username: options.username,
              content: text,
              timestamp: new Date().toISOString()
            };

            socket.emit('send-message', message);

            inputBar.setValue('');
            screen.render();
            ensureFocus();
          }
        });

        screen.key('pageup', () => {
          messageList.scroll(-messageList.height);
          screen.render();
          ensureFocus();
        });

        screen.key('pagedown', () => {
          messageList.scroll(messageList.height);
          screen.render();
          ensureFocus();
        });

        screen.key('end', () => {
          messageList.setScrollPerc(100);
          screen.render();
          ensureFocus();
        });

        screen.key(['tab', 'escape'], () => {
          ensureFocus();
        });

        socket.on('disconnect', () => {
          statusBar.setContent('{red-fg}{bold}Disconnected from server{/bold}{/red-fg}');
          screen.render();
        });

        screen.key(['C-c'], () => {
          socket.disconnect();
          setTimeout(() => {
            console.log(chalk.yellow('Disconnected from chat server'));
            process.exit(0);
          }, 500);
        });
      });

      socket.on('connect_error', (error) => {
        clearTimeout(connectionTimeout);
        console.error(chalk.red(`Failed to connect to the server: ${error.message}`));
        console.log(chalk.yellow('Make sure the WebSocket server is running at ' + options.server));
        process.exit(1);
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);