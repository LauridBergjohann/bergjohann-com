export type NavigationItem =
    {
        type: "page";
        pageId: string;
        children?: NavigationItem[];
    } | {
        type: "model";
        modelId: string;
    };