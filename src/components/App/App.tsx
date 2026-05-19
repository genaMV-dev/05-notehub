import { useState, useEffect, useRef } from "react"
import css from "./App.module.css"
import NoteList from "../NoteList/NoteList"
import { useQuery } from "@tanstack/react-query"
import Pagination from "../Pagination/Pagination"
import Modal from "../Modal/Modal"
import NoteForm from "../NoteForm/NoteForm"
import SearchBox from "../SearchBox/SearchBox"
import { useDebouncedCallback } from "use-debounce"
import { getNotes, type NoteApiResponse } from "../../services/noteService"

const App = () => {
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [searchQuery, setSearchQuery] = useState(``)

  const prevDataRef = useRef<NoteApiResponse | null>(null)

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value)
    setPage(1)
  }, 300)

  const handleSearchChange = (value: string) => {
    setInputValue(value)
    debouncedSetSearchQuery(value)
  }

  const { data } = useQuery<NoteApiResponse, Error>({
    queryKey: [`notes`, page, searchQuery],
    queryFn: () =>
      getNotes({ page: page, perPage: 10, searchQuery: searchQuery }),
    placeholderData: () => prevDataRef.current ?? { notes: [], totalPages: 0 },
  })

  useEffect(() => {
    if (data) {
      prevDataRef.current = data
    }
  }, [data])

  const displayData: NoteApiResponse = data ?? { notes: [], totalPages: 0 }

  const onChangePage = (page: number) => {
    setPage(page)
  }

  const onClose = () => {
    setIsOpen(false)
  }

  const onOpen = () => {
    setIsOpen(true)
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        {displayData && displayData.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={displayData.totalPages}
            onPageChange={onChangePage}
          />
        )}
        <button className={css.button} onClick={onOpen}>
          Create note +
        </button>
      </header>
      <NoteList notes={displayData?.notes ?? []} />
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <NoteForm onClose={onClose} />
        </Modal>
      )}
    </div>
  )
}

export default App
