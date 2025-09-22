import { useMemo, useState, type PropsWithChildren, type ReactNode } from "react";
import { cx } from "../utils/cx";

export type SortDirection = "asc" | "desc";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  accessor?: (row: T) => ReactNode;
  sortAccessor?: (row: T) => string | number | Date | null;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T> extends PropsWithChildren {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey?: (row: T, index: number) => string;
  className?: string;
  caption?: ReactNode;
  emptyMessage?: ReactNode;
  defaultSort?: { columnKey: string; direction: SortDirection };
  onSortChange?: (sort: { columnKey: string; direction: SortDirection } | null) => void;
}

const getSortValue = <T,>(row: T, column: DataTableColumn<T>) => {
  if (column.sortAccessor) {
    const result = column.sortAccessor(row);
    return result instanceof Date ? result.getTime() : result;
  }
  if (column.accessor) {
    const value = column.accessor(row);
    return typeof value === "string" || typeof value === "number" ? value : String(value ?? "");
  }
  const key = column.key as keyof T;
  const value = row[key];
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") return value;
  return value ? String(value) : "";
};

const compareValues = (a: unknown, b: unknown) => {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  const aString = String(a);
  const bString = String(b);
  return aString.localeCompare(bString, undefined, { numeric: true, sensitivity: "base" });
};

export const DataTable = <T,>({
  data,
  columns,
  rowKey,
  className,
  caption,
  emptyMessage = "No records",
  defaultSort,
  onSortChange,
}: DataTableProps<T>) => {
  const [sort, setSort] = useState<{ columnKey: string; direction: SortDirection } | null>(
    defaultSort ?? null,
  );

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const column = columns.find((col) => col.key === sort.columnKey);
    if (!column || !column.sortable) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const valueA = getSortValue(a, column);
      const valueB = getSortValue(b, column);
      const comparison = compareValues(valueA, valueB);
      return sort.direction === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [data, sort, columns]);

  const toggleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    setSort((current) => {
      const nextDirection: SortDirection =
        !current || current.columnKey !== column.key
          ? "asc"
          : current.direction === "asc"
            ? "desc"
            : "asc";
      const next = { columnKey: column.key, direction: nextDirection };
      onSortChange?.(next);
      return next;
    });
  };

  const rows = sortedData;

  return (
    <div className={cx("mosaic-table-container", className)}>
      <table className="mosaic-table">
        {caption ? <caption className="mosaic-table__caption">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => {
              const isSorted = sort?.columnKey === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  className={cx(
                    "mosaic-table__header",
                    {
                      "mosaic-table__header--sortable": column.sortable,
                      "mosaic-table__header--sorted": isSorted,
                    },
                    column.align ? { [`mosaic-table__header--${column.align}`]: true } : undefined,
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className="mosaic-table__sort"
                      aria-sort={
                        isSorted ? (sort?.direction === "asc" ? "ascending" : "descending") : "none"
                      }
                    >
                      <span>{column.header}</span>
                      <span className="mosaic-table__sort-indicator" aria-hidden="true">
                        {isSorted ? (sort?.direction === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="mosaic-table__empty" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const key = rowKey ? rowKey(row, rowIndex) : rowIndex;
              return (
                <tr key={key}>
                  {columns.map((column) => {
                    const content = column.accessor
                      ? column.accessor(row)
                      : (row as Record<string, unknown>)[column.key];
                    return (
                      <td
                        key={column.key}
                        className={cx(
                          "mosaic-table__cell",
                          column.align ? { [`mosaic-table__cell--${column.align}`]: true } : undefined,
                        )}
                      >
                        {content as ReactNode}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
