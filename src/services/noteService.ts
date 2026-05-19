import axios from "axios"
import type { NewNoteBody, Note } from "../types/note"

const VITE_NOTEHUB_TOKEN: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdlbmFub2NoZWF0c0BnbWFpbC5jb20iLCJpYXQiOjE3NzkxMjMxOTh9.3t1q4xKcKzC7x95VO3uHCCgr7GbC4HDZpWd9g2T2NWM"
const BASE_URL = "https://notehub-public.goit.study/api"

export interface NoteApiResponse {
  notes: Note[]
  totalPages: number
}

interface NoteResponseParams {
  page: number
  perPage: number
  searchQuery?: string
}

export async function getNotes({
  page,
  perPage,
  searchQuery,
}: NoteResponseParams): Promise<NoteApiResponse> {
  const res = await axios.get<NoteApiResponse>(`${BASE_URL}/notes`, {
    params: {
      page,
      perPage,
      search: searchQuery,
    },
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  })

  return res.data
}

export async function createNote(newNote: NewNoteBody): Promise<Note> {
  const res = await axios.post<Note>(`${BASE_URL}/notes`, newNote, {
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  })

  return res.data
}

export async function deleteNote(noteId: string): Promise<Note> {
  const res = await axios.delete<Note>(`${BASE_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  })

  return res.data
}
