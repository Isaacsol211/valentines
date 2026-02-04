export async function onRequestPost({ request, env }) {
  try {
    const { name, theme } = await request.json();
    
    if (!name || !theme) {
      return new Response(JSON.stringify({ error: 'Name and theme are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(
      'INSERT INTO responses (name, theme) VALUES (?, ?)'
    ).bind(name, theme).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
