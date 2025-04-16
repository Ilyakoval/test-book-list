export interface Book {
  id: number
  title: string
  author: string
  publication: string
  year: number
  description: string
  coverImage: File | null
}

export interface BookDialogConfig {
  isEdit: boolean
  book?: Book
}
