import { MatchWithUserPick, UserWithMatchesAndPick } from "@/types/firestoreData";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserMatchTotal(match: MatchWithUserPick) {
  let total = 0;

  const isFinalStage = match.stageId !== "41bf2615-bd8f-4f76-a8a5-6c4fb19d44de";

  if (match.userPick && match.homeTeamScore != null && match.awayTeamScore != null && match.userPick.homeTeamScore != null && match.userPick.awayTeamScore != null) {
    const matchDiffScore = match.homeTeamScore - match.awayTeamScore;
    const userPickDiffScore = match.userPick.homeTeamScore - match.userPick.awayTeamScore

    const isDraw = (matchDiffScore === 0 && userPickDiffScore === 0);

    const bonEcart = matchDiffScore === userPickDiffScore;
    const bonneIssue = isDraw || (matchDiffScore * userPickDiffScore > 0)
    const bonScore = match.homeTeamScore == match.userPick.homeTeamScore && match.awayTeamScore == match.userPick.awayTeamScore;
    if (bonEcart)
      total += 1
    if (bonScore)
      total += 1

    if (!isFinalStage && bonneIssue) {
      total += 1
    }
    else if (isFinalStage && !isDraw && bonneIssue) {
      total += 1
    }
    else if (isFinalStage && isDraw && match.userPick.winner && match.userPick.winner === match.winner) {
      total += 1
    }


    if (match.scorersIds?.includes(match.userPick.scorer || "OURAGA LUAI"))
      total += 1
  }
  return total;
}

export function getUserTotal(user: UserWithMatchesAndPick) {
  const allowMatches = user.matches.filter(mt => mt.isEnd === true);

  const total = allowMatches.reduce((prev, cur) => {
    const subTot = getUserMatchTotal(cur);
    return prev + subTot;
  }, 0)
  return total;
}

export async function getToday() {
  let result = new Date().toLocaleDateString();
  const req = await fetch(`https://worldtimeapi.org/api/timezone/Africa/Abidjan?${new Date().getTime()}`);
  if (req.ok) {
    const reqData = await req.json();
    result = reqData.utc_datetime.slice(0, 10);
  }
  return result;
}

export async function getApiDate() {
  let result = new Date().getTime();
  const req = await fetch(`https://worldtimeapi.org/api/timezone/Africa/Abidjan?${new Date().getTime()}`);
  if (req.ok) {
    const reqData = await req.json();
    result = new Date(reqData.datetime).getTime();
  }
  return result;
}