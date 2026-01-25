// Search Kit Library Types

export interface TermGroup {
  label: string;
  terms: string;
}

export interface Cluster {
  label: 'Broad' | 'Established' | 'Recent' | 'Specific';
  terms?: string;
  groups?: TermGroup[];
}

export interface SubBlock {
  type: 'Concepts' | 'Methods' | 'Tools';
  clusters: Cluster[];
}

export interface Block {
  number: number;
  title: string;
  sub_blocks: SubBlock[];
}

export interface RecipeItem {
  block: string;
  components: string;
}

export interface Archetype {
  name: string;
  summary: string;
  recipe: RecipeItem[];
  why: string;
}

export interface SearchKit {
  version: string;
  role_title: string;
  role_summary: string;
  role_details?: {
    core_function?: string;
    technical_domain?: string;
    key_deliverables?: string;
    stakeholders?: string;
  };
  archetypes: Archetype[];
  blocks: Block[];
}

// Database row types
export interface SearchKitRow {
  id: string;
  role_title: string;
  company: string | null;
  created_at: string;
  created_by: string;
  input_jd: string;
  input_intake: string | null;
  kit_data: SearchKit;
}

export interface UserFavoriteRow {
  id: string;
  user_id: string;
  search_kit_id: string;
  created_at: string;
}

// Component prop types
export interface KitCardProps {
  kit: SearchKitRow;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface FavoriteButtonProps {
  isFavorited: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export interface ArchetypeAccordionProps {
  archetype: Archetype;
  defaultOpen?: boolean;
}

export interface BlockSectionProps {
  block: Block;
}

export interface ClusterRowProps {
  cluster: Cluster;
}

export interface CopyButtonProps {
  text: string;
}
