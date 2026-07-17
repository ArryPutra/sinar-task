import slugify from "slugify";

interface GenerateUniqueSlugOptions {
    value: string;
    exists: (slug: string) => Promise<boolean>;
}

export async function generateUniqueSlug({
    value,
    exists,
}: GenerateUniqueSlugOptions) {
    const baseSlug = slugify(value, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug = baseSlug;
    let counter = 2;

    while (await exists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}