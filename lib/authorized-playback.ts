import {isAllowedPlaybackUrl,parsePlaybackOrigins} from "@/lib/playback-origins";
export type PlaybackSource={kind:"embed"|"video";url:string;providerName:string;audioLanguages:string[];subtitleLanguages:string[];mimeType?:"video/mp4"|"application/vnd.apple.mpegurl";captions?:{url:string;language:string;label:string;isDefault?:boolean}[]};
type Verified=PlaybackSource&{rightsVerified:true;rightsEvidence:string;territories:string[];reviewedAt:string};
/** Add an episode only after verifying playback and embedding rights. Intentionally empty until then. */
const verifiedPlaybackByEpisodeId:Record<number,Verified>={};
export function getAuthorizedPlayback(id:number):PlaybackSource|null {
 const r=verifiedPlaybackByEpisodeId[id]; if(!r||r.rightsVerified!==true||!r.rightsEvidence.trim()||!r.territories.length||!r.reviewedAt)return null;
 const media=parsePlaybackOrigins(process.env.PLAYBACK_MEDIA_ORIGINS);
 const allowed=r.kind==="embed"?parsePlaybackOrigins(process.env.PLAYBACK_EMBED_ORIGINS):media;
 if(!isAllowedPlaybackUrl(r.url,allowed))return null;
 const captions=r.captions?.filter(c=>isAllowedPlaybackUrl(c.url,media));
 return {kind:r.kind,url:r.url,providerName:r.providerName,audioLanguages:r.audioLanguages,subtitleLanguages:r.subtitleLanguages,...(captions?.length?{captions}:{}),...(r.kind==="video"&&r.mimeType?{mimeType:r.mimeType}:{})};
}
