const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const Category = require("../categories/Category");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users });
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/articles");
            }).catch((err) => {
                res.redirect("/");
            });
            //res.json({email, password}); TESTANDO SE OS DADOS ESTÃO SENDO ENVIADOS
        } else {
            res.redirect("/admin/users/create");
        }
    })
});

router.get("/login", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/users/login", { categories: categories });
    })
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            //VALIDANDO SENHA
            var correct = bcrypt.compareSync(password, user.password);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})

module.exports = router;
