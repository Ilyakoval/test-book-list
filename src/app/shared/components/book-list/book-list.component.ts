import { trigger, transition, useAnimation } from '@angular/animations'
import { AsyncPipe } from '@angular/common'
import { Component, inject, output, OutputEmitterRef, Signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { itemEnterAnimation, itemLeaveAnimation, listAnimation } from '../../animations/animations'
import { Book, BookDialogConfig } from '../../interfaces/i-book'
import { ImagePreviewPipe } from '../../pipes/image.pipe'
import { BookService } from '../../services/book.service'
import { BookModalComponent } from '../book-modal/book-modal.component'

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    ImagePreviewPipe,
    AsyncPipe,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [useAnimation(itemEnterAnimation)]),
      transition(':leave', [useAnimation(itemLeaveAnimation)]),
    ]),
    trigger('listAnimation', [transition(':enter', [useAnimation(listAnimation)])]),
  ],
})
export class BookListComponent {
  private readonly bookService: BookService = inject(BookService)
  private readonly dialogService: MatDialog = inject(MatDialog)

  booksUpdated: OutputEmitterRef<void> = output<void>()

  books: Signal<Book[]> = this.bookService.books

  openPreviewDialog(book: Book): void {
    const dialogReference = this.dialogService.open<BookModalComponent, BookDialogConfig>(BookModalComponent, {
      data: {
        isEdit: false,
        book,
      },
      autoFocus: false,
      width: '600px',
    })

    dialogReference.afterClosed().subscribe(() => {
      this.booksUpdated.emit()
    })
  }

  openEditModal(event: MouseEvent, book: Book): void {
    event.stopPropagation()
    const dialogReference = this.dialogService.open<BookModalComponent, BookDialogConfig>(BookModalComponent, {
      data: {
        isEdit: true,
        book,
      },
      autoFocus: false,
      width: '600px',
    })

    dialogReference.afterClosed().subscribe(() => {
      dialogReference.afterClosed().subscribe(() => {
        this.booksUpdated.emit()
      })
    })
  }

  deleteBook(event: MouseEvent, bookId: number): void {
    event.stopPropagation()
    this.bookService.deleteBook(bookId)
  }
}
