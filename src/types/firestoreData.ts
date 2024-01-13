import { Timestamp } from "firebase-admin/firestore";

export interface Team {
    id: string;
    displayName: string;
    flagId: string;
    group: "A" | "B" | "C" | "D" | "E" | "F";
    players: { id: string, displayName: string }[]
}
export interface Stage {
    id: string;
    displayName: string;
    startDate: Timestamp;
    starDateTimestamp?: number;
}



export interface Match {
    id: string;
    stageId: string;
    startDate: Timestamp;
    starDateTimestamp?: number;
    homeTeamId: string;
    awayTeamId: string;
    homeTeamScore: string | null;
    awayTeamScore: string | null;
    scorersIds: string | null;
    isEnd: boolean;
    homeTeam?: Team;
    awayTeam?: Team;
}

export interface UserPick {
    id: string;
    userId: string;
    matchId: string;
    homeTeamScore?: number;
    awayTeamScore?: number;
    scorer?: string;
    scorerName?: string;
}

export interface MatchWithUserPick extends Match {
    userPick: UserPick | null;
    homeTeam?: Team;
    awayTeam?: Team;
}

export interface StageWithMatchesAndUserPick extends Stage {
    matches: MatchWithUserPick[]
}

