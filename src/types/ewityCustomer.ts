export interface Customer {
    id: number;
    company_name: string | null;
    name: string;
    address: string;
    email: string;
    mobile: string;
    birthday: string | null;
    passport: string | null;
    bill_note: string | null;
    price_level: string | null;
    tax_number: string | null;
    note: string | null;
    credit_limit: number;
    total_outstanding: number;
    total_spent: number;
    loyalty_points: number | null;
    loyalty_text: string;
    loyalty_text_extra: string | null;
    loyalty_program: string | null;
    created_unix: number;
}

export interface CustomerRegistration {
    mobile?: string,
    name: string | null,
    email?: string | null,
    address: string | null
}