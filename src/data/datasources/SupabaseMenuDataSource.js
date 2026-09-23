import { supabase } from '../lib/supabaseClient';
import { LocalStorageDataSource } from './LocalStorageDataSource';

export class SupabaseMenuDataSource {
  static async getMenuItems(category = null) {
    if (!supabase) {
      return LocalStorageDataSource.getMenuItems(category);
    }

    try {
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('id', { ascending: true });

      if (category && category !== 'Semua') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return LocalStorageDataSource.getMenuItems(category);
      }

      return data;
    } catch (err) {
      console.warn('Supabase not reachable, falling back to LocalStorage', err);
      return LocalStorageDataSource.getMenuItems(category);
    }
  }

  static async saveMenuItem(itemJson) {
    if (!supabase) {
      return LocalStorageDataSource.saveMenuItem(itemJson);
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .upsert([itemJson])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase save menu failed, using local storage fallback', err);
      return LocalStorageDataSource.saveMenuItem(itemJson);
    }
  }

  static async deleteMenuItem(id) {
    if (!supabase) {
      return LocalStorageDataSource.deleteMenuItem(id);
    }

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      return LocalStorageDataSource.deleteMenuItem(id);
    }
  }

  static async updateMenuItem(id, itemJson) {
    if (!supabase) {
      return LocalStorageDataSource.saveMenuItem({ ...itemJson, id });
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(itemJson)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase update menu failed, using local storage fallback', err);
      return LocalStorageDataSource.saveMenuItem({ ...itemJson, id });
    }
  }
}
