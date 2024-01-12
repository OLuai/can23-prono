import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

export interface UserData extends Session {
    user: AdapterUser
}

export interface AppParams {
    userData?: UserData | null
}