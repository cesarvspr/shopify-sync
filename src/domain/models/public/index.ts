  type ShopifyResponse = {
    orders: Order[];
};

export type Order = {
    id: number;
    admin_graphql_api_id: string;
    app_id: number;
    browser_ip: string;
    buyer_accepts_marketing: boolean;
    cancel_reason: null;
    cancelled_at: null;
    cart_token: null;
    checkout_id: number;
    checkout_token: string;
    client_details: ClientDetails;
    closed_at: null;
    confirmed: boolean;
    contact_email: null;
    created_at: string;
    currency: string;
    current_subtotal_price: string;
    current_subtotal_price_set: MoneySet;
    current_total_discounts: string;
    current_total_discounts_set: MoneySet;
    current_total_duties_set: null;
    current_total_price: string;
    current_total_price_set: MoneySet;
    current_total_tax: string;
    current_total_tax_set: MoneySet;
    customer_locale: string;
    device_id: null;
    discount_codes: any[];
    email: string;
    estimated_taxes: boolean;
    financial_status: string;
    fulfillment_status: null;
    gateway: string;
    landing_site: null;
    landing_site_ref: null;
    location_id: number;
    name: string;
    note: null;
    note_attributes: any[];
    number: number;
    order_number: number;
    order_status_url: string;
    original_total_duties_set: null;
    payment_gateway_names: string[];
    phone: null;
    presentment_currency: string;
    processed_at: string;
    processing_method: string;
    reference: string;
    referring_site: null;
    source_identifier: string;
    source_name: string;
    source_url: null;
    subtotal_price: string;
    subtotal_price_set: MoneySet;
    tags: string;
    tax_lines: any[];
    taxes_included: boolean;
    test: boolean;
    token: string;
    total_discounts: string;
    total_discounts_set: MoneySet;
    total_line_items_price: string;
    total_line_items_price_set: MoneySet;
    total_outstanding: string;
    total_price: string;
    total_price_set: MoneySet;
    total_price_usd: string;
    total_shipping_price_set: MoneySet;
    total_tax: string;
    total_tax_set: MoneySet;
    total_tip_received: string;
    total_weight: number;
    updated_at: string;
    user_id: number;
    discount_applications: any[];
    fulfillments: any[];
    line_items: LineItem[];
    payment_terms: null;
    refunds: any[];
    shipping_lines: any[];
};

type ClientDetails = {
    accept_language: null;
    browser_height: null;
    browser_ip: string;
    browser_width: null;
    session_hash: null;
    user_agent: string;
};

type MoneySet = {
    shop_money: Money;
    presentment_money: Money;
};

type Money = {
    amount: string;
    currency_code: string;
};

type LineItem = {
  id: number;
  admin_graphql_api_id: string;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: null;
  gift_card: boolean;
  grams: number;
  name: string;
  origin_location: OriginLocation;
  price: string;
  price_set: MoneySet;
  product_exists: boolean;
  product_id: number;
  properties: any[];
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: MoneySet;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: string;
  vendor: string;
  tax_lines: any[];
  duties: any[];
  discount_allocations: any[];
};
type OriginLocation = {
  id: number;
  country_code: string;
  province_code: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
};

export interface Product {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: null | string;
  template_suffix: null | string;
  status: string;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: Variant[];
  options: Option[];
  images: Image[];
  image: Image;
}

interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: null | string;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: null | string;
  option3: null | string;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: null | string;
  grams: number;
  image_id: null | string;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

interface Option {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

interface Image {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: null | string;
  width: number;
  height: number;
  src: string;
  variant_ids: string[];
  admin_graphql_api_id: string;
}