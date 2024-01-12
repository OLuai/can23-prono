import LogoutButton from "@/components/buttons/LogoutButton";
import { getCurrentUser } from "@/lib/session";
import { group } from "console";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image'
import { useEffect, useState } from "react";
import { env } from "@/env.mjs";
import { getUsers, getStageAndMatchesUpcoming, getTeams } from "@/lib/data";
import { ScoreTile } from "@/components/score-tile";

export default async function Resume() {
  // const session = await getCurrentUser();
  const stages = await getStageAndMatchesUpcoming();
  const teams = await getTeams();

  // const teamRep = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/auth/teams`);
  // console.log("stages", stages);

  return (
    <div className=" min-h-[100vh-5rem] flex flex-col items-center mx-auto">

      <div className="w-full flex justify-between my-10">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        {/* <LogoutButton /> */}
      </div>
      <div className="">
        {
          stages.map(stage => {
            let items = stage.matches.map(mt => {
              let awayTeam = teams.find(e => e.id == mt.awayTeamId);
              let homeTeam = teams.find(e => e.id == mt.homeTeamId);
              return (<ScoreTile key={mt.id} matchInfo={mt} stage={stage} userPick={null} awayTeam={awayTeam} homeTeam={homeTeam} />)
            })
            return items;
          })
        }
      </div>
    </div>
  );
}
