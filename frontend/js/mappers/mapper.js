export function map(input) {
    return input.map(element => {
        element.selected = false;
        return element;
    });
}