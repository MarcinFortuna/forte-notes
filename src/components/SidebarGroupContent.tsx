"use client";

import React, {useEffect, useMemo, useState} from "react";
import {Note} from "@prisma/client";
import {SidebarGroupContent as SidebarGroupContentShadCn, SidebarMenu, SidebarMenuItem} from "@/components/ui/sidebar";
import {SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import Fuse from "fuse.js";
import SelectNoteButton from "@/components/SelectNoteButton";
import DeleteNoteButton from "@/components/DeleteNoteButton";

interface SidebarGroupContentProps {
    notes: Note[];
}

export default function SidebarGroupContent(props: SidebarGroupContentProps) {

    const {notes} = props;

    const [searchText, setSearchText] = useState<string>("");
    const [localNotes, setLocalNotes] = useState<Note[]>(notes);

    const fuse = useMemo(() => {
        return new Fuse(localNotes, {keys: ["text"]});
    }, [localNotes]);

    const filteredNotes = searchText ? fuse.search(searchText).map((result) => result.item) : localNotes;

    const deleteNoteLocally = (noteId: string) => setLocalNotes((localNotes) => localNotes.filter((el: Note) => el.id !== noteId));

    useEffect(() => {
        setLocalNotes(notes);
    }, [notes]);

    return <SidebarGroupContentShadCn>
        <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-4"/>
            <Input className="bg-muted pl-8" placeholder="Search your notes..." value={searchText}
                   onChange={(e) => setSearchText(e.target.value)}/>
        </div>
        <SidebarMenu className="mt-4">
            {filteredNotes.map((note) => <SidebarMenuItem key={note.id}
                                                          className="group/item">
                <SelectNoteButton note={note}/>
                <DeleteNoteButton noteId={note.id} deleteNoteLocally={deleteNoteLocally} />
            </SidebarMenuItem>)}
        </SidebarMenu>
    </SidebarGroupContentShadCn>;
}