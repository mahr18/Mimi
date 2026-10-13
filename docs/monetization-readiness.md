# Monetization readiness

Status: all ads disabled (reviewed 2026-10-13).

The current project does not load Monetag or Google AdSense scripts and does not render ad placements. Keep ads disabled until the publisher account and site are approved, the site's content and playback rights are confirmed, and a suitable privacy/consent flow is implemented for the audience.

Monetag's current publisher content rules say publisher sites may not contain material that infringes third-party rights or violates law, and expressly prohibit pirated software and other illegal activity. Monetag lists streaming sites among mainstream site types, but that statement does not grant rights to stream third-party programs. Approval, monetization, ad quality, and revenue are not guaranteed.

Before activation:
1. Confirm written rights or provider authorization for every playable title, including territories, embedding, and commercial use.
2. Add and verify the actual production domain in the Monetag publisher account.
3. Review the publisher terms, allowed ad formats, privacy obligations, and consent requirements for the site's target regions.
4. Use only the official zone configuration supplied by the approved account. Keep intrusive formats such as popunders, redirects, and forced navigation disabled unless the owner explicitly chooses them after review.
5. Test mobile usability, accessibility, ad labeling, and the playback provider's rules in a preview environment.

Official references checked 2026-10-12:
- Publisher content rules: https://help.monetag.com/en/articles/6726292-website-content-main-rules-for-publishers
- Site verification and publisher setup: https://help.monetag.com/en/articles/6726312-how-do-i-get-started-as-a-publisher-add-and-verify-your-website-s
- Publisher terms: https://monetag.com/terms

This document is an implementation checklist, not legal advice or a statement that VIP TV qualifies for Monetag.

## Revenue ownership in the embedded player

- The former Yeraltı/AnaPlayer trial is disabled. No external player currently runs on that page.
- The only configured video is a YouTube embed. Any ads or revenue inside that third-party player follow YouTube/channel settings; embedding does not route them to VIP TV.
- Vercel's project API could not be inspected in this review because its connected credential returned `403 invalidToken`. This document describes the checked source code, not the current deployed environment.
- To receive revenue from VIP TV's own ad inventory, the owner needs an approved publisher account, a site/domain accepted by that network, and that account's own ad-unit configuration. Payments are made under that network's account and terms; amounts are subject to validation, fees, and payout requirements. This is separate from ads served inside an external iframe.
- Do not make a play button redirect to an advertiser or arrange ads so a user can mistake them for playback controls. Any future ad unit needs an approved publisher, a format allowed for the site, clear separation from player controls, and the consent mechanism required for its target regions. Monetag's publisher rules allow streaming as a site category but prohibit content that infringes third-party rights; that category does not approve this site's content or licensing.

Official references checked 2026-10-13:
- [Monetag publisher content rules](https://help.monetag.com/en/articles/6726292-website-content-main-rules-for-publishers)
- [Monetag website verification and publisher setup](https://help.monetag.com/en/articles/6726312-how-do-i-get-started-as-a-publisher-add-and-verify-your-website-s)
- [Monetag Publisher Agreement](https://monetag.com/terms/)
- [Google AdSense program policies](https://support.google.com/adsense/answer/48182?hl=en)
- [Google AdSense ad placement policies](https://support.google.com/adsense/answer/1346295?hl=en-GB)

