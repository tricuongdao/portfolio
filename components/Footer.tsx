"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TextHoverEffect } from "./ui/text-hover-effect";

export default function Footer() {
  const [timeNow, setTimeNow] = useState<string>("");

  useEffect(() => {
    setTimeNow(new Date().toLocaleTimeString());
    const id = setInterval(
      () => setTimeNow(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <footer className=" relative mx-auto  pb-12 md:pb-0 lg:pb-0 xl:pb-0  max-w-330 bg-zinc-950 border-t border-zinc-800  text-zinc-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 md:px-20 py-5">
        <div className="h-10 w-36 flex items-center justify-center sm:justify-start">
          <TextHoverEffect text="VINNY" />
        </div>
        <Link href="/contact" className="text-lg cursor-pointer hover:text-white transition-colors">
          Reach out →
        </Link>

        <div className="text-lg">{timeNow}</div>
      </div>
    </footer>
  );
}
