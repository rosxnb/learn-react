import { useEffect } from "react";

export function useKeyPressEvent(code, action) {
    useEffect(() => {
        const callback = (e) => {
            if (e.code.toLowerCase() === code.toLowerCase())
                action();
        }
        document.addEventListener("keydown", callback);
        return () => document.removeEventListener("keydown", callback);
    }, [action, code])
}
