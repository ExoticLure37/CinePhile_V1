const watchListModel = require('../models/watchListModel');

const checkSharedWatchlistPermissions = (requiredPermission) => {
    return async (req, res, next) => {
      const watchlist = await watchListModel.findById(req.params.watchlist_id);
      
      if(!watchlist)
        return res.status(404).json({ error: 'Watchlist not found' });

      const member = watchlist?.members.find(m => 
        m.user._id.toString() === req.user._id.toString()
      );
      
      if (req.user._id.toString()!==watchlist.owner.toString() && !member?.permissions[requiredPermission]) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    };
  };

  module.exports = {checkSharedWatchlistPermissions} ;
  