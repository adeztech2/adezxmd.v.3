// menu.js - kept for compatibility; delegates to the full table menu in help.js
const helpCommand = require('./help');
async function menuCommand(sock, chatId, message) {
    return helpCommand(sock, chatId, message);
}
module.exports = menuCommand;
