import { getDB } from "@/config/firebase-admin"
import { Match, Stage, StageWithMatchesAndUserPick, Team, UserPick } from "@/types/firestoreData";
import { OrderByDirection } from "firebase-admin/firestore";
import { User } from "next-auth";

export const getUsers = async () => {
    const db = getDB();
    const collectionRef = db.collection("users")
    const querySnapshot = await collectionRef.get()

    const users: User[] = [];

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const user: User = { id: doc.id, ...data } as User;
        users.push(user);
    })

    return users;

}

export const getTeams = async () => {
    const db = getDB();
    const collectionRef = db.collection("teams")
    const querySnapshot = await collectionRef.get()

    const teams: Team[] = [];

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const team: Team = { ...data } as Team;
        teams.push(team);
    });

    return teams;
}

export const getUserPickByMatchId = async (userId: string, matchId: string) => {
    const db = getDB();
    const collectionRef = db.collection("picks")
    const querySnapshot = await collectionRef.where("matchId", "==", matchId).where("userId", "==", userId).get();

    let result: UserPick | null = null;

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const docData = doc.data() as UserPick;

        result = { ...docData }
    }

    return result;
}

export const getMatchesAndUserPickByStageId = async (userId: string, stageId: string, isEnd: boolean = false, order: OrderByDirection = "asc") => {
    const db = getDB();
    const collectionRef = db.collection("matches")
    const querySnapshot = await collectionRef.where("stageId", "==", stageId).where("isEnd", "==", isEnd).orderBy("startDate", order).get();
    const result: any[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const docData = doc.data() as Match;
        docData.starDateTimestamp = docData.startDate.toMillis();

        const userPick = await getUserPickByMatchId(userId, docData.id);

        result.push({ ...docData, userPick })
    }

    return result;



}


export const getUserPronos = async (userId: string, isEnd: boolean = false, order: OrderByDirection = "asc") => {
    const db = getDB();
    const collectionRef = db.collection("stages")
    const querySnapshot = await collectionRef.orderBy("startDate", order).get()

    const result: StageWithMatchesAndUserPick[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const docData = doc.data() as Stage;

        docData.starDateTimestamp = docData.startDate.toMillis();

        const stage = { ...docData }

        const matchesAndPick = await getMatchesAndUserPickByStageId(userId, docData.id, isEnd);

        result.push({ ...docData, matches: matchesAndPick } as StageWithMatchesAndUserPick)
    }

    return result;
}

export const getUserPronosForUpcomingMatches = async (userId: string) => {
    const result = getUserPronos(userId, false, "asc");

    return result;
}

export const getUserPronosForHistoryMatches = async (userId: string) => {

    const result = getUserPronos(userId, true, "desc");

    return result;
}
