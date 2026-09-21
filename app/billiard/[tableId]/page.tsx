import { TableDetails } from "@/components/TableDetails/TableDetails";
import { BILLIARD_TABLES } from "@/data/tables";

// Static export (GitHub Pages) has no server to render this route
// on-demand, so every real table ID is pre-rendered at build time.
export function generateStaticParams() {
  return BILLIARD_TABLES.map((table) => ({ tableId: table.id }));
}

export default function TableDetailsPage({ params }: { params: { tableId: string } }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <TableDetails tableId={params.tableId} />
    </div>
  );
}
