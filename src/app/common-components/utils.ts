import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export class Utils {
    static intToRGB(value: number): number[] {
        const result = [];
        let r, g, b: number;
        b = 0x0000FF & value;
        g = (0x00FF00 & value) >> 8;
        r = (0xFF0000 & value) >> 16;
        result.push(r);
        result.push(g);
        result.push(b);

        return result;
    }

    static rgbToInt(rgbStr: string): number {
        const rgb = rgbStr.replace(/[^\d,]/g, '').split(',');
        return (parseInt(rgb[0], 10) << 16) + (parseInt(rgb[1], 10) << 8) + (parseInt(rgb[2], 10));
    }

    static rgbIntToHex(value: number): string {
        return '#' + ((1 << 24) + value).toString(16);
    }

    static HexToIntRGB(hex: string): number {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return ((parseInt(result[1], 16)) << 16) + ((parseInt(result[2], 16)) << 8) + ((parseInt(result[3], 16)));
    }

    static getRGBStr(rgb: number[]): string {
        return 'rgb(' + rgb[0].toString() + ',' + rgb[1].toString() + ',' + rgb[2].toString() + ')';
    }

    static delayObservable(ms: number): Observable<any> {
        return of({}).pipe(delay(ms));
    }

    static getHBFilterChainShiftFactor(log2: number, chainHash: number): number {
      if (log2 === 0) {
        return 0;
      }

      const s = 3 ** log2;
      let u = chainHash % s; // scale

      let ix = log2;
      let shift = 0;
      let shift_stage = 1 / (2 ** (log2 + 1));

      // base3 conversion
      do {
          const r = u % 3;
          shift += (r - 1) * shift_stage;
          shift_stage *= 2;
          u = Math.floor(u / 3); // Euclidean division
          ix--;
      } while (u);

      // continue shift with leading zeroes. ix has the number of leading zeroes.
      for (let i = 0; i < ix; i++) {
          shift -= shift_stage;
          shift_stage *= 2;
      }

      return shift;
    }

    static convertHBFilterChainToString(log2: number, chainHash: number): string {
      if (log2 === 0) {
          return 'C';
      }

      const s = 3 ** log2;
      let u = chainHash % s; // scale
      let chainString = '';
      let ix = log2;

      // base3 conversion
      do {
          const r = u % 3;

          if (r === 0) {
              chainString = 'L' + chainString;
          } else if (r === 1) {
              chainString = 'C' + chainString;
          } else if (r === 2) {
              chainString = 'H' + chainString;
          }

          u = Math.floor(u / 3); // Euclidean division
          ix--;
      } while (u);

      // continue shift with leading zeroes. ix has the number of leading zeroes.
      for (let i = 0; i < ix; i++) {
          chainString = 'L' + chainString;
      }

      return chainString;
    }
}
