"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function GenerateLinkButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ id: string; url?: string } | null>(null);
    const [clientName, setClientName] = useState("");
    const [shake, setShake] = useState(false);
    const [styles, setStyles] = useState(false);
    const [SavedMessageLink, setSavedMessageLink] = useState<string>('')
    const [oneTimeLinkMessage, setOneTimeLinkMessage] = useState<string>('')
    const router = useRouter();

    async function fetchData() {
        try {
            const res = await fetch("/api/db/Users");
            const data = await res.json();
            console.log(data)
            setSavedMessageLink(data.linkMessage)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);



    async function onClick() {
        if (!clientName) {
            setStyles(true);
            toast.error("Please enter a client name");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/db/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientName,  oneTimeLinkMessage: oneTimeLinkMessage ? oneTimeLinkMessage : SavedMessageLink }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || `Request failed (${res.status})`);
            }

            const data = (await res.json()) as { id: string; videoUrl?: string | null };
            setResult({ id: data.id });
            await navigator.clipboard.writeText(`${window.location.origin}/link/${data.id}`);
            toast.info("Copied to clipboard!");
            setClientName("")
            setOneTimeLinkMessage('')
            router.refresh();

        } catch (e: any) {
            setError(e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (clientName) setStyles(false);
    }, [clientName]);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-center w-full flex-col gap-2">
                <Input
                    type="text"
                    placeholder="Client Name"
                    className={` w-full rounded-md border border-border p-2 ${styles ? "border-destructive" : ""} ${
                        shake ? "animate-shake" : ""
                    }`}
                    onChange={(e) => setClientName(e.target.value)}
                    value={clientName}
                />
                <Input
                    type="text"
                    placeholder="One Time Link Message"
                    className={` w-full rounded-md border border-border p-2 ${styles ? "border-destructive" : ""} ${
                        shake ? "animate-shake" : ""
                    }`}
                    onChange={(e) => setOneTimeLinkMessage(e.target.value)}
                    value={oneTimeLinkMessage}
                />
                <Button
                    type="submit"
                    variant="outline"
                    className="hover:cursor-pointer"
                    onClick={() => onClick()}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Link"}
                </Button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {result && (
                <div className="text-sm">
                    <p className="font-medium">Link created</p>
                    <p>
                        ID: <code>{result.id}</code>
                    </p>
                </div>
            )}
        </div>
    );
}
