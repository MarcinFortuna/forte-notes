"use client";

import React, {useEffect, useMemo, useState} from "react";
import {Note} from "@prisma/client";
import {useSearchParams} from "next/navigation";
import useNote from "@/hooks/useNote";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import Link from "next/link";

interface SelectNoteButtonProps {
    note: Note;
};

export default function SelectNoteButton(props: SelectNoteButtonProps) {
    const {note} = props;
    const noteId = useSearchParams().get("noteId") || "";

    const {noteText: selectedNoteText} = useNote();
    const blankNoteText: string = "EMPTY NOTE";

    const [shouldBeGlobalNoteText, setShouldBeGlobalNoteText] = useState<boolean>(false);
    const [localNoteText, setLocalNoteText] = useState<string>(note.text);

    const noteText = useMemo(() => {
        if (shouldBeGlobalNoteText) return selectedNoteText || blankNoteText;
        return localNoteText || blankNoteText;
    }, [localNoteText, selectedNoteText, shouldBeGlobalNoteText]);

    useEffect(() => {
        setShouldBeGlobalNoteText(note.id === noteId);
    }, [note.id, noteId]);

    useEffect(() => {
        if (shouldBeGlobalNoteText) setLocalNoteText(selectedNoteText);
    }, [shouldBeGlobalNoteText, selectedNoteText]);

    return (
        <SidebarMenuButton asChild className={`items-start gap-0 pr-12 ${shouldBeGlobalNoteText ? "bg-sidebar-accent-50" : ""}`}>
            <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
                <p className="w-full overflow-hidden text-ellipsis truncate whitespace-nowrap">
                    {noteText}
                </p>
                <p className="text-xs text-muted-foreground">
                    {note.updatedAt.toDateString()}
                </p>
            </Link>
        </SidebarMenuButton>
    );
};