import { supabase } from './supabase';
import { handleApiError } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import type { Conversation, ConversationParticipant, Message, MessageReaction } from '@/types';

// ============================================
// CONVERSATIONS
// ============================================

export async function getConversations(userId: string): Promise<Conversation[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          *,
          profiles(id, full_name, role)
        )
      `)
      .in('id', 
        supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', userId)
      )
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    logger.error('Failed to fetch conversations', { userId, error });
    return handleApiError(error, 'getConversations');
  }
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          *,
          profiles(id, full_name, role)
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Failed to fetch conversation', { conversationId, error });
    return handleApiError(error, 'getConversation');
  }
}

export async function createDirectConversation(
  userId: string,
  otherUserId: string
): Promise<Conversation> {
  try {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId)
      .in('conversation_id',
        supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', otherUserId)
      );

    if (existing && existing.length > 0) {
      return getConversation(existing[0].conversation_id);
    }

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        type: 'direct',
        created_by: userId,
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversation.id, user_id: userId },
        { conversation_id: conversation.id, user_id: otherUserId },
      ]);

    if (partError) throw partError;

    return getConversation(conversation.id);
  } catch (error) {
    logger.error('Failed to create direct conversation', { userId, otherUserId, error });
    return handleApiError(error, 'createDirectConversation');
  }
}

export async function createGroupConversation(
  userId: string,
  name: string,
  participantIds: string[]
): Promise<Conversation> {
  try {
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        type: 'group',
        name,
        created_by: userId,
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add creator and participants
    const participants = [
      { conversation_id: conversation.id, user_id: userId, is_admin: true },
      ...participantIds.map(id => ({
        conversation_id: conversation.id,
        user_id: id,
        is_admin: false,
      })),
    ];

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (partError) throw partError;

    return getConversation(conversation.id);
  } catch (error) {
    logger.error('Failed to create group conversation', { userId, name, error });
    return handleApiError(error, 'createGroupConversation');
  }
}

// ============================================
// MESSAGES
// ============================================

export async function getMessages(
  conversationId: string,
  limit = 50,
  before?: string
): Promise<Message[]> {
  try {
    let query = supabase
      .from('messages')
      .select(`
        *,
        profiles(id, full_name, role),
        reactions:message_reactions(
          *,
          profiles(id, full_name)
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query;

    if (error) throw error;
    return Array.isArray(data) ? data.reverse() : [];
  } catch (error) {
    logger.error('Failed to fetch messages', { conversationId, error });
    return handleApiError(error, 'getMessages');
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  attachments?: string[],
  replyTo?: string
): Promise<Message> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        attachments,
        reply_to: replyTo,
      })
      .select(`
        *,
        profiles(id, full_name, role)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Failed to send message', { conversationId, senderId, error });
    return handleApiError(error, 'sendMessage');
  }
}

export async function updateMessage(
  messageId: string,
  content: string
): Promise<Message> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({
        content,
        is_edited: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .select(`
        *,
        profiles(id, full_name, role)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Failed to update message', { messageId, error });
    return handleApiError(error, 'updateMessage');
  }
}

export async function deleteMessage(messageId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  } catch (error) {
    logger.error('Failed to delete message', { messageId, error });
    return handleApiError(error, 'deleteMessage');
  }
}

export async function addReaction(
  messageId: string,
  userId: string,
  emoji: string
): Promise<MessageReaction> {
  try {
    const { data, error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        emoji,
      })
      .select(`
        *,
        profiles(id, full_name)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Failed to add reaction', { messageId, userId, emoji, error });
    return handleApiError(error, 'addReaction');
  }
}

export async function removeReaction(
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('emoji', emoji);

    if (error) throw error;
  } catch (error) {
    logger.error('Failed to remove reaction', { messageId, userId, emoji, error });
    return handleApiError(error, 'removeReaction');
  }
}

export async function markAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    logger.error('Failed to mark as read', { conversationId, userId, error });
    return handleApiError(error, 'markAsRead');
  }
}
