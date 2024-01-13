import { getUserPronosForHistoryMatches } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";


const handler = async function (req: Request) {

    const body = await req.json();
    let userId: string = "";

    if (body?.userId) {
        userId = body?.userId as string;
    }
    else {
        const userData = await getCurrentUser();
        userId = userData?.appUser.id ?? "";
    }

    const data = await getUserPronosForHistoryMatches(userId);
    return Response.json({ data: data, userId: userId });


};

export { handler as POST };

