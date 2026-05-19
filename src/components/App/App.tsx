import { useState, useEffect } from "react"
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

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value)
  }, 300)

  const handleSearchChange = (value: string) => {
    setInputValue(value)
    debouncedSetSearchQuery(value)
  }

  useEffect(() => {
    setPage(1)
  }, [searchQuery, setPage])

  const { data, isFetching } = useQuery<NoteApiResponse, Error>({
    queryKey: [`notes`, page, searchQuery],
    queryFn: () =>
      getNotes({ page: page, perPage: 10, searchQuery: searchQuery }),
    placeholderData: { notes: [], totalPages: 0 },
  })

  const [prevData, setPrevData] = useState<NoteApiResponse | null>(null)

  useEffect(() => {
    if (data) {
      setPrevData(data)
    }
  }, [data])

  const displayData: NoteApiResponse =
    isFetching && prevData ? prevData : (data ?? { notes: [], totalPages: 0 })

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
