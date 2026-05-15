import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function FileInput(
    { className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className={className}>
            <input
                {...props}
                type="file"
                className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                ref={localRef}
            />
        </div>
    );
});
