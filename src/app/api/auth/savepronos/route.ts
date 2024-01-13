import { getDB } from "@/config/firebase-admin";
import { getUserPronosForUpcomingMatches } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { UserPick } from "@/types/firestoreData";


const handler = async function (req: Request) {

    const body = await req.json();
    let picks: UserPick[] = [];

    if (body?.picks) {
        picks = body?.picks as UserPick[];
    }

    const db = getDB();
    const batch = db.batch();
    picks.forEach((doc) => {
        var docRef = db.collection("picks").doc(doc.id);
        batch.set(docRef, doc, { merge: true });
    });

    await batch.commit();

    return Response.json({ ok: true });


};

export { handler as POST };

