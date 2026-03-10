'use client';

import React, {useState} from "react";

export const Linkbar = ({ setIsLoading, setRoadmap }: { setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; setRoadmap: React.Dispatch<React.SetStateAction<any>> }) => {
    const [link, setLink] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        e.preventDefault();
        const res = await fetch("http://localhost:5018/ai/roadmap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ link }),
        })
        const data = await res.json();
        console.log(data);
        setRoadmap(data.roadmap);
        setLink("");
        setIsLoading(false);
    };

    return (
        <div className="flex flex-row items-center justify-start gap-6 p-4">
            <form onSubmit={handleSubmit} className="flex flex-row items-center gap-4">
                <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter a link"
                    className="border border-gray-300 rounded-4xl px-4 py-2 w-[56rem]"
                />
                <button
                    type="submit"
                    className="border rounded-4xl cursor-pointer px-4 py-2"
                >
                    Scrape
                </button>
            </form>
        </div>
    )
}