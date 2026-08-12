import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "The Public Operator Evals Thesis — Why Public Evals for AI Operators",
  description:
    "Public model evals created accountability for AI labs. Public operator evals create accountability for AI users. The thesis: operator skill should be measurable, comparable, and public.",
  alternates: { canonical: "/public-operator-evals" },
  openGraph: {
    title: "The Public Operator Evals Thesis",
    description:
      "Why public operator evals are the next frontier in AI accountability.",
    url: "https://sigeconomy.com/public-operator-evals",
    type: "article",
  },
};

export default function PublicOperatorEvalsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <JsonLd
        data={[
          articleSchema(
            "The Public Operator Evals Thesis \u2014 Why Public Evals for AI Operators",
            "Public model evals created accountability for AI labs. Public operator evals create accountability for AI users. The thesis: operator skill should be measurable, comparable, and public.",
            "/public-operator-evals",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Operator Evals", path: "/operator-evals" },
            { name: "Thesis", path: "/public-operator-evals" },
          ]),
          faqSchema([
            {
              question: "What is the public operator evals thesis?",
              answer:
                "The thesis: AI user skill should be measurable, comparable, and public. Public model evals (Vals AI, LMSYS Arena) created accountability for AI labs. Public operator evals create accountability for AI users \u2014 developers, coders, anyone using AI. What gets measured publicly gets better publicly.",
            },
            {
              question: "Why should AI user skill be public?",
              answer:
                "Because accountability creates improvement. When model labs faced public benchmarks, they got better. When AI coders face public evals, they get better. The leaderboard is the scoreboard. Public evals turned model quality from marketing copy into measurable data; operator evals do the same for developer skill.",
            },
            {
              question: "How do public benchmarks create accountability for AI developers?",
              answer:
                "Before public evals, AI user skill was vibes \u2014 'they seem productive.' After public evals, it's Yield \u2014 a measurable, comparable, public score. Two developers using the same AI model can have 100x different Yield. Public benchmarks make that difference visible.",
            },
            {
              question: "What is the privacy contract for observing AI users?",
              answer:
                "SigRank collects token counts only \u2014 input, output, cache_read, cache_write. Never prompt content. Never code. Never conversation. The score is public; the work is private. Same privacy contract as a fitness tracker: your step count is public, your location is not.",
            },
            {
              question: "What score is used to benchmark AI coders?",
              answer:
                "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2. It measures token-cascade efficiency \u2014 whether signal is compounding or tokens are being burned. Volume is noise; Yield is signal. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding agent.",
            },
            {
              question: "How will operator evals become infrastructure?",
              answer:
                "Public model evals became infrastructure \u2014 every lab checks Vals AI before shipping. Public operator evals will become infrastructure too. Every developer will check their Yield before a performance review. Every team will track aggregate Yield. Every hiring manager will look at the leaderboard before making an offer.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">
            The Public Operator Evals Thesis
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Why public operator evals are the next frontier in AI accountability
        </p>
      </div>

      <article className="space-y-6 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            The model evals revolution
          </h2>
          <p>
            In 2023, AI model quality was marketing copy. Labs published
            cherry-picked benchmarks, selective comparisons, and curated
            examples. Then came public model evals \u2014 Vals AI, LMSYS Arena,
            LiveBench, Hugging Face Open LLM Leaderboard. These platforms ran
            standardized, public, reproducible evaluations. Overnight, model
            quality became measurable. You couldn&apos;t just claim your model
            was good \u2014 you had to show the scores.
          </p>
          <p>
            The impact was immediate. Labs optimized for benchmarks. Users had
            real data for model selection. The leaderboard became the
            scoreboard. Public evals created accountability for AI labs the same
            way public financial reporting created accountability for
            companies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            The operator evals gap
          </h2>
          <p>
            Models are evaluated. Operators are not. There is no Vals AI for the
            human wielding the AI. No LMSYS Arena for the person writing the
            prompts. No LiveBench for the operator managing the context window.
            Operator skill is vibes \u2014 &quot;they seem productive,&quot;
            &quot;they&apos;re fast,&quot; &quot;they ship a lot.&quot;
          </p>
          <p>
            This is a problem because the skill gap is real. Two operators using
            the same model, the same tools, and the same prompts can have 100x
            different outcomes. The difference isn&apos;t the model \u2014
            it&apos;s the cascade architecture. How efficiently does the
            operator reuse cached context? How lean is their fresh input? How
            much output do they extract per turn? These are measurable
            quantities. They&apos;re just not being measured publicly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            The thesis: operator skill should be public
          </h2>
          <p>
            <strong className="text-foreground">
              Operator skill should be measurable, comparable, and public.
            </strong>{" "}
            Not because operators need to be ranked for ego \u2014 because
            accountability creates improvement. When model labs faced public
            evals, they got better. When operators face public evals, they get
            better. The leaderboard is the scoreboard.
          </p>
          <p>
            The metric is Yield (\u03a5) \u2014 token-cascade efficiency. Yield
            measures whether signal is compounding or tokens are being burned.
            It&apos;s objective (measured from token counts, not opinions),
            privacy-preserving (no prompt content, just counts), and comparable
            (every operator gets the same metric from the same formula).
          </p>
          <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
            \u03a5 = (cache_read \u00d7 output) / input\u00b2
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            What public operator evals change
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-1">
                1. Skill becomes measurable
              </h3>
              <p className="text-sm">
                Before: &quot;They&apos;re a good AI coder.&quot; After:
                &quot;Their Yield is 2,462,656 \u2014 S-class, top 0.1%.&quot;
                Vibes become numbers.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-1">
                2. Improvement becomes trackable
              </h3>
              <p className="text-sm">
                Operators can see their Yield trend over time. Are they getting
                better at context reuse? Is their input economy improving? The
                leaderboard shows weekly movement \u2014 who climbed, who
                dropped, who entered.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-1">
                3. Hiring becomes data-driven
              </h3>
              <p className="text-sm">
                Companies hiring AI operators can look at public Yield scores
                instead of take-home assignments. The leaderboard is the
                portfolio. A S-class operator with 6 months of telemetry is a
                better signal than a 2-hour coding test.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-1">
                4. Tooling becomes accountable
              </h3>
              <p className="text-sm">
                If operators using Claude Code consistently out-Yield operators
                using Cursor, that&apos;s public data. Tool selection becomes
                evidence-based, not preference-based.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            The privacy contract
          </h2>
          <p>
            Public operator evals sound invasive. They&apos;re not. SigRank
            collects token counts only \u2014 input, output, cache_read,
            cache_write. Never prompt content. Never code. Never conversation.
            The evaluation is public; the work is private. Your Yield score is
            on the leaderboard; your code is not.
          </p>
          <p>
            This is the same privacy contract as a fitness tracker. Your
            step count is public; your location is not. Your heart rate is
            public; your medical history is not. The metric is public; the
            activity is private.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            The future: operator evals as infrastructure
          </h2>
          <p>
            Public model evals became infrastructure \u2014 every lab checks
            Vals AI before shipping. Public operator evals will become
            infrastructure too. Every operator will check their Yield before
            a performance review. Every team will track aggregate Yield as a
            productivity signal. Every hiring manager will look at the
            leaderboard before making an offer.
          </p>
          <p>
            The thesis is simple: <strong className="text-foreground">what
            gets measured publicly gets better publicly.</strong> Model evals
            proved it. Operator evals will prove it again.
          </p>
        </section>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">What is the public operator evals thesis?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The thesis: AI user skill should be measurable, comparable, and public. Public model evals (Vals AI, LMSYS Arena) created accountability for AI labs. Public operator evals create accountability for AI users {"\u2014"} developers, coders, anyone using AI. What gets measured publicly gets better publicly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Why should AI user skill be public?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Because accountability creates improvement. When model labs faced public benchmarks, they got better. When AI coders face public evals, they get better. The leaderboard is the scoreboard. Public evals turned model quality from marketing copy into measurable data; operator evals do the same for developer skill.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">How do public benchmarks create accountability for AI developers?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Before public evals, AI user skill was vibes {"\u2014"} &apos;they seem productive.&apos; After public evals, it&apos;s Yield {"\u2014"} a measurable, comparable, public score. Two developers using the same AI model can have 100x different Yield. Public benchmarks make that difference visible.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">What is the privacy contract for observing AI users?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                SigRank collects token counts only {"\u2014"} input, output, cache_read, cache_write. Never prompt content. Never code. Never conversation. The score is public; the work is private. Same privacy contract as a fitness tracker: your step count is public, your location is not.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">What score is used to benchmark AI coders?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yield ({"\u03a5"}) = (cache_read {"\u00d7"} output) / input{"\u00b2"}. It measures token-cascade efficiency {"\u2014"} whether signal is compounding or tokens are being burned. Volume is noise; Yield is signal. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding agent.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">How will operator evals become infrastructure?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Public model evals became infrastructure {"\u2014"} every lab checks Vals AI before shipping. Public operator evals will become infrastructure too. Every developer will check their Yield before a performance review. Every team will track aggregate Yield. Every hiring manager will look at the leaderboard before making an offer.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
          <p className="text-xl font-bold">
            The leaderboard is the scoreboard.
          </p>
          <p className="mt-2 text-white/80">
            Get your public operator eval. See where you rank.
          </p>
          <a
            href="https://signalaf.com/score"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
          >
            Check my rank
          </a>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <Link
            href="/operator-evals"
            className="text-sm text-primary hover:underline"
          >
            \u2190 Back to operator evals
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link
            href="/vs/vals-ai"
            className="text-sm text-primary hover:underline"
          >
            SigRank vs Vals AI \u2192
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link
            href="/how-it-works"
            className="text-sm text-primary hover:underline"
          >
            How Yield works \u2192
          </Link>
        </div>
      </article>
    </div>
  );
}
