import LogoutButton from "@/components/buttons/LogoutButton";
import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth";

export default async function Resume() {
    const session = await getCurrentUser();

    return (
        <div className="max-w-2xl min-h-[100vh-5rem] flex flex-col items-center mx-auto">

            <div className="w-full flex justify-between my-10">
                <h1 className="text-2xl font-bold">Match à venir</h1>
                <LogoutButton />
            </div>
            <pre className="w-full bg-gray-200 p-4 rounded break-words whitespace-pre-wrap">
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
    );
}
