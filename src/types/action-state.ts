export type ActionState = {
    error: string | null;
    success: boolean;
    message?: string | null;
    fields?: Record<string, any> | null;
    fieldErrors?: Record<string, string[] | undefined> | null; 
};

export const initialActionState: ActionState = {
    error: null,
    success: false,
    message: null,
    fields: null,
    fieldErrors: null,
};