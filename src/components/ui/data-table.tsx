'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    HeaderGroup,
    Row,
    Cell,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell as TableCellComponent,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
    searchKey?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loading = false,
    searchKey,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="space-y-4">
            {searchKey && (
                <Input
                    placeholder="Search by email..."
                    className="max-w-sm"
                    onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
                />
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCellComponent colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCellComponent>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row: Row<TData>) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                                        <TableCellComponent key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCellComponent>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}