import css from "./SearchBox.module.css"

interface SearchBoxProps {
  onChange: (query: string) => void
  value: string
}

const SearchBox = ({ onChange, value }: SearchBoxProps) => {
  return (
    <input
      value={value}
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default SearchBox
