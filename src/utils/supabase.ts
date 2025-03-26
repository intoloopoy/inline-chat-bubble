
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
  primary_color: string;
  typing_text: string;
  created_at: string;
  user_id?: string;
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
  
  // Add the typing_text field with a default value if it doesn't exist in the database
  return {
    ...data,
    typing_text: data.typing_text || "Typing..." // Provide default value if not present
  };
};

export const getAllChatSettings = async (): Promise<ChatSettings[]> => {
  // Get the current user's ID from the auth session
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  // If no user is authenticated, return an empty array
  if (!userId) {
    return [];
  }
  
  // Query only the chat settings belonging to the current user
  const { data, error } = await supabase
    .from('chat_settings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all chat settings:', error);
    return [];
  }
  
  // Add the typing_text field with a default value if it doesn't exist in the database
  return (data || []).map(chatSetting => ({
    ...chatSetting,
    typing_text: chatSetting.typing_text || "Typing..." // Provide default value if not present
  }));
};

export const createChatSettings = async (settings: Omit<ChatSettings, 'id' | 'created_at'>): Promise<string | null> => {
  // Get the current user's ID from the auth session if not provided
  if (!settings.user_id) {
    const { data: { session } } = await supabase.auth.getSession();
    settings.user_id = session?.user?.id;
    
    // If still no user ID, return null (user must be authenticated)
    if (!settings.user_id) {
      console.error('Error creating chat settings: No authenticated user');
      return null;
    }
  }
  
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
