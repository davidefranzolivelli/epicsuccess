function endpoint(app, connpool) {

    app.post("/api/utenti", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            Username: req.body.Username,
            psw: req.body.psw,
        }

        var sql = 'INSERT INTO utenti (Username, psw) VALUES (?,?)'
        var params = [data.Username, data.psw]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/utenti", (req, res, next) => {
        var sql = "select * from utenti"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });


    app.get("/api/utenti/:id", (req, res) => {
        var sql = "select * from utenti where IDUtenti = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });


    app.put("/api/utenti/:id", (req, res) => {
        var data = {
            Username: req.body.Username,
            psw: req.body.psw,
        }
        connpool.execute(
            `UPDATE utenti set 
               username = COALESCE(?,username), 
               psw = COALESCE(?,psw) 
               WHERE IDUtenti = ?`,
            [data.Username, data.psw, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })



    app.delete("/api/utenti/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM utenti WHERE IDUtenti = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })


}





module.exports = endpoint;