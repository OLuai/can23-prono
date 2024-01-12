import { Timestamp } from "firebase-admin/firestore";

export interface Team {
    id: string;
    displayName: string;
    flagId: string;
    group: "A" | "B" | "C" | "D" | "E" | "F";
}
export interface Stage {
    id: string;
    displayName: string;
    startDate: Timestamp;
}



export interface Match {
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

export interface UserPick {
    id: string;
    userId: string;
    matchId: string;
    homeTeamScore: string;
    awayTeamScore: string;
    scorer: string
}

export interface StageWithMatches extends Stage {
    matches: Match[]
}

