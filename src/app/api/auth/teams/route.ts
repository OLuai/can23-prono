import { getTeams } from "@/lib/data";


const handler = async function (req: Request
) {
    const data = await getTeams();

    return Response.json({ data: data });

};

export { handler as GET, handler as POST };

