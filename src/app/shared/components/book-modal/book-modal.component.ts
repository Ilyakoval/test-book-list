import { DialogRef } from '@angular/cdk/dialog'
import { AsyncPipe } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { Book, BookDialogConfig } from '../../interfaces/i-book'
import { ImagePreviewPipe } from '../../pipes/image.pipe'
import { BookService } from '../../services/book.service'
import { ImageUploadComponent } from '../image-upload/image-upload.component'

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ImageUploadComponent,
    ImagePreviewPipe,
    AsyncPipe,
  ],
  templateUrl: './book-modal.component.html',
  styleUrl: './book-modal.component.scss',
})
export class BookModalComponent implements OnInit {
  bookService: BookService = inject(BookService)
  formBuilder: FormBuilder = inject(FormBuilder)
  dialogReference: DialogRef = inject(DialogRef)
  data: BookDialogConfig = inject<BookDialogConfig>(MAT_DIALOG_DATA)

  get dialogTitle(): string {
    if (this.data.isEdit && this.data.book) {
      return `Edit:  ${this.data.book.title}`
    } else if (this.data.isEdit && !this.data.book) {
      return 'Add new book'
    } else if (!this.data.isEdit && this.data.book) {
      return this.data.book.title
    }

    return ''
  }

  bookForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    publication: ['', [Validators.required]],
    year: [0, [Validators.required]],
    description: ['', [Validators.required]],
    coverImage: new FormControl<File | null>(null),
  })

  ngOnInit(): void {
    if (this.data.book) {
      this.bookForm.patchValue(this.data.book)
    }
  }

  private createNewBook(): void {
    if (!this.bookForm.valid) return

    this.bookService.addBook(this.bookForm.value as Book)
    this.dialogReference.close()
  }

  private editBook(bookId: number): void {
    if (!this.bookForm.valid) return

    this.bookService.updateBook(bookId, this.bookForm.value as Book)
    this.dialogReference.close()
  }

  deleteBook(): void {
    if (this.data.book) {
      this.bookService.deleteBook(this.data.book.id)
    }
    this.dialogReference.close()
  }

  cancel(): void {
    if (this.data.isEdit && this.data.book) {
      this.toggleEditBookMode()
    } else {
      this.dialogReference.close()
    }
  }

  toggleEditBookMode(): void {
    this.data.isEdit = !this.data.isEdit
    if (this.data.book) {
      this.bookForm.patchValue(this.data.book)
    }
  }

  submit(): void {
    if (this.data.book) {
      this.editBook(this.data.book.id)
    } else {
      this.createNewBook()
    }
  }
}
