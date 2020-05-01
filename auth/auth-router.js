const bc = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model.js");

//.get for the hash -->
router.get("/secret", (req, res, next) => {
    if (req.headers.authorization) {
        bc.hash(req.headers.authorization, 12, (err, hash) => {
            // 2^10 is the number of rounds
            if (err) {
                res.status(500).json({ oops: "it broke" });
            } else {
                res.status(200).json({ hash });
            }
        });
    } else {
        res.status(400).json({ error: "missing header" });
    }
});

router.post("/register", (req, res) => {
    let user = req.body;
    const Salt = Number(process.env.SALT)
    const hash = bc.hashSync(req.body.password, Salt);

    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

// if (user) {
                // compare().then(match => {
                //   if (match) {
                //     // good password
                //   } else {
                //     // they don't match
                //   }
                // }).catch()

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bc.compareSync(password, user[0].password)) {
                req.session.ID = user[0].id;
                req.session.loggedIn = true;
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

module.exports = router;