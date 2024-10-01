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

    const url = searchParams.get('url');
    if (!url) return ResponseUtils.missing("Param: url");

    let headers = request.headers;
    headers.delete('Authorization');

    try {
        // 注意, 缓存1天
        const response = await fetch(url, { next: { revalidate: 86400 }, headers: headers });
        return response;
    } catch (e) {
        ErrorUtils.log(e as Error);
        return ResponseUtils.serverError((e as Error).message);
    }
}