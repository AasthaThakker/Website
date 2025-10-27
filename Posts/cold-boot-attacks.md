---
id: cold-boot-attacks
date: 2025-10-23  
category: Attacks 
title: You Said It’s Impossible? Cold Boot, DMA & Hibernation Attacks 
excerpt: So, in my previous blog, a bunch of you got real comfortable questioning whether these attacks actually work in the wild. “Show me proof,” you said. “This is just theoretical,” you claimed. “No one actually does this,” you insisted.  
cover: https://media.licdn.com/dms/image/v2/D4D12AQFZ_1kzFejSqA/article-cover_image-shrink_720_1280/B4DZoR9X2JK0AM-/0/1761237915637?e=1762992000&v=beta&t=xpxAjQb3C5lZvwLICpCdA7CDKX8YeIEz1OMUMle9A9U
---

![Placeholder for Cover Image](https://media.licdn.com/dms/image/v2/D4D12AQFZ_1kzFejSqA/article-cover_image-shrink_720_1280/B4DZoR9X2JK0AM-/0/1761237915637?e=1762992000&v=beta&t=xpxAjQb3C5lZvwLICpCdA7CDKX8YeIEz1OMUMle9A9U)

# You Said It’s Impossible? Cold Boot, DMA & Hibernation Attacks

So, in my previous blog, a bunch of you got real comfortable questioning whether these attacks actually work in the wild. “Show me proof,” you said. “This is just theoretical,” you claimed. “No one actually does this,” you insisted.  

This blog answers that, backed by evidence.

I’m sharing research papers, proof-of-concept demonstrations, YouTube videos from security researchers, vendor advisories, and documented forensic case studies. You’ll see that Cold Boot, DMA (including Thunderspy and Thunderclap), and Evil Maid attacks aren’t just theoretical, they’re practical techniques used from a forensic perspective. Don’t worry though, I’ll break down the technical details so everything stays digestible.

Before we begin, I want to acknowledge Pavan Saxena (rootkid), who contributed significantly to the research behind this blog. His help in covering these complex topics was invaluable.

This blog is divided into 3 comprehensive sections:

1. Cold Boot / Memory Remanence Attacks: How encryption keys survive in powered-off RAM  
2. DMA (Direct Memory Access) Attacks: Thunderspy, Thunderclap, FireWire & PCIe exploitation  
3. Hibernation File Exploitation & Evil Maid Attacks: Extracting secrets from sleep files and bootloader compromise

For each attack class, we’ll examine:

- Are these attacks feasible in the real world?  
- Which research papers demonstrate them, and how did vendors respond?  
- Can these be reproduced safely in a lab, and what equipment is required?  
- Are there real-world case examples (forensic or adversarial) where the techniques were used?  
- What practical mitigations reduce risk?

## 1. COLD BOOT ATTACKS

Cold Boot attacks exploit a physical property of Dynamic RAM (DRAM). Data persists briefly after power loss due to residual electrical charge. If memory modules are cooled and transplanted rapidly into another system, attackers can reconstruct fragments of RAM, sometimes recovering encryption keys, authentication tokens, or in-memory secrets.

This isn’t hacker movie nonsense. This is documented, reproducible, and actively used in forensic investigations. DDR4/DDR5 and modern mobile LPDDR modules commonly use memory scrambling and many laptops have soldered (BGA) RAM, which greatly reduces the practicality of classic transplant workflows. success rates drop on modern hardware; legacy removable DIMMs remain the main risk.

**But Does This Actually Work in Real Life?**  
Yes, in these cases.

Cold boot attacks work when someone gets brief physical access to your machine and can either:

- Power it off suddenly and transplant the RAM sticks into a reader  
- Grab the device right after power loss and take it to a controlled environment

What makes this practical:

- Removable RAM: Older laptops and desktops where you can pop out DIMMs  
- Keys living in memory: Full-disk encryption session keys, TLS keys, anything cached in RAM  
- Time window tricks: Cooling extends data retention. Spray some inverted canned or compressed-air duster (commonly used to cool modules) on those DIMMs and suddenly you’ve got minutes instead of seconds  
- Mature tooling: Volatility, key-search scripts, entropy scanners, the forensic community has this down to a science

**The OG Paper:** Halderman, J. A., et al., “Lest We Remember: Cold Boot Attacks on Encryption Keys” (Read it here)  
![Placeholder](https://media.licdn.com/dms/image/v2/D4D12AQFk0GNvWVprzA/article-inline_image-shrink_1000_1488/B4DZoR9fyAGgAQ-/0/1761237927038?e=1762992000&v=beta&t=kjtEJF56EUdNgwEVoUDw2bW7vHiMNdXdkvwJCd5dNTk)
![Placeholder](https://media.licdn.com/dms/image/v2/D4D12AQGualXGFobhpQ/article-inline_image-shrink_1500_2232/B4DZoR9fWMKQAU-/0/1761237924052?e=1762992000&v=beta&t=7f9D1PHaSs8FkcuqP2Fstex8awJz1dYwz3OwVK6JJ9E) 
![Placeholder](https://media.licdn.com/dms/image/v2/D4D12AQHXeJ8QDoHhSg/article-inline_image-shrink_1500_2232/B4DZoR9fjtIgAU-/0/1761237925394?e=1762992000&v=beta&t=a10lScwK0IOtkTYF5KGvoNR4tEkfLhBJ3L6232EUToE)  
![Placeholder](https://media.licdn.com/dms/image/v2/D4D12AQH4o2Lgl2Vd_w/article-inline_image-shrink_1500_2232/B4DZoR9ftPHwAU-/0/1761237925996?e=1762992000&v=beta&t=aCtfIq-iMNO6n-c0f4OepUSgIkGoJwbHfXKGmwqBRrk)
This wasn’t just a paper, it was a mic drop moment. They showed live recovery of AES keys from powered-off RAM, and the security world collectively went “oh crap.”

**Follow-Up Research:**

- Lest We Remember: Cold-Boot Attacks on Encryption Keys: jhalderm.com/pub/papers/coldboot-cacm09.pdf  
- Cold boot attacks revisited: arxiv.org/pdf/1408.0725  
- Dataplant: Enhancing System Security with Low-Cost In-DRAM Value Generation Primitives: arxiv.org/pdf/1902.07344  
- Cold Boot Attack on Encrypted Containers for Forensic Investigations (Twum et al., 2022) : This paper adapts the classic cold-boot attack to recover keys from encrypted containers for forensic use, proving it can work in practice while noting time, access, and technical constraints. Requires physical access, quick action (data decays), and some hardware/skill so it’s powerful but not universally applicable.

**Want to SEE it with Video Proof?**

- Princeton’s original demo: youtube.com/watch?v=WY7RoDKC9BM  
- Step-by-step walkthrough: youtube.com/watch?v=Y_70UC0tPUU  
- More demonstrations: youtube.com/watch?v=Ej-Nr79bVjg

Vendors eventually responded with soldered memory, memory scrambling (increases difficulty), and TPM integration. But legacy systems? Still vulnerable. And there are millions of them out there.

**Can I Actually Test This?**  
Yes, and you should (in a controlled, authorized lab environment).

**What you need:**

- Old laptop or desktop with removable RAM (check eBay or your company’s decommission pile)  
- Another machine or DIMM reader  
- Linux live USB (Kali or Ubuntu work great)  
- Memory forensics tools: dd, Volatility3, key-search scripts  
- Optional but fun: inverted canned air (the computer duster kind, do NOT inhale!)  
- Safety gear: anti-static wrist strap, gloves, common sense

**The procedure (authorized testing ONLY):**

1. Boot your test machine with some encrypted volumes mounted (FDE unlocked)  
2. Kill the power suddenly  
3. (Optional) Cool the RAM modules with that inverted canned air  
4. Speed-run the DIMM removal, you’ve got seconds  
5. Pop them into your reader and dump the memory image  
6. Fire up Volatility and run key-search modules  
7. Watch as AES/RSA key structures appear in your terminal  
8. Document everything like a proper forensic analyst

Tip: Practice the physical steps first. You’d be surprised how much time you lose fumbling with tiny screws under pressure. Lab environment is not joke here.

**Cases Where This Actually Happened**  
The Princeton demo (2008) is the most famous, live demonstration at USENIX that you can still watch on YouTube. It fundamentally changed how we think about “locked = secure.”  
Many forensic teams treat volatile memory as high-priority evidence and perform RAM acquisition when possible. The practitioner literature is full of cases where cold boot or hibernation file analysis recovered credentials during investigations. Many of these stay sealed in legal proceedings, but the technique is standard operating procedure.

If you’ve ever wondered why forensic teams treat seized laptops like ticking time bombs and rush, this is why. The clock is literally ticking on that RAM.

**How to Defend Against This**

- Buy newer gear: Soldered memory and memory scrambling make this much harder  
- Use hardware security modules: TPMs and secure enclaves protect keys only when the OS or application stores them there. For example, BitLocker with TPM + PIN or Apple’s secure enclave design keeps keys sealed until you authenticate. But many full-disk encryption setups (like TPM-only BitLocker) still load the active encryption key into memory at boot. So, TPMs reduce exposure, they don’t eliminate it.  
- Implement memory zeroing (clearing out the contents of memory (RAM) by overwriting it with zeros, so that no leftover data can be recovered after shutdown or reuse) on shutdown, where feasible.  
- Never leave devices unlocked in untrusted spaces, power them down fully  
- Require pre-boot authentication (PIN/password) and ensure hibernation files are stored on encrypted volumes; configure OS to require credentials on resume.  
- For forensic teams, treat seized devices as volatile evidence and follow your legal protocols

## 2. DMA ATTACKS

Direct Memory Access exists for good reasons, it lets peripherals talk directly to RAM without bothering the CPU, which makes everything faster. But here’s the problem, if protections fail or aren’t enabled, a malicious device can read your entire memory space (including encryption keys), Inject code directly into the kernel or Exfiltrate data in seconds.

Attack surfaces: Thunderbolt ports (the big one), FireWire (RIP but still on older gear), ExpressCard slots, and PCIe expansion cards.

Thunderspy and Thunderclap are the poster children for this attack class and they’re not theoretical.

**Are these attacks practical in the real world?**  
Yes, DMA attacks are practical in many hands-on attack scenarios, especially against legacy or unpatched hardware:

Attack vectors include plugging a malicious device into a live system (Thunderbolt, FireWire, ExpressCard), using a malicious docking station, or flashing controller firmware (Thunderspy) to disable protections.  
These attacks require physical proximity (device insertion) and in some cases modest hardware and time (minutes) to reprogram firmware.  
Modern systems that enable IOMMU and Kernel DMA Protection make exploitation significantly more difficult; many vendors issued guidance and firmware updates after PoCs became public.

**Research That Broke Thunderbolt Security**

- Thunderclap (2019): Exploring Vulnerabilities in Operating System IOMMU Protection via DMA from Untrustworthy Peripherals: Full NDSS paper  
![Placeholder for Cover Image](https://media.licdn.com/dms/image/v2/D4D12AQED_BfCJgrp4g/article-inline_image-shrink_1000_1488/B4DZoR9fYTH4AU-/0/1761237923905?e=1762992000&v=beta&t=12HFYPBV0P_JK9w97mhps1jkzb-uDrcqQ77lE2kwpvo)  
![Placeholder for Cover Image](https://media.licdn.com/dms/image/v2/D4D12AQF28_CSfi024Q/article-inline_image-shrink_1000_1488/B4DZoR9fbhIAAQ-/0/1761237924144?e=1762992000&v=beta&t=0TXZ52I-se2tMI8gUkkacaXGzwjRNbgUXcBkxyuJVCc)
2. Thunderspy (2020): The PoC toolkit that made vendors sweat:

- Project site with vulnerable device list  
- Full whitepaper: “Breaking Thunderbolt Security”  
- Wired’s coverage

3. PicoDMAL DMA attacks shrunk to pocket-size Black Hat presentation

4. Video Proof (Because Seeing is Believing):

- Thunderspy: Windows PC unlocked in 5 minutes: youtube.com/watch?v=7uvSZA1F9os  
- Disabling Thunderbolt security permanently: youtube.com/watch?v=oEfzp4lHpB0  
- Bypassing Kernel DMA Protection: youtube.com/watch?v=I44caDH-ilY  
- PicoDMA Black Hat talk: youtube.com/watch?v=j8pCjgaByVo

After these disclosures, vendors pushed firmware updates and encouraged Kernel DMA Protection. But legacy hardware? Still vulnerable.

**“Can I Reproduce This in My Lab?”**  
Absolutely and security labs do this all the time for authorized testing.

**What you need:**

- A vulnerable target machine (pre-2019 Thunderbolt laptop, check Thunderspy’s tested device list).  
- Malicious peripheral hardware: FPGA dev board, PicoDMA device, or PCILeech.  
- PoC toolchains and DMA mapping utilities.  
- (For Thunderspy tests) Firmware programmer and a lot of patience.  
- Most importantly, documented authorization to test.

**The basic flow:**

1. Verify your target lacks IOMMU/Kernel DMA Protection (or it’s misconfigured).  
2. Connect your malicious device or reprogram the controller (lab environment only!).  
3. Use DMA tools to map physical memory.  
4. Read sensitive memory regions or inject kernel payloads.  
5. Test mitigations by enabling protections and trying again.

Safety note: Only test on systems you own or have explicit written permission to test. DMA attacks can cause system instability if you screw up.

Ok, so the reason I didn’t include it in the previous blog is that most of my readers don’t have access to a proper lab environment, as it’s not commonly available. However, if someone still wishes to experiment, they can certainly set up a controlled lab environment and proceed, though it’s worth noting that a lab setup is not a cup of tea.

**How to Defend Your Systems**

- Enable IOMMU and Kernel DMA Protection on every endpoint, verify it’s actually working.  
- Lock down high-risk ports at the firmware level if you don’t need them.  
- Treat docking stations as untrusted devices until proven otherwise.  
- Keep firmware updated and monitor vendor advisories (Thunderspy maintains a great list)  
- Physical security matters, port blockers, restricted access for sensitive systems  
- For enterprise, implement policy that prevents unapproved peripheral use

## 3. HIBERNATION FILES

When your OS hibernates or sleeps, it dumps RAM to disk:

- Windows: hiberfil.sys and pagefile.sys  
- Linux: swap partition  
- macOS: sleep image

These files can contain everything that was in memory. They can contain passwords, keys, session tokens, and other secrets.

**Are these attacks practical in the real world?**  
Yes, Hibernation & swap files are a real threat. If an attacker obtains a disk image (for example via a stolen device, direct disk access, or an unprotected backup), they can parse hiberfil.sys, pagefile.sys, or macOS sleepimage offline and extract secrets such as keys, credentials, or session tokens. Mature forensic tools (Volatility/Volatility3, Rekall, Arsenal Recon, community scripts) automate much of this work. (hiberfil formats changed across Windows versions (pre-Win8, Win8+, Win10/11 memory compression etc.), and parsing requires up-to-date plugins.) How much an attacker recovers depends entirely on your encryption setup: when those files live inside a volume protected by full-disk encryption with pre-boot authentication (BitLocker with PIN, FileVault, LUKS with passphrase), they are effectively unreadable without the key. By contrast, systems that rely on TPM-only unlock (no PIN/password) can be vulnerable: if the OS or firmware automatically unlocks the disk at boot, hibernation/swap contents may be recoverable from a disk image.

Volatility3: Modern Windows Hibernation file analysis  (https://www.forensicxlab.com/blog/hibernation)
Parsing the hiberfil.sys, searching for slack space

![Placeholder for Cover Image](https://media.licdn.com/dms/image/v2/D4D12AQGp2HeXRFB3aQ/article-inline_image-shrink_1500_2232/B4DZoR9f2HH4AU-/0/1761237926410?e=1762992000&v=beta&t=DR7RstIP-YGGMHYgEpHF7RVvlBTgmXHAZJQBC7MMPTE)

**More References on hibernation and evil maid attack:**

- Evil-Maid with hibernation exploitation  (https://www.pentester.es/evil-maid-attacks-with-hibernation/)
- Bruce Schneier on Evil Maid attacks  (https://www.schneier.com/blog/archives/2009/10/evil_maid_attac.html)
- Black Hat: Windows Hibernation Analysis  (https://www.blackhat.com/presentations/bh-usa-08/Suiche/BH_US_08_Suiche_Windows_hibernation.pdf)
- Andrea Fortuna’s walkthrough  (https://andreafortuna.org/2019/05/15/how-to-read-windows-hibernation-file-hiberfil-sys-to-extract-forensic-data/)
- Invisiblething’slab (https://invisiblethingslab.com/)

Vendor response: This threat model drove adoption of Secure Boot, measured boot, TPM attestation, and firmware signing. The defenses exist, but only if you enable them.

**Defense Strategies That Work**

- Disable hibernation if you don’t need it (seriously, do you?)  
- Treat hiberfil.sys and pagefile.sys as sensitive data, restricted disk access.  
- Use full-disk encryption and lock screens (they don’t help if someone steals the disk, but they’re table stakes)

Cold boot, DMA, and hibernation attacks aren’t theoretical. They’re not “movie hacker” nonsense. They’re documented, reproducible, and actively used in both forensic investigations and offensive operations.

The good news? The defenses work. Hardware protections exist. Firmware mitigations are available. OS-level controls are effective. You just have to implement them.

Physical access has always been game over in security. But with the right combination of platform selection, configuration hardening, and operational discipline, you can make these attacks exponentially harder to pull off.

## Complete Reference Library

**Cold-Boot / Memory Remanence**  
Research Papers:

- https://www.usenix.org/legacy/event/sec08/tech/full_papers/halderman/halderman.pdf  
- https://jhalderm.com/pub/papers/coldboot-cacm09.pdf  
- https://arxiv.org/pdf/1408.0725  
- https://arxiv.org/pdf/1902.07344  
- https://dr.ntu.edu.sg/server/api/core/bitstreams/1172e813-fcee-4f98-8cef-dbc9076caccc/content  
- https://es.cs.rptu.de/publications/datarsg/Bitt24a.pdf

Video Demonstrations:

- https://www.youtube.com/watch?v=WY7RoDKC9BM  
- https://www.youtube.com/watch?v=Y_70UC0tPUU  
- https://www.youtube.com/watch?v=Ej-Nr79bVjg  
- https://www.youtube.com/watch?v=TQP2IMnPw9c  
- https://www.youtube.com/watch?v=7aX-ujYjz_8  
- https://www.youtube.com/watch?v=E6gzVVjW4yY  
- https://www.youtube.com/watch?v=XfUlRsE3ymQ  
- https://www.youtube.com/watch?v=AcqtFOcizOk

**DMA / Thunderbolt / Thunderspy / Thunderclap**  
Research & Whitepapers:

- https://www.cl.cam.ac.uk/~atm26/pubs/thunderclap-paper-ndss2019.pdf  
- https://thunderspy.io/  
- https://thunderspy.io/assets/reports/breaking-thunderbolt-security-bjorn-ruytenberg-20200417.pdf  
- https://www.wired.com/story/thunderspy-thunderbolt-evil-maid-hacking/  
- https://i.blackhat.com/USA-19/Wednesday/us-19-Sandin-PicoDMA-DMA-Attacks-At-Your-Fingertips.pdf  
- https://www.os3.nl/_media/2011-2012/courses/rp1/p14_report.pdf

Video Demonstrations:

- https://www.youtube.com/watch?v=7uvSZA1F9os  
- https://www.youtube.com/watch?v=oEfzp4lHpB0  
- https://www.youtube.com/watch?v=I44caDH-ilY  
- https://www.youtube.com/watch?v=j8pCjgaByVo  
- https://www.youtube.com/watch?v=UtJKewJoyRw  
- https://www.youtube.com/watch?v=7nD391e_NK0

**Hibernation**  
Forensic Resources:

- https://www.forensicxlab.com/blog/hibernation  
- https://diablohorn.com/2014/12/10/parsing-the-hiberfil-sys-searching-for-slack-space/  
- https://forensics.wiki/arsenal_recon/  
- https://www.blackhat.com/presentations/bh-usa-08/Suiche/BH_US_08_Suiche_Windows_hibernation.pdf  
- https://ijser.org/researchpaper/Role-of-Hibernation-File-in-Memory-Forensics-of-windows-10.pdf  
- https://andreafortuna.org/2019/05/15/how-to-read-windows-hibernation-file-hiberfil-sys-to-extract-forensic-data/  
- https://www.pentester.es/evil-maid-attacks-with-hibernation/