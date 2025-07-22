import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Image } from '@app/shared/models';
import { environment } from 'src/environments/environment';

const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatCardModule];

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [NgClass, MATERIAL_MODULES],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputComponent {
  selectedImage = input.required<Image>();
  hasError = input<boolean>();
  fileEmitter = output<File>();
  fileUpload = viewChild<ElementRef>('fileUpload');
  fileName = signal('');
  newPath = signal('');
  imagePath = computed(() => {
    if (this.newPath()) {
      return this.newPath();
    }
    if (this.selectedImage()) {
      return `${environment.baseUrl}/${this.selectedImage().path}`;
    }
    return null;
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const file: File = input.files[0];
      if (file) {
        this.handelFile(file);
      }
    }
  }

  openBottomSheet(): void {
    this.fileUpload()?.nativeElement.click();
  }

  handelFile(file: File) {
    this.fileName.set(file.name);
    this.fileEmitter.emit(file);
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) =>
      this.newPath.set(event.target?.result as string);
    reader.readAsDataURL(file);
  }
}
