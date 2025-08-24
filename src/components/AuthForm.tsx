"use client";

import React, {useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {CardContent, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import Link from "next/link";
import {loginAction, signUpAction} from "@/actions/users";

interface AuthFormProps {
    type: "login" | "signup";
}

export default function AuthForm(props: AuthFormProps) {

    const {type} = props;

    const isLoginForm: boolean = type === "login";
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            let errorMessage = null;
            let title;
            let description;

            if (isLoginForm) {
                errorMessage = (await loginAction(email, password)).errorMessage;
                title = "Logged in";
                description = "You've successfully logged in";
            } else {
                errorMessage = (await signUpAction(email, password)).errorMessage;
                title = "Signed up";
                description = "Check your email for a confirmation link";
            }

            if (!errorMessage) {
                toast.success(title, {
                    description: description, position: "top-center"
                });
                router.replace("/");
            } else {
                toast.error("Error", {
                    description: errorMessage, position: "top-center"
                });
            }

        });
    }

    return <form action={handleSubmit}>
        <CardContent className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" required disabled={isPending}/>
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter your password" required disabled={isPending}/>
            </div>
        </CardContent>
        <CardFooter className="mt-4 flex flex-col gap-6">
            <Button className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : isLoginForm ? "Login" : "Sign up"}
            </Button>
            <p>
                {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link href={isLoginForm ? "/sign-up" : "/login"}
                      className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}>
                    {isLoginForm ? "Sign Up" : "Login"}
                </Link>
            </p>
        </CardFooter>
    </form>;
}