"use server";

import {getUser} from "@/auth/server";
import {handleError} from "@/lib/utils";
import {prisma} from "@/db/prisma";

export const updateNoteAction = async (noteId: string, text: string) => {
    try {
        const user = await getUser();
        if (!user) throw new Error("You must be logged in to update a note");

        await prisma.note.update({
            where: {
                id: noteId
            },
            data: {
                text
            }
        });

        return {errorMessage: null}
    } catch (error) {
        return handleError(error);
    }
}

export const createNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();
        if (!user) throw new Error("You must be logged in to update a note");

        await prisma.note.create({
            data: {
                id: noteId,
                text: "",
                authorId: user.id
            }
        });

        return {errorMessage: null}

    } catch (error) {
        return handleError(error);
    }
}

export const deleteNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();
        if (!user) throw new Error("You must be logged in to update a note");

        await prisma.note.delete({
            where: {
              id: noteId, authorId: user.id
            }
        });

        return {errorMessage: null}

    } catch (error) {
        return handleError(error);
    }
}

export const askAIAboutNotesAction = async (questions: string[], responses: string[]) => {
        const user = await getUser();
        if (!user) throw new Error("You must be logged in to ask AI about your notes");

        const notes = await prisma.note.findMany({
            where: {
                authorId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                text: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const filteredNotes = notes.filter((el) => el.text.length > 0);

        if (filteredNotes.length === 0) return "You don't have any contentful notes yet!";

        const formattedNotes: string = notes.map((note) => `
            Text: ${note.text}
            Created at: ${note.createdAt}
            Updated at: ${note.updatedAt}
        `.trim()).join("\n");

        // send request to AI, get a string as a return
        return "A problem has occurred.";
}