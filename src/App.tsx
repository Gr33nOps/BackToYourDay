import { useEffect, useState } from "react";
import { fetchOnThisDay, pickThree, type Entry } from "@/lib/onthisday";
import { BirthdayPicker } from "@/components/BirthdayPicker";
import { Loader } from "@/components/Loader";
import { ErrorBox } from "@/components/ErrorBox";
import { Results } from "@/components/Results";

type View = "form" | "loading" | "results" | "error";

type Picked = { events: Entry[]; births: Entry[]; deaths: Entry[] };

const LOADING_LINES = [
  "Winding back the clock...",
  "Dusting off the almanac...",
  "Setting the dials...",
  "Turning the pages of history...",
  "Warming up the time machine...",
];

export default function App() {
  const [view, setView] = useState<View>("form");
  const [message, setMessage] = useState(LOADING_LINES[0]);
  const [date, setDate] = useState<{ month: number; day: number }>({ month: 1, day: 1 });
  const [picked, setPicked] = useState<Picked | null>(null);

  async function search(month: number, day: number) {
    setDate({ month, day });
    setMessage(LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]);
    setView("loading");

    try {
      const data = await fetchOnThisDay(month, day);
      setPicked({
        events: pickThree(data.events),
        births: pickThree(data.births),
        deaths: pickThree(data.deaths),
      });
      setView("results");
    } catch {
      setView("error");
    }
  }

  useEffect(() => {
    if (view === "results" || view === "form") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  return (
    <main className="mx-auto max-w-container px-4 pb-12 pt-5 sm:px-[22px] sm:pb-[72px] sm:pt-7">
      {view === "form" && <BirthdayPicker onSubmit={search} />}

      {view === "loading" && <Loader message={message} />}

      {view === "error" && <ErrorBox onRetry={() => search(date.month, date.day)} />}

      {view === "results" && picked && (
        <Results
          month={date.month}
          day={date.day}
          events={picked.events}
          births={picked.births}
          deaths={picked.deaths}
          onAgain={() => setView("form")}
        />
      )}
    </main>
  );
}
