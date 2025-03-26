
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the configured Supabase client from the integration
export const supabase = supabaseClient;

export interface ChatSettings {
  id: string;
  name: string;
  chat_title: string;
  webhook_url: string;
  input_placeholder: string;
  empty_state_text: string;
  width: string;
  height: string;
  created_at: string;
}

export const getChatSettings = async (id: string | null | undefined): Promise<ChatSettings | null> => {
  // Check if the ID is valid before making the request
  if (!id) {
    console.error('Invalid chat settings ID:', id);
    return null;
  }
  
  const { data, error } = await supabase
    .from('chat_settings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching chat settings:', error);
    return null;
  }
  
  return data;
};

export const getAllChatSettings = async (): Promise<ChatSettings[]> => {
  const { data, error } = await supabase
    .from('chat_settings')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all chat settings:', error);
    return [];
  }
  
  return data || [];
};

export const createChatSettings = async (settings: Omit<ChatSettings, 'id' | 'created_at'>): Promise<string | null> => {
  const { data, error } = await supabase
    .from('chat_settings')
    .insert([settings])
    .select();
  
  if (error) {
    console.error('Error creating chat settings:', error);
    return null;
  }
  
  return data?.[0]?.id || null;
};

export const updateChatSettings = async (id: string, settings: Partial<Omit<ChatSettings, 'id' | 'created_at'>>): Promise<boolean> => {
  const { error } = await supabase
    .from('chat_settings')
    .update(settings)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating chat settings:', error);
    return false;
  }
  
  return true;
};

export const deleteChatSettings = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('chat_settings')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting chat settings:', error);
    return false;
  }
  
  return true;
};
