// category.model.ts
export interface Skill {
  _id?: string;
  name: string;
  description?: string;
}

export interface SubCategory {
  id?: string;
  name: string;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  skills: Skill[];
  subCategories: SubCategory[];
  subcategories?: SubCategory[];
}
