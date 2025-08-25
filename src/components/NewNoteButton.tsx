"use client";

import React, {useState} from "react";
import {User} from "@supabase/supabase-js";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useRouter} from "next/navigation";
import {v4 as uuidv4} from "uuid";
import {toast} from "sonner";
import {createNoteAction} from "@/actions/notes";

interface NewNoteButtonProps {
    user: User | null;
};

export default function NewNoteButton(props: NewNoteButtonProps) {
    const {user} = props;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleClickNewNoteButton = async () => {
        if (!user) {
            router.push("/login");
        } else {
            setLoading(true);
            const uuid = uuidv4();
            await createNoteAction(uuid);
            router.push(`?noteId=${uuid}`);
            toast.success("New note created", {
                description: "You've successfully created a new note",
                position: "top-center",
            });
            setLoading(false);
        }
    }

    return (
        <Button onClick={handleClickNewNoteButton} variant="secondary" className="w-24" disabled={loading}>
            {loading ? <Loader2 className="animate-spin"/> : "New Note"}
        </Button>
    );
};