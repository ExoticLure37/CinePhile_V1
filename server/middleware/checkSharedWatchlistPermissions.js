const sharedWatchListModel = require('../models/sharedWatchListModel');

const checkSharedWatchlistPermissions = (requiredPermission) => {
    return async (req, res, next) => {
      const watchlist = await sharedWatchListModel.findById(req.params.watchlist_id);
      
      const member = watchlist.members.find(m => 
        m.user._id.toString() === req.user._id.toString()
      );
      
      if (req.user._id.toString()!==watchlist.owner.toString() && !member?.permissions[requiredPermission]) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    };
  };

  module.exports = {checkSharedWatchlistPermissions} ;
  