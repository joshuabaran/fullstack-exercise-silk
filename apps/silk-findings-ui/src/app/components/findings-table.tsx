import { useState, useMemo } from 'react'
import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper
} from '@mui/material'

import { IFinding, IRawFinding } from '@silk-libs/finding-types'

interface Column {
  key: string
  label: string
  maxWidth?: number
  sortable?: boolean
  format?: (value: string | number | Date) => string
}

const formatDate = (date: string | number | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })
}

const groupedColumns: readonly Column[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'severity', label: 'Severity', sortable: true },
  { key: 'grouped_finding_created', label: 'Finding Created', format: formatDate, maxWidth: 165, sortable: true },
  { key: 'sla', label: 'SLA', format: formatDate, maxWidth: 165, sortable: true },
  { key: 'description', label: 'Description' },
  { key: 'workflow', label: 'Workflow', sortable: true },
  { key: 'progress', label: 'Progress', maxWidth: 165, sortable: true },
  { key: 'security_analyst', label: 'Security Analyst', maxWidth: 100, sortable: true },
  { key: 'owner', label: 'Owner', maxWidth: 100, sortable: true },
  { key: 'grouping_type', label: 'Grouping Type', maxWidth: 100, sortable: true },
  { key: 'grouping_key', label: 'Grouping Key', maxWidth: 100, sortable: true },
]

const rawColumns: readonly Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'grouped_finding_id', label: 'Group ID' },
  { key: 'status', label: 'Status' },
  { key: 'severity', label: 'Severity' },
  { key: 'finding_created', label: 'Finding Created', format: formatDate, maxWidth: 165 },
  { key: 'ticket_created', label: 'Ticket', format: formatDate, maxWidth: 165 },
  { key: 'description', label: 'Description', maxWidth: 165 },
  { key: 'asset', label: 'Asset', maxWidth: 165 },
  { key: 'remediation_text', label: 'Remediation Text', maxWidth: 165 },
  { key: 'remediation_url', label: 'Remediation URL', maxWidth: 165 },
  { key: 'source_collaboration_tool_id', label: 'Collaboration Tool ID', maxWidth: 100 },
  { key: 'source_collaboration_tool_name', label: 'Collaboration Tool Name', maxWidth: 100 },
  { key: 'source_security_tool_id', label: 'Security Tool ID', maxWidth: 100 },
  { key: 'source_security_tool_name', label: 'Security Tool Name', maxWidth: 100 }
]

interface IFindingsTableProps {
  findings: IFinding[] | null
}

interface ICollapsibleRowProps {
  row: IFinding
}

const CollapsibleRow = (props: ICollapsibleRowProps) => {
  const { row } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, ':hover': { cursor: 'pointer' } }} onClick={() => setOpen(!open)}>
        {groupedColumns.map((column) => {
          const value = row[column.key as keyof IFinding] as string | number | Date
          const formattedValue = column.format ? column.format(value) : value as string | number
          return (
            <TableCell key={column.key} sx={{ maxWidth: column.maxWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={formattedValue as string}>
              {formattedValue}
            </TableCell>
          )
        })}
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={groupedColumns.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="raw findings table">
                <TableHead>
                  <TableRow>
                    {rawColumns.map((column) => (
                      <TableCell key={column.key} sx={{ maxWidth: column.maxWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.raw.map((raw: IRawFinding) => (
                    <TableRow key={raw.id}>
                      {rawColumns.map((column) => {
                        const value = raw[column.key as keyof IRawFinding]
                        const formattedValue = column.format ? column.format(value) : value as string | number
                        return (
                        <TableCell key={column.key} sx={{ maxWidth: column.maxWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={formattedValue as string}>
                          {formattedValue}
                        </TableCell>
                      )})}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export const FindingsTable = (props: IFindingsTableProps) => {
  const { findings } = props
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [sortKey, setSortKey] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeSort = (key: string) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const visibleRows = useMemo(() =>
    findings?.sort((a, b) => {
      const aValue = a[sortKey as keyof IFinding]
      const bValue = b[sortKey as keyof IFinding]
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      } else if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      } else {
        return 0
      }
    })?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
  ), [findings, page, rowsPerPage, sortDirection, sortKey])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="grouped findings table">
        <TableHead>
          <TableRow>
            {groupedColumns.map((column) => (
              <TableCell key={column.key} sx={{ maxWidth: column.maxWidth }}>
                {column.sortable ? (
                  <TableSortLabel active={ column.key === sortKey} direction={sortDirection} onClick={() => handleChangeSort(column.key)}>
                    {column.label}
                  </TableSortLabel>
                ) : column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows && visibleRows.map((row: IFinding) => (
            <CollapsibleRow key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={findings?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </TableContainer>
  )
}
