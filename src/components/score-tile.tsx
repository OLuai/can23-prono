// "use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/registry/default/ui/select"
import { Match, Stage, Team, UserPick } from "@/types/firestoreData"
import clsx from "clsx"
import Image from 'next/image'
import { useState } from "react"
import { v4 } from "uuid"

interface Props {
    matchInfo: Match,
    userPick: UserPick | null,
    homeTeam?: Team,
    awayTeam?: Team,
    readonly?: boolean
    setProno?: Function,
    userId: string,
}

export const ScoreTile = ({ matchInfo, userPick, homeTeam, awayTeam, readonly = true, setProno = () => { }, userId }: Props) => {

    const startDate = new Date(matchInfo.starDateTimestamp ?? "");

    const [myPick, setMyPick] = useState(userPick);

    const setPronoHandle = (prono: UserPick) => {
        setProno ? setProno(prono) : undefined;
        setMyPick(prono);
    }

    return (
        <div className="flex flex-col gap-1 mb-5">
            <div className="text-sm text-muted-foreground flex items-center justify-between">
                <span className="">{startDate.toLocaleDateString()}</span>
                <span className="">{startDate.toTimeString().slice(0, 5)}</span>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-1">
                    <TeamInfo team={homeTeam} />
                    <ScoreInfo setProno={setPronoHandle} userId={userId} readonly={readonly} awayTeam={awayTeam} homeTeam={homeTeam} matchInfo={matchInfo} userPick={userPick} />
                    <TeamInfo team={awayTeam} isAway={true} />
                </div>
                {myPick && (
                    <div className="m-4 flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <span className="text-sm">Buteur: </span>
                            <ScorerSelect userPick={myPick} awayTeam={awayTeam} homeTeam={homeTeam} readonly={readonly} setProno={setPronoHandle} />
                        </div>
                        <div className="pourLesPoints">

                        </div>
                    </div>
                )}
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
    readonly?: boolean,
    setProno?: Function,
    userId: string
}

const ScoreInfo = ({ matchInfo, userPick, homeTeam, awayTeam, readonly = true, setProno, userId }: ScoreInfoProps) => {
    const initialPick: UserPick = userPick || { id: v4(), matchId: matchInfo.id, userId: userId }
    const [pick, setPick] = useState<UserPick>(initialPick);

    const changeHandler = (propName: "homeTeamScore" | "awayTeamScore", value: string) => {

        let numberValue = parseInt(value) || 0;

        const newPick = { ...pick, homeTeamScore: pick.homeTeamScore || 0, awayTeamScore: pick.awayTeamScore || 0, [propName]: numberValue };
        setPick(newPick);
        setProno ? setProno(newPick) : undefined;

        // console.log(setProno, "ON CHANGE", pick);

    }

    return (
        <div className="min-w-[100px] gap-1 flex items-center justify-center">
            <input value={pick.homeTeamScore} onChange={(e) => changeHandler("homeTeamScore", e.currentTarget.value)} disabled={readonly} type="text" maxLength={2} className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            <span>:</span>
            <input value={pick.awayTeamScore} onChange={(e) => changeHandler("awayTeamScore", e.currentTarget.value)} disabled={readonly} type="text" maxLength={2} className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
        </div>
    )
}

interface ScorerSelectProps {
    homeTeam?: Team,
    awayTeam?: Team,
    readonly?: boolean,
    userPick: UserPick,
    setProno?: Function,
}

const ScorerSelect = ({ homeTeam, awayTeam, readonly, userPick, setProno = () => { } }: ScorerSelectProps) => {
    const changeHandler = (value: string) => {

        const newPick = { ...userPick };
        newPick.scorer = value;
        if (homeTeam && awayTeam) {
            newPick.scorerName = ([...homeTeam?.players, ...awayTeam?.players]).find(pl => pl.id == value)?.displayName;
        }

        setProno ? setProno(newPick) : undefined;

        // console.log("ON CHANGE", newPick);

    }
    return (
        <Select onValueChange={changeHandler} value={userPick.scorer} disabled={readonly}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Choisir un buteur" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{homeTeam?.displayName}</SelectLabel>
                    {homeTeam?.players.map(pl => <SelectItem key={pl.id} value={pl.id}>{pl.displayName}</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>{awayTeam?.displayName}</SelectLabel>
                    {awayTeam?.players.map(pl => <SelectItem key={pl.id} value={pl.id}>{pl.displayName}</SelectItem>)}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
