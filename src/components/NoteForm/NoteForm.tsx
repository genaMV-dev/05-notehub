import { useId } from "react"
import css from "./NoteForm.module.css"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { createNote } from "../../services/noteService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { NewNoteBody } from "../../types/note"
import * as Yup from "yup"

const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, `Too short!`)
    .max(50, `Too long!`)
    .required(`Required!`),
  content: Yup.string().max(500, `Too long!`),
  tag: Yup.string()
    .oneOf([`Todo`, `Work`, `Personal`, `Meeting`, `Shopping`])
    .required("Required"),
})

interface NoteForm {
  title: string
  content: string
  tag: `Todo` | `Work` | `Personal` | `Meeting` | `Shopping`
}

interface NoteFormProps {
  onClose: () => void
}

const NoteForm = ({ onClose }: NoteFormProps) => {
  const queryClient = useQueryClient()
  const fieldId = useId()

  const initialValues: NoteForm = {
    title: ``,
    content: ``,
    tag: `Todo`,
  }

  const mutation = useMutation({
    mutationFn: (newNote: NewNoteBody) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`notes`] })
      onClose()
    },
  })

  const handleSubmit = (values: NoteForm) => {
    mutation.mutate({
      title: values.title,
      content: values.content,
      tag: values.tag,
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  )
}

export default NoteForm
