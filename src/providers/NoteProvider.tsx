"use client";

import React, {createContext, useState} from "react";

interface NoteProviderContextType {
    noteText: string;
    setNoteText: (text: string) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
    noteText: "",
    setNoteText: () => {
    },
});

interface NoteProviderProps {
    children: React.ReactNode | React.ReactNode[];
}

export default function NoteProvider(props: NoteProviderProps) {
    const [noteText, setNoteText] = useState<string>("");
    const {children} = props;

    return <NoteProviderContext.Provider value={{noteText, setNoteText}}>
        {children}
    </NoteProviderContext.Provider>;
}
