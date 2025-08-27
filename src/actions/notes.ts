"use server";

import {getUser} from "@/auth/server";
import {handleError} from "@/lib/utils";
import {prisma} from "@/db/prisma";
import ai from "@/google-gen-ai";

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

    const systemInstruction: string = `You are a helpful assistant that answers questions about a user's notes. Assume all questions are related to the user's notes. Make sure that your answers are not too verbose and you speak succinctly. Your responses MUST be formatted in clean, valid HTML with proper structure. Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. Avoid inline styles, JavaScript, or custom attributes. Rendered like this in JSX: <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} /> Here are the user's notes: ${formattedNotes}`

    const chatHistory = [];

    for (let i = 0; i < responses.length; i++) {
        chatHistory.push({
            role: "user",
            parts: [{ text: questions[i] }]
        });
        if (responses.length > i) {
            chatHistory.push({
                role: "model",
                parts: [{ text: responses[i] }]
            })
        }
    }

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: systemInstruction,
        },
        history: chatHistory,
    });

    const { text } = await chat.sendMessage({
       message: questions[questions.length - 1]
    });

    return text || "A problem has occurred.";
}