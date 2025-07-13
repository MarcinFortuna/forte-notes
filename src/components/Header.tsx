import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return <header>
        <Link href="/">
            <Image src="/ForteNotesLOGO.png" alt="Forte Notes" height={60} width={60} className="rounded" priority/>
        </Link>
    </header>
}