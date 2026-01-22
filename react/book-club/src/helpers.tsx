export const formatLastAccess = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};