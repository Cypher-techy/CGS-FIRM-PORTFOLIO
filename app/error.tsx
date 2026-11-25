"use client";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-x py-40">
      <h1 className="text-3xl font-bold">This page couldn’t be loaded.</h1>
      <p className="my-4">
        The content service may be temporarily unavailable.
      </p>
      {error.digest && /^CMS-[A-Z]{3,12}$/.test(error.digest) && (
        <p className="mb-4 text-sm text-slate2">
          Support reference: {error.digest}
        </p>
      )}
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </section>
  );
}
