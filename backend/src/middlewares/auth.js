const jwt = require('jsonwebtoken');

// ============================================================
// MIDDLEWARE 1: verifyToken
// ============================================================
// Propósito: verificar que la petición trae un token JWT válido,
// es decir, que el usuario está "logueado".
//
// Se ejecuta ANTES del controlador en rutas protegidas.
// Ejemplo de uso: router.post('/', verifyToken, createProduct)
// ============================================================
const verifyToken = (req, res, next) => {
  // 1. Leer el header "Authorization" de la petición.
  //    El frontend lo envía así: "Bearer eyJhbGciOiJIUzI1NiIs..."
  const authHeader = req.headers['authorization'];

  // 2. Separar el header por espacio y quedarnos con la segunda parte.
  //    "Bearer eyJ..." → ["Bearer", "eyJ..."] → tomamos el índice [1]
  //    Si authHeader no existe, "authHeader && ..." evita un error
  //    y token queda como undefined.
  const token = authHeader && authHeader.split(' ')[1];

  // 3. Si no hay token, no se puede continuar.
  //    Respondemos 401 (No autorizado) y NO llamamos a next(),
  //    por lo tanto la petición se detiene aquí.
  if (!token) return res.status(401).json({ msg: 'Token required' });

  try {
    // 4. Verificar el token:
    //    - jwt.verify revisa que la FIRMA del token sea válida
    //      usando el mismo JWT_SECRET con el que se creó en el login.
    //    - También revisa que el token no haya EXPIRADO (8h).
    //    - Si todo está bien, devuelve el "payload" original:
    //      { id: "...", role: "admin", iat: ..., exp: ... }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Guardamos esos datos en req.user para que los controladores
    //    y siguientes middlewares puedan usarlos.
    //    Por ejemplo: req.user.id, req.user.role
    req.user = decoded;

    // 6. next() le dice a Express: "todo bien, continúa con
    //    el siguiente middleware o el controlador final".
    next();
  } catch {
    // 7. Si jwt.verify lanza un error (firma inválida, token
    //    modificado, o expirado), caemos aquí.
    //    Respondemos 401 y la petición se detiene.
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

// ============================================================
// MIDDLEWARE 2: onlyRole
// ============================================================
// Propósito: verificar que el usuario tiene el ROL correcto
// para acceder a esta ruta (autorización, no autenticación).
//
// Es una función que RECIBE roles permitidos y DEVUELVE
// el middleware real. Por eso se usa así:
//   onlyRole('admin')              → solo admin
//   onlyRole('admin', 'barista')   → admin O barista
//
// Siempre debe ir DESPUÉS de verifyToken, porque necesita
// que req.user ya exista.
// ============================================================
const onlyRole = (...roles) => (req, res, next) => {
  // ...roles es un "rest parameter": junta todos los argumentos
  // en un array. onlyRole('admin','barista') → roles = ['admin','barista']

  // 1. Revisamos si el rol del usuario logueado (req.user.role)
  //    está incluido en la lista de roles permitidos.
  if (!roles.includes(req.user.role)) {
    // 2. Si NO está permitido, respondemos 403 (Prohibido).
    //    Diferencia con 401:
    //    - 401 = "no sé quién eres / no estás logueado"
    //    - 403 = "sé quién eres, pero no tienes permiso"
    return res.status(403).json({ msg: 'Access denied for this role' });
  }

  // 3. Si el rol es válido, continuamos.
  next();
};

// ============================================================
// EXPORTAR ambos middlewares para usarlos en las rutas
// ============================================================
module.exports = { verifyToken, onlyRole };