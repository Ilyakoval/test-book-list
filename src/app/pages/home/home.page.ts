import { Component, OnInit, Signal, inject } from '@angular/core'
import { ReactiveFormsModule, FormControl } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, tap, filter, distinctUntilChanged } from 'rxjs'

import { BookModalComponent } from '../../shared/components/book-modal/book-modal.component'
import { BookListComponent } from '../../shared/components/book-list/book-list.component'
import { BookService } from '../../shared/services/book.service'
import { Book, BookDialogConfig } from '../../shared/interfaces/i-book'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    BookListComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  animations: [],
})
export default class HomePage implements OnInit {
  private readonly bookService: BookService = inject(BookService)
  private readonly dialogService: MatDialog = inject(MatDialog)

  books: Signal<Book[]> = this.bookService.books
  searchControl: FormControl<string | null> = new FormControl<string>('')

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => (query === '' ? this.resetSearch() : false)),
        filter((query) => query !== null && query.length >= 3),
      )
      .subscribe((query) => {
        this.bookService.getBooksByTitleOrAuthor(query!)
      })
  }

  resetSearch(event?: Event): void {
    event?.preventDefault()
    this.searchControl.setValue('')
    this.bookService.getAllBooks()
  }

  openCreateModal(): void {
    const dialogReference = this.dialogService.open<BookModalComponent, BookDialogConfig>(BookModalComponent, {
      data: {
        isEdit: true,
      },
      autoFocus: false,
      width: '600px',
    })

    dialogReference.afterClosed().subscribe(() => {
      this.resetSearch()
    })
  }
}
