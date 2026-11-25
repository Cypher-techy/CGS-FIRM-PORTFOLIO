"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container-x py-40">
      <h1 className="text-3xl font-bold">This page couldn’t be loaded.</h1>
      <p className="my-4">
        The content service may be temporarily unavailable.
      </p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </section>
  );
}
