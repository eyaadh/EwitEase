export interface Product {
    id: number;
    brand_name: string | null;
    category_name: string;
    name: string;
    has_variants: boolean;
    has_serialized_inventory: boolean;
    is_inventory_tracked: boolean;
    type: string;
    codes: string;
    cost_price: number;
    effective_cost_price: number;
    sales_price: number;
    sales_price_with_tax: number;
    default_sales_price: number;
    default_sales_price_with_tax: number;
    units: {
        scales: {
            pcs: number;
        };
        default: string;
        base: string;
    };
    count: number;
    variants: Variant[];
    taxes?: any
}

export interface Variant {
    id: number;
    product_id: number;
    type: string;
    attr_text: string;
    attr_values: any[]; // You can specify a more specific type if you know the structure
    full_name: string;
    product_name: string;
    barcode: string | null;
    sku: string;
    is_inventory_tracked: boolean;
    code: string;
    pricing: {
        base: {
            price: number;
        };
    };
    units: {
        scales: {
            pcs: number;
        };
        default: string;
        base: string;
    };
    cost_price: number;
    standard_cost: number;
    effective_cost_price: number;
    sales_price: number;
    sales_price_with_tax: number;
    default_sales_price: number;
    default_sales_price_with_tax: number;
    recipe: any | null; // You can specify a more specific type if you know the structure
    kit_items: any[]; // You can specify a more specific type if you know the structure
    images: any[]; // You can specify a more specific type if you know the structure
    thumbnail: string | null;
    count: number;
}

export interface ProductsStoreResponse {
    products: Product[] | null,
    productsPage: number,
    productsLastPage: number,
    productsTotalItems: number
}


export interface ProductForCart {
    variant_id: number,
    product_id: number,
    product_name: string
    product_image: string,
    unit: string,
    unit_quantity: number,
    quantity: number,
    unit_sales_price: number,
    total_sales_price: number,
    base_sales_price: number,
    total_base_sales_price: number,
    base_tax_amount: number,
    total_base_tax_amount: number,
    taxes: any
}