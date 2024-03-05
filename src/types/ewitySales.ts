import type {Customer} from "@/types/ewityCustomer";

export interface Location {
    id: number;
    name: string;
    display_name: string;
    type: string;
    tax_number: string;
    tax_activity_number: string;
    street_address: string | null;
    city: string | null;
    country: string | null;
    phone: string | null;
    bill_note: string | null;
    price_level: string | null;
}


export interface Created {
    at: string;
    by: string;
}

export interface SaleData {
    id: number;
    parent_id: number | null;
    number: string;
    location: Location;
    customer: Customer;
    register_name: string;
    restaurant_table: any | null;
    total_sales_price: number;
    total_cost_price: number;
    total_tax: number;
    total_outstanding: number;
    total: number;
    currency: string | null;
    status: string;
    payment_status: string;
    delivery_status: any | null;
    ui_status?: any;
    ui_payment_status?: any;
    ui_delivery_status?: any;
    ui_type?: any;
    type: string;
    sub_type: any | null;
    is_invalid: boolean;
    invalid_reason: string | null;
    ebill_url: string;
    date: string;
    created: Created;
    bill_lines: BillLine[] | null;
}

export interface Payment {
    id: number;
    number: string;
    bill_id: number;
    bill: {
        id: number;
        number: string;
    };
    payment_type: string;
    status: string | null;
    amount: number;
    amount_text: string;
    ref: string | null;
    extra: string | null;
    note: string;
    received_currency: string | null;
    received_currency_rate: number | null;
    received_amount: number | null;
    created: {
        at: string;
        by: string;
    };
}

export interface Variant {
    id: number;
    product_id: number;
    type: string;
    attr_text: string;
    attr_values: any[];
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
        units: any[];
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
    recipe: string | null;
    kit_items: any[];
    images: {
        id: number;
        url: string;
        width: number | null;
        height: number | null;
        placeholder: string | null;
    }[];
    thumbnail: {
        id: number;
        url: string;
        width: number | null;
        height: number | null;
        placeholder: string | null;
    } | null;
}

export interface Tax {
    id: number;
    tax_id: number;
    name: string;
    rate: number;
    code: string;
    amount: number;
}

export interface BillLine {
    id: number;
    variant: Variant;
    taxes: Tax[];
    text: string;
    note: string;
    note_internal: string;
    print_note: number;
    has_serialized_inventory: boolean;
    quantity: number;
    cost_price: number;
    sales_price: number;
    price_level: string | null;
    discount_amount: number;
    discount_percent: number | null;
    unit: string;
    unit_quantity: number;
    unit_scale: number;
    total_cost_price: number;
    total_sales_price: number;
    total_tax: number;
    total: number;
    serials: any[] | null;
    batches: any[];
    refundable_quantity: number;
    original_quantity: number;
    refundable_text: string | null;
    modifiers_used: any[];
    kit_items: any[];
    served: any[] | null;
    sort_order: number;
}

export interface BillData {
    id: number;
    parent: any | null;
    children: any[];
    location: Location;
    customer: Customer;
    payments: Payment[];
    employee: any | null;
    customer_address: any | null;
    bill_lines: BillLine[];
    void_items: any[];
    restaurant_table: any | null;
    covers: number;
    quotation: any | null;
    register_session_id: number;
    register_name: string;
    number: string;
    sub_total: number;
    total_sales_price: number;
    total_cost_price: number;
    total_tax: number;
    total_outstanding: number;
    total: number;
    currency: string | null;
    discount_amount: number;
    discount_percent: number | null;
    taxes: Tax[];
    fees: any[];
    status: string;
    payment_status: string;
    delivery_status: any | null;
    ui_status?: any;
    ui_payment_status?: any;
    ui_delivery_status?: any;
    ui_type?: any;
    type: string;
    sub_type: any | null;
    date: string;
    settled_at: number;
    note: string;
    po_number: string | null;
    invalid_reason: string | null;
    files: any[];
    client_created_at: number;
    client_created: { at: string; by: string };
    created_unix: number;
    created: { at: string; by: string };
    updated: { at: string; by: string };
    ebill_url: string;
    refund: any | null;
    extra: {
        can_pay: boolean;
        can_void: boolean;
        cant_void_reason: string | null;
        can_refund: boolean;
        cant_refund_reason: string | null;
        refundable_payment: number;
        can_change_delivery_status: { possible: boolean; allowed: boolean };
        has_delivery_receipt: boolean;
    };
    flight_number: string | null;
    flight_seat_number: string | null;
}