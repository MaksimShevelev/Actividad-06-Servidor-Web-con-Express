import express from "express";
import chalk from "chalk";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 5000;
const admin = new ProductManager();


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Home');
});

app.get('/api/products', async (req, res) => {
    const productos = await admin.getProducts();
    res.json(productos || []);
});

app.get('/api/products/:id', async (req, res) => {
    const id = req.params.id;
    const producto = await admin.getProductById(id);

    if (producto && Object.keys(producto).length !== 0) {
        res.json(producto);
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

app.post('/api/products', async (req, res) => {
    const nuevoProducto = req.body;

    if (!nuevoProducto.name || !nuevoProducto.price) {
        return res.status(400).json({ error: "Faltan campos requeridos: name y price" });
    }

    try {
        const id = await admin.addProduct(nuevoProducto);
        res.status(201).json({ ...nuevoProducto, id });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el producto" });
    }
});

app.put('/api/products/:id', async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    if (!newData.name || !newData.price) {
        return res.status(400).json({ error: "Faltan campos requeridos: name y price" });
    }

    try {
        const updated = await admin.updateProductById(id, newData);

        if (updated) {
            res.status(200).json({ msg: "Producto actualizado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});



app.delete('/api/products/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleted = await admin.deleteProductById(id);

        if (deleted) {
            res.status(200).json({ msg: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

app.listen(port, () => {
    console.log(chalk.green(`Servidor Web en el puerto ${port}`));
});
