
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();
    
    // Verify Paystack signature
    const hash = await crypto.subtle.digest(
      'SHA-512',
      new TextEncoder().encode(Deno.env.get("PAYSTACK_SECRET_KEY") + body)
    );
    const expectedSignature = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) {
      console.error('Invalid signature');
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event);

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.event) {
      case 'charge.success':
        // Handle successful payment
        await supabaseService
          .from('wallet_transactions')
          .update({
            status: 'completed',
            paystack_transaction_id: event.data.id,
            updated_at: new Date().toISOString()
          })
          .eq('paystack_reference', event.data.reference);
        break;

      case 'transfer.success':
        // Handle successful transfer
        await supabaseService
          .from('wallet_transactions')
          .update({
            status: 'completed',
            paystack_transaction_id: event.data.id,
            updated_at: new Date().toISOString()
          })
          .eq('paystack_reference', event.data.reference);
        break;

      case 'transfer.failed':
      case 'charge.failed':
        // Handle failed transactions
        await supabaseService
          .from('wallet_transactions')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('paystack_reference', event.data.reference);
        break;
    }

    return new Response('OK', {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
      status: 200,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response('Server Error', {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
      status: 500,
    });
  }
});
