const colors: string[] = ["red"];

export const getColors = async () => {
    return await Promise.resolve(colors);
};

export const postColor = async (color: string) => {
    return await Promise.resolve(colors.push(color));
};
