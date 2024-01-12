import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { UserData } from "@/types/appData"

export async function getCurrentUser() {
  const session: UserData | null = await getServerSession(authOptions);

  return session
}
