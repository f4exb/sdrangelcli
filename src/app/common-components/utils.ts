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
}
