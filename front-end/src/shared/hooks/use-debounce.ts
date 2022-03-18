import { useEffect, useState } from "react";
const defaultDelay = 300;
export default function useDebounce(value: string, delay?: number) {
    const [debouncedValue, setDebouncedValue] = useState('');
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, (delay || defaultDelay));
        return () => {
            clearTimeout(handler)
        }
    }, [value]);

    return debouncedValue;
};
