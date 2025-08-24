"use client";

import React, {useState} from "react";
import {Button} from "@/components/ui/button"
import {Loader} from "lucide-react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {logOutAction} from "@/actions/users";

export default function LogOutButton() {

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);

        const {errorMessage} = await logOutAction();

        if (!errorMessage) {
            toast.success("Logged out", {
                description: "You've been successfully logged out",
                position: "top-center"
            });
            router.push("/login");
        } else {
            toast.error("Error", {
                description: errorMessage,
                position: "top-center"
            });
        }

        setLoading(false);
    }

    return <Button className="w-24"
                   variant="outline"
                   disabled={loading}
                   onClick={handleLogout}
    >{loading ? <Loader className="animate-spin"/> : "Log out"}
    </Button>

}