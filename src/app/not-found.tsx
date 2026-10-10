import Link from "next/link";

/**
 * 404 page. Rendered for unmatched routes and `notFound()` calls; Next serves
 * it with a 404 status, so crawlers see a proper not-found response.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-6xl font-extrabold">404</h1>
      <p className="text-lg text-soft">העמוד הזה לא קיים.</p>
      <Link href="/" className="underline underline-offset-4">
        לעמוד הבית
      </Link>
    </div>
  );
}
