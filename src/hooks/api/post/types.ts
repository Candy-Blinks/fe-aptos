// Post interface based on your database schema
export interface Post {
  id: string;
  user_id: string;
  content?: string;
  media_urls: string[]; // JSON array in DB
  has_blink: boolean;
  collection_uri?: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  has_shared_post: boolean;
  shared_post_id?: string;
}

// User interface for relations
export interface User {
  id: string;
  username: string;
  aptos_address: string;
  display_name: string;
  email?: string;
  header_url?: string;
  profile_url?: string;
  bio?: string;
  activity_points: number;
  role: string;
  is_new_user: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  referral_code: string;
  referral_count: number;
  referred_by?: string;
}

// Like interface
export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// Share interface
export interface Share {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// Comment interface
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Comment with user relation
export interface CommentWithUser extends Comment {
  user?: User;
}

// PostWithRelations interface for API responses
export interface PostWithRelations extends Post {
  user?: User;
  likes?: Like[];
  shares?: Share[];
  comments?: CommentWithUser[];
  original_post?: PostWithRelations; // For shared posts
} 