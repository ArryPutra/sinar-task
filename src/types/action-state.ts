export type ActionState<T = null> = {
    error: string | null;
    success: boolean;
    message?: string | null;
    fields?: Record<string, any> | null;
    fieldErrors?: Record<string, string[] | undefined> | null; 
    data?: T;
};

export const initialActionState: ActionState = {
    error: null,
    success: false,
    message: null,
    fields: null,
    fieldErrors: null,
};