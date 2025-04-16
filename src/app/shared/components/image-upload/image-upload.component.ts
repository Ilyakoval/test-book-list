import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  imports: [MatButtonModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class ImageUploadComponent implements ControlValueAccessor {
  selectedImage: string | ArrayBuffer | null = null;
  private file: File | null = null;
  private onChange: (file: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.file = file;
    this.onChange(this.file);
    this.onTouched();

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = null;
    }
  }

  clearImage(): void {
    this.file = null;
    this.selectedImage = null;
    this.onChange(this.file);
  }

  writeValue(file: File | null): void {
    this.file = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = null;
    }
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}


