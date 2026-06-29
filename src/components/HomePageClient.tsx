"use client";

import { useState } from "react";
import Splash from "@/components/Splash";
import Navbar from "@/components/Navbar";
import Manifesto from "@/components/Manifesto";
import Treatments from "@/components/Treatments";
import SmileAssistant from "@/components/SmileAssistant";
import GalleriaStudio from "@/components/GalleriaStudio";
import DrBarbato from "@/components/DrBarbato";
import CtaFooter from "@/components/CtaFooter";
import FloatingChat from "@/components/FloatingChat";
import StickyOverlapController from "@/components/StickyOverlapController";
import SectionCurtains from "@/components/SectionCurtains";
import MediaPerf from "@/components/MediaPerf";

export default function HomePageClient() {
  const [chat, setChat] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  const openChat = (q?: string) => {
    if (typeof q === "string") setDraft(q);
    setChat(true);
  };

  return (
    <div className="relative min-h-screen text-foreground bg-background">
      <Splash />
      <Navbar onOpenChat={() => openChat()} />
      <main id="main-content">
        <Manifesto />
        <Treatments />
        <SmileAssistant onOpenChat={openChat} />
        <GalleriaStudio />
        <DrBarbato onOpenChat={() => openChat()} />
        <CtaFooter onOpenChat={() => openChat()} />
      </main>
      <FloatingChat
        open={chat}
        setOpen={setChat}
        initialDraft={draft}
        onDraftConsumed={() => setDraft(null)}
      />
      <StickyOverlapController />
      <SectionCurtains />
      <MediaPerf />
    </div>
  );
}
