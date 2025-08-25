"use client";

import {useContext} from "react";
import {NoteProviderContext} from "@/providers/NoteProvider";

export default function useNote() {
    const context = useContext(NoteProviderContext);

    if (!context) throw new Error("useNote must be used within a Note Provider");

    return context;
}