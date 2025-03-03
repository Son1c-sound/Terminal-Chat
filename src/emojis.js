// emoji-support.js
// A simple module that handles emoji conversion in the Limbo chat client

// Basic emoji mappings
const emojiMap = {
    // Smileys
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
    
    // Hearts
    '<3': '❤️',
    '</3': '💔',
    
    // Hand gestures
    ':clap:': '👏',
    ':+1:': '👍',
    ':-1:': '👎',
    ':wave:': '👋',
    
    // Objects
    ':fire:': '🔥',
    ':star:': '⭐',
    ':sparkles:': '✨',
    ':check:': '✅',
    ':x:': '❌',
    
    // Common emojis
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
  
  // Parse message text and replace emoji codes with actual emojis
  export function parseEmojis(text) {
    if (!text) return text;
    
    let parsedText = text;
    
    // Replace all emoji codes with actual emojis
    for (const [code, emoji] of Object.entries(emojiMap)) {
      parsedText = parsedText.replace(new RegExp(escapeRegExp(code), 'g'), emoji);
    }
    
    return parsedText;
  }
  
  // Helper function to escape special regex characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  export default {
    parseEmojis
  };