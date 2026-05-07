export default function DataTable({ columns, rows, keyField = 'id', onRowClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-ink/10">
          <thead className="bg-fog/80">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.14em] text-ink/50">
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
      <div className="divide-y divide-ink/10 md:hidden">
        {rows.map((row) => (
          <div
            key={row[keyField]}
            className={`block w-full px-4 py-4 text-left ${onRowClick ? 'cursor-pointer transition hover:bg-fog/60' : ''}`}
            onClick={() => onRowClick?.(row)}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyDown={(event) => {
              if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onRowClick(row);
              }
            }}
          >
            <div className="min-w-0 space-y-3">
              {columns.map((column, index) => (
                <div key={column.key} className={index === 0 ? 'min-w-0' : 'flex min-w-0 items-start justify-between gap-4'}>
                  {index === 0 ? (
                    <>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/40">{column.header}</p>
                      <div className="mt-1 min-w-0 break-words text-base font-extrabold text-ink">{column.render ? column.render(row) : row[column.key]}</div>
                    </>
                  ) : (
                    <>
                      <span className="shrink-0 text-xs font-extrabold uppercase tracking-[0.12em] text-ink/40">{column.header}</span>
                      <span className="min-w-0 break-words text-right text-sm font-semibold text-ink/70">{column.render ? column.render(row) : row[column.key]}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
