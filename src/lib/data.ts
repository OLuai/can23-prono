import { getDB } from "@/config/firebase-admin"
import { Match, MatchWithUserPick, Stage, StageWithMatchesAndUserPick, Team, UserPick, UserWithMatchesAndPick } from "@/types/firestoreData";
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
export const getAllPicks = async () => {
    const db = getDB();
    const collectionRef = db.collection("picks")
    const querySnapshot = await collectionRef.get()

    const result: UserPick[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const docData = doc.data() as UserPick;

        const mapData = { ...docData }

        result.push({ ...mapData })
    }

    return result;
}
export const getAllMatches = async () => {
    const db = getDB();
    const collectionRef = db.collection("matches")
    const querySnapshot = await collectionRef.orderBy("startDate", "asc").get()

    const result: Match[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const docData = doc.data() as Match;

        const mapData = { ...docData, starDateTimestamp: docData.startDate.toMillis() }

        result.push({ ...mapData })
    }

    return result;
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

export const getUserPicks = async (userId: string) => {
    const db = getDB();
    const collectionRef = db.collection("picks")
    const querySnapshot = await collectionRef.where("userId", "==", userId).get()

    const result: UserPick[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const docData = doc.data() as UserPick;

        const mapData = { ...docData }

        result.push({ ...mapData } as UserPick)
    }

    return result;
}

export const getMatches = async (isEnd: boolean = false, order: OrderByDirection = "asc") => {
    const db = getDB();
    const collectionRef = db.collection("matches")
    const querySnapshot = await collectionRef.where("isEnd", "==", isEnd).orderBy("startDate", order).get()

    const result: Match[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const docData = doc.data() as Match;

        const mapData = { ...docData, starDateTimestamp: docData.startDate.toMillis() }

        result.push({ ...mapData })
    }

    return result;
}

export const getStages = async (order: OrderByDirection = "asc") => {
    const db = getDB();
    const collectionRef = db.collection("stages")
    const querySnapshot = await collectionRef.orderBy("startDate", order).get()

    const result: Stage[] = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i]
        const docData = doc.data() as Stage;

        const mapData = { ...docData, starDateTimestamp: docData.startDate.toMillis() }

        result.push({ ...mapData })
    }

    return result;
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
    // const db = getDB();
    // const collectionRef = db.collection("stages")
    // const querySnapshot = await collectionRef.orderBy("startDate", order).get()

    const result: StageWithMatchesAndUserPick[] = [];

    // for (let i = 0; i < querySnapshot.docs.length; i++) {
    //     const doc = querySnapshot.docs[i]
    //     const docData = doc.data() as Stage;

    //     docData.starDateTimestamp = docData.startDate.toMillis();

    //     const stage = { ...docData }

    //     const matchesAndPick = await getMatchesAndUserPickByStageId(userId, docData.id, isEnd);

    //     result.push({ ...docData, matches: matchesAndPick } as StageWithMatchesAndUserPick)
    // }

    // return result;
    const teams = await getTeams();
    const stages = await getStages(order) as StageWithMatchesAndUserPick[];
    const matches = await getMatches(isEnd, order) as MatchWithUserPick[]
    const userPicks = await getUserPicks(userId);

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        match.homeTeam = teams.find(e => e.id == match.homeTeamId);
        match.awayTeam = teams.find(e => e.id == match.awayTeamId);
        match.userPick = userPicks.find(e => e.matchId == match.id) || null;
    }

    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        stage.matches = matches.filter(e => e.stageId === stage.id)

        if (stage.matches.length > 0) {
            result.push(stage);
        }
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

export const getUsersWithPicks = async () => {
    let result: UserWithMatchesAndPick[] = []

    const users: User[] = await getUsers() as UserWithMatchesAndPick[];

    const allPicks: UserPick[] = await getAllPicks();

    const teams = await getTeams();
    const matches = await getAllMatches() as MatchWithUserPick[];

    for (let i = 0; i < users.length; i++) {
        const user = users[i] as UserWithMatchesAndPick;
        user.matches = matches;

        for (let j = 0; j < user.matches.length; j++) {
            const match = matches[j];
            match.homeTeam = teams.find(e => e.id == match.homeTeamId);
            match.awayTeam = teams.find(e => e.id == match.awayTeamId);
            match.userPick = allPicks.find(e => e.matchId == match.id) || null;
        }

        result.push(user);
    }

    return result;


}
