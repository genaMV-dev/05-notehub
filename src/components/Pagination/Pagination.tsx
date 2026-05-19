import ReactPaginateModule from "react-paginate"
import css from "./Pagination.module.css"

import type { ComponentType } from "react"
import type { NoteApiResponse } from "../../services/noteService"

type ModuleWithDefault<T> = { default: T }

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<any>>
).default

interface PaginationProps {
  data?: NoteApiResponse
  onPageChange: (page: number) => void
  page: number
}

const Pagination = ({ page, data, onPageChange }: PaginationProps) => {
  return (
    <ReactPaginate
      pageCount={data?.totalPages ?? 0}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={(pageData: { selected: number }) => {
        onPageChange(pageData.selected + 1)
      }}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  )
}

export default Pagination
