import { getDB, initAdmin } from "@/config/firebase-admin";
import { getTeams } from "@/lib/data";
import { Team } from "@/types/firestoreData";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";


const handler = async function (req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const data = await getTeams();

    return Response.json({ data: data });

};

export { handler as GET, handler as POST };

