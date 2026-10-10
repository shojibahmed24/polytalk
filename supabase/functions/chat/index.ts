import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return new Response(JSON.stringify({ error: 'Missing conversation_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify conversation ownership
    const { data: conversation, error: convError } = await supabaseClient
      .from('conversations')
      .select('id, target_language, difficulty')
      .eq('id', conversation_id)
      .eq('user_id', user.id)
      .single();

    if (convError || !conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found or access denied' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if AI provider is configured
    const aiKey = Deno.env.get('OPENAI_API_KEY'); // Or other provider
    if (!aiKey) {
      return new Response(JSON.stringify({ 
        error: 'AI Provider not configured. Please add OPENAI_API_KEY to Edge Function environment variables.',
        unavailable: true
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch conversation history
    const { data: messages, error: messagesError } = await supabaseClient
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(20);

    // Call AI provider (Mocking the fetch structure for OpenAI)
    /*
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${aiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `You are a helpful language tutor teaching ${conversation.target_language} at a ${conversation.difficulty} level. Reply naturally in the target language.` },
          ...messages
        ]
      })
    });
    */
    
    // For now, since we only implement the foundation:
    return new Response(JSON.stringify({ 
      error: 'AI service endpoint implemented but requires real provider configuration.',
      unavailable: true 
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
