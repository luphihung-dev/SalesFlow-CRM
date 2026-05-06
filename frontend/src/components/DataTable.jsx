export default function DataTable({ columns, rows, keyField = 'id', onRowClick }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/80 shadow-card backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink/10">
          <thead className="bg-cream/80">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.16em] text-ink/50">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.map((row) => (
              <tr
                key={row[keyField]}
                className={onRowClick ? 'cursor-pointer transition hover:bg-fog/60' : 'transition hover:bg-fog/40'}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-ink/75">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
