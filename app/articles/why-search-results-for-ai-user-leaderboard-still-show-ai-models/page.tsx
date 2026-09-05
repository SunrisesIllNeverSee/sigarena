import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Why Search Results for \u201cAI User Leaderboard\u201d Still Show AI Models",
  description:
    "Google still routes \u201cAI user leaderboard\u201d to model leaderboards. We captured the SERP, analyzed what it shows, and explain why the user-ranking intent remains underserved.",
  alternates: { canonical: "/articles/why-search-results-for-ai-user-leaderboard-still-show-ai-models" },
  openGraph: {
    title: "Why Search Results for \u201cAI User Leaderboard\u201d Still Show AI Models",
    description:
      "Google still routes \u201cAI user leaderboard\u201d to model leaderboards. We captured the SERP and explain why user-ranking intent is underserved.",
    url: "https://sigeconomy.com/articles/why-search-results-for-ai-user-leaderboard-still-show-ai-models",
    type: "article",
  },
};

const SERP_RESULTS = [
  { name: "Artificial Analysis", type: "Model leaderboard", url: "artificialanalysis.ai" },
  { name: "LiveBench", type: "Model benchmark", url: "livebench.ai" },
  { name: "OpenRouter", type: "Model routing / stats", url: "openrouter.ai" },
  { name: "Scale AI", type: "Model evaluation", url: "scale.com" },
  { name: "Hugging Face Arena", type: "Model leaderboard", url: "huggingface.co" },
  { name: "Vellum", type: "Model eval platform", url: "vellum.ai" },
  { name: "Steel.dev", type: "Agent infrastructure", url: "steel.dev" },
  { name: "LLM Stats", type: "Model statistics", url: "llm-stats.com" },
  { name: "Kilo Code", type: "Model / agent tooling", url: "kilocode.ai" },
];

const COMPETITORS = [
  { name: "Cribble", what: "AI usage tracking", notes: "Tracks AI usage patterns but does not rank operators by efficiency." },
  { name: "Tokscale", what: "Token usage board", notes: "Ranks by raw token consumption, not token-cascade efficiency." },
  { name: "TokenRank", what: "Token leaderboard", notes: "Volume-based ranking. Does not distinguish operator from model." },
  { name: "MyTokenTracker", what: "Personal token tracking", notes: "Individual tracking, not a public comparative leaderboard." },
];

export default function WhySearchResultsShowModelsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <JsonLd
        data={[
          articleSchema(
            "Why Search Results for \u201cAI User Leaderboard\u201d Still Show AI Models",
            "Google still routes \u201cAI user leaderboard\u201d to model leaderboards. We captured the SERP and explain why user-ranking intent is underserved.",
            "/articles/why-search-results-for-ai-user-leaderboard-still-show-ai-models",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: "Why Search Results Show AI Models", path: "/articles/why-search-results-for-ai-user-leaderboard-still-show-ai-models" },
          ]),
          faqSchema([
            {
              question: "What does Google show for \u201cAI user leaderboard\u201d?",
              answer:
                "As of September 4, 2026, Google routes the query primarily to AI model leaderboards \u2014 Artificial Analysis, LiveBench, Hugging Face Arena, and similar sites that rank AI models, not AI users. The AI Overview discusses model evaluation. No result on the first page ranks human AI users by any efficiency metric.",
            },
            {
              question: "Why does Google show model leaderboards for a user-ranking query?",
              answer:
                "The phrase \u201cAI user leaderboard\u201d is ambiguous. Google interprets \u201cAI\u201d as the subject being ranked, not as the tool being used. Until enough content explicitly ranks AI users (operators) as the subject, search intent will continue to be misrouted toward model leaderboards.",
            },
            {
              question: "Is there a leaderboard that ranks AI users?",
              answer:
                "Yes. The SigArena AI User Leaderboard ranks operator profiles by token-cascade efficiency (Yield), not model quality or raw token volume. It is currently the only public leaderboard that ranks the accounts operating AI tools rather than the models themselves.",
            },
            {
              question: "What is the difference between a model leaderboard and a user leaderboard?",
              answer:
                "A model leaderboard ranks AI models (GPT, Claude, Gemini) by accuracy, preference, or benchmark performance. A user leaderboard ranks the humans or accounts using AI tools by how efficiently they operate them. The questions are different: \u201cwhich model is best?\u201d vs \u201cwho ranks highest under the stated metric?\u201d",
            },
          ]),
        ]}
      />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">SERP analysis</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Why Search Results for &quot;AI User Leaderboard&quot; Still Show AI Models
        </h1>
        <p className="text-lg text-muted-foreground">
          Google still routes the query toward model leaderboards. We captured
          the SERP, analyzed what it shows, and explain why the user-ranking
          intent remains underserved.
        </p>
        <p className="text-xs text-muted-foreground">Published: September 4, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">The query and what it means</h2>
        <p>
          When someone searches &quot;AI user leaderboard,&quot; they are
          likely asking: <em>where do I rank among people who use AI
          tools?</em> The intent is to compare <strong>human AI users</strong>{" "}
          (operators) against each other, not to compare AI models. But Google
          does not yet have enough content that explicitly ranks AI users as
          the subject, so it falls back to the closest thing it knows: model
          leaderboards.
        </p>
        <p>
          This is a search-intent gap. The phrase is ambiguous, and the
          dominant interpretation wins. Until enough content ranks operators
          as the subject, the gap will persist.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What the SERP actually showed</h2>
        <p className="text-sm text-muted-foreground">
          Query: <code className="text-foreground">ai user leaderboard</code>.
          Date: September 4, 2026. Location: 14209, Buffalo, NY. Device:
          desktop. Personalization: <code className="text-foreground">pws=0</code>{" "}
          (personalized search disabled).
        </p>
        <p>
          The first page returned an AI Overview discussing model evaluation,
          a model leaderboard carousel, and nine organic results. Every
          organic result was a model leaderboard, model benchmark, or
          model-related tool. <strong>None ranked human AI users.</strong>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/serp/ai-user-leaderboard-2026-09-04.png"
          alt="Google SERP for &quot;ai user leaderboard&quot; on September 4, 2026 — all first-page results are model leaderboards, none rank AI users"
          width={1280}
          height={800}
          className="w-full rounded-lg border border-border"
          loading="lazy"
        />
        <p className="text-xs text-muted-foreground">
          Full-page SERP capture. Text extraction is also available at{" "}
          <a href="/serp/ai-user-leaderboard-2026-09-04.txt" className="text-primary hover:underline">
            /serp/ai-user-leaderboard-2026-09-04.txt
          </a>
          .
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-semibold">Result</th>
                <th className="py-2 pr-4 text-left font-semibold">Type</th>
                <th className="py-2 text-left font-semibold">Domain</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {SERP_RESULTS.map((r) => (
                <tr key={r.name} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">{r.name}</td>
                  <td className="py-2 pr-4">{r.type}</td>
                  <td className="py-2">{r.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          People Also Search For included &quot;Ai user leaderboard today&quot;
          and &quot;AI coding leaderboard,&quot; suggesting the user-ranking
          intent exists but is not being served by the current results.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Why the intent is misrouted</h2>
        <p>
          Google interprets &quot;AI user leaderboard&quot; as a leaderboard
          <em> for AI</em>, not a leaderboard <em>for AI users</em>. The word
          &quot;AI&quot; attaches to &quot;leaderboard&quot; (an AI
          leaderboard) rather than to &quot;user&quot; (a leaderboard of AI
          users). This is a syntactic ambiguity that search engines resolve by
          frequency: model leaderboards are common, user leaderboards are
          rare, so the model interpretation wins.
        </p>
        <p>
          The People Also Ask and People Also Search For modules confirm the
          user-ranking intent exists, but Google has no dominant result to
          route it to. The intent is real; the supply is missing.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What existing results measure</h2>
        <p>
          The results on the first page measure one of the following:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Model accuracy on benchmark suites (LiveBench, Scale AI)</li>
          <li>Human preference / ELO ratings (LMSYS Arena, Hugging Face)</li>
          <li>Model routing and cost statistics (OpenRouter, LLM Stats)</li>
          <li>Agent infrastructure and evaluation (Steel.dev, Kilo Code)</li>
          <li>Model evaluation platforms (Vellum, Artificial Analysis)</li>
        </ul>
        <p>
          None of these measure how effectively a <em>human</em> operates an
          AI tool. They answer &quot;which model is best?&quot; not &quot;who
          ranks highest among AI users?&quot;
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">
          Why &quot;where do I rank?&quot; remains underserved
        </h2>
        <p>
          A developer who uses Claude, Cursor, or Copilot every day has no
          public way to compare their AI usage efficiency against other
          developers. Model leaderboards do not help because they rank models,
          not users. Raw usage boards (token volume, cost) do not help because
          they reward spending, not efficiency. The question &quot;where do I
          rank among AI users?&quot; has no widely visible answer.
        </p>
        <p>
          Several tools track AI usage at the individual or team level, but
          they do not produce a public comparative ranking:
        </p>
        <div className="space-y-2">
          {COMPETITORS.map((c) => (
            <div key={c.name} className="rounded-lg border border-border p-3">
              <p className="font-medium text-foreground">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.what}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.notes}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          These tools are useful for personal tracking or team analytics, but
          none produces a public leaderboard that ranks operators by
          token-cascade efficiency.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Where SigArena fits</h2>
        <p>
          SigArena is the public leaderboard surface for AI operator
          evaluation. It ranks operator profiles by Yield (Υ), a
          token-cascade efficiency metric computed from privacy-preserving
          token telemetry. It does not rank models, and it does not rank by
          raw token volume. It answers &quot;who ranks highest under the
          stated metric and time window?&quot;
        </p>
        <p>
          The leaderboard is live and inspectable. Operator profiles include
          claimed, unclaimed, pseudonymous, and verified entries. Yield does
          not measure productivity, work quality, or professional skill. It
          measures a token-flow relationship.
        </p>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <Link
            href="/ai-user-leaderboard"
            className="text-primary font-medium hover:underline"
          >
            View the AI User Leaderboard →
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Methodology and caveats</h2>
        <p className="text-sm text-muted-foreground">
          The SERP capture was performed on September 4, 2026, from 14209,
          Buffalo, NY, using a desktop browser with personalized search
          disabled (<code>pws=0</code>). Full-page screenshots and text
          extraction were saved. Search results change over time and vary by
          location and personalization. This analysis describes what was
          observed on that date and is not a permanent claim that no other
          user-usage leaderboards exist.
        </p>
        <p className="text-sm text-muted-foreground">
          Reproducible query URL:{" "}
          <code className="text-foreground">
            https://www.google.com/search?q=ai+user+leaderboard&pws=0
          </code>
        </p>
      </section>
    </div>
  );
}
