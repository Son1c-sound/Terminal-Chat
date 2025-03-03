import blessed from 'neo-blessed';

export function createInterface() {
  // Create a screen object
  const screen = blessed.screen({
    smartCSR: true,
    title: 'Limbo',
    dockBorders: true,
    fullUnicode: true,
    // Add these for better focus handling
    useBCE: true,
    sendFocus: true
  });

  // Create a message list box
  const messageList = blessed.box({
    top: 0,
    left: 0,
    height: '90%-2',
    width: '100%',
    border: {
      type: 'line'
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'gray'
      },
      style: {
        inverse: true
      }
    },
    style: {
      border: {
        fg: 'blue'
      },
    },
    tags: true,
    content: '{center}{bold}Welcome to Limbo!{/bold}{/center}\n{center}Start typing to send a message{/center}',
    // Add mouse support for scrolling
    mouse: true
  });

  // Create an input bar
  const inputBar = blessed.textbox({
    bottom: 1,
    left: 0,
    height: 3,
    width: '100%',
    border: {
      type: 'line'
    },
    inputOnFocus: true,
    style: {
      border: {
        fg: 'blue'
      },
      focus: {
        border: {
          fg: 'green'
        }
      }
    },
    // Improve input handling reliability
    clickable: true,
    keyable: true,
    keys: true,
    cursor: {
      artificial: true,
      shape: 'line',
      blink: true,
      color: 'white'
    }
  });

  // Create a status bar
  const statusBar = blessed.box({
    bottom: 0,
    left: 0,
    height: 1,
    width: '100%',
    content: 'Connecting...',
    style: {
      fg: 'yellow',
      bg: 'blue'
    },
    tags: true
  });

  // Append our boxes to the screen
  screen.append(messageList);
  screen.append(inputBar);
  screen.append(statusBar);

  // Render the screen
  screen.render();

  return {
    screen,
    messageList,
    inputBar,
    statusBar
  };
}