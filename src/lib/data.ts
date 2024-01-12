import { getDB } from "@/config/firebase-admin"
import { Match, Stage, StageWithMatches, Team } from "@/types/firestoreData";
import { } from "firebase-admin/firestore";
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

export const getStageAndMatchesUpcoming = async () => {
    const db = getDB();
    const collectionRef = db.collection("stages")
    const querySnapshot = await collectionRef.orderBy("startDate", "asc").get()

    const result: StageWithMatches[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const stage = doc.data() as Stage;

        const matchesRef = db.collection("matches")
        const matchesSnapshot = await matchesRef.where("stageId", "==", stage.id).where("isEnd", "==", false).orderBy("startDate", "asc").get();

        if (!matchesSnapshot.empty) {
            const matches: Match[] = [];
            matchesSnapshot.forEach(async (doc) => {
                const match = doc.data() as Match;
                // console.log("Match :: ", match)
                matches.push(match);
            })

            result.push({ ...stage, matches } as StageWithMatches)
        }
    }

    return result;
}

export const getStageAndMatchesHistory = async () => {
    const db = getDB();
    const collectionRef = db.collection("stages")
    const querySnapshot = await collectionRef.orderBy("startDate", "desc").get()

    const result: StageWithMatches[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const stage = doc.data() as Stage;

        const matchesRef = db.collection("matches")
        const matchesSnapshot = await matchesRef.where("stageId", "==", stage.id).where("isEnd", "==", true).orderBy("startDate", "desc").get();

        if (!matchesSnapshot.empty) {
            const matches: Match[] = [];
            matchesSnapshot.forEach(async (doc) => {
                const match = doc.data() as Match;
                // console.log("Match :: ", match)
                matches.push(match);
            })

            result.push({ ...stage, matches } as StageWithMatches)
        }
    }

    return result;
}
