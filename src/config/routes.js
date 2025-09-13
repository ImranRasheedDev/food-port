/**
 * Route configuration with access control
 * 
 * Route Types:
 * - public: Accessible without authentication (login, forgot password)
 * - private: Requires authentication
 * - role: Requires specific user roles (for future implementation)
 */

// Public routes - accessible without authentication
export const publicRoutes = [
  "/",
  "/forgot-password",
];

// Private routes - require authentication
export const privateRoutes = [
  "/dashboard",
  "/manage-campuses",
  "/manage-addcampuses",
  "/manage-addcampuses/:id",
  "/manage-classes",
  "/staff-department",
  "/inquiries",
  "/add/:type/:id?",
  "/student",
  "/add-student/:type",
  "/edit-student/:type/:uid/:tab",
  "/student/:id/:uid",
  "/staff",
  "/add-staff",
  "/add-staff/:type",
  "/add-staff/:type/:uid/:tab",
  "/add-staff/:tab",
  "/manage-fee",
  "/create-fee",
  "/fee-collection",
  "/attendance-sync",
  "/staff-attendance",
  "/account",
  "/expense",
  "/income",
  "/staff-salary",
  "/journal",
  "/add-journal",
  "/manage-subject",
  "/add-subject",
  "/exam-type",
  "/grading",
  "/manage-datesheet",
  "/add-datesheet",
  "/manage-marks",
  "/print-result",
  "/report",
  "/templates",
  "/send-message",
  "/outbox",
  "/groups",
  "/user-management",
  "/change-password",
];

// Role-based routes (for future implementation)
export const roleBasedRoutes = {
  admin: [
    "/user-management",
    "/manage-campuses",
    "/staff-department",
  ],
  teacher: [
    "/student",
    "/attendance-sync",
    "/manage-marks",
  ],
  student: [
    "/dashboard",
    "/change-password",
  ],
  // Add more roles as needed
};

/**
 * Check if a route is public
 * @param {string} pathname - The route pathname
 * @returns {boolean} - True if route is public
 */
export const isPublicRoute = (pathname) => {
  return publicRoutes.some(route => {
    // Handle exact matches and dynamic routes
    if (route === pathname) return true;
    
    // Handle dynamic routes with parameters
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(pathname);
  });
};

/**
 * Check if a route is private
 * @param {string} pathname - The route pathname
 * @returns {boolean} - True if route is private
 */
export const isPrivateRoute = (pathname) => {
  return privateRoutes.some(route => {
    // Handle exact matches and dynamic routes
    if (route === pathname) return true;
    
    // Handle dynamic routes with parameters
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(pathname);
  });
};

/**
 * Check if user has access to a role-based route
 * @param {string} pathname - The route pathname
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user has access
 */
export const hasRoleAccess = (pathname, userRole) => {
  if (!userRole || !roleBasedRoutes[userRole]) return false;
  
  return roleBasedRoutes[userRole].some(route => {
    if (route === pathname) return true;
    
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(pathname);
  });
};