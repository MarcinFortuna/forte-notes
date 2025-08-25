"use client";

import React from "react";
import {Note} from "@prisma/client";

interface SidebarGroupContentProps {
    notes: Note[];
}

export default function SidebarGroupContent(props: SidebarGroupContentProps) {

    const {notes} = props;

    return <div>notes</div>

}