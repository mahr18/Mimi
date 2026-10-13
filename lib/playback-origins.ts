export function parsePlaybackOrigins(value: string | undefined): string[] {
  if (!value) return [];
  return [...new Set(value.split(",").flatMap((entry) => {
    try { const origin=entry.trim(); const url=new URL(origin); return url.protocol==="https:"&&!url.username&&!url.password&&url.origin===origin?[url.origin]:[]; } catch { return []; }
  }))];
}
export function isAllowedPlaybackUrl(value:string,allowedOrigins:string[]):boolean {
  try { const url=new URL(value); return url.protocol==="https:"&&!url.username&&!url.password&&allowedOrigins.includes(url.origin); } catch { return false; }
}
