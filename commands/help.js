/**
 * help.js - ADEZ-XMD.v.3
 * .menu / .help / .list  ->  full command table (all commands, one message)
 */
const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { getPrefix } = require('./setprefix');
const { getBotName, getMenuImage, getTimezone } = require('../lib/botConfig');
const { createFakeContact } = require('../lib/fakeContact');

const GROUP_LINK = 'https://chat.whatsapp.com/CQKxbaUHijZ2JcPVpuGbqL?s=cl&p=a&iam=2';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029Vb8N0xYLikgHxdGh790m';
const DEFAULT_BANNER = path.join(__dirname, '..', 'assets', 'adez-xmd-menu.jpg');

// ─────────────────────────────────────────────
// Every command the bot answers to, by category
// ─────────────────────────────────────────────
const COMMAND_CATEGORIES = {
    'GENERAL 🎯': [
        'alive', 'ping', 'runtime', 'uptime', 'time', 'date', 'datetime', 'botinfo',
        'owner', 'repo', 'script', 'sc', 'help', 'menu', 'list', 'jid', 'chanelid',
        'chjid', 'getcmd', 'getpp', 'fetch', 'inspect'
    ],
    'GROUP 👥': [
        'add', 'admin', 'approve', 'ban', 'unban', 'demote', 'promote', 'kick', 'killall',
        'removeall', 'mute', 'unmute', 'open', 'close', 'link', 'resetlink', 'revoke',
        'welcome', 'goodbye', 'warn', 'warnings', 'groupinfo', 'infogroup', 'infogrupo',
        'listadmin', 'listonline', 'topmembers', 'lastseen', 'leave', 'join', 'creategroup',
        'tagall', 'tag', 'hidetag', 'tagnotadmin', 'mention', 'setmention', 'setgname',
        'setgroupname', 'setgdesc', 'setgroupdesc', 'setgpp', 'setgrouppp', 'getgcname',
        'getgcprofile', 'getgcdescription', 'getgcdesc', 'drop', 'staff', 'pair'
    ],
    'PROTECTION 🛡️': [
        'antilink', 'antibadword', 'antitag', 'antisticker', 'antiimage', 'antimention',
        'antigcmention', 'antigroupmention', 'antipromote', 'antidemote', 'antistatus',
        'antistatusgroup', 'antistatusmention', 'antidelete', 'antiedit', 'antibot',
        'anticall', 'nocall', 'pmblocker'
    ],
    'OWNER 🔐': [
        'mode', 'settings', 'getsettings', 'setprefix', 'setowner', 'setbotname', 'setmenu',
        'menuset', 'menuconfig', 'menuimage', 'configimage', 'setpp', 'setbio', 'setstatus',
        'setfont', 'setdispmessage', 'disp', 'settimezone', 'settz', 'timezone', 'sudo',
        'block', 'unblock', 'unblockall', 'allblocklist', 'listblock', 'autostatus',
        'autoread', 'autotyping', 'autorecording', 'autorecord', 'autoboth', 'autoreact',
        'areact', 'autoreaction', 'autofont', 'alwaysonline', 'online', 'readreciepts',
        'chatbot', 'clear', 'clearsession', 'cleartmp', 'cleartemp', 'paircode', 'update',
        'restart', 'save', 'send', 'retrive'
    ],
    'AI 🤖': [
        'ai', 'gpt', 'gptedit', 'gemini', 'deepseek', 'grok', 'copilot', 'blackbox',
        'blackai', 'bird', 'birdai', 'ilama', 'illama', 'meta', 'metai', 'mistral',
        'perplexity', 'plexity', 'wormgpt', 'speechwrite', 'speech', 'analyse', 'vision',
        'imagine', 'dalle', 'flux', 'sora', 'magicstudio', 'remini'
    ],
    'DOWNLOADER 📥': [
        'play', 'song', 'mp3', 'video', 'ytplay', 'ytv', 'ytaudio', 'ytvideo', 'docytplay',
        'docytvideo', 'ytdocplay', 'ytdocvideo', 'spotify', 'instagram', 'insta', 'ig', 'igs',
        'facebook', 'fb', 'tiktok', 'tt', 'xvideo', 'xvdl', 'mediafire', 'mf', 'apk',
        'gitclone', 'git', 'github', 'clone', 'terabox', 'pinterest', 'stream', 'lyrics',
        'whatsong', 'shazam'
    ],
    'SEARCH & TOOLS 🛠️': [
        'yts', 'ytsearch', 'img', 'image', 'movie', 'mvie', 'siries', 'news', 'weather',
        'ss', 'ssweb', 'screenshot', 'translate', 'trt', 'transcribe', 'tts', 'locate',
        'location', 'url', 'tourl', 'vcf', 'vcard', 'vv', 'vv2', 'enc', 'find', 'trim',
        'trimed', 'ytcomment', 'tweet', 'say'
    ],
    'STICKER & MEDIA 🎨': [
        'sticker', 's', 'simage', 'stickercrop', 'crop', 'tgsticker', 'take', 'attp',
        'emojimix', 'emix', 'meme', 'smeme', 'wmeme', 'blur', 'circle', 'removebg', 'nobg',
        'toimage', 'toaudio', 'tomp3', 'totext', 'tosgroup', 'tostatus', 'savestatus',
        'togroupstatus', 'setgstatus', 'status'
    ],
    'TEXT & IMAGE EFFECTS ✨': [
        'metallic', 'ice', 'snow', 'impressive', 'matrix', 'light', 'neon', 'devil', 'purple',
        'thunder', 'arena', 'hacker', 'sand', 'glitch', 'fire', 'blackpink', 'glass', 'jail',
        'passed', 'triggered', 'comrade', 'gay', 'lgbt', 'lolice', 'heart', 'horny', 'wasted',
        'simpcard', 'namecard', 'misc', 'fancy', 'mist', 'stupid', 'itssostupid', 'iss'
    ],
    'GAMES 🎮': [
        'tictactoe', 'ttt', 'move', 'connect4', 'hangman', 'guess', 'trivia', 'answer',
        'scramble', 'endscramble', 'truth', 'dare', '8ball', 'cf', 'bet', 'forfeit',
        'surrender', 'reset', 'start'
    ],
    'FUN & SOCIAL 🎉': [
        'compliment', 'insult', 'flirt', 'shayari', 'goodnight', 'gn', 'roseday', 'lovenight',
        'character', 'rate', 'ship', 'simp', 'joke', 'quote', 'animequote', 'fact', 'oogway',
        'oogway2', 'pies', 'devil'
    ],
    'ANIME 🌸': [
        'neko', 'waifu', 'husbando', 'kitsune', 'loli', 'anime', 'animu', 'nom', 'nome',
        'poke', 'cry', 'kiss', 'pat', 'hug', 'cuddle', 'wink', 'wave', 'smile', 'blush',
        'bite', 'slap', 'dance', 'pout', 'sleep', 'facepalm'
    ],
    'SPORTS ⚽': [
        'sports', 'livescore', 'epl', 'laliga', 'laligastandings', 'seriea', 'bundesliga',
        'league1standings', 'ucl', 'euros', 'fifa', 'maches', 'player', 'team', 'venue',
        'gameevents', 'footballnews', 'fnews', 'bettips'
    ]
};

// De-duplicate across categories (first category wins), keep order
(function dedupe() {
    const seen = new Set();
    for (const cat of Object.keys(COMMAND_CATEGORIES)) {
        COMMAND_CATEGORIES[cat] = COMMAND_CATEGORIES[cat].filter(c => {
            if (seen.has(c)) return false;
            seen.add(c);
            return true;
        });
    }
})();

const totalCommands = () =>
    Object.values(COMMAND_CATEGORIES).reduce((n, list) => n + list.length, 0);

function readMode() {
    const tryFiles = ['../data/botMode.json', '../data/messageCount.json'];
    for (const f of tryFiles) {
        try {
            const raw = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
            const m = raw && (raw.mode || (raw.isPublic === false ? 'private' : raw.isPublic ? 'public' : ''));
            if (m) return String(m).charAt(0).toUpperCase() + String(m).slice(1).toLowerCase();
        } catch (_) {}
    }
    return settings.commandMode
        ? settings.commandMode.charAt(0).toUpperCase() + settings.commandMode.slice(1)
        : 'Public';
}

function currentTime() {
    try {
        return new Date().toLocaleTimeString('en-US', {
            timeZone: getTimezone() || settings.timezone || 'Africa/Nairobi',
            hour: '2-digit', minute: '2-digit'
        });
    } catch (_) {
        return new Date().toLocaleTimeString();
    }
}

// Builds the full table-style menu
function generateMenu(userJid) {
    const prefix = getPrefix() || '.';
    const botName = getBotName() || settings.botName;
    const mentionTag = userJid ? `@${String(userJid).split('@')[0].split(':')[0]}` : 'there';

    let m = `└─► Hey, ${mentionTag} 👋\n\n`;
    m += `╭───〔 ${botName} 〕────────···\n`;
    m += `│ ❇ │▸ 𝐓𝐎𝐓𝐀𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒: ${totalCommands()}\n`;
    m += `│ ❇ │▸ 𝐏𝐑𝐄𝐅𝐈𝐗: ${prefix}\n`;
    m += `│ ❇ │▸ 𝐌𝐎𝐃𝐄: ${readMode()}\n`;
    m += `│ ❇ │▸ 𝐓𝐈𝐌𝐄: ${currentTime()}\n`;
    m += `╰──────────────────────────────⊷\n`;

    for (const [category, commands] of Object.entries(COMMAND_CATEGORIES)) {
        if (!commands.length) continue;
        m += `\n╭────────「 ${category}」───────···\n`;
        for (const c of commands) m += `│ ◦ ${prefix}${c}\n`;
        m += `╰──────────────────────────────···\n`;
    }

    m += `\n📢 *Channel:* ${CHANNEL_LINK}\n`;
    m += `👥 *Group:* ${GROUP_LINK}\n`;
    m += `\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴅᴇᴢ ᴛᴇᴄʜ*`;
    return m;
}

function resolveBanner() {
    const img = getMenuImage && getMenuImage();
    if (img) {
        const p = path.isAbsolute(img) ? img : path.join(__dirname, '..', img);
        if (!/^https?:\/\//i.test(img) && fs.existsSync(p)) return p;
    }
    return fs.existsSync(DEFAULT_BANNER) ? DEFAULT_BANNER : null;
}

async function helpCommand(sock, chatId, message) {
    const sender = message.key.participant || message.key.remoteJid;
    const menuText = generateMenu(sender);
    const botName = getBotName() || settings.botName;

    try {
        await sock.sendMessage(chatId, { react: { text: '🪐', key: message.key } });
    } catch (_) {}

    const banner = resolveBanner();
    const contextInfo = {
        mentionedJid: [sender],
        externalAdReply: {
            showAdAttribution: false,
            title: botName,
            body: 'Powered by ADEZ TECH',
            sourceUrl: CHANNEL_LINK,
            mediaType: 1,
            renderLargerThumbnail: true,
            ...(banner ? { thumbnail: fs.readFileSync(banner) } : {})
        }
    };

    try {
        // One text message (no caption limit) carrying the banner as a large thumbnail
        await sock.sendMessage(chatId, { text: menuText, contextInfo }, { quoted: createFakeContact(message) });
    } catch (error) {
        console.error('Error in help command:', error);
        try {
            await sock.sendMessage(chatId, { text: menuText, mentions: [sender] }, { quoted: message });
        } catch (fallbackError) {
            console.error('Even fallback failed:', fallbackError);
        }
    }
}

// Kept for main.js compatibility (the old number-reply menu no longer exists)
async function handleMenuReply() {
    return false;
}

module.exports = helpCommand;
module.exports.handleMenuReply = handleMenuReply;
module.exports.generateMenu = generateMenu;
module.exports.COMMAND_CATEGORIES = COMMAND_CATEGORIES;
