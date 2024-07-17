module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        console.log('User is not authenticated'); 
        res.status(401).json({ message: 'Unauthorized' });
    }
};

