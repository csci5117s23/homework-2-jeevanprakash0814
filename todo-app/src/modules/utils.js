export function shrinkText(text) {
    // if(text.length > innerWidth/20) return `${text.substring(0,innerWidth/20)}...`;
    // else return text;
    if(text.length > 20) return `${text.substring(0,20)}...`;
    else return text;
}