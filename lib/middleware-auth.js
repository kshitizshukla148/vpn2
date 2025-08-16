export function withAuth(handler) {
  return async (req) => {
    const token = req.cookies.get('auth-token');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
      req.user = decoded;
      return handler(req);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

export function withAdminAuth(handler) {
  return async (req) => {
    const token = req.cookies.get('auth-token');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
      
      if (decoded.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Admin access required' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      req.user = decoded;
      return handler(req);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}