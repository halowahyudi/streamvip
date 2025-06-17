"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import * as React from "react";

import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Player = {
  nama: string;
  id?: number;
  slotVip: number;
  slotMatch: number;
};

const defaultData: Player[] = [];

export default function Home() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [data, setData] = React.useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = React.useState({
    nama: "",
    id: "",
    slotVip: "",
    slotMatch: "",
  });

  // Load from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("playerData");
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(defaultData);
    }
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem("playerData", JSON.stringify(data));
  }, [data]);

  const handleIncrement = (rowIndex: number) => {
    setData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, slotMatch: row.slotMatch + 1 } : row
      )
    );
  };

  const handleDecrement = (rowIndex: number) => {
    setData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? { ...row, slotMatch: Math.max(0, row.slotMatch - 1) }
          : row
      )
    );
  };

  const handleIncrementVip = (rowIndex: number) => {
    setData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, slotVip: row.slotVip + 1 } : row
      )
    );
  };

  const handleDecrementVip = (rowIndex: number) => {
    setData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? { ...row, slotVip: Math.max(0, row.slotVip - 1) }
          : row
      )
    );
  };

  const handleAddPlayer = () => {
    if (!newPlayer.nama || !newPlayer.slotVip || !newPlayer.slotMatch) return;

    const newEntry: Player = {
      nama: newPlayer.nama,
      id: newPlayer.id ? Number(newPlayer.id) : undefined,
      slotVip: Number(newPlayer.slotVip),
      slotMatch: Number(newPlayer.slotMatch),
    };

    setData((prev) => [...prev, newEntry]);
    setNewPlayer({ nama: "", id: "", slotVip: "", slotMatch: "" });
  };

  const handleDeletePlayer = (rowIndex: number) => {
    setData((prev) => prev.filter((_, idx) => idx !== rowIndex));
  };

  const columns: ColumnDef<Player>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("nama")}</div>,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("id") ?? "-"}</div>,
    },
    {
      accessorKey: "slotVip",
      header: ({ column }) => (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slot VIP <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const index = row.index;
        const vip: number = row.getValue("slotVip");
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handleDecrementVip(index)}>
              -
            </Button>
            <span className="w-6 text-center">{vip}</span>
            <Button size="sm" onClick={() => handleIncrementVip(index)}>
              +
            </Button>
          </div>
        );
      },
    },

    {
      accessorKey: "slotMatch",
      header: ({ column }) => (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slot Match <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const index = row.index;
        const match: number = row.getValue("slotMatch");
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handleDecrement(index)}>
              -
            </Button>
            <span className="w-6 text-center">{match}</span>
            <Button size="sm" onClick={() => handleIncrement(index)}>
              +
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const player = row.original;
        const index = row.index;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="noShadow" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${player.nama} - ID: ${player.id ?? "No ID"} - Slot VIP: ${
                      player.slotVip
                    } - Slot Match: ${player.slotMatch}`
                  )
                }
              >
                Copy info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeletePlayer(index)}>
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full md:max-w-4xl md:mx-auto font-base text-main-foreground">
      <div className="flex items-center py-4 gap-4 flex-wrap">
        <Input
          placeholder="Filter nama..."
          value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nama")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="noShadow" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* form add data */}
      <div className="bg-muted p-4 rounded-xl mb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        <Input
          placeholder="Nama"
          value={newPlayer.nama}
          onChange={(e) =>
            setNewPlayer((p) => ({ ...p, nama: e.target.value }))
          }
        />
        <Input
          placeholder="ID (optional)"
          value={newPlayer.id}
          onChange={(e) => setNewPlayer((p) => ({ ...p, id: e.target.value }))}
        />
        <Input
          placeholder="Slot VIP"
          type="number"
          value={newPlayer.slotVip}
          onChange={(e) =>
            setNewPlayer((p) => ({ ...p, slotVip: e.target.value }))
          }
        />
        <Input
          placeholder="Slot Match"
          type="number"
          value={newPlayer.slotMatch}
          onChange={(e) =>
            setNewPlayer((p) => ({ ...p, slotMatch: e.target.value }))
          }
        />
        <Button onClick={handleAddPlayer}>Tambah</Button>
      </div>
      <div>
        <Table>
          <TableHeader className="font-heading">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-secondary-background text-foreground"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-foreground" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="bg-secondary-background text-foreground data-[state=selected]:bg-main data-[state=selected]:text-main-foreground"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <p className="text-red-500">
        Dengan menghapus browser, history, cache dan cookies, Anda akan
        kehilangan semua data yang telah Anda simpan.
      </p>
      <p className="text-red-500 text-xs">
        *Data disimpan dimemori browser Anda.
      </p>
    </div>
  );
}
