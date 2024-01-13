import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

export interface UserData extends Session {
    appUser: AdapterUser
}