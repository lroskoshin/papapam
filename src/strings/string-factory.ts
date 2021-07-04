import { StringArea } from "./string-area";

export function stringsFactory(): StringArea[] {
    const stringsElements = document.getElementsByClassName('area-string');
    const strings = [];
    for (let index = 0; index < stringsElements.length; index++) {
        const element = stringsElements.item(index);
        strings.push(new StringArea(element));
    }
    return strings;
}
