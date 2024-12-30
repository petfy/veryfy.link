import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    )

    const { reportedEmail, description } = await req.json()

    // Get all verified stores
    const { data: stores } = await supabase
      .from('stores')
      .select('*')
      .eq('verification_status', 'verified')

    if (!stores || stores.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No verified stores found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email to each store
    const emailPromises = stores.map(async (store) => {
      const emailContent = {
        from: 'Verify.link <notifications@verify.link>',
        to: [store.email], // Make sure to add email field to stores table
        subject: 'Scam Alert: New Customer Blacklist Report',
        html: `
          <h2>New Scam Report Alert</h2>
          <p>A new customer has been reported for potential fraudulent activity:</p>
          <ul>
            <li><strong>Reported Email:</strong> ${reportedEmail}</li>
            <li><strong>Description:</strong> ${description}</li>
          </ul>
          <p>Please be cautious if you receive orders from this email address.</p>
          <p>This is an automated notification from Verify.link.</p>
        `
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify(emailContent)
      })

      return res.json()
    })

    await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({ message: 'Notifications sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})