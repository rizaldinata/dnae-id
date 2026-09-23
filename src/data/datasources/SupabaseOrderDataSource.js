import { supabase } from '../lib/supabaseClient';
import { LocalStorageDataSource } from './LocalStorageDataSource';

export class SupabaseOrderDataSource {
  static async getOrders(status = null) {
    if (!supabase) {
      return LocalStorageDataSource.getOrders(status);
    }

    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error || !data) {
        return LocalStorageDataSource.getOrders(status);
      }

      return data;
    } catch (err) {
      console.warn('Supabase get orders failed, using LocalStorage', err);
      return LocalStorageDataSource.getOrders(status);
    }
  }

  static async createOrder(orderJson) {
    if (!supabase) {
      return LocalStorageDataSource.saveOrder(orderJson);
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderJson])
        .select()
        .single();

      if (error) {
        console.warn('Supabase create order error:', error);
        return LocalStorageDataSource.saveOrder(orderJson);
      }
      return data;
    } catch (err) {
      console.warn('Supabase insert failed, fallback to LocalStorage', err);
      return LocalStorageDataSource.saveOrder(orderJson);
    }
  }

  static async updateOrderStatus(orderId, status) {
    if (!supabase) {
      return LocalStorageDataSource.updateOrderStatus(orderId, status);
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .or(`id.eq.${orderId},order_code.eq.${orderId}`)
        .select()
        .single();

      if (error) {
        return LocalStorageDataSource.updateOrderStatus(orderId, status);
      }
      return data;
    } catch (err) {
      return LocalStorageDataSource.updateOrderStatus(orderId, status);
    }
  }

  static async deleteOrder(orderId) {
    if (!supabase) {
      return LocalStorageDataSource.deleteOrder(orderId);
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .or(`id.eq.${orderId},order_code.eq.${orderId}`);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete order failed, using local storage fallback', err);
      return LocalStorageDataSource.deleteOrder(orderId);
    }
  }
}
