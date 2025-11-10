"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AutoRefresh = () => {
    const router = useRouter();

    useEffect(() => {
        const eventSource = new EventSource("/api/notifications/stream");

        eventSource.onmessage = (event) => {
            console.log("🔁 Change detected:", event.data);
            router.refresh(); // revalidates and reloads server components
        };

        return () => eventSource.close();
    }, [router]);

    return null;
};

export default AutoRefresh;