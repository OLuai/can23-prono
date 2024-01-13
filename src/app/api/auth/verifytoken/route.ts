import { MyAdapter } from "@/lib/auth";


const handler = async function (request: Request) {
    const token = await request.json()
    try {
        const verify = MyAdapter.getSessionAndUser ? await MyAdapter.getSessionAndUser(token?.token || "") : null;
        return Response.json({ ok: !!verify });
    } catch {
        return Response.json({ ok: false });
    }

};

export { handler as POST };
