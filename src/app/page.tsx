import LogoutButton from "@/components/buttons/LogoutButton";
import { getCurrentUser } from "@/lib/session";
import { group } from "console";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image'
import { useEffect, useState } from "react";
import { env } from "@/env.mjs";

export default async function Resume() {
  const session = await getCurrentUser();

  const teamRep = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/auth/teams`);
  // console.log("teamRep", teamRep);

  return (
    <div className="max-w-2xl min-h-[100vh-5rem] flex flex-col items-center mx-auto">

      <div className="w-full flex justify-between my-10">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        {/* <LogoutButton /> */}
      </div>
    </div>
  );
}
