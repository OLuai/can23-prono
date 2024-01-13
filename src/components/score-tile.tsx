// "use client"
import { Match, Stage, Team, UserPick } from "@/types/firestoreData"
import clsx from "clsx"
import Image from 'next/image'

interface Props {
    matchInfo: Match,
    userPick: UserPick | null,
    homeTeam?: Team,
    awayTeam?: Team,
}

export const ScoreTile = ({ matchInfo, userPick, homeTeam, awayTeam }: Props) => {

    const startDate = new Date(matchInfo.starDateTimestamp ?? "");

    return (
        <div className="flex flex-col gap-1 mb-5">
            <div className="text-sm text-muted-foreground flex items-center justify-between">
                <span className="">{startDate.toLocaleDateString()}</span>
                <span className="">{startDate.toTimeString().slice(0, 5)}</span>
            </div>
            <div className="flex flex-1">
                <TeamInfo team={homeTeam} />
                <ScoreInfo awayTeam={awayTeam} homeTeam={homeTeam} matchInfo={matchInfo} userPick={userPick} />
                <TeamInfo team={awayTeam} isAway={true} />
            </div>
        </div>
    )
}

interface TeamTileProps {
    team?: Team,
    isAway?: boolean
}

const TeamInfo = ({ team, isAway = false }: TeamTileProps) => {
    if (team)
        return (
            <div className={clsx("flex w-[45%] flex-col items-center md:flex-row gap-1", isAway && "md:flex-row-reverse")}>
                <div className="w-12 h-12">
                    <Image width={48} height={48} className="w-12 h-12" alt={team.flagId} src={`https://flagsapi.com/${team.flagId}/shiny/64.png`} />
                </div>
                <div className="text-center items-center text-sm font-medium leading-none">{team.displayName}</div>
            </div>
        )
    else return null;
}

interface ScoreInfoProps {
    matchInfo: Match,
    userPick: UserPick | null,
    homeTeam?: Team,
    awayTeam?: Team,
}

const ScoreInfo = ({ matchInfo, userPick, homeTeam, awayTeam }: ScoreInfoProps) => {

    return (
        <div className="min-w-[100px] gap-1 flex items-center justify-center">
            <input type="text" maxLength={2} className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            <span>:</span>
            <input type="text" maxLength={2} className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
        </div>
    )
}