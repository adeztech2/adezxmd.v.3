require('dotenv').config();


global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
};



module.exports = {
    SESSION_ID: global.SESSION_ID || process.env.SESSION_ID,
    MEGAN_API_URL: process.env.MEGAN_API_URL || 'https://apis.megan.qzz.io',
    MEGAN_API_KEY: process.env.MEGAN_API_KEY || '',
    WARN_COUNT: 3,
    APIs: global.APIs,
    APIKeys: {}
};
