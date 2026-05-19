import { useState } from "react"
import css from "./App.module.css"
import NoteList from "../NoteList/NoteList"
import { useQuery } from "@tanstack/react-query"
import Pagination from "../Pagination/Pagination"
import Modal from "../Modal/Modal"
import NoteForm from "../NoteForm/NoteForm"
import SearchBox from "../SearchBox/SearchBox"
import { useDebouncedCallback } from 'use-debounce';
import { getNotes } from "../../services/noteService"

const App = () => {
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState(``)
    


   const debouncedSetSearchQuery = useDebouncedCallback(
  (value: string) => {
    setSearchQuery(value)
  },
  300
)

const handleSearchChange = (value: string) => {
  setInputValue(value)        
  debouncedSetSearchQuery(value) 
}
    useQuery({
        queryKey: [`value`, searchQuery],
        
    })

  const { data } = useQuery({
    queryKey: [`notes`, page, isOpen, searchQuery],
    queryFn: () => getNotes({ page: page, perPage: 10, searchQuery: searchQuery }),
  })

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
        <SearchBox value={inputValue} onChange={handleSearchChange}/>
        {data && data.totalPages > 1 && (
          <Pagination page={page} data={data} onPageChange={onChangePage} />
        )}
        <button className={css.button} onClick={onOpen}>
          Create note +
        </button>
      </header>
      <NoteList notes={data?.notes ?? []} />
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <NoteForm onClose={onClose}/>
        </Modal>
      )}
    </div>
  )
}

export default App
