-- Row Level Security Policies for New Features

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_experiences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MESSAGING POLICIES
-- ============================================

-- Conversations: Users can view conversations they're part of
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT conversation_id FROM public.conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Conversations: Users can create conversations
CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Conversation participants: Users can view participants of their conversations
CREATE POLICY "Users can view conversation participants"
ON public.conversation_participants FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Conversation participants: Users can add participants to conversations they created
CREATE POLICY "Users can add participants"
ON public.conversation_participants FOR INSERT
TO authenticated
WITH CHECK (
  conversation_id IN (
    SELECT id FROM public.conversations WHERE created_by = auth.uid()
  )
);

-- Messages: Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Messages: Users can send messages to their conversations
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Messages: Users can update their own messages
CREATE POLICY "Users can update their messages"
ON public.messages FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Messages: Users can delete their own messages
CREATE POLICY "Users can delete their messages"
ON public.messages FOR DELETE
TO authenticated
USING (sender_id = auth.uid());

-- Message reactions: Users can view reactions
CREATE POLICY "Users can view message reactions"
ON public.message_reactions FOR SELECT
TO authenticated
USING (true);

-- Message reactions: Users can add reactions
CREATE POLICY "Users can add reactions"
ON public.message_reactions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Message reactions: Users can remove their reactions
CREATE POLICY "Users can remove their reactions"
ON public.message_reactions FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Notifications: Users can update their notifications (mark as read)
CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Notifications: Users can delete their notifications
CREATE POLICY "Users can delete their notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Notification preferences: Users can manage their preferences
CREATE POLICY "Users can manage notification preferences"
ON public.notification_preferences FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- SOCIAL FEED POLICIES
-- ============================================

-- Posts: Everyone can view posts
CREATE POLICY "Everyone can view posts"
ON public.posts FOR SELECT
TO authenticated
USING (true);

-- Posts: Users can create posts
CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Posts: Users can update their own posts
CREATE POLICY "Users can update their posts"
ON public.posts FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Posts: Users can delete their own posts
CREATE POLICY "Users can delete their posts"
ON public.posts FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Post likes: Everyone can view likes
CREATE POLICY "Everyone can view post likes"
ON public.post_likes FOR SELECT
TO authenticated
USING (true);

-- Post likes: Users can like posts
CREATE POLICY "Users can like posts"
ON public.post_likes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Post likes: Users can unlike posts
CREATE POLICY "Users can unlike posts"
ON public.post_likes FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Post comments: Everyone can view comments
CREATE POLICY "Everyone can view comments"
ON public.post_comments FOR SELECT
TO authenticated
USING (true);

-- Post comments: Users can comment
CREATE POLICY "Users can comment"
ON public.post_comments FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Post comments: Users can update their comments
CREATE POLICY "Users can update their comments"
ON public.post_comments FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Post comments: Users can delete their comments
CREATE POLICY "Users can delete their comments"
ON public.post_comments FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Comment likes: Similar to post likes
CREATE POLICY "Everyone can view comment likes"
ON public.comment_likes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can like comments"
ON public.comment_likes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unlike comments"
ON public.comment_likes FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Post shares: Everyone can view shares
CREATE POLICY "Everyone can view shares"
ON public.post_shares FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can share posts"
ON public.post_shares FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unshare posts"
ON public.post_shares FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- User follows: Everyone can view follows
CREATE POLICY "Everyone can view follows"
ON public.user_follows FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can follow others"
ON public.user_follows FOR INSERT
TO authenticated
WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow"
ON public.user_follows FOR DELETE
TO authenticated
USING (follower_id = auth.uid());

-- ============================================
-- RESOURCE LIBRARY POLICIES
-- ============================================

-- Resources: Everyone can view approved resources
CREATE POLICY "Everyone can view approved resources"
ON public.resources FOR SELECT
TO authenticated
USING (status = 'approved' OR uploaded_by = auth.uid());

-- Resources: Users can upload resources
CREATE POLICY "Users can upload resources"
ON public.resources FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid());

-- Resources: Users can update their own resources
CREATE POLICY "Users can update their resources"
ON public.resources FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid())
WITH CHECK (uploaded_by = auth.uid());

-- Resources: Admins can approve/reject resources
CREATE POLICY "Admins can manage resources"
ON public.resources FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Resource reviews: Everyone can view reviews
CREATE POLICY "Everyone can view reviews"
ON public.resource_reviews FOR SELECT
TO authenticated
USING (true);

-- Resource reviews: Users can add reviews
CREATE POLICY "Users can add reviews"
ON public.resource_reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Resource reviews: Users can update their reviews
CREATE POLICY "Users can update their reviews"
ON public.resource_reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Resource downloads: Users can track their downloads
CREATE POLICY "Users can track downloads"
ON public.resource_downloads FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their downloads"
ON public.resource_downloads FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Resource bookmarks: Users can manage their bookmarks
CREATE POLICY "Users can manage bookmarks"
ON public.resource_bookmarks FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- PLACEMENT PORTAL POLICIES
-- ============================================

-- Companies: Everyone can view companies
CREATE POLICY "Everyone can view companies"
ON public.companies FOR SELECT
TO authenticated
USING (true);

-- Companies: Admins can manage companies
CREATE POLICY "Admins can manage companies"
ON public.companies FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Job postings: Everyone can view active jobs
CREATE POLICY "Everyone can view active jobs"
ON public.job_postings FOR SELECT
TO authenticated
USING (is_active = true);

-- Job postings: Admins can manage jobs
CREATE POLICY "Admins can manage jobs"
ON public.job_postings FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Applications: Users can view their own applications
CREATE POLICY "Users can view their applications"
ON public.applications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Applications: Users can apply for jobs
CREATE POLICY "Users can apply for jobs"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Applications: Users can update their applications
CREATE POLICY "Users can update their applications"
ON public.applications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Applications: Admins can view and manage all applications
CREATE POLICY "Admins can manage applications"
ON public.applications FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Student profiles: Users can view all profiles
CREATE POLICY "Users can view student profiles"
ON public.student_profiles FOR SELECT
TO authenticated
USING (true);

-- Student profiles: Users can manage their own profile
CREATE POLICY "Users can manage their profile"
ON public.student_profiles FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Placement stats: Everyone can view stats
CREATE POLICY "Everyone can view placement stats"
ON public.placement_stats FOR SELECT
TO authenticated
USING (true);

-- Placement stats: Admins can manage stats
CREATE POLICY "Admins can manage placement stats"
ON public.placement_stats FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Interview experiences: Everyone can view experiences
CREATE POLICY "Everyone can view interview experiences"
ON public.interview_experiences FOR SELECT
TO authenticated
USING (true);

-- Interview experiences: Users can share their experiences
CREATE POLICY "Users can share experiences"
ON public.interview_experiences FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Interview experiences: Users can update their experiences
CREATE POLICY "Users can update their experiences"
ON public.interview_experiences FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
