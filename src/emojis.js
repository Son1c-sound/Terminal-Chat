const emojiMap = {
    ':)': '😊',
    ':-)': '😊',
    ':D': '😄',
    ':-D': '😄',
    ':(': '😞',
    ':-(': '😞',
    ';)': '😉',
    ';-)': '😉',
    ':P': '😛',
    ':-P': '😛',
    ':O': '😮',
    ':-O': '😮',
    ':o': '😮',
    ':-o': '😮',
    
    '<3': '❤️',
    '</3': '💔',
    
    ':clap:': '👏',
    ':+1:': '👍',
    ':-1:': '👎',
    ':wave:': '👋',
    
    ':fire:': '🔥',
    ':star:': '⭐',
    ':sparkles:': '✨',
    ':check:': '✅',
    ':x:': '❌',
    
    ':100:': '💯',
    ':lol:': '🤣',
    ':heart:': '❤️',
    ':smile:': '😊',
    ':laugh:': '😂',
    ':sad:': '😢',
    ':angry:': '😠',
    ':thumbsup:': '👍',
    ':thumbsdown:': '👎',
    ':ok:': '👌',
    ':thinking:': '🤔',
    ':party:': '🎉',
    ':eyes:': '👀',
    ':rocket:': '🚀',
    ':sun:': '☀️',
    ':moon:': '🌙',
    ':cloud:': '☁️',
    ':rain:': '🌧️',
    ':snow:': '❄️',
    ':zap:': '⚡',
  };
  
  export function parseEmojis(text) {
    if (!text) return text;
    
    let parsedText = text;
    
    for (const [code, emoji] of Object.entries(emojiMap)) {
      parsedText = parsedText.replace(new RegExp(escapeRegExp(code), 'g'), emoji);
    }
    
    return parsedText;
  }
  
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  export default {
    parseEmojis
  };