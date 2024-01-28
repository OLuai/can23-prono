/* eslint-disable react/no-unescaped-entities */
import { getUsersWithPicks } from "@/lib/data";
import { getApiDate, getToday, getUserMatchTotal, getUserTotal } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/default/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/default/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/default/ui/tabs";
import { UserWithMatchesAndPick } from "@/types/firestoreData";



export default async function Resume() {


  // const teamRep = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/auth/teams`);
  // console.log("teamRep", teamRep);

  const usersData = await getUsersWithPicks();
  const apiDateTime = await getApiDate();
  const today = new Date(apiDateTime).toISOString().slice(0, 10);
  console.log(today);

  return (
    <div className="w-full min-h-[100vh-5rem] flex flex-col items-center mx-auto">

      <div className="w-full flex justify-between my-10">
        <h1 className="text-2xl font-bold">We Love Sport</h1>
      </div>
      <ResumeTabs currentDatetime={apiDateTime} users={usersData} date={today} />
    </div>
  );
}

interface ResumeTabsProps {
  users: UserWithMatchesAndPick[];
  date: string;
  currentDatetime: number

}

function ResumeTabs({ users, date, currentDatetime }: ResumeTabsProps) {

  let rankingData = users.map((user) => {
    const userTotal = getUserTotal(user);
    return {
      name: user.name,
      total: userTotal[0],
      rank: 0,
      score: userTotal[1]
    }
  }).sort((u1, u2) => {
    if (u1.total < u2.total)
      return 1
    if (u1.total > u2.total)
      return -1
    return 0
  });
  let lastRank: number = 1;
  rankingData = rankingData.map((data, ind, arr) => {
    const rankData = { ...data };
    rankData.rank = ind + 1;
    if (ind != 0) {
      if (rankData.total === arr[ind - 1].total) {
        rankData.rank = lastRank;
      }

    }
    lastRank = rankData.rank;
    return rankData;
  });

  // console.log("rankingData", rankingData)
  let todayResumeData = users.map(user => {

    const todayMatches = user.matches.filter(mt => {
      const matchDate = new Date(mt.starDateTimestamp ?? "").toISOString().slice(0, 10)
      return date === matchDate && (mt.starDateTimestamp ?? 0) < currentDatetime
    });

    const pronos = todayMatches.map(mt => {
      return (

        <div key={mt.id} className="flex flex-col font-light text-xs">
          <span>{`${mt.homeTeam?.displayName} : ${!!mt.userPick ? `${mt.userPick?.homeTeamScore} ${mt.homeTeamId === mt.userPick.winner ? " *" : ""}` : "n/a"}`}</span>
          <span>{`${mt.awayTeam?.displayName} : ${!!mt.userPick ? `${mt.userPick?.awayTeamScore} ${mt.awayTeamId === mt.userPick.winner ? " *" : ""}` : "n/a"}`}</span>
          <span>{`Buteur : ${!!mt.userPick ? mt.userPick?.scorerName ?? "n/a" : "n/a"}`}</span>
        </div>


      )
    });
    return {
      name: user.name,
      pronos,
      subTot: getUserTotal({ ...user, matches: todayMatches })[0]
    }
  })




  return (
    <Tabs defaultValue="ranking" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ranking">Classement</TabsTrigger>
        <TabsTrigger value="today-picks">Pronos du jour</TabsTrigger>
      </TabsList>
      <TabsContent value="ranking">
        <Card>
          <CardContent className="p-0 space-y-2">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Rang
                    </TableHead>
                    <TableHead>
                      Nom
                    </TableHead>
                    <TableHead className="text-center">
                      Scores exacts
                    </TableHead>
                    <TableHead className="text-center">
                      Points
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingData.map((data, ind) => (
                    <TableRow key={ind}>
                      <TableCell className="font-semibold">
                        {`#${data.rank}`}
                      </TableCell>
                      <TableCell>
                        {`${data.name}`}
                      </TableCell>
                      <TableCell className="text-center">
                        {`${data.score}`}
                      </TableCell>
                      <TableCell className="text-center">
                        {`${data.total}`}
                      </TableCell>
                    </TableRow>
                  ))}

                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="today-picks">
        <Card>
          <CardContent className="p-0 space-y-2">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Nom
                    </TableHead>
                    <TableHead>
                      Pronostics
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayResumeData.map((data, ind) => (
                    <TableRow key={ind}>
                      <TableCell>
                        {`${data.name}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 flex-1">
                          {data.pronos}
                          <span className="mt-1">{`${data.subTot} pts`}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}




