"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Feather,
  Flame,
  Hammer,
  Home,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Step =
  | "intro"
  | "stop1"
  | "stop2"
  | "stop3"
  | "stop4"
  | "stop5"
  | "stop6"
  | "stop7"
  | "conclusion";

const STORAGE_KEY = "ilmarinen-tour-step-v2";

const STEP_ORDER: Step[] = [
  "intro",
  "stop1",
  "stop2",
  "stop3",
  "stop4",
  "stop5",
  "stop6",
  "stop7",
  "conclusion",
];

const STOP_NAMES = [
  "Железнодорожный вокзал",
  "Молекула",
  "Круглая площадь",
  "Губернаторский парк",
  "Памятник Гаскойну",
  "Театральная площадь",
  "Онежская набережная",
];

const EMBERS = [
  { left: "6%", size: 3, duration: 11, delay: 0 },
  { left: "20%", size: 2, duration: 14, delay: 3.2 },
  { left: "37%", size: 4, duration: 9, delay: 6.1 },
  { left: "54%", size: 2, duration: 13, delay: 1.4 },
  { left: "69%", size: 3, duration: 10, delay: 4.6 },
  { left: "83%", size: 2, duration: 15, delay: 2.3 },
  { left: "94%", size: 3, duration: 12, delay: 7.7 },
];

export function Tour() {
  const [step, setStep] = useState<Step>("intro");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (
      saved === "stop1" ||
      saved === "stop2" ||
      saved === "stop3" ||
      saved === "stop4" ||
      saved === "stop5" ||
      saved === "stop6" ||
      saved === "stop7" ||
      saved === "conclusion"
    ) {
      setStep(saved);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, step);
  }, [step, ready]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const go = useCallback((next: Step) => setStep(next), []);

  const goBack = useCallback(() => {
    const index = STEP_ORDER.indexOf(step);
    if (index > 0) setStep(STEP_ORDER[index - 1]);
  }, [step]);

  const goHome = useCallback(() => setStep("intro"), []);

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div aria-hidden className="forge-bg fixed inset-0 z-0" />
      <Embers />
      <main className="relative z-10 mx-auto w-full max-w-md px-5 pb-16 pt-5 sm:max-w-lg">
        {ready && step !== "intro" && (
          <nav className="sticky top-2 z-20 mb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-4 py-2 text-sm font-medium text-foreground shadow-lg shadow-black/30 backdrop-blur transition hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4 text-amber-500" />
              Назад
            </button>
            <button
              type="button"
              onClick={goHome}
              aria-label="Вернуться на главный экран"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-4 py-2 text-sm font-medium text-foreground shadow-lg shadow-black/30 backdrop-blur transition hover:bg-accent"
            >
              <Home className="h-4 w-4 text-amber-500" />
              На главную
            </button>
          </nav>
        )}
        {ready && (
          <div key={step} className="animate-fade-up">
            {step === "intro" && <IntroScreen onStart={() => go("stop1")} />}
            {step === "stop1" && <Stop1Screen onDone={() => go("stop2")} />}
            {step === "stop2" && <Stop2Screen onDone={() => go("stop3")} />}
            {step === "stop3" && <Stop3Screen onDone={() => go("stop4")} />}
            {step === "stop4" && <Stop4Screen onDone={() => go("stop5")} />}
            {step === "stop5" && <Stop5Screen onDone={() => go("stop6")} />}
            {step === "stop6" && <Stop6Screen onDone={() => go("stop7")} />}
            {step === "stop7" && <Stop7Screen onDone={() => go("conclusion")} />}
            {step === "conclusion" && <ConclusionScreen onFinish={goHome} />}
          </div>
        )}
      </main>
    </div>
  );
}

function Embers() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {EMBERS.map((ember, index) => (
        <span
          key={index}
          className="absolute -bottom-2 rounded-full bg-amber-400/80 blur-[1px] animate-ember-rise"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            animationDuration: `${ember.duration}s`,
            animationDelay: `${ember.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function P({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[15px] leading-7 text-stone-300", className)}>{children}</p>
  );
}

function Em({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-amber-200">{children}</strong>;
}

function Divider() {
  return (
    <div aria-hidden className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
      <Hammer className="h-4 w-4 text-amber-500/70" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-6 py-4 text-base font-semibold text-stone-950 shadow-lg shadow-amber-950/50 transition hover:from-amber-300 hover:to-amber-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

function TaskCard({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/10 to-transparent p-5 shadow-[0_0_50px_-20px_rgba(245,158,11,0.55)]">
      <div className="flex items-center gap-2 text-amber-400">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.25em]">
          Задание Илмаринена
        </span>
      </div>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-amber-50/90">{children}</div>
    </div>
  );
}

function StopHeader({ n, name }: { n: number; name: string }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/70 px-5 py-4 backdrop-blur-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-500">
          Точка {n} из {STOP_NAMES.length}
        </p>
        <h2 className="mt-1 font-serif text-xl leading-snug text-foreground">{name}</h2>
      </div>
      <div className="flex shrink-0 gap-1.5" aria-hidden>
        {STOP_NAMES.map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-2 w-2 rounded-full",
              index < n - 1 && "bg-amber-500",
              index === n - 1 &&
                "animate-pulse bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]",
              index > n - 1 && "bg-stone-700"
            )}
          />
        ))}
      </div>
    </header>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-8">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-amber-500/25 shadow-[0_0_70px_-18px_rgba(245,158,11,0.6)]">
        <Image
          src={`${BASE_PATH}/ilmarinen.webp`}
          alt="Кузнец Илмаринен у горна, из молота летят искры"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 576px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0805] via-transparent to-transparent" />
      </div>

      <header className="space-y-2 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
          <Flame className="h-4 w-4 animate-flicker" />
          Кузнец Илмаринен
          <Flame className="h-4 w-4 animate-flicker" />
        </p>
        <h1 className="font-serif text-3xl leading-tight text-foreground">
          Здравствуй, путник!
        </h1>
      </header>

      <div className="space-y-4">
        <P>
          Я — Илмаринен, кузнец из древних карельских рун. Я выковал небесный свод и
          знаменитую мельницу «Сампо». Но даже самая искусная работа не рождается из
          одного удара молота: ей нужны огонь, терпение, знание и память.
        </P>
        <P>
          Я пришёл в Петрозаводск не случайно. Этот город тоже родился у огня — у заводских
          печей, где плавили металл и отливали пушки. Со временем слобода превратилась в
          город, где наука, искусство, производство и люди сплетаются воедино.
        </P>
        <P>
          Сегодня вам предстоит пройти большой путь. Вы не соперники — вы одна команда.
          Обсуждайте загадки, помогайте друг другу и не бойтесь ошибаться.
        </P>
      </div>

      <P className="text-center text-stone-400">Ваш проводник покажет дорогу.</P>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
        <p className="text-[15px] leading-7 text-amber-50">
          Первая точка — <Em>Железнодорожный вокзал</Em>. В добрый путь!
        </p>
      </div>

      <PrimaryButton onClick={onStart}>
        <Hammer className="h-5 w-5" />
        Начать маршрут
      </PrimaryButton>
    </div>
  );
}

function PhotoTask({ onDone }: { onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function send() {
    if (!file || sending) return;
    setSending(true);
    setError(false);
    // На статическом хостинге (GitVerse Pages) приёмного сервера нет — достаточно
    // самого факта, что фото снято и выбрано; оно остаётся на устройстве.
    if (BASE_PATH) {
      onDone();
      return;
    }
    try {
      const body = new FormData();
      body.append("photo", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error(`upload failed: ${res.status}`);
      onDone();
    } catch {
      setError(true);
      setSending(false);
    }
  }

  return (
    <div className="space-y-3 pt-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          setFile(selected instanceof File ? selected : null);
          setError(false);
        }}
      />

      {file && previewUrl ? (
        <div className="space-y-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-amber-500/30">
            <Image
              src={previewUrl}
              alt="Предпросмотр фото"
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 576px"
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={sending}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl border border-border bg-secondary px-4 py-3.5 text-sm font-medium text-secondary-foreground transition hover:bg-accent disabled:opacity-50"
            >
              Другое фото
            </button>
            <PrimaryButton onClick={send} disabled={sending} className="flex-1 py-3.5">
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sending ? "Отправляю…" : "Отправить фото"}
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 px-4 py-8 text-amber-200 transition hover:border-amber-400/70 hover:bg-amber-500/10"
        >
          <Camera className="h-7 w-7 text-amber-400" />
          <span className="text-sm font-medium">Сделать или выбрать фото</span>
          <span className="text-xs text-stone-400">
            Кузнец принимает только фотографии
          </span>
        </button>
      )}

      {error && (
        <p className="text-sm text-red-400">
          Не получилось отправить. Проверьте связь и попробуйте ещё раз.
        </p>
      )}
    </div>
  );
}

function RiddleTask({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "correct") return;
    const normalized = value
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^a-zа-я\s-]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (normalized === "кивач" || normalized === "водопад кивач") {
      setStatus("correct");
      window.setTimeout(onDone, 1200);
    } else {
      setStatus("wrong");
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={cn("space-y-3", status === "wrong" && "animate-shake")}
    >
      <label
        htmlFor="riddle-answer"
        className="block text-xs font-semibold uppercase tracking-[0.25em] text-amber-500"
      >
        Ваш ответ
      </label>
      <input
        id="riddle-answer"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (status === "wrong") setStatus("idle");
        }}
        disabled={status === "correct"}
        autoComplete="off"
        placeholder="Что это за чудо природы?"
        className="w-full rounded-xl border border-input bg-black/40 px-4 py-3.5 text-base text-foreground outline-none transition placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30 disabled:opacity-70"
      />
      {status === "correct" ? (
        <p className="flex items-center gap-2 text-sm font-medium text-amber-300">
          <Check className="h-4 w-4" />
          Верно! Идём дальше.
        </p>
      ) : (
        <>
          <PrimaryButton type="submit" className="py-3.5">
            Ответить
          </PrimaryButton>
          {status === "wrong" && (
            <p className="text-sm text-red-400">Попробуйте ещё раз.</p>
          )}
        </>
      )}
    </form>
  );
}

function Stop1Screen({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-8">
      <StopHeader n={1} name={STOP_NAMES[0]} />
      <div className="space-y-4">
        <P>
          Я начал с огня. <Em>Без огня нет железа. Без железа нет города.</Em>
        </P>
        <P>Здесь, где вы стоите, когда-то были только лес и ветер.</P>
        <P>
          Этот город берет начало в далеком <Em>1703 году</Em>. В начале XVIII века Россия
          воевала со Швецией за выход к Балтийскому морю. Нужны были пушки, ядра, якоря.
          Пётр I узнал от местных карел, что здесь, на реке Лососинке, издавна плавят
          железо — в маленьких кузницах, по-старинке. Он понял: здесь будет завод.
        </P>
        <P>
          <Em>29 августа 1703 года</Em> здесь заложили Шуйский железоделательный завод.
          Вокруг завода выросла Петровская слобода.
        </P>
        <P>
          Огонь, который я зажег здесь, не погас. <Em>Он стал городом.</Em>
        </P>
        <P>
          Огонь живёт в металле. Каждый рельс, каждый фонарь — это моё железо. Оно пришло
          сюда из руды, которую я плавил.
        </P>
      </div>
      <Divider />
      <TaskCard icon={<Hammer className="h-4 w-4" />}>
        <p>
          Найдите на вокзале что-нибудь железное: рельс, ограду, фонарь, петлю на двери,
          старую скобу. Приложите к нему ладонь. Почувствуйте холод. Это не просто металл.{" "}
          <Em>Это память об огне.</Em>
        </p>
        <p>
          Сфотографируйте команду так, чтобы <Em>рука каждого из вас касалась металла</Em>.
          Отправьте фото.
        </p>
        <PhotoTask onDone={onDone} />
      </TaskCard>
    </div>
  );
}

function ChoiceTask({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "correct") return;
    if (value === "Углерод") {
      setStatus("correct");
      window.setTimeout(onDone, 1200);
    } else {
      setStatus("wrong");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-amber-50">
          Какое вещество изображено в виде этой необычной геометрической конструкции?
        </legend>
        {["Кеплерат", "Углерод", "Боросферен"].map((answer) => (
          <label
            key={answer}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-black/25 px-4 py-3 text-sm text-stone-200 transition hover:border-amber-500/50 has-[:checked]:border-amber-500/70 has-[:checked]:bg-amber-500/10"
          >
            <input
              type="radio"
              name="molecule-answer"
              value={answer}
              checked={value === answer}
              onChange={() => {
                setValue(answer);
                if (status === "wrong") setStatus("idle");
              }}
              disabled={status === "correct"}
              className="h-4 w-4 accent-amber-500"
            />
            {answer}
          </label>
        ))}
      </fieldset>
      {status === "correct" ? (
        <p className="flex items-center gap-2 text-sm font-medium text-amber-300">
          <Check className="h-4 w-4" /> Верно! Идём дальше.
        </p>
      ) : (
        <>
          <PrimaryButton type="submit" className="py-3.5">
            Ответить
          </PrimaryButton>
          {status === "wrong" && (
            <p className="text-sm text-red-400">Попробуйте ещё раз.</p>
          )}
        </>
      )}
    </form>
  );
}

function Stop2Screen({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-8">
      <StopHeader n={2} name={STOP_NAMES[1]} />
      <div className="space-y-4">
        <P>
          Перед вами необычный памятник — не человеку и не военному событию, а научной
          идее. Он находится на Студенческом бульваре, напротив главного здания
          Петрозаводского государственного университета.
        </P>
        <P>
          Композиция появилась в 1996 году. Её автор — архитектор Евгений Таев. В
          первоначальный замысел входили фонтан, скульптурная форма и стела с кораблём. В
          народе за композицией закрепилось название «Молекула фуллерена».
        </P>
        <P>
          Но у памятника есть и другой смысл. По задумке автора, фонтан должен был
          символизировать знания и научные идеи, которые словно прорываются наружу. Рядом
          находится университет — место, где люди задают вопросы, проверяют гипотезы и
          создают новое.
        </P>
        <P>
          Фуллерены — особая форма <Em>углерода</Em>. Их молекулы состоят из атомов,
          соединённых в замкнутую структуру, напоминающую сферу или многогранник. Почему
          такая молекула появилась именно в Карелии? Регион известен шунгитом — редкой
          горной породой, содержащей углерод.
        </P>
      </div>
      <Divider />
      <TaskCard icon={<Flame className="h-4 w-4" />}>
        <ChoiceTask onDone={onDone} />
      </TaskCard>
    </div>
  );
}

function Stop3Screen({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-8">
      <StopHeader n={3} name={STOP_NAMES[2]} />
      <div className="space-y-4">
        <P>
          Я ковал железо. Я ковал небо. Я ковал Сампо. Но прежде чем что-то выковать,
          мастер должен знать форму.
        </P>
        <P>
          Перед вами одно из самых важных исторических мест Петрозаводска. Сегодня площадь
          носит имя Ленина, но в разные годы её называли Круглой, Циркульной,
          Полуциркульной, площадью 25-летия Октября и Административной.
        </P>
        <P>
          Здесь, на этой площади, город впервые получил свою форму. До 1777 года
          Петрозаводск был Петровской слободой — посёлком при заводе. Дома лепились вокруг
          производства, улиц не было.
        </P>
        <P>
          В <Em>1777 году</Em> Екатерина II дала слободе статус города. А в 1785 году был
          утверждён первый регулярный план — город решили выковать заново. По проекту
          архитектора Ивана Лема здесь разбили <Em>круглую площадь</Em> — центр будущего
          города.
        </P>
        <P>
          Вокруг неё поставили восемь каменных зданий: губернаторский дом, присутственные
          места, гауптвахту, дома для чиновников. Улицы разошлись от круга лучами — как
          трещины от удара молота по наковальне.
        </P>
        <P>
          Круглая площадь — один из наиболее значимых сохранившихся архитектурных
          ансамблей XVIII века в Петрозаводске. Она напоминает, что город строится не
          только вокруг заводов, но и вокруг порядка, управления и общих решений.
        </P>
      </div>
      <Divider />
      <TaskCard icon={<Camera className="h-4 w-4" />}>
        <p>
          Найдите на площади <Em>круг</Em> — люк, клумбу, узор на фасаде, круглое окно,
          плитку — и сделайте фотографию.
        </p>
        <PhotoTask onDone={onDone} />
      </TaskCard>
    </div>
  );
}

function Stop4Screen({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-8">
      <StopHeader n={4} name={STOP_NAMES[3]} />
      <div className="space-y-4">
        <P>
          Я ковал железо. Я ковал форму. А здесь, в этом парке, жил человек, который бил
          словом.
        </P>
        <P>
          В 1784 году Екатерина II назначила Гавриила Романовича Державина первым
          губернатором Олонецкой губернии. Он приехал сюда на год — но успел много. При нём
          открылась первая городская больница. Он объехал всю губернию и написал «Поденную
          записку» — которое стало этнографическим исследованием края.
        </P>
        <P>
          Но главное — он был поэтом. Позже он напишет оду «Водопад», навеянную карельскими
          впечатлениями, стихотворение «Буря» — после шторма на Белом море, и ещё несколько
          стихов, где вспоминал этот чудесный край.
        </P>
        <P>
          Здесь, в этом парке, стоит памятник не губернатору. Здесь стоит памятник слову.
        </P>
      </div>
      <Divider />
      <TaskCard icon={<Feather className="h-4 w-4" />}>
        <p>
          Найдите памятник Державину. Он установлен в 2003 году скульптором Вальтером
          Сойни — финном, который долго жил в Карелии.
        </p>
        <p>Подойдите к памятнику и попробуйте отгадать, о каком природном чуде идёт речь:</p>
        <div className="rounded-xl border border-border bg-black/30 p-4 font-serif italic leading-7 text-amber-100/90">
          Алмазна сыплется гора
          <br />
          С высот четыремя скалами,
          <br />
          Жемчугу бездна и сребра
          <br />
          Кипит внизу, бьет вверх буграми;
          <br />
          От брызгов синий холм стоит,
          <br />
          Далече рев в лесу гремит.
        </div>
        <RiddleTask onDone={onDone} />
      </TaskCard>
    </div>
  );
}

function Stop5Screen({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-8">
      <StopHeader n={5} name={STOP_NAMES[4]} />
      <div className="space-y-4">
        <P>
          Державин был мастером слова. А этот человек — мастер дела. Слушайте историю.
        </P>
        <P>
          Перед вами памятник человеку, который помог изменить историю местного
          производства. Его звали Чарльз Гаскойн, а в России его называли Карлом
          Карловичем.
        </P>
        <P>
          Гаскойн родился в Шотландии в 1739 году. Он был инженером, металлургом и
          специалистом по оружейному производству. В Россию его пригласила Екатерина II —
          стране требовались люди, способные развивать промышленность и совершенствовать
          производство вооружения.
        </P>
        <P>
          В Петрозаводске Гаскойн руководил Александровским пушечным и чугунолитейным
          заводом. Под его руководством предприятие модернизировали, внедряли новые
          технологии и улучшали качество продукции. Завод стал одним из передовых
          механических и литейных предприятий своего времени.
        </P>
        <P>
          В <Em>1791 году</Em> на Александровском заводе изготовили первую в России
          паровую машину. Это был важный шаг для развития отечественной техники: паровая
          энергия открывала новые возможности для производства.
        </P>
        <P>
          Памятник Гаскойну открыли в Петрозаводске <Em>24 сентября 2021 года</Em>. Он
          напоминает о том, что историю города создавали не только правители и
          полководцы, но и инженеры, мастера, изобретатели — люди, которые меняли
          повседневную жизнь с помощью знаний и труда.
        </P>
      </div>
      <PrimaryButton onClick={onDone}>Продолжить</PrimaryButton>
    </div>
  );
}

function Stop6Screen({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-8">
      <StopHeader n={6} name={STOP_NAMES[5]} />
      <div className="space-y-4">
        <P>
          Теперь мы оказываемся в пространстве, где город говорит со зрителем языком
          сцены. Театр — особая часть городской культуры: здесь оживают истории, звучат
          голоса разных эпох, а люди на время становятся героями чужих судеб.
        </P>
        <P>
          В Петрозаводске театральная жизнь складывалась на протяжении десятилетий.
          Национальный театр Республики Карелия ведёт свою историю с 1932 года. Его работа
          связана с сохранением и развитием национальных сценических традиций, в том числе
          культуры и языков народов Карелии.
        </P>
        <P>
          Театр важен не только как здание или сцена. Это место встречи разных поколений и
          культур. На сцене могут звучать русская речь, карельские и финские слова, музыка,
          песни и сказания, которые передавались из поколения в поколение.
        </P>
        <P>
          В карельском эпосе «Калевала» живёт множество необыкновенных героев. Среди них —
          я, Илмаринен, кузнец, который способен создавать удивительные вещи.
        </P>
      </div>
      <Divider />
      <TaskCard icon={<Camera className="h-4 w-4" />}>
        <p>Я оставил в городе свой образ. Найдите статую Илмаринена и сделайте фотографию на его фоне.</p>
        <PhotoTask onDone={onDone} />
      </TaskCard>
    </div>
  );
}

function Stop7Screen({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-8">
      <StopHeader n={7} name={STOP_NAMES[6]} />
      <div className="space-y-4">
        <P>
          Наш путь завершает Онежская набережная — место, где город встречается с огромным
          пространством озера. Здесь можно увидеть не только воду и панораму Петрозаводской
          губы, но и целую галерею необычных скульптур.
        </P>
        <P>
          История современной скульптурной набережной началась в 1991 году. Тогда
          Петрозаводск получил от американского города-побратима Дулута композицию
          «Рыбаки». Её автор — скульптор Рафаэль Консуэгра.
        </P>
        <P>
          Два металлических рыбака забрасывают сеть в воду. По замыслу автора, один из них
          символизирует русского рыбака, другой — американского. Вместе они показывают
          совместный труд и связь двух городов, расположенных у больших озёр.
        </P>
        <P>
          «Рыбаки» положили начало традиции устанавливать на набережной скульптуры,
          подаренные городами-побратимами и партнёрами Петрозаводска. Постепенно набережная
          превратилась в своеобразный музей под открытым небом. Здесь встречаются разные
          художественные языки и культурные традиции. Каждая скульптура рассказывает не
          только о своём авторе, но и о городе, который её подарил.
        </P>
        <P>
          Вы прошли весь путь. Вы увидели город, который начинался с железа и огня, вырос
          благодаря труду мастеров и инженеров, стал местом науки, искусства и поэзии.
        </P>
      </div>
      <PrimaryButton onClick={onDone}>Завершить маршрут</PrimaryButton>
    </div>
  );
}

function ConclusionScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
          <Flame className="h-4 w-4 animate-flicker" />
          Путь завершён
          <Flame className="h-4 w-4 animate-flicker" />
        </p>
        <h1 className="font-serif text-3xl leading-tight text-foreground">Спасибо за путь</h1>
      </header>
      <div className="space-y-4">
        <P>
          Вот мы и завершили наш путь. Мы прошли по улицам Петрозаводска, прикоснулись к его
          истории и увидели, сколько разных судеб, идей и открытий скрывается за знакомыми
          местами.
        </P>
        <P>
          Когда-то здесь разжигали огонь заводских печей, чтобы выплавлять железо и создавать
          орудия. Со временем город рос и менялся: появлялись новые здания, развивалась
          наука, звучали стихи, открывались театры, а на берегу Онего рождались новые
          произведения искусства.
        </P>
        <P>
          Посмотрите вокруг. Петрозаводск — это не только то, что было создано много лет
          назад. Это город, чья история продолжается прямо сейчас. И однажды в ней появится
          место и для ваших собственных открытий.
        </P>
        <P>
          Спасибо, что прошли этот путь со мной. Пусть огонь любопытства не гаснет, а
          каждая новая дорога открывает вам ещё одну историю.
        </P>
      </div>
      <PrimaryButton onClick={onFinish}>
        <Home className="h-5 w-5" />
        На главную
      </PrimaryButton>
    </div>
  );
}
