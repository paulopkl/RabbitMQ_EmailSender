import { app } from "./app";

const main = async () => {

    const port = 3001;
    app.listen(port, () => {
        console.log(`MainApi running on port ${port}`);
    });
}

main();