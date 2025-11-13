"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {getThumbnail} from "@/lib/actions/cloudinary/thumbnail/route";
import {Spinner} from "@/components/ui/spinner";
import LinkMessage from "@/components/linkMessage";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
    params: { link_id: string } | Promise<{ link_id: string }>;
};

export default function ScreenRecordButton({ params }: PageProps) {
    const [recording, setRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // uploaded URL
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // local preview
    const [linkId, setLinkId] = useState<string | null>(null);
    const [videoExists, setVideoExists] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [linkMessage, setLinkMessage] = useState<string | null>(null);
    const [fetchFinished, setFetchFinished] = useState(false);
    const router = useRouter();

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (params instanceof Promise) {
            params.then((p) => setLinkId(p.link_id));
        } else {
            setLinkId(params.link_id);
        }
    }, [params]);

    useEffect(() => {
        if (!linkId) return;

        async function fetchVideoStatus() {
            try {
                const res = await fetch(`/api/db/links/${linkId}`, {
                    method: "GET",
                    headers: { Action: "checkForVideo"},
                });
                const data = await res.json();
                console.log(data.islinkactive)
                if (!data.islinkactive) {
                    setVideoExists(false);

                } else {
                    router.push("./thankyou");

                }
            } catch (err) {
                console.error("Error checking video:", err);
            }
        }

        async function checkLinkExists() {
            try {
                const res = await fetch(`/api/db/links/${linkId}`, {
                    method: "GET",
                    headers: { Action: "doeslinkexist" },
                });
                const data = await res.json();
                if (!data.islinkactive) router.push("/404");
            } catch (err) {
                console.error("Error checking link existence:", err);
            }
        }

        checkLinkExists();
        fetchVideoStatus();
    }, [linkId, router]);

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                const localFile = new File([blob], "recording.webm", { type: "video/webm" });
                setRecording(false);
                toast.success("Recording stopped. Preview available below.");
                setPreviewUrl(URL.createObjectURL(blob));
                setFile(localFile);
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setRecording(true);
            toast("Recording started. Click again to stop.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to start screen recording");
        }
    }

    function stopRecording() {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
            setRecording(false);
        }
    }

    async function uploadToCloudinaryAndSave(file: File) {
        if (!linkId) {
            toast.error("Link ID not ready");
            return;
        }

        try {
            setUploading(true);

            const sigRes = await fetch("/api/sign-upload");
            const sigData = await sigRes.json();
            if (!sigRes.ok) throw new Error(sigData.error || "Failed to get signature");

            const { signature, timestamp, upload_preset, cloud_name, api_key } = sigData;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", upload_preset);
            formData.append("signature", signature);
            formData.append("api_key", api_key);
            formData.append("timestamp", timestamp.toString());

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok || !data.secure_url) throw new Error(data.error?.message || "Upload failed");

            const thumbnail = await getThumbnail(data.secure_url)

            toast.success("Uploaded to Cloudinary!");

            const updateRes = await fetch("/api/db/links", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link_id: linkId, videoUrl: data.secure_url, thumbUrl: thumbnail }),
            });

            if (!updateRes.ok) {
                const errData = await updateRes.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to attach video to link");
            }

            toast.success("MongoDB entry updated!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Upload failed");
        } finally {
            setUploading(false);
            router.push(`/link/thankyou`);
        }
    }

    async function getMessageLink () {
        try {
            const res = await fetch(`/api/db/links/${linkId}`, {
                method: "GET",
                headers: { Action: "getLinkMessage" },
            });
            const data = await res.json();
            setFetchFinished(true)
            setLinkMessage(data.linkMessage)
        } catch (err) {
            console.error("Error fetching link message:", err);
        }
    }

    useEffect(() => {
        if (!linkId) return;
        getMessageLink()
    }, [linkId]);

    return (
        <div className="flex flex-col items-center gap-6 w-screen flex-1 justify-center">

            {!previewUrl ? fetchFinished ? ( <h1 className={'text-2xl'}>{linkMessage ? linkMessage : 'Please take a short Screen Recording to be sent to your support agent.'}</h1>) : (<Skeleton className="h-8 w-96" />) : null}
            <div className={'flex flex-row gap-5'}>

            <Button
                onClick={recording ? stopRecording : startRecording}
                disabled={uploading}
                variant={recording ? "destructive" : "default"}
            >
                {recording ? "Stop Recording" : uploading ? "Uploading..." : "Record Screen"}
            </Button>
                {previewUrl && (
            <Button
                className=""
                onClick={() => file && uploadToCloudinaryAndSave(file)}
                disabled={uploading}
                variant='confirm'
            >
                { uploading && (<Spinner />)}
                Confirm Upload
            </Button>
                    )}

            </div>

            {previewUrl && (
                <>
                <div className="w-full max-w-4xl">
                    <p className="text-sm text-gray-500">Preview (before upload):</p>
                    <video src={previewUrl} width={1000} controls className=" rounded-lg mt-2" />

                </div>

                </>
            )}

        </div>
    );
}
