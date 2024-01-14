import { MatchWithUserPick, UserWithMatchesAndPick } from "@/types/firestoreData";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserMatchTotal(match: MatchWithUserPick) {
  let total = 0;

  if (match.userPick && match.homeTeamScore != null && match.awayTeamScore != null && match.userPick.homeTeamScore != null && match.userPick.awayTeamScore != null) {
    const matchDiffScore = match.homeTeamScore - match.awayTeamScore;
    const userPickDiffScore = match.userPick.homeTeamScore - match.userPick.awayTeamScore
    const bonEcart = matchDiffScore === userPickDiffScore;
    const bonneIssue = (matchDiffScore === 0 && userPickDiffScore === 0) || (matchDiffScore * userPickDiffScore > 0)
    const bonScore = match.homeTeamScore == match.userPick.homeTeamScore && match.awayTeamScore == match.userPick.awayTeamScore;

    if (bonEcart)
      total += 1
    if (bonneIssue)
      total += 1
    if (bonScore)
      total += 1
    if (match.scorersIds?.includes(match.userPick.scorer || ""))
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
  const req = await fetch("http://worldtimeapi.org/api/timezone/Africa/Abidjan");
  if (req.ok) {
    const reqData = await req.json();
    result = new Date(reqData.datetime).toLocaleDateString();
  }
  return result;
}

export async function getApiDate() {
  let result = new Date().getTime();
  const req = await fetch("http://worldtimeapi.org/api/timezone/Africa/Abidjan");
  if (req.ok) {
    const reqData = await req.json();
    result = new Date(reqData.datetime).getTime();
  }
  return result;
}