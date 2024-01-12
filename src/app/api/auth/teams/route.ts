import { getDB, initAdmin } from "@/config/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";


const handler = async function (req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // const db = getDB();
    // const batch = db.batch();
    // matches.forEach((doc) => {
    //     // doc.id = v4();
    //     var docRef = db.collection("matches").doc(doc.id);
    //     batch.set(docRef, doc, { merge: true });
    // });
    // console.log(matches);

    // await batch.commit();

    return Response.json({ ok: true });

};

export { handler as GET, handler as POST };

