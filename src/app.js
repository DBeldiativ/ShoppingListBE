const express = require("express");
const bodyParser = require("body-parser");
const shoppingListRoutes = require("./routes/shoppingList");

const app = express();
app.use(bodyParser.json());

app.use("/shopping-list", shoppingListRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));

