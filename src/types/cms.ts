export interface CmsItem {
  id: number;
  item_key: string;
  page: string;
  section: string;
  content_type:
    | "text"
    | "image"
    | "video"
    | "pillar"
    | "stage"
    | "circle"
    | "footer_block"
    | "card";
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
  description_en: string;
  description_es: string;
  media_url: string;
  media_type: "none" | "image" | "video";
  badge_en: string;
  badge_es: string;
  cta_text_en: string;
  cta_text_es: string;
  cta_link: string;
  meta_json: Record<string, unknown>;
  display_order: number;
  status: "active" | "inactive";
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

