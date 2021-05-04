module.exports = function (req, res, next) { 
    if (req.user.role!="tutor") return res.status(403).send('Access denied due to role.');  
    next();
}