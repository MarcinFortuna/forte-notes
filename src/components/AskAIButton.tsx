"use client";

import React, {useRef, useState, useTransition} from "react";
import {User} from "@supabase/supabase-js";
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useRouter} from "next/navigation";
import {Textarea} from "@/components/ui/textarea";
import {ArrowUpIcon} from "lucide-react";
import {askAIAboutNotesAction} from "@/actions/notes";

interface AskAIButtonProps {
    user: User | null;
};

export default function AskAIButton(props: AskAIButtonProps) {
    const {user} = props;
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const [open, setOpen] = useState<boolean>(false);
    const [questionText, setQuestionText] = useState<string>("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);

    const resetQuestionSetup = () => {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!user) {
            router.push("/login");
        } else {
            if (isOpen) {
                resetQuestionSetup();
            }
            setOpen(isOpen);
        }
    };

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        const textArea = textAreaRef.current;
        if (!textArea) return;

        textArea.style.height = "auto";
        textArea.style.height = `${textArea.scrollHeight}px`;
    };

    const handleClickInput = () => {
        textAreaRef.current?.focus();
    };

    const handleSubmit = () => {
        if (!questionText.trim()) return;
        const newQuestions = [...questions, questionText];
        setQuestions(newQuestions);
        setQuestionText("");
        setTimeout(scrollToBottom, 100)

        startTransition(async () => {
            const res = await askAIAboutNotesAction(newQuestions, responses);
            setResponses((prev) => [...prev, res]);
        });
    };

    const scrollToBottom = () => {
        contentRef.current?.scrollTo({
            top: contentRef.current?.scrollHeight,
            behavior: "smooth",
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary">Ask AI</Button>
            </DialogTrigger>
            <DialogContent className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto"
                           ref={contentRef}>
                <DialogHeader>
                    <DialogTitle>Ask AI about your notes</DialogTitle>
                    <DialogDescription>
                        Our AI can answer questions about all your notes
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex flex-col gap-8">
                    {questions.map((question, i) =>
                        <React.Fragment key={i}>
                            <p className="ml-auto max-w-[60%] rounded-md bg-muted px-2 py-1 text-sm">{question}</p>
                            {responses[i] && <p className="bot-response text-sm text-muted-foreground"
                                                dangerouslySetInnerHTML={{__html: responses[i]}}
                            />}
                        </React.Fragment>
                    )}
                    {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
                </div>
                <div className="mt-auto flex cursor-text flex-col rounded-lg border p-4" onClick={handleClickInput}>
                    <Textarea ref={textAreaRef} placeholder="Ask me anything about your notes..."
                              className="resize-none rounded-none border-none bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                              style={{
                                  minHeight: "0",
                                  lineHeight: "normal"
                              }}
                              rows={4}
                              onInput={handleInput}
                              onKeyDown={handleKeyDown}
                              value={questionText}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestionText(e.target.value)}
                    />
                    <Button className="ml-auto size-8 rounded-full">
                        <ArrowUpIcon className="text-background"/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    );
};