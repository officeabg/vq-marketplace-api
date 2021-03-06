const async = require("async");
const models  = require('../models/models');
const responseController = require("../controllers/responseController.js");
const isAdmin = responseController.isAdmin;

module.exports = app => {
    app.get("/api/app_task_categories", (req, res) =>
        models.appTaskCategory
        .findAll({ order: [ 'code' ] })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send(err))
    );

    app.post("/api/app_task_categories", isAdmin, (req, res) => {
        const category = {
            code: req.body.code,
            label: req.body.label,
            desc: req.body.desc,
            minPriceHour: req.body.minPriceHour || 0,
            bigImageUrl: req.body.bigImageUrl,
            imageUrl: req.body.imageUrl
        };
        
        models.appTaskCategory.create(category)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send(err));
    });

    app.put("/api/app_task_categories/:id", isAdmin, (req, res) => {
        const id = req.params.id;
        const category = {
            code: req.body.code,
            label: req.body.label,
            desc: req.body.desc,
            minPriceHour: req.body.minPriceHour,
            bigImageUrl: req.body.bigImageUrl,
            imageUrl: req.body.imageUrl
        };
      
        models.appTaskCategory.update(category, {
            where: { id }
        })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send(err));
    });

    app.delete("/api/app_task_categories/:id", isAdmin, (req, res) => {
        res.status(200).send({});

        models.appTaskCategory.destroy({ 
            where: {
                id: req.params.id
            }
        });
    });
};
