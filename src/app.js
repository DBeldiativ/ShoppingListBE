const express = require("express");
const bodyParser = require("body-parser");
const shoppingListRoutes = require("./routes/shoppingList");

const app = express();
app.use(bodyParser.json());
app.use("/shopping-list", shoppingListRoutes);

// Spuštění serveru pouze v produkci, ne při testování
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
}

module.exports = app; // Exportuje aplikaci pro testování


