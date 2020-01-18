const startApp = (app) => {
    const port = process.env.PORT || 8000;
    return app.listen(port, () => console.log(`Example app listening on port ${port}`));
}

module.exports = startApp;