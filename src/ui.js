import blessed from 'neo-blessed';

export function createInterface() {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'Limbo',
    dockBorders: true,
    fullUnicode: true,
    useBCE: true,
    sendFocus: true
  });

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
    mouse: true
  });

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

  screen.append(messageList);
  screen.append(inputBar);
  screen.append(statusBar);
  screen.render();

  return {
    screen,
    messageList,
    inputBar,
    statusBar
  };
}