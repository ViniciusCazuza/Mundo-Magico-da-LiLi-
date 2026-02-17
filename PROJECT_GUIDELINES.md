The user wants to add a mandatory date format to the "Meu Aniversário" field. This required implementing a custom input mask feature for the `ModernInput` component to maintain visual consistency as requested by the user.

**Changes Made:**
1.  **`core/components/ModernInput.tsx`:**
    *   Added a new optional prop `mask?: string;` to the `ModernInputProps` interface.
    *   Implemented an `applyMask` function within the component to format the input value based on the provided mask. The mask uses '9' as a placeholder for digits.
    *   Modified the `onChange` handlers for both `<input>` and `<textarea>` elements to use the `applyMask` function if a `mask` prop is provided.
2.  **`modules/perfil/index.tsx`:**
    *   Added `mask="99/99/9999"` to the `ModernInput` component corresponding to the "Meu Aniversário" field.

This implementation provides a custom masked input for dates, offering a consistent user experience as requested.