"use  client"

import { Button } from "@/registry/default/ui/button"
import { Loader2, SaveIcon } from "lucide-react"

interface Props {
    isLoading: boolean,
    clickHandler: Function
}

export const SaveButton = ({ clickHandler = () => { }, isLoading }: Props) => {

    if (isLoading) {
        return (
            <>
                <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Patientez
                </Button>
            </>
        )
    }

    return (
        <Button onClick={() => clickHandler()}>
            <SaveIcon className="mr-2 h-4 w-4" /> Enregistrer
        </Button>
    )
}