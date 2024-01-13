"use client"
import { StageWithMatchesAndUserPick, Team } from "@/types/firestoreData";
import { useEffect, useState } from "react";
import { ScoreTile } from "./score-tile";
import React from "react";

interface Props {
  type: "upcoming" | "history";
  readonly?: boolean
}

export const PronosList = ({ type, readonly = true }: Props) => {

  const [stages, setStages] = useState<StageWithMatchesAndUserPick[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function fetchData() {
      const teamsReq = await fetch(`/api/auth/teams`);
      if (teamsReq.ok) {
        const teamsReqData = await teamsReq.json()
        setTeams(teamsReqData.data)
      }
      const stageUri = type === "upcoming" ? "userpronos" : "userhistory"
      const stageReq = await fetch(`/api/auth/${stageUri}`, {
        method: "POST",
        body: JSON.stringify({})
      });
      console.log("stageReq", stageReq)
      if (stageReq.ok) {
        const stageReqData = await stageReq.json();
        console.log("stageReqData.data", stageReqData.data)
        setStages(stageReqData.data)
      }
    }

    fetchData();


  }, []);

  return (
    <div className="w-full">
      {
        stages.map(stage => {
          return (
            <React.Fragment key={stage.id}>
              <div className="mt-3 mb-1">{stage.displayName}</div>
              {
                stage.matches.map(mt => {
                  let awayTeam = teams.find(e => e.id == mt.awayTeamId);
                  let homeTeam = teams.find(e => e.id == mt.homeTeamId);
                  return (<ScoreTile key={mt.id} matchInfo={mt} userPick={mt.userPick} awayTeam={awayTeam} homeTeam={homeTeam} />)
                })
              }
            </React.Fragment>
          )
        })
      }
    </div>
  )
}