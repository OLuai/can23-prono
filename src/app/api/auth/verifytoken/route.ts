import { MyAdapter } from "@/lib/auth";


const handler = async function (request: Request) {
    const token = await request.json()
    const verify = MyAdapter.getSessionAndUser ? await MyAdapter.getSessionAndUser(token?.token || "") : null;
    return Response.json({ ok: !!verify });
};

export { handler as POST };
