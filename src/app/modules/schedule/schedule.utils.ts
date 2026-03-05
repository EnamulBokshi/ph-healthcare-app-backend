export const convertDateTime = async(date: Date) => {
    const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    return new Date(date.getTime() + offset);

}
