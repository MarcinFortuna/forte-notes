import React from "react";
import Link from "next/link";
import Image from "next/image";
import {shadow} from "@/styles/utils";
import {Button} from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";
import LogOutButton from "@/components/LogOutButton";
import {getUser} from "@/auth/server";

export default async function Header() {

    const user = await getUser();

    return <header className="relative w-full flex h-24 items-center justify-between bg-popover px-3 sm:px-8" style={{
        boxShadow: shadow
    }}>
        <Link className="flex items-end gap-2" href="/">
            <Image src="/ForteNotesLOGO.png" alt="Forte Notes" height={60} width={60} className="rounded" priority/>
            <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6">Forte <span>Notes</span></h1>
        </Link>
        <div className="flex gap-4">
            {
                user ? <LogOutButton /> : <>
                    <Button asChild>
                        <Link href="/sign-up" className="hidden sm:block">Sign Up</Link>
                    </Button>
                    <Button asChild className="outline">
                        <Link href="/login">Login</Link>
                    </Button>
                </>
            }
            <DarkModeToggle />
        </div>
    </header>
}