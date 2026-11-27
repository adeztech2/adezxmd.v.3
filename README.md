<!-- Glowing Header --><p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%">
</p><h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=25&duration=3000&color=FF0000&background=000000&center=true&vCenter=true&width=600&lines=🚀+ADEZ+NEXUS;🔥+WhatsApp+Bot;💻+By+ADEZ+TECH" alt="Typing Animation">
</h1><!-- Banner Image --><p align="center">
  <img src="https://files.catbox.moe/8rcgs3.jpg" width="85%" height="auto">
</p>---

📌 How to Connect ADEZ-XMD.v.3 Bot

Step 1: Get Session ID

Use the same session ID you use for the ADEZ-XMD.v.3 bot. It must start with `ADEZ~`.
Step 2: Configure Settings

Before deployment, configure your bot:

- Option A: Edit your configuration/settings files
- Option B: Use environment variables on your hosting platform

Step 3: Choose Hosting Platform

Deploy ADEZ-XMD.v.3 on your preferred platform.

<p align="center">
  <a href="https://dashboard.heroku.com/new?template=https%3A%2F%2Fgithub.com%2Fbonyke2-bot%2FBONY-XMD" target="_blank">
    <img src="https://img.shields.io/badge/🚀_HEROKU-000000?style=for-the-badge&color=FF00FF" width="200" height="45"/>
  </a>
  <img src="https://img.shields.io/badge/🚀_RENDER-COMING_SOON-000000?style=for-the-badge&color=61DAFB" width="200" height="45"/>
  <img src="https://img.shields.io/badge/🚀_RAILWAY-COMING_SOON-000000?style=for-the-badge&color=purple" width="200" height="45"/>
</p>Step 4: Start Using

Once configured, your bot will be ready to use!

---

🖼️ Bot Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://files.catbox.moe/tc72g8.jpg" width="300"><br>
        <small><i>ADEZ-XMD.v.3 Interface</i></small>
      </td>
      <td align="center">
        <img src="https://files.catbox.moe/tx9oba.jpg" width="300"><br>
        <small><i>ADEZ-XMD.v.3 Features</i></small>
      </td>
    </tr>
  </table>
</div>---

📢 Stay Updated

<p align="center">
  <a href="https://whatsapp.com/channel/0029Vb8N0xYLikgHxdGh790m" target="_blank">
    <img src="https://img.shields.io/badge/📢_WHATSAPP_CHANNEL-25d366?style=for-the-badge&logo=whatsapp" width="300" height="50"/>
  </a>
</p>---

📊 Stats

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=bonyke2-bot&label=Profile+Views&color=FF0000&style=for-the-badge" alt="Views"/>
  <img src="https://img.shields.io/github/followers/bonyke2-bot?label=GitHub+Followers&style=for-the-badge&color=00FF00" alt="Followers"/>
</p>---

🟢 Status

<p align="center">
  <span style="font-size:1.2em; color:#00FF00;">Status: <b>🟢 ONLINE</b></span>
</p>---

<!-- Footer --><p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%">
</p><p align="center">
  <strong>ADEZ-XMD.v.3 © 2026 | Developed by ADEZ TECH</strong>
</p>

---

## Heroku notes

1. Press the Heroku button, then fill in `SESSION_ID` (it must start with `ADEZ~`), `OWNER_NUMBER` and `APP_URL` (`https://your-app-name.herokuapp.com`, using the app name you chose).
2. The Postgres add-on is added for you and fills in `DATABASE_URL` by itself. The bot runs as a **web** dyno, so Heroku starts it after every deploy.
3. Heroku has no permanent disk and restarts the bot about once a day. Settings changed from WhatsApp (prefix, mode, antilink, welcome and so on) are saved in Postgres and come back after each restart.
4. A Basic dyno never sleeps. On Eco dynos the keep-alive ping uses `APP_URL`.
5. If the logs say "Invalid SESSION_ID", the value does not start with `ADEZ~`.
6. Still seeing an old bot name after a restart? Send `.setbotname ADEZ-XMD.v.3` once. The saved setting in Postgres wins over the file.

## Megan API configuration

The bot exposes Megan settings through environment variables. Set these in your hosting provider or local `.env` file:

```env
MEGAN_API_URL=https://apis.megan.qzz.io
MEGAN_API_KEY=your_private_megan_api_key
```

Never commit `MEGAN_API_KEY` to GitHub. The Heroku app template declares it as a required secret, while `MEGAN_API_URL` is preconfigured with the Megan base URL.
