export type ActionState = {
    success: boolean;
    message?: string | null;
    fields?: Record<string, any> | null;
    fieldErrors?: Record<string, string[] | undefined> | null; 
};

export const initialActionState: ActionState = {
    success: false,
    message: null,
    fields: null,
    fieldErrors: null,
};