"use client";

import { Download } from "lucide-react";

export default function DownloadButton({
  title,
  body,
  slug,
}: {
  title: string;
  body: string[];
  slug: string;
}) {
  function download() {
    const text = `${title}\n${"=".repeat(title.length)}\n\n${body.join("\n\n")}\n\n— Cypher Green Systems (CGS)\nTechnology. Environment. Opportunity.`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  return (
    <button onClick={download} className="btn-primary">
      <Download className="h-4 w-4" /> Download Publication
    </button>
  );
}
