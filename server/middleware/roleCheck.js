/**
 * Role-Based Access Control Middleware
 * Restricts access to routes based on user roles
 */

/**
 * Check if user has one of the allowed roles
 * @param {Array} roles - Array of allowed roles
 */
export const checkRole = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user || !req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this route'
      });
    }

    // Check if user role is in allowed roles
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is restricted to: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Restrict to User role only (Job Seekers)
 */
export const userOnly = (req, res, next) => {
  if (req.userRole !== 'user') {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to job seekers'
    });
  }
  next();
};

/**
 * Restrict to Client role only (Employers)
 */
export const clientOnly = (req, res, next) => {
  if (req.userRole !== 'client') {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to employers'
    });
  }
  next();
};

/**
 * Restrict to Admin role only
 */
export const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to administrators'
    });
  }
  next();
};

/**
 * Allow both User and Client roles
 */
export const userOrClient = (req, res, next) => {
  if (!['user', 'client'].includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to users and clients'
    });
  }
  next();
};

/**
 * Admin or resource owner can access
 * Resource must be attached to req.resource by previous middleware
 */
export const adminOrOwner = (ownerField = 'user') => {
  return (req, res, next) => {
    // Admin has full access
    if (req.userRole === 'admin') {
      return next();
    }

    // Check if resource exists
    if (!req.resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if user owns the resource
    const resourceOwnerId = req.resource[ownerField]?.toString() || req.resource[ownerField];
    const requestUserId = req.userId.toString();

    if (resourceOwnerId !== requestUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

/**
 * Check if client's subscription allows the action
 */
export const checkSubscription = (requiredPlan = 'basic') => {
  return (req, res, next) => {
    if (req.userRole !== 'client') {
      return next();
    }

    const planHierarchy = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'enterprise': 3
    };

    const userPlanLevel = planHierarchy[req.user.subscription?.plan || 'free'];
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        success: false,
        message: `This feature requires a ${requiredPlan} subscription or higher`,
        currentPlan: req.user.subscription?.plan || 'free',
        requiredPlan
      });
    }

    // Check if subscription is active
    if (!req.user.subscription?.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your subscription is not active. Please renew to continue.'
      });
    }

    next();
  };
};

/**
 * Check if client has job posting quota available
 */
export const checkJobPostingQuota = async (req, res, next) => {
  if (req.userRole !== 'client') {
    return next();
  }

  const client = req.user;

  if (!client.canPostJob()) {
    return res.status(403).json({
      success: false,
      message: 'Job posting limit reached for your subscription plan',
      limit: client.subscription.jobPostingLimit,
      used: client.subscription.jobPostingsUsed,
      availableSlots: client.subscription.jobPostingLimit - client.subscription.jobPostingsUsed
    });
  }

  next();
};

/**
 * Check if account is verified
 */
export const requireVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this feature'
    });
  }
  next();
};

/**
 * Check if client company is verified (for posting jobs)
 */
export const requireClientVerification = (req, res, next) => {
  if (req.userRole !== 'client') {
    return next();
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Your company account must be verified before posting jobs',
      verificationStatus: req.user.verificationStatus
    });
  }

  next();
};

/**
 * Check multiple permissions at once
 */
export const checkPermissions = (checks) => {
  return async (req, res, next) => {
    for (const check of checks) {
      try {
        await new Promise((resolve, reject) => {
          check(req, res, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
      } catch (error) {
        return;
      }
    }
    next();
  };
};

export default checkRole;