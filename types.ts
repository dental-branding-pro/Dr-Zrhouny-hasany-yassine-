export type Language = 'fr' | 'ar';
export type Theme = 'light' | 'dark';

export interface ModalContent {
  id: string;
  title: string;
  subtitle?: string;
  type: 
    | 'diagnostic'
    | 'whatsapp_booking'
    | 'whatsapp_responses'
    | 'google_reviews'
    | 'seo_articles'
    | 'faq_engine'
    | 'vcard'
    | 'qr_code'
    | 'maps_itinerary'
    | 'instagram_bank'
    | 'google_posts'
    | 'maps_top3_guide'
    | 'secretary_script';
}
