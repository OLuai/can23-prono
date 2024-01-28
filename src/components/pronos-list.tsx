"use client"
import { Match, StageWithMatchesAndUserPick, Team, UserPick } from "@/types/firestoreData";
import { useEffect, useState } from "react";
import { ScoreTile } from "./score-tile";
import React from "react";
import { SaveButton } from "./save-button";
import { Loader2 } from "lucide-react";

interface Props {
  type: "upcoming" | "history";
  readonly?: boolean,
}

export const PronosList = ({ type, readonly = true }: Props) => {

  const [stages, setStages] = useState<StageWithMatchesAndUserPick[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [userPronostics, setUserPronostics] = useState<UserPick[]>([]);
  const [canSave, setCanSave] = useState<boolean>(false)

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [apiDate, setApiDate] = useState<number>(new Date().getTime());

  const [isLoading, setIsLoading] = useState(true);

  const onSave = async () => {

    setIsSaving(true)

    let date = new Date().getTime();
    const reqDate = await fetch("https://worldtimeapi.org/api/timezone/Africa/Abidjan");
    if (reqDate.ok) {
      const reqData = await reqDate.json();
      date = new Date(reqData.datetime).getTime();
    }
    setApiDate(date);

    let matches: Match[] = []
    stages.forEach(stage => {
      matches = [...matches, ...stage.matches]
    });

    let allowMatches = matches.filter(mt => {
      if (mt.starDateTimestamp)
        return mt.starDateTimestamp > date;
      return false;
    }).map(mt => mt.id);

    allowMatches = matches.map(mt => mt.id);

    let allowPronostics = userPronostics.filter(pick => allowMatches.includes(pick.matchId));


    const req = await fetch(`/api/auth/savepronos`, {
      method: "POST",
      body: JSON.stringify({ picks: allowPronostics })
    });

    if (req.ok) {
      const reqData: any = await req.json();
      if (reqData.ok) {
        console.log('Pronos saved');
        setCanSave(false);
      }
    }
    setIsSaving(false)

  }

  function setProno(prono: UserPick) {

    let newPronos = userPronostics.filter(e => e.id != prono.id);
    newPronos.push(prono);
    setUserPronostics(newPronos);

    if (!readonly) {
      setCanSave(true)
    }
  }

  useEffect(() => {
    async function fetchData() {
      let date = new Date().getTime();
      const reqDate = await fetch("https://worldtimeapi.org/api/timezone/Africa/Abidjan");
      if (reqDate.ok) {
        const reqData = await reqDate.json();
        date = new Date(reqData.datetime).getTime();
      }

      setApiDate(date);

      const stageUri = type === "upcoming" ? "userpronos" : "userhistory"
      const stageReq = await fetch(`/api/auth/${stageUri}`, {
        method: "POST",
        body: JSON.stringify({})
      });
      // console.log("stageReq", stageReq)
      if (stageReq.ok) {
        const stageReqData = await stageReq.json();
        const stages = stageReqData.data as StageWithMatchesAndUserPick[];
        // console.log("stageReqData.data", stageReqData.data);

        setUserId(stageReqData.userId);
        setStages(stages);

        const pronos: UserPick[] = []
        stages.forEach(stage => {
          stage.matches.forEach(mt => {
            if (mt.userPick) {
              pronos.push(mt.userPick);
            }
          })
        })

        setIsLoading(false);

      }
    }

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="h-full w-full flex flex-1 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      ) :
        (
          <div className="w-full pb-6">
            {canSave && (
              <div className="fixed top-16 right-4 z-30 md:sticky md:block">
                <div className=" flex items-center flex-1 justify-end">
                  <SaveButton clickHandler={onSave} isLoading={isSaving} />
                </div>
              </div>
            )}
            {
              stages.map(stage => {
                return (
                  <React.Fragment key={stage.id}>
                    <div className="mt-3 mb-1">{stage.displayName}</div>
                    {
                      stage.matches.map(mt => {
                        return (<ScoreTile stage={stage} date={apiDate} userId={userId} setProno={readonly ? undefined : setProno} readonly={readonly} key={mt.id} matchInfo={mt} userPick={mt.userPick} awayTeam={mt.awayTeam} homeTeam={mt.homeTeam} />)
                      })
                    }
                  </React.Fragment>
                )
              })
            }
          </div>
        )
      }
    </>

  )
}