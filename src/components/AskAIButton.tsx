"use client";

import React from "react";
import {User} from "@supabase/supabase-js";

interface AskAIButtonProps {
    user: User | null;
};

export default function AskAIButton(props: AskAIButtonProps) {
    const {user} = props;

    return (
        <div>Ask AI Button</div>
    );
};