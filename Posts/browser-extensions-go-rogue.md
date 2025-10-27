---
id: browser-extensions-go-rogue
title: When Browser Extensions Go Rogue
date: 2025-06-26
category: Attacks
excerpt: When a browser extension wants “access to everything,” maybe it’s not just helping you take screenshots.
cover: https://media.licdn.com/dms/image/v2/D4D12AQG0QvjTM6GDUQ/article-cover_image-shrink_720_1280/B4DZetLdM7H4AM-/0/1750957153396?e=1762992000&v=beta&t=mmrxlM2_7d1S2K9sybtNTqNE3r4cRiCN-iNkQKn7WDY
---

# When Browser Extensions Go Rogue

![Placeholder for Cover Image](https://media.licdn.com/dms/image/v2/D4D12AQG0QvjTM6GDUQ/article-cover_image-shrink_720_1280/B4DZetLdM7H4AM-/0/1750957153396?e=1762992000&v=beta&t=mmrxlM2_7d1S2K9sybtNTqNE3r4cRiCN-iNkQKn7WDY)

You install an extension to block ads or take screenshots. It looks clean, does its job, and stays quietly in the toolbar. But behind the scenes, it may copy your session cookies, track your activity, and maybe even watch what you type.

## Session Cookies
Session cookies are tiny tokens that keep you logged in. Steal them and wow the attacker can act as you.

* No 2FA.
* No email alerts.
* No suspicions.

That’s why attackers are pushing fake browser extensions designed to grab these cookies quietly and consistently.

## What’s a BitB Attack?
You have probably read about Browser-in-the-Middle (BiTM) (https://systemweakness.com/from-man-in-the-middle-to-browser-in-the-middle-a5cd2487cd49) attacks before (yep, we covered that in previous blog). But meet its cousin: *Browser-in-the-Browser (BitB).*

BitB creates a fake browser popup inside your real browser. The attacker controls everything; URL, layout, buttons. You “log in,” thinking it’s Google or Instagram. Instead, it’s just some hacker a hoodie collecting your secrets.

Combine BitB with a shady browser extension, and it’s like giving a thief your house key and a floor plan. The extension steals your session cookies while the fake login page captures any new credentials you enter.
![Placeholder](https://media.licdn.com/dms/image/v2/D4D12AQGDwiLJRpxPbg/article-inline_image-shrink_1000_1488/B4DZev7nhtHMAQ-/0/1751003342468?e=1762992000&v=beta&t=iy1mIa3VHVwnBHM8WQ362baazOOcWwIbu2we5MUgLk4)

### Hundreds of Fake Chrome Add-ons:
In May 2025 DomainTools Intelligence reported (https://thehackernews.com/2025/05/100-fake-chrome-extensions-found.html#:~:text=While%20the%20browser%20add,and%20phishing%20via%20DOM%20manipulation) over 100 malicious Chrome extensions(launched since Feb 2024) impersonating popular tools (VPNs, crypto wallets, productivity apps). These fake extensions requested broad permissions (access to all sites and cookies) and secretly *exfiltrated credentials and cookies.*
![Placeholder](https://media.licdn.com/dms/image/v2/D4D12AQFbInUOwJ2Jcg/article-inline_image-shrink_1500_2232/B4DZetLiDGGsAU-/0/1750957172436?e=1762992000&v=beta&t=Atzi-jRJu2SudP18DmzS90YTNHWJNjhgdn5VyJo8iAY)

### Article content
*“Recover Your Facebook Page” Scam*
Victims searched YouTube for ways to unban Facebook pages. Instead, they were directed to install a Chrome extension from Google Drive (red flag already).

* It asked for access to everything.
* Stole *Facebook session cookies* and sent them via Telegram to attackers.
* No passwords needed — just cookies, and you’re ghosted from your own account.

### Latin America Banking Extortion (Phantom Enigma)
In June 2025 Positive Technologies reported Operation “Phantom Enigma”, a multi-stage phishing campaign in Brazil and Latin America. This attack delivers a malicious Chromium extension (via batch scripts or Windows installers) that installs itself in Chrome, Edge or Brave. The extension remains dormant except on specific bank sites (e.g. Banco do Brasil). When the victim visits the targeted banking webpage, the extension activates JavaScript to grab the *user’s authentication token* from the browser and send it to the attacker.
![Placeholder](https://media.licdn.com/dms/image/v2/D4D12AQFT3ckfJ8KpTg/article-inline_image-shrink_1500_2232/B4DZetLh9lHkAY-/0/1750957172170?e=1762992000&v=beta&t=-uBMVdtRIH8YklXAt5ep-cdWpKIbQeyNoQc7ph9pLXQ)

### Cookie-Bite Proof-of-Concept
In April 2025 Varonis disclosed a proof-of-concept called “Cookie-Bite,” showing how a malicious Chrome extension can defeat MFA on Microsoft 365. The PoC involves a hidden extension that listens for Microsoft login events, then reads and exfiltrates the session cookies *ESTSAUTH* (persistent “stay signed in” tokens) to the attacker via a Google Form. Although this was a lab demo, it underscores the danger: any browser extension can be coded to grab session cookies and give attackers immediate account access.

## BitB Attacks in Context
Session hijacking can be achieved by either phishing or malware. Recent analysis breaks it into two categories:

1. Modern phishing kits (AitM/BitM/BitB) that proxy login flows, and
2. Infostealers or plugins that target browser data.

Fake extensions fall squarely into the second category; they act like tailor-made infostealer malware. For instance, the Cookie-Bite proof-of-concept is essentially an infostealer Chrome extension for cookies,(https://www.bleepingcomputer.com/news/security/cookie-bite-attack-poc-uses-chrome-extension-to-steal-session-tokens/#:~:text=A%20proof,Microsoft%20365%2C%20Outlook%2C%20and%20Teams) while the fake Facebook “Ban Fix” extension is literal spyware grabbing cookies.

Attackers often chain these techniques. A BitB page could trick a user into logging in (capturing credentials), and the attacker could then use those credentials to push a malicious extension or session token. Conversely, a user who installs a malicious extension may later encounter a BitB-style login prompt when re-entering credentials, unaware the session is compromised.

In either case, the goal is the same: persistently hijack identity. Identity attacks now blend AitM/BitM and data-stealing tools,(https://thehackernews.com/2024/09/session-hijacking-20-latest-way-that.html#:~:text=Comparing%20session%20hijacking%20approaches) widening the avenues to capture sessions. The current wave of threats shows that once an attacker has obtained either your password or your session cookie, they effectively own your session (and bypass MFA).

## Signs You May Be Compromised
- Unexpected login notifications from accounts you didn’t access
- Friends reporting strange messages or posts from your accounts
- Banking or financial alerts for activities you didn’t perform
- Browser extensions you don’t remember installing

## If You Think You’re Compromised
- Immediately log out of all accounts on the affected browser
- Remove suspicious extensions from chrome://extensions/
- Clear all browser data including cookies and saved passwords
- Change passwords for all important accounts from a different device
- Enable additional security measures like app-specific passwords
- Monitor accounts closely for unusual activity

These days, you don’t need to “download a virus.” Just install the wrong browser plugin and let it steal your entire login session while you watch Netflix.