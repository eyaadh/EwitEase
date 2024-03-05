export interface CategoryImage {
    url: string
}

export interface ProductCategory {
    id: number;
    type: string;
    category_id: number | null;
    name: string;
    product_count: number;
    for_sale: boolean;
    kot_type_id: number | null;
    kot_type_text: string | null;
    image: CategoryImage | null;
    category: any; // You might want to define a specific type for 'category' if possible
}

export interface CategoriesStoreResponse {
    categories: ProductCategory[] | null,
    currentPage: number,
    categoriesLastPage: number,
    categoriesTotalItems: number
}