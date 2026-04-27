"use client";

import Image from "next/image";
import { RevealLines, RevealParagraph } from "@/components/reveals";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const items: {
  num: string;
  title: string;
  desc: string;
  imgKey: string;
  imgSrc: string;
  imgAlt: string;
}[] = [
  {
    num: "I",
    title: "Implantologia",
    desc: "Impianti a carico immediato e chirurgia guidata 3D. Pianificazione digitale, risultato prevedibile.",
    imgKey: "implant",
    imgSrc: "/images/treatments/implantologia.jpg",
    imgAlt: "Modello dentale con impianti visibili",
  },
  {
    num: "II",
    title: "Ortodonzia invisibile",
    desc: "Allineatori trasparenti per adulti e adolescenti. Risultati visibili senza dover sorridere diversamente.",
    imgKey: "ortho",
    imgSrc: "/images/treatments/ortodonzia.jpg",
    imgAlt: "Professionista che osserva una radiografia panoramica",
  },
  {
    num: "III",
    title: "Estetica del sorriso",
    desc: "Faccette in ceramica integrale, sbiancamento professionale, ricostruzioni minimamente invasive.",
    imgKey: "esthetic",
    imgSrc: "/images/treatments/estetica.jpg",
    imgAlt: "Scelta del colore di una faccetta dentale durante una visita",
  },
  {
    num: "IV",
    title: "Conservativa ed endodonzia",
    desc: "Al microscopio operatorio. Salvare un dente è sempre preferibile a sostituirlo.",
    imgKey: "endo",
    imgSrc: "/images/treatments/endodonzia.jpg",
    imgAlt: "Modello in sezione di un dente con radice e canali",
  },
  {
    num: "V",
    title: "Igiene e prevenzione",
    desc: "Richiami ogni sei mesi, protocolli personalizzati. La manutenzione è dove si vince a lungo termine.",
    imgKey: "hygiene",
    imgSrc: "/images/treatments/igiene.jpg",
    imgAlt: "Igieniste al lavoro su un paziente in studio dentistico",
  },
];

function TreatmentCardXL({
  num,
  title,
  desc,
  imgSrc,
  imgAlt,
}: {
  num: string;
  title: string;
  desc: string;
  imgSrc: string;
  imgAlt: string;
}) {
  return (
    <article
      className="relative w-full aspect-[4/5] md:aspect-[16/10]"
      data-cursor="hover"
    >
      <Image
        src={imgSrc}
        alt={imgAlt}
        fill
        sizes="(max-width: 1100px) 100vw, 1100px"
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,46,54,0.92)] via-[rgba(10,46,54,0.55)] to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-12 max-w-2xl">
        <div className="font-heading italic text-primary leading-none text-2xl sm:text-3xl md:text-4xl">
          {num}
        </div>
        <h3
          className="mt-2 font-heading italic text-foreground text-2xl sm:text-3xl md:text-5xl"
          style={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          {title}
        </h3>
        <p
          className="mt-4 font-body text-foreground/85 text-base md:text-lg"
          style={{ lineHeight: 1.55, maxWidth: "52ch" }}
        >
          {desc}
        </p>
      </div>
    </article>
  );
}

export default function Treatments() {
  return (
    <section
      id="trattamenti"
      className="relative bg-background"
      style={{ zIndex: 3 }}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-10 pt-[15vh] pb-12 md:pb-16 text-center">
        <div className="inline-flex liquid-glass rounded-full px-4 py-1.5 mb-7">
          <span
            className="font-body text-[11px] tracking-[0.22em] uppercase text-foreground/75"
            style={{ fontWeight: 500 }}
          >
            I NOSTRI AMBITI
          </span>
        </div>
        <h2
          className="font-heading italic text-foreground"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
            lineHeight: 0.96,
            letterSpacing: "-0.025em",
          }}
        >
          <RevealLines
            as="span"
            text="Cinque specializzazioni."
            stagger={0.06}
            duration={0.9}
          />
          <br />
          <span className="text-foreground/60">
            <RevealLines
              as="span"
              text="Una sola idea di cura."
              stagger={0.06}
              duration={0.9}
              delay={0.18}
            />
          </span>
        </h2>
        <RevealParagraph
          className="mt-7 font-body text-foreground/70 mx-auto"
          style={{
            fontSize: "clamp(1rem, 1.1vw, 1.0625rem)",
            lineHeight: 1.6,
            maxWidth: "52ch",
          }}
          delay={0.4}
        >
          Meno invasivo quando possibile, più personalizzato sempre. Ogni trattamento
          segue lo stesso principio.
        </RevealParagraph>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 pb-[20vh]">
        <ScrollStack
          itemDistance={140}
          itemScale={0.04}
          itemStackDistance={32}
          baseScale={0.88}
          stackPosition="22%"
          scaleEndPosition="12%"
          blurAmount={1.5}
        >
          {items.map((it) => (
            <ScrollStackItem
              key={it.imgKey}
              itemClassName="rounded-[28px] overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(244,241,234,0.10)]"
            >
              <TreatmentCardXL
                num={it.num}
                title={it.title}
                desc={it.desc}
                imgSrc={it.imgSrc}
                imgAlt={it.imgAlt}
              />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
