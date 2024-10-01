import { AuthUtils } from "@/components/AuthUtils";
import { ErrorUtils } from "@/components/ErrorUtils";
import { ResponseUtils } from "@/components/ResponseUtils";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token")
    if (!token) return ResponseUtils.needLogin();
    const login = await AuthUtils.checkToken(token);
    if (login instanceof Response) return login;

    let url = searchParams.get('url');
    if (!url) return ResponseUtils.missing("Param: url");

    if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
    }

    let headers = new Headers();
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0");
    headers.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8");
    headers.set("Accept-Language", "en-US,en;q=0.5");
    headers.set("Accept-Encoding", "gzip, deflate, br, zstd");
    headers.set("DNT", "1");
    headers.set("Connection", "keep-alive");
    headers.set("Upgrade-Insecure-Requests", "1");
    headers.set("Sec-Fetch-Dest", "document");
    headers.set("Sec-Fetch-Mode", "navigate");
    headers.set("Sec-Fetch-Site", "none");
    headers.set("Sec-Fetch-User", "?1");
    headers.set("Priority", "u=0, i");
    headers.set("Referer", "https://www.bilibili.com");

    try {
        // 注意, 缓存1天
        const response = await fetch(url, { next: { revalidate: 86400 }, headers: headers });
        return response;
    } catch (e) {
        ErrorUtils.log(e as Error);
        return ResponseUtils.serverError((e as Error).message);
    }
}