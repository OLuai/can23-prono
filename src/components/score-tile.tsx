// "use client"
import { getUserMatchTotal } from "@/lib/utils"
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
    date?: number,
    stage: Stage
}

export const ScoreTile = ({ matchInfo, userPick, homeTeam, awayTeam, readonly = true, setProno = () => { }, userId, date = new Date().getTime(), stage }: Props) => {

    const startDate = new Date(matchInfo.starDateTimestamp ?? "");
    const isReadonly = readonly || (date > (matchInfo.starDateTimestamp || 0));
    const initialPick: UserPick = userPick || { id: v4(), matchId: matchInfo.id, userId: userId }

    const [myPick, setMyPick] = useState<UserPick>(userPick ?? initialPick);

    const setPronoHandle = (prono: UserPick) => {
        setProno ? setProno(prono) : undefined;
        if (stage.type === "final" && prono.awayTeamScore !== prono.homeTeamScore) {
            delete prono.winner;
        }
        if (prono.awayTeamScore === 0 && prono.homeTeamScore === 0) {
            prono.scorer = "aucun";
            prono.scorerName = "aucun";
        } else {
            if (prono.scorer === "aucun") {
                delete prono.scorer
                delete prono.scorerName
            }
        }
        setMyPick(prono);
    }

    return (
        <div className={clsx("flex flex-col gap-1 mb-5", isReadonly && "opacity-65")}>
            <div className="text-sm text-muted-foreground flex items-center justify-between">
                <span className="">{startDate.toLocaleDateString()}</span>
                <span className="">{startDate.toTimeString().slice(0, 5)}</span>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-1">
                    <TeamInfo team={homeTeam} />
                    <ScoreInfo setProno={setPronoHandle} userId={userId} readonly={isReadonly} awayTeam={awayTeam} homeTeam={homeTeam} matchInfo={matchInfo} userPick={myPick} />
                    <TeamInfo team={awayTeam} isAway={true} />
                </div>
                {myPick && (
                    <div className="m-4 flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <span className="text-sm">Buteur: </span>
                            <ScorerSelect userPick={myPick} awayTeam={awayTeam} homeTeam={homeTeam} readonly={isReadonly} setProno={setPronoHandle} />
                        </div>
                    </div>
                )}
                {myPick && stage.type === "final" && (myPick.awayTeamScore === myPick.homeTeamScore) && (
                    <div className="m-4 flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <span className="text-sm">Qualif: </span>
                            <WinnerSelect userPick={myPick} awayTeam={awayTeam} homeTeam={homeTeam} readonly={isReadonly} setProno={setPronoHandle} />
                        </div>
                    </div>
                )}
                {matchInfo.isEnd && (<div className="font-semibold text-sm">
                    {`${getUserMatchTotal({ ...matchInfo, userPick: userPick })[0]} pts`}
                </div>)}
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
    userPick: UserPick,
    homeTeam?: Team,
    awayTeam?: Team,
    readonly?: boolean,
    setProno?: Function,
    userId: string
}

const ScoreInfo = ({ matchInfo, userPick, homeTeam, awayTeam, readonly = true, setProno, userId }: ScoreInfoProps) => {

    const pick = userPick;
    const homePlayersIds = homeTeam?.players.map(e => e.id);
    const awayPlayersIds = awayTeam?.players.map(e => e.id);

    const changeHandler = (propName: "homeTeamScore" | "awayTeamScore", value: string) => {

        let numberValue = parseInt(value) || 0;

        const newPick = { ...pick, homeTeamScore: pick.homeTeamScore || 0, awayTeamScore: pick.awayTeamScore || 0, [propName]: numberValue };
        if (numberValue === 0) {
            if (newPick.scorer != undefined && propName === "homeTeamScore" && homePlayersIds?.includes(newPick.scorer)) {
                newPick.scorer = newPick.awayTeamScore > 0 ? undefined : "aucun";
                newPick.scorerName = newPick.awayTeamScore > 0 ? undefined : "aucun";

            }
            else if (newPick.scorer != undefined && propName === "awayTeamScore" && awayPlayersIds?.includes(newPick.scorer)) {
                newPick.scorer = newPick.homeTeamScore > 0 ? undefined : "aucun";
                newPick.scorerName = newPick.homeTeamScore > 0 ? undefined : "aucun";
            }
            else if (!!!newPick.scorer) {
                newPick.scorer = "aucun";
                newPick.scorerName = "aucun";
            }
        }
        else {
            if (newPick.scorer == "aucun") {
                newPick.scorer = undefined;
                newPick.scorerName = undefined;
            }
        }

        setProno ? setProno(newPick) : undefined;

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

    }
    return (
        <Select onValueChange={changeHandler} value={userPick.scorer} disabled={readonly}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Choisir un buteur" />
            </SelectTrigger>
            <SelectContent>
                {userPick.scorer === "aucun" && (<SelectItem value={"aucun"}>{"aucun"}</SelectItem>)}
                {((userPick.homeTeamScore ?? 0) > 0) && (
                    <SelectGroup>
                        <SelectLabel>{homeTeam?.displayName}</SelectLabel>
                        {homeTeam?.players.map(pl => <SelectItem key={pl.id} value={pl.id}>{pl.displayName}</SelectItem>)}
                    </SelectGroup>
                )}
                {((userPick.awayTeamScore ?? 0) > 0) && (
                    <SelectGroup>
                        <SelectLabel>{awayTeam?.displayName}</SelectLabel>
                        {awayTeam?.players.map(pl => <SelectItem key={pl.id} value={pl.id}>{pl.displayName}</SelectItem>)}
                    </SelectGroup>
                )}
            </SelectContent>
        </Select>
    )
}

const WinnerSelect = ({ homeTeam, awayTeam, readonly, userPick, setProno = () => { } }: ScorerSelectProps) => {
    const changeHandler = (value: string) => {

        const newPick = { ...userPick };
        newPick.winner = value;
        setProno ? setProno(newPick) : undefined;

    }
    return (
        <Select onValueChange={changeHandler} value={userPick.winner} disabled={readonly}>
            <SelectTrigger className="w-[280px]">
                <SelectValue />
            </SelectTrigger>
            {homeTeam && awayTeam && (
                <SelectContent>
                    <SelectItem value={homeTeam?.id}>{homeTeam.displayName}</SelectItem>
                    <SelectItem value={awayTeam?.id}>{awayTeam.displayName}</SelectItem>
                </SelectContent>
            )}
        </Select>
    )
}
