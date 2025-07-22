import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagePath',
  standalone: true,
})
export class ImagePathPipe implements PipeTransform {
  transform(image: string): string {
    
    if (image) {
      return `${environment.baseUrl}/${image}`;
    }
    return '/no-image.jpeg';
  }
}
