import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { adminClient } from '../../../../sanity/adminClient'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: false,
    })
  }
} catch (e) {
  console.warn("Upstash Redis not configured. Rate limiting disabled for Clerk Webhook.")
}

export async function POST(req: Request) {
  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await ratelimit.limit(`clerk-webhook-${ip}`)
    if (!success) {
      return new Response('Too many requests', { status: 429 })
    }
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or Vercel')
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      username,
      image_url
    } = evt.data;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response('No email address found', { status: 400 });
    }

    try {
      const customerId = `customer-${id}`;

      // Build display name with priority: first_name+last_name > username > email prefix
      let displayName = '';

      if (first_name || last_name) {
        displayName = `${first_name || ''} ${last_name || ''}`.trim();
      } else if (username) {
        displayName = username;
      }

      // Log webhook data for debugging
      console.log('📥 Clerk Webhook received:', {
        eventType,
        userId: id,
        email,
        username,
        first_name,
        last_name,
        displayName,
        image_url
      });

      // Create or update user in Sanity
      await adminClient.transaction()
        .createIfNotExists({
          _type: 'customer',
          _id: customerId,
          email: email,
          clerkUserId: id,
          createdAt: new Date().toISOString(),
        })
        .patch(customerId, (p) => p.set({
          name: displayName || undefined,
          profilePicture: image_url || undefined,
          email: email,
        }))
        .commit();

      console.log(`✅ Successfully synced user ${id} to Sanity with name: "${displayName}"`);
    } catch (error) {
      console.error('❌ Error syncing user to Sanity:', error);
      return new Response('Error syncing user to Sanity', { status: 500 });
    }
  }

  return new Response('', { status: 200 })
}