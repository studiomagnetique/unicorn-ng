import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unicornAge',
})
export class UnicornAgePipe implements PipeTransform {
  transform(birthyear: number, ...args: unknown[]): string | '👴' {
    const age: number = new Date().getFullYear() - birthyear;
    return age > 60 ? '👴' : age + (age > 1 ? '\u00a0ans' : '\u00a0an');
  }
}
