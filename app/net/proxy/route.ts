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

    let headers = request.headers;
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0');

    try {
        // 注意, 缓存1天
        const response = await fetch(url, { next: { revalidate: 86400 }, headers: headers });
        return response;
    } catch (e) {
        ErrorUtils.log(e as Error);
        return ResponseUtils.serverError((e as Error).message);
    }
}