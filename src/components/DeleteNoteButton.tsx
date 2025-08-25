"use client";

import React, {useTransition} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Loader2, Trash2} from "lucide-react";
import {toast} from "sonner";
import {useRouter, useSearchParams} from "next/navigation";
import {deleteNoteAction} from "@/actions/notes";

interface DeleteNoteButtonProps {
    noteId: string;
    deleteNoteLocally: (id: string) => void;
};

export default function DeleteNoteButton(props: DeleteNoteButtonProps) {
    const {noteId, deleteNoteLocally} = props;

    const router = useRouter();

    const [pending, startTransition] = useTransition();
    const noteIdParam = useSearchParams().get("noteId") || "";

    const handleDeleteNote = () => {
        startTransition(async () => {
            const { errorMessage } = await deleteNoteAction(noteId);
            if (!errorMessage) {
                toast.success("Note deleted", {
                    description: "You've successfully deleted this note",
                    position: "top-center"
                });
                deleteNoteLocally(noteId);
                if (noteId === noteIdParam) {
                    router.replace("/");
                }
            } else {
                toast.error("Error", {
                    description: errorMessage,
                    position: "top-center"
                });
            }
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button asChild variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 size-5 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-2">
                    <Trash2/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the note from the server.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteNote}
                                       className="w-24 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {pending ? <Loader2 className="animate-spin"/> : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};