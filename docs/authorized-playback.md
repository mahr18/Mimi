# Authorized playback sources

Reviewed 2026-10-12.

## Kara Sevda — season 1, episode 1

- TVmaze show ID: `7580`; episode ID: `427468`.
- Video: [Kara Sevda 1. Bölüm FULL HD](https://www.youtube.com/watch?v=fVNzewv_2oU).
- Publisher/channel: [Kara Sevda on YouTube](https://www.youtube.com/@KaraSevdaTv).
- Publisher evidence: [Ay Yapım's official YouTube channels](https://www.ayyapim.com/tr-tr/youtube-channels) lists Kara Sevda as one of its channels.
- Playback: official YouTube Privacy Enhanced iframe (`youtube-nocookie.com`); the video was returned by YouTube's public oEmbed endpoint during review.
- Audio: Turkish. Arabic subtitles: not verified or supplied.
- Availability: YouTube may restrict embedding, playback, or territories at any time; VIP TV does not download or rehost the video.
- Status: configured for a live in-page playback check. Availability in all territories is not claimed.

Other episodes remain unavailable until a per-episode source is configured and its playback, territory, and subtitle behavior are checked.

## Yeraltı — episode 17 (embedded player trial)

- Qarmzi episode page: `https://www.qrmzi.tv/episode/مسلسل-تحت-الأرض-الحلقة-17/`.
- The page exposes an embed code pointing to `https://w.anaplayer.online/albaplayer/yeralti-2026-s01e17/?serv=0`.
- VIP TV embeds that player as-is; it does not download or proxy the video.
- The user reports having permission from Qarmzi to display its translated episodes and retain its branding. That permission has not been independently reviewed here and does not establish rights beyond the scope the user received.
- Status: implemented for this episode only. The public player endpoint returned HTTP 200 and did not return `X-Frame-Options` or `Content-Security-Policy` headers in the check on 2026-10-13. Actual playback, subtitle appearance, and availability in every territory still need browser verification.

