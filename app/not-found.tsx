import Link from "next/link";
export default function Missing() {
  return (
    <div className="container-x py-40">
      <p className="eyebrow">404 / Not found</p>
      <h1 className="my-4 text-4xl font-bold">This page isn’t available.</h1>
      <Link href="/" className="btn-primary">
        Return home
      </Link>
    </div>
  );
}
