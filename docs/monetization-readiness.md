# Monetization readiness

Status: disabled and not verified (reviewed 2026-10-13).

The current project does not load Monetag scripts or display Monetag ads. Do not enable an ad unit until the publisher account and site are approved, the site's content and playback rights are confirmed, and applicable privacy/consent requirements are implemented.

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

- The Yeraltı episode page embeds a player hosted by AnaPlayer, using the URL exposed by the Qarmzi episode page. VIP TV does not control that player's ad code, publisher account, or payment settings.
- Embedding the player does not route its ad revenue to VIP TV. The party whose publisher account or ad zone is configured in that player controls the reporting and payout. The account attached to this specific player has not been verified, so this project cannot say whether that party is Qarmzi, AnaPlayer, or another provider.
- The current Vercel preview returned no Google AdSense or Monetag ad scripts on the watch page. The homepage's AdSense slot only renders when both `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_SLOT` are configured; no such scripts were present in the checked preview response. No Monetag integration or account credentials are present in the repository.
- To receive revenue from VIP TV's own ad inventory, the owner needs an approved publisher account, a site/domain accepted by that network, and that account's own ad-unit configuration. Payments are made under that network's account and terms; amounts are subject to validation, fees, and payout requirements. This is separate from ads served inside an external iframe.
- Do not make a play button redirect to an advertiser or arrange ads so a user can mistake them for playback controls. The ad network must serve a format explicitly allowed for this site, with clear separation from player controls and any required consent handling. Google warns against placements that cause accidental clicks or deceptive navigation. Monetag's publisher rules allow streaming as a site category but prohibit content that infringes third-party rights; that category does not approve this site's content or licensing.

Official references checked 2026-10-13:
- [Monetag publisher content rules](https://help.monetag.com/en/articles/6726292-website-content-main-rules-for-publishers)
- [Monetag website verification and publisher setup](https://help.monetag.com/en/articles/6726312-how-do-i-get-started-as-a-publisher-add-and-verify-your-website-s)
- [Monetag Publisher Agreement](https://monetag.com/terms/)
- [Google AdSense program policies](https://support.google.com/adsense/answer/48182?hl=en)
- [Google AdSense ad placement policies](https://support.google.com/adsense/answer/1346295?hl=en-GB)

