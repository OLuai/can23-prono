import { getUserPronosForUpcomingMatches } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";


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

    const data = await getUserPronosForUpcomingMatches(userId);
    return Response.json({ data: data });


};

export { handler as POST };

