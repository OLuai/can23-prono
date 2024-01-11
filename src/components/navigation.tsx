import Link from "next/link"

interface Props {
    children?: React.ReactNode
}

export const Navigation = ({ }: Props) => {

    return (
        <div className="flex flex-col space-y-2">

            <div className="flex flex-col space-y-1 pt-2">
                <h4 className="font-medium">Mes pronos</h4>
                <Link href="/">
                    Récapitulatif
                </Link>
                <Link href="/upcoming">
                    Match à venir
                </Link>
                <Link href="/bonus">
                    Questions bonus
                </Link>
                <Link href="/history">
                    Historique
                </Link>
            </div>

            <div className="flex flex-col space-y-1 pt-2">
                <div className="font-medium">Créer une ligue</div>
                <div className="font-medium">Rejoindre une ligue</div>
            </div>

            <div className="flex flex-col space-y-1 pt-2">
                <h4 className="font-medium">Mes ligues</h4>
                <Link href="/league?id=007">
                    WeLoveSport
                </Link>
            </div>
            {/* {docsConfig.sidebarNav.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 pt-6">
                    <h4 className="font-medium">{item.title}</h4>
                    {item?.items?.length &&
                        item.items.map((item) => (
                            <React.Fragment key={item.href}>
                                {!item.disabled &&
                                    (item.href ? (
                                        <MobileLink
                                            href={item.href}
                                            className="text-muted-foreground"
                                        >
                                            {item.title}
                                            {item.label && (
                                                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                                                    {item.label}
                                                </span>
                                            )}
                                        </MobileLink>
                                    ) : (
                                        item.title
                                    ))}
                            </React.Fragment>
                        ))
                        }
                </div>
            ))} */}
        </div>
    )
}