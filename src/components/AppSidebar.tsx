import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar"
import {getUser} from "@/auth/server";
import {Note} from "@prisma/client";
import {prisma} from "@/db/prisma";
import Link from "next/link";
import SidebarGroupContent from "@/components/SidebarGroupContent";

export default async function AppSidebar() {

    const user = await getUser();
    let notes: Note[] = [];

    if (user) {
        notes = await prisma.note.findMany({
            where: {
                authorId: user.id
            },
            orderBy: {
                updatedAt: "desc"
            }
        })
    }

    return (
        <Sidebar>
            <SidebarContent className="customScrollbar">
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-2 mt-2 text-lg">
                        {
                            user
                                ? "Your notes"
                                : <p><Link className="underline" href="/login">Login</Link>{" "}to see your notes</p>
                        }
                    </SidebarGroupLabel>
                    {!!user && <SidebarGroupContent notes={notes} />}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    );
}