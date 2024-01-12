import { Timestamp } from "firebase-admin/firestore";

export type Team = {
    id: string;
    displayName: string;
    flagId: string;
    group: "A" | "B" | "C" | "D" | "E" | "F";
}
export type Stage = {
    id: string;
    displayName: string;
}



export type Match = {
    id: string;
    stageId: string;
    startDate: Timestamp;
    homeTeamId: string;
    awayTeamId: string;
    homeTeamScore: string | null;
    awayTeamScore: string | null;
    scorersIds: string | null;
    isEnd: boolean;
}

export type UserPick = {
    id: string;
    userId: string;
    matchId: string;
    homeTeamScore: string;
    awayTeamScore: string;
    scorer: string
}

