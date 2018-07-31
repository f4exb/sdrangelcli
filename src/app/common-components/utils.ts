export class Utils {
    static intToRGB(value: number) : number[] {
        let result = [];
        let r, g, b : number;
        b = 0x0000FF & value;
        g = (0x00FF00 & value)>>8;
        r = (0xFF0000 & value)>>16;
        result.push(r);
        result.push(g);
        result.push(b);

        return result;
    }
}