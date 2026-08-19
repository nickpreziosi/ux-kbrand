/**
 * POSTs selected asset ids (and an optional format filter) to the bulk zip
 * route and starts a browser download of the archive.
 */
export async function downloadBrandBundle(input: {
  assetIds: string[];
  format?: string;
}): Promise<void> {
  const response = await fetch("/api/brand-bundle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assetIds: input.assetIds,
      ...(input.format ? { format: input.format } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error("errors.assets.bundleFailed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "brand-assets.zip";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}