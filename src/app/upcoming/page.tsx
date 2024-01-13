import LogoutButton from "@/components/buttons/LogoutButton";
import { PronosList } from "@/components/pronos-list";

export default async function Upcoming() {

    return (
        <div className="w-full min-h-[100vh-5rem] flex flex-col items-center mx-auto">

            <div className="w-full flex justify-between my-10">
                <h1 className="text-2xl font-bold">Matchs à venir</h1>
            </div>
            <PronosList type="upcoming" readonly={false} />
        </div>
    );
}
