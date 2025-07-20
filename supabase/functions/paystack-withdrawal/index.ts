
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { amount, destination, account_details, wallet_id } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    // Create transfer recipient
    const recipientResponse = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: destination === 'bank_transfer' ? 'ghipss' : 'mobile_money',
        name: account_details.account_name,
        account_number: account_details.account_number,
        bank_code: account_details.bank_code || (destination === 'mtn_momo' ? 'MTN' : 'VOD'),
        currency: "GHS"
      }),
    });

    const recipientData = await recipientResponse.json();

    if (!recipientData.status) {
      throw new Error(recipientData.message || "Failed to create recipient");
    }

    // Initiate transfer
    const transferResponse = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: amount,
        recipient: recipientData.data.recipient_code,
        reason: "Wallet withdrawal",
        reference: `withdrawal_${Date.now()}_${user.id.slice(0, 8)}`
      }),
    });

    const transferData = await transferResponse.json();

    if (!transferData.status) {
      throw new Error(transferData.message || "Failed to initiate transfer");
    }

    // Create transaction record
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseService.from("wallet_transactions").insert({
      wallet_id: wallet_id,
      user_id: user.id,
      type: "withdrawal",
      amount: amount,
      status: "pending",
      payment_method: destination,
      paystack_reference: transferData.data.reference,
      description: `Withdrawal to ${account_details.account_name}`,
      metadata: {
        recipient_code: recipientData.data.recipient_code,
        transfer_code: transferData.data.transfer_code
      }
    });

    return new Response(JSON.stringify({
      status: true,
      message: "Withdrawal initiated successfully",
      reference: transferData.data.reference
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Paystack withdrawal error:", error);
    return new Response(JSON.stringify({ 
      status: false, 
      message: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
